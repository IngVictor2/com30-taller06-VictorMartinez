# COM30 · Taller 06 — Mesa de Ayuda TI

Aplicación Angular de una sola pantalla para registrar y gestionar solicitudes de soporte técnico. Escenario **E1 – Mesa de ayuda de TI** del Taller 06 (sesiones S05, S06 y S07).

## Escenario

Un funcionario de la mesa de ayuda registra solicitudes de soporte con los datos de contacto del solicitante, categoría, prioridad, impacto, fecha, descripción y equipos afectados. Cada solicitud queda en estado **Pendiente** y desde el listado se puede cambiar a **En proceso** o **Resuelto**, o eliminarla. Los datos viven en memoria en un servicio con `signals` y `computed`.

## Funcionalidades

- Formulario reactivo con `FormBuilder.nonNullable`: 7 controles de cabecera más un `FormArray` de equipos.
- Validadores integrados: `required`, `minLength`, `email` y `pattern`.
- Validador propio de control `sinSoloEspacios` (rechaza cadenas formadas solo por espacios).
- Validador de grupo `impactoRequerido`: si la prioridad es **Crítica**, el impacto es obligatorio.
- `FormArray` de equipos con agregar/quitar filas, dos controles validados por fila y validador propio `minimoItems(1)`.
- Mensajes de error visibles solo con `touched` o `dirty`, con mensaje distinto por tipo de error; el error de grupo se consulta desde el `FormGroup`.
- Servicio `providedIn: 'root'` con signal privada, versión pública `asReadonly()`, `computed` de total y pendientes, y métodos `agregar`, `cambiarEstado` y `eliminar` que usan `update()` con arreglos nuevos.
- Listado con `@for` y `track`, bloque `@empty`, cambio de estado por registro y panel de resumen cargado con `@defer (on interaction)`.
- Sin `NgModule`, sin `*ngIf`, sin rutas y sin `HttpClient`.

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
├── app.ts / app.html / app.css        # pantalla principal y contadores
├── models/solicitud.model.ts          # interfaces Solicitud y EquipoAfectado
├── services/solicitud.service.ts      # signal privada, computed y CRUD en memoria
├── validators/solicitud.validators.ts # sinSoloEspacios, impactoRequerido, minimoItems
└── components/
    ├── solicitud-form/                # formulario reactivo y FormArray
    ├── solicitud-list/                # listado, estados y @empty
    └── resumen-panel/                 # panel cargado con @defer
```

## Evidencias

Las capturas de la aplicación están en [`docs/evidencias`](docs/evidencias). El informe diligenciado se entrega en PDF junto con este repositorio.

## Repositorio

<https://github.com/IngVictor2/com30-taller06-VictorMartinez.git>
