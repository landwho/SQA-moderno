'use strict';
function validateAppointment(input) {
  if (!input || typeof input !== 'object') return { ok:false, error:'Solicitud inválida' };
  const client = typeof input.client === 'string' ? input.client.trim() : '';
  const service = typeof input.service === 'string' ? input.service.trim() : '';
  const date = typeof input.date === 'string' ? input.date.trim() : '';
  const time = typeof input.time === 'string' ? input.time.trim() : '';
  if (!client || !service || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return {ok:false,error:'Completa nombre, servicio, fecha y hora válidos'};
  if (Number.isNaN(Date.parse(`${date}T${time}:00`)) || new Date(`${date}T${time}:00`).toISOString().slice(0,10)!==date) return {ok:false,error:'Fecha inválida'};
  return {ok:true,value:{client,service,date,time}};
}
function conflicts(items, appointment, excludeId=null) { return items.some(x=>x.id!==excludeId && x.date===appointment.date && x.time===appointment.time && x.service.toLowerCase()===appointment.service.toLowerCase()); }
function metrics(events) { const incidents=events.filter(e=>e.type==='incident'&&Number.isFinite(e.repairMinutes)); return { incidents:incidents.length, mttrMinutes:incidents.length ? Number((incidents.reduce((s,e)=>s+e.repairMinutes,0)/incidents.length).toFixed(2)) : null }; }
module.exports={validateAppointment,conflicts,metrics};
console.log(variableQueNoExiste);