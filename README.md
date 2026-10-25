# Proyecto B — CitasSQA

## Requisitos
Node.js 20+.

## Ejecutar
```powershell
npm install
npm start
```
Visitar http://localhost:3100

## Shift-Left
```powershell
npm test
npm run lint
npm run check
```
Las pruebas unitarias usan `node:test`. ESLint detecta problemas estáticos.

## Shift-Right
Los eventos se registran en `logs/events.jsonl` con `timestamp`, `level`, `event`, `requestId`, `path`, `durationMs`. En otra terminal PowerShell:
```powershell
$env:ENABLE_FAULT_INJECTION='true'
npm start
```
Después, en otra terminal:
```powershell
Invoke-WebRequest -Uri http://localhost:3100/api/dev/simulate-failure -Method POST
```
El comando genera intencionalmente un HTTP 500 y una línea de error en el log. La ruta está DESACTIVADA por defecto y nunca debe habilitarse en producción.

## MTTR
Anota hora de inicio del incidente, hora de detección y hora de restauración. `MTTR = suma de minutos hasta restauración / cantidad de incidentes reparados`. No usar números inventados.
