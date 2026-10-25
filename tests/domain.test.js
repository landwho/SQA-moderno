'use strict';
const test=require('node:test');const assert=require('node:assert/strict');
const {validateAppointment,conflicts,metrics}=require('../src/domain');
test('UT-01: permite cita con datos válidos',()=>{const r=validateAppointment({client:' Ana ',service:'Consulta',date:'2026-11-15',time:'09:30'});assert.equal(r.ok,true);assert.equal(r.value.client,'Ana');});
test('UT-02: rechaza campos vacíos',()=>{assert.equal(validateAppointment({client:'',service:'Consulta',date:'2026-11-15',time:'09:30'}).ok,false);});
test('UT-03: detecta citas duplicadas en mismo servicio y horario',()=>{const a={id:'1',service:'Consulta',date:'2026-11-15',time:'09:30'};assert.equal(conflicts([a],{service:'consulta',date:'2026-11-15',time:'09:30'}),true);});
test('UT-04: admite otro horario',()=>{const a={id:'1',service:'Consulta',date:'2026-11-15',time:'09:30'};assert.equal(conflicts([a],{service:'Consulta',date:'2026-11-15',time:'10:00'}),false);});
test('UT-05: calcula MTTR desde incidentes reparados',()=>{assert.deepEqual(metrics([{type:'incident',repairMinutes:10},{type:'incident',repairMinutes:20},{type:'incident'}]),{incidents:2,mttrMinutes:15});});
test('UT-06: rechaza fecha inexistente',()=>{assert.equal(validateAppointment({client:'Ana',service:'Consulta',date:'2026-02-30',time:'09:30'}).ok,false);});
