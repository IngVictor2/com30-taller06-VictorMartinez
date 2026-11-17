# COM30 · Taller 08 — Rutas y navegación sobre Mesa de Ayuda TI

Aplicación Angular que amplía el proyecto del **Taller 07** con rutas y navegación sobre el escenario **E1 – Mesa de ayuda de TI**. Se conserva el mismo repositorio, el mismo escenario, el servicio con `signals` y el formulario reactivo del taller anterior.

## Escenario

Un funcionario de la mesa de ayuda registra solicitudes de soporte técnico con los datos del solicitante, categoría, prioridad, impacto, fecha, descripción y equipos afectados. Las solicitudes se guardan en memoria en un servicio con `signals` y se pueden listar, filtrar por estado, consultar en detalle, cambiar de estado o eliminar.

## Rutas (tabla A)

| Orden | Ruta | Vista (componente) | Parámetro o carga |
| --- | --- | --- | --- |
| 1 | `/` | Redirección a `/solicitudes` | `pathMatch: 'full'` |
| 2 | `/solicitudes` | `SolicitudList` | Query param `estado` recibido con `input()` |
| 3 | `/solicitudes/nueva` | `SolicitudForm` | Sin parámetros |
| 4 | `/solicitudes/:id` | `SolicitudDetalle` | Parámetro `id` con el código (`R01`…`R12`) |
| 5 | `/estadisticas` | `Estadisticas` | `loadComponent` (chunk diferido) |
| 6 | `**` | `NoEncontrada` | Dirección solicitada |

`/solicitudes/nueva` va **antes** de `/solicitudes/:id` para que «nueva» no se interprete como un código. El comodín `**` queda al final.

## Decisiones técnicas

- `provideRouter(routes, withComponentInputBinding())` en `app.config.ts`.
- Menú con `routerLink` y `routerLinkActive`; la opción **Inicio** usa `{ exact: true }`.
- Un solo `<router-outlet />` en `app.html`. Ningún enlace interno usa `href`: todos usan `routerLink`.
- Detalle: `id = input.required<string>()` y `solicitud = computed(() => ...find(...))`. Un código inexistente muestra «No existe la solicitud R99» dentro del detalle, no la vista 404.
- Filtro del listado: `estado = input<string>()`, enlaces con `queryParams` y `visibles = computed(...)`. El filtro vive en la URL y sobrevive a F5. Un estado sin registros muestra el bloque `@empty`.
- Alta: tras guardar un formulario válido, `router.navigate(['/solicitudes', nueva.codigo])` lleva al detalle del registro creado.
- Estadísticas: única ruta con `loadComponent`; su chunk JS aparece en F12 → Red solo la primera vez.
- 404: muestra `router.url` y un enlace de regreso al listado.
- Los datos siguen en el servicio con signal del Taller 07. No se usa `HttpClient`, guards, `NgModule` ni `*ngIf`.

## Semilla

El servicio inicia con **12 registros** y **3 estados**: `Pendiente`, `En proceso` y `Resuelto`. Cada registro tiene un código legible: `R01` a `R12`.

| Estado | Códigos | Cantidad |
| --- | --- | --- |
| Pendiente | R01, R04, R06, R11 | 4 |
| En proceso | R02, R07, R10, R12 | 4 |
| Resuelto | R03, R05, R08, R09 | 4 |

## Casos de prueba (tabla B)

| Caso | Acción | Resultado esperado | Obtenido |
| --- | --- | --- | --- |
| C1 | Abrir `/` | Redirige a `/solicitudes`: 12 registros. Menú «Solicitudes» activo. | Redirigió a `/solicitudes`; 12 registros; «Solicitudes» activo. |
| C2 | Pulsar el filtro «Pendiente» | URL `/solicitudes?estado=Pendiente` · 4 registros (R01, R04, R06, R11). | URL y 4 registros correctos. |
| C3 | Recargar con F5 en C2 | Los mismos 4 registros y el filtro «Pendiente» marcado. | Se conservaron los 4 registros y el filtro activo. |
| C4 | Escribir `/solicitudes?estado=Cancelado` | Mensaje de `@empty`: 0 registros con ese estado. | Mostró «0 solicitudes con estado «Cancelado»». |
| C5 | Pulsar la fila R05 | URL `/solicitudes/R05` · Diana Ruiz · Software · Resuelto. «Solicitudes» sigue activo. | URL, datos y menú correctos. |
| C6 | Escribir `/solicitudes/R99` | Mensaje «No existe la solicitud R99» dentro del detalle; no es la vista 404. | Mensaje dentro del detalle; no apareció la 404. |
| C7 | Escribir `/reportes` | Vista 404 con la dirección escrita y un enlace al listado. | Mostró `/reportes` y el enlace de regreso. |
| C8 | Guardar el alta Andrés Prueba · Hardware · Media | Navega a `/solicitudes/R13`. El listado tiene 13 registros; filtro Pendiente: 5. | Navegó a `/solicitudes/R13`; listado con 13 y Pendiente con 5. |
| C9 | Abrir `/estadisticas` con F12 → Red (JS) | Un archivo `chunk-….js` nuevo la primera vez; ninguno la segunda. | Cargó `chunk-CJ47BWI5.js` (200, script); en la segunda visita no se repitió. |

## Búsqueda reactiva del Taller 07

La búsqueda anterior se conserva dentro del listado, en una sección plegable, para no perder el trabajo del Taller 07. Compara el texto normalizado con **solicitante** e **impacto**, aplica `debounceTime(300)`, `distinctUntilChanged()` y `switchMap`, y mantiene el historial de las 5 últimas consultas. El filtro principal del Taller 08 es independiente y vive en la URL.

## Cómo ejecutar

Requisitos: Node.js 20 o superior y npm.

```bash
npm install
npm start
```

Abrir <http://localhost:4200/>.

```bash
# compilación de producción
npm run build

# pruebas unitarias
npm test -- --watch=false
```

## Estructura

```text
src/app/
├── app.routes.ts                           # redirección, cinco vistas, loadComponent y comodín
├── app.config.ts                           # provideRouter + withComponentInputBinding
├── app.ts / app.html / app.css             # cabecera, menú y único router-outlet
├── models/solicitud.model.ts               # Solicitud con id numérico y código R01…
├── services/solicitud.service.ts           # semilla de 12, búsqueda y CRUD en signals
├── validators/solicitud.validators.ts      # validadores del Taller 06
└── components/
    ├── solicitud-list/                     # listado, filtro ?estado= y @empty
    ├── solicitud-detalle/                  # detalle por :id, computed y mensaje C6
    ├── solicitud-form/                     # alta y router.navigate al detalle
    ├── estadisticas/                       # vista con loadComponent
    ├── no-encontrada/                      # 404 con la dirección solicitada
    ├── busqueda-solicitudes/               # búsqueda reactiva del Taller 07
    └── resumen-panel/                      # panel de resumen reutilizado en estadísticas
```

## Evidencias e informe

- C5, detalle con la URL visible: [`docs/evidencias/taller08-c5.png`](docs/evidencias/taller08-c5.png).
- C9, F12 → Red con el chunk diferido: [`docs/evidencias/taller08-c9.png`](docs/evidencias/taller08-c9.png).
- Informe diligenciado: [`docs/informe/COM30_Taller08_Martinez.pdf`](docs/informe/COM30_Taller08_Martinez.pdf).

## Repositorio

<https://github.com/IngVictor2/com30-taller06-VictorMartinez.git>
