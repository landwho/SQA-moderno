'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {validateAppointment,conflicts}=require('./domain');
const PORT=Number(process.env.PORT||3100);
const root=path.resolve(__dirname,'..');
const db=path.join(root,'appointments.json');
const logFile=path.join(root,'logs','events.jsonl');
const items=fs.existsSync(db)?JSON.parse(fs.readFileSync(db,'utf8')):[];
function log(level,event,details={}) { const line=JSON.stringify({timestamp:new Date().toISOString(),level,event,...details}); console.log(line); fs.mkdirSync(path.dirname(logFile),{recursive:true}); fs.appendFileSync(logFile,line+'\n'); }
function send(res,status,payload,requestId){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','X-Request-Id':requestId});res.end(JSON.stringify(payload));}
function persist(){fs.writeFileSync(db,JSON.stringify(items,null,2));}
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 const requestId=crypto.randomUUID();const started=Date.now();
 try {
  const u=new URL(req.url,'http://localhost');
  if(req.method==='GET'&&u.pathname==='/api/health')return send(res,200,{status:'ok',service:'CitasSQA'},requestId);
  if(req.method==='GET'&&u.pathname==='/api/appointments')return send(res,200,items,requestId);
  if(req.method==='POST'&&u.pathname==='/api/appointments'){
   let raw='';for await(const part of req){raw+=part;if(raw.length>10000)throw Object.assign(new Error('Solicitud demasiado grande'),{status:413});}
   let input;try{input=JSON.parse(raw);}catch{ return send(res,400,{error:'JSON inválido'},requestId); }
   const checked=validateAppointment(input);if(!checked.ok)return send(res,400,{error:checked.error},requestId);
   if(conflicts(items,checked.value))return send(res,409,{error:'Ya existe una cita para ese servicio, fecha y hora'},requestId);
   const created={id:crypto.randomUUID(),...checked.value};items.push(created);persist();log('info','appointment_created',{requestId,appointmentId:created.id});return send(res,201,created,requestId);
  }
  if(req.method==='DELETE'&&u.pathname.startsWith('/api/appointments/')){
   const id=u.pathname.split('/').pop();const i=items.findIndex(x=>x.id===id);if(i<0)return send(res,404,{error:'Cita no encontrada'},requestId);items.splice(i,1);persist();log('info','appointment_deleted',{requestId,appointmentId:id});return send(res,200,{deleted:true},requestId);
  }
  // Inyección de fallos exclusivamente en entorno de desarrollo y bajo activación explícita.
  if(req.method==='POST'&&u.pathname==='/api/dev/simulate-failure'&&process.env.ENABLE_FAULT_INJECTION==='true')throw new Error('Fallo simulado para ejercicio Shift-Right');
  if(req.method==='GET'&&!u.pathname.startsWith('/api/')){
   const file=u.pathname==='/'?'index.html':u.pathname.slice(1);const target=path.resolve(root,'public',file);
   if(!target.startsWith(path.resolve(root,'public')+path.sep))return send(res,403,{error:'Acceso denegado'},requestId);
   if(!fs.existsSync(target)||!fs.statSync(target).isFile())return send(res,404,{error:'No encontrado'},requestId);
   res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});return res.end(fs.readFileSync(target));
  }
  return send(res,404,{error:'Ruta no encontrada'},requestId);
 }catch(err){log('error','request_failed',{requestId,message:err.message,path:req.url});return send(res,err.status||500,{error:'Error al procesar la solicitud',requestId},requestId);}
 finally{log('info','request_completed',{requestId,method:req.method,path:req.url,durationMs:Date.now()-started});}
});
if(require.main===module)server.listen(PORT,()=>log('info','server_started',{port:PORT}));
module.exports={server};
