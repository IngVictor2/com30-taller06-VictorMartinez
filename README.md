# COM30 · Taller 07 — Búsqueda reactiva sobre Mesa de Ayuda TI

Aplicación Angular que amplía el proyecto del **Taller 06** con una búsqueda reactiva sobre el escenario **E1 – Mesa de ayuda de TI**. Se conserva el mismo repositorio, el mismo escenario y el formulario reactivo del taller anterior.

## Escenario

Un funcionario de la mesa de ayuda registra solicitudes de soporte técnico con los datos del solicitante, categoría, prioridad, impacto, fecha, descripción y equipos afectados. Las solicitudes se guardan en memoria en un servicio con `signals` y se pueden buscar por **solicitante** o **impacto**, filtrar por estado y cambiar de estado o eliminar.

## Semilla del Taller 07

El servicio inicia con **12 registros** y **3 estados**: `Pendiente`, `En proceso` y `Resuelto`.

| Palabra | Registros | Cantidad |
| --- | --- | --- |
| `red` | R01, R02, R03, R06, R07, R09, R12 | 7 |
| `redes` | R02, R07, R12 | 3 |
| `sist` | R04, R05, R07, R11 | 4 |
| `laboratorio` | R04, R07, R12 | 3 |
| `zzz` | — | 0 |

La búsqueda compara el texto normalizado con dos campos declarados: **`solicitante`** e **`impacto`**. Se aplica `trim()`, se convierte a minúsculas y se eliminan las tildes. Con menos de 2 caracteres no se consulta el servicio.

## Búsqueda reactiva

- `FormControl` de búsqueda con `valueChanges`.
- Tubería: `map(trim)` → `debounceTime(300)` → `distinctUntilChanged()` → `switchMap(...)`.
- Con menos de 2 caracteres, `switchMap` devuelve `of([])` sin llamar al servicio.
- Retardo simulado del servicio: `max(150, 1500 − 300 × longitud del texto)` milisegundos.
- Resultado expuesto con `toSignal(..., { initialValue: [] })`.
- `computed` para el total encontrado, el total visible y el conteo por estado.
- Filtro por estado con una `signal` y un `computed`; cambiar el filtro **no** genera consultas.
- Historial de las 5 últimas consultas, la más reciente primero, con `subscribe()` y `takeUntilDestroyed()`.
- Contador `llamadas` privado en el servicio y expuesto como `asReadonly()`.
- Mensajes de mínimo 2 caracteres, «Buscando…» y «Sin coincidencias» con `@empty`.
- `@for` con `track` en todos los listados.
- Sin `NgModule`, sin `*ngIf`, sin rutas y sin `HttpClient`.

## Casos de prueba

| Caso | Acción | Resultado esperado | Llamadas |
| --- | --- | --- | --- |
| C1 | Escribir `red` | 7 registros: R01, R02, R03, R06, R07, R09, R12 | 1 |
| C2 | Cambiar a `redes` | 3 registros: R02, R07, R12 | 2 |
| C3 | Cambiar a `sist` | 4 registros: R04, R05, R07, R11 | 3 |
| C4 | Agregar espacio final: `sist ` | Mismos 4 registros; sin consulta nueva | 3 |
| C5 | Escribir `x` | Mensaje de mínimo 2 caracteres; sin consulta | 3 |
| C6 | Escribir `zzz` | «Sin coincidencias» (`@empty`) | 4 |
| C7 | Buscar `red` y aplicar cada filtro | Pendiente 2 (R01, R06) · En proceso 3 (R02, R07, R12) · Resuelto 2 (R03, R09); el filtro no suma llamadas | 5 |
| C8 | Escribir `laboratorio` letra por letra | 3 registros: R04, R07, R12; una sola consulta | 6 |
| C9 | Borrar, escribir `red`, esperar 400 ms y completar `redes` | Termina con 3 registros: R02, R07, R12; la respuesta de `red` se descarta | 8 |

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
├── app.ts / app.html / app.css             # pantalla principal y contadores
├── models/solicitud.model.ts               # interfaces Solicitud y EquipoAfectado
├── services/solicitud.service.ts           # semilla de 12, buscar() con retardo y llamadas
├── validators/solicitud.validators.ts      # validadores del Taller 06
└── components/
    ├── busqueda-solicitudes/               # búsqueda, filtros, historial y resultados
    ├── solicitud-form/                     # formulario reactivo y FormArray
    ├── solicitud-list/                     # listado, estados y @empty
    └── resumen-panel/                      # panel cargado con @defer
```

## Evidencias e informe

- Captura del panel después del caso C9: [`docs/evidencias/taller07-c9.png`](docs/evidencias/taller07-c9.png).
- Captura del indicador «Buscando…»: [`docs/evidencias/taller07-buscando.png`](docs/evidencias/taller07-buscando.png).
- Informe diligenciado: [`docs/informe/COM30_Taller07_Martinez.pdf`](docs/informe/COM30_Taller07_Martinez.pdf).

## Repositorio

<https://github.com/IngVictor2/com30-taller06-VictorMartinez.git>
