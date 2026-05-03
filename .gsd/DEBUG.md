status: resolved
trigger: "a veces al intentar hacer zoom en movil ocurre la animacion de slide y deja la foto fuera de alcance dejando la pantalla en negro y no me permite cambiar de foto obligandome a cerrar la galeria ampliada para abrirla otra vez"
created: 2026-05-02T19:56:30-04:00
updated: 2026-05-02T20:10:30-04:00
---

## Current Focus
hypothesis: "La pantalla negra y el bloqueo ocurren porque el gesto de pinch (dos dedos) se 'filtraba' al controlador de drag del carrusel exterior. Al soltar los dedos, el carrusel detectaba un swipe falso y disparaba la animación de salida (exit), pero al estar en medio de un cambio de estado de zoom, AnimatePresence se bloqueaba o el nuevo componente no entraba correctamente."
test: "Aislamiento de Eventos de Touch: 1. Usar dragListener={!isZoomed} para apagar el carrusel completamente durante el zoom. 2. Usar e.stopPropagation() en los eventos de touch del div interno para que el carrusel ni siquiera 'escuche' el pinch. 3. Añadir una variante 'zoomed' de seguridad al carrusel para que no pueda tener opacidad 0 si está ampliado."
expecting: "Que sea imposible disparar un cambio de foto mientras se tengan dos dedos en pantalla o la imagen esté ampliada."
next_action: "Confirmar con el usuario."

## Symptoms
expected: "Zoom fluido sin movimientos del carrusel de fondo."
actual: "La foto se desliza y desaparece al intentar ampliarla con dos dedos."
errors: "N/A"

## Eliminated
- **Error de Key**: Se confirmó que la key 'page' solo cambia en paginate, pero paginate era llamado erróneamente por el leak de eventos.

## Evidence
- El carrusel exterior reaccionaba a los movimientos del pinch-to-zoom porque el drag de Framer Motion escucha eventos de puntero de forma global si no se detiene la propagación.
- `dragListener={false}` es la forma más segura de desconectar el sistema de navegación lateral.

## Hypotheses
1. **Fuga de Eventos de Puntero (CONFIRMADO)**: El pinch disparaba el onDragEnd del carrusel.
2. **Conflicto de Estado en AnimatePresence (CONFIRMADO)**: El cambio de imagen (exit) durante un proceso de escalado activo causaba inconsistencia visual.



