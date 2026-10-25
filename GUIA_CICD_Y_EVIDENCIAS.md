# CitasSQA — Implementación SQA Moderno CI/CD

## Alcance
Este repositorio está diseñado para que **CitasSQA sea la raíz del repositorio GitHub**. Si lo incluyes dentro de un monorepo, hay que ajustar rutas de los workflows.

## Configuración local (PowerShell)
```powershell
npm install
npm run lint
npm run test:coverage
npm run test:integration
npm run check
```

## GitHub Actions
1. Crear repositorio vacío en GitHub, por ejemplo `CitasSQA-Moderno`.
2. Abrir esta carpeta en VS Code.
3. Ejecutar `git init`, `git add .`, `git commit -m "CI SQA Moderno"`, `git branch -M main`.
4. Vincular el repositorio con `git remote add origin URL_DEL_REPOSITORIO` y `git push -u origin main`.
5. Abrir pestaña **Actions** en GitHub: debe verse `CitasSQA - Quality Gate CI`.
6. Capturar resultado del pipeline con lint, cobertura y pruebas de integración.
7. Tras una ejecución CI exitosa en `main`, `CitasSQA - Continuous Delivery` crea un artefacto descargable. **Esto es entrega continua, no despliegue en producción**.

## Quality Gate
- ESLint debe salir con código 0.
- Pruebas unitarias y de integración deben pasar.
- El pipeline se marca fallido ante cualquier error.
- Cobertura se reporta pero **no hay umbral mínimo obligatorio configurado**; no afirmar lo contrario.
- Para bloquear merge, activar Branch protection / Rulesets en GitHub y requerir el job `Lint, Unit Tests, Coverage, Integration`.

## Shift-Right ya comprobado por el estudiante
Dos ejecuciones con salud HTTP 200, fallo HTTP 500 y salud HTTP 200; logs `request_failed` con `requestId`. Esto demuestra observabilidad y contención de error controlado, **no mide MTTR**.

## Evidencia para presentación
E-CI-01: screenshot Actions pipeline verde. E-CI-02: ESLint exitoso. E-CI-03: resultados de tests. E-CI-04: cobertura. E-CD-01: artefacto de entrega. E-SR-01: logs de inyección de fallo. E-MTTR-01: mediciones reales de reinicio (pendiente).

## Importante
No hay conexión a GitHub desde esta entrega; la ejecución real del pipeline debe confirmarse en tu cuenta. No atribuir una ejecución remota aún no realizada.
