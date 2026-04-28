# 📘 Manual de Administración - Coastal Alchemist

Bienvenido al panel administrativo de **Coastal Alchemist**. Este manual está diseñado para que cualquier administrador pueda operar el sistema de reservas, gestionar precios y mantener la disponibilidad del departamento de forma eficiente y segura.

---

## 1. Introducción
El Panel Admin es el centro operativo de tu propiedad. Desde aquí puedes controlar todo el flujo de negocio: desde que entra un lead (solicitud) hasta que se confirma el pago y se cierra la reserva.

---

## 2. Acceso Seguro
Para ingresar al panel:
1. Ve a la ruta: `tu-sitio.com/admin`
2. Ingresa con tu correo autorizado y contraseña.
3. **Seguridad**: El sistema solo permite el acceso a correos listados en la configuración de seguridad (`ALLOWED_ADMIN_EMAILS`).

---

## 3. Dashboard General (Inbox)
Al entrar, verás el **Inbox de Solicitudes**. Es tu centro de atención al cliente.
- **Sincronizar**: Usa el botón "Sincronizar" para traer las últimas solicitudes si has dejado la pestaña abierta.
- **Filtros**: Puedes filtrar por estado (Pendiente, Esperando Pago, Confirmado, etc.) para enfocarte en lo urgente.
- **Archivado**: Puedes archivar solicitudes antiguas para mantener tu bandeja limpia. No se borran, solo se mueven a la vista de "Archivados".

---

## 4. Gestión de Solicitudes (Flujo de Reserva)
Cada solicitud sigue un proceso lógico:

### Paso 1: Revisar Lead (Pendiente)
- Revisa las fechas, cantidad de personas y el **Motivo del viaje**.
- El sistema asigna un "Score de Riesgo" basado en palabras clave (ej: "fiesta").

### Paso 2: Pre-aprobar
- Si la solicitud es válida, haz clic en **"Pre-aprobar"**.
- El sistema enviará automáticamente un correo al huésped con los **datos bancarios** para que realice el depósito.

### Paso 3: Confirmar Pago
- Una vez que recibas el comprobante de transferencia, busca la solicitud y haz clic en **"Confirmar"**.
- **Importante**: Esto marcará las fechas como **ocupadas** en el calendario público y enviará al huésped la confirmación final con el link de WhatsApp.

### Paso 4: Rechazar/Cancelar
- Si no puedes aceptar la reserva, usa **"Rechazar"**. Se enviará un correo de cortesía informando que no hay disponibilidad.

---

## 5. Gestión de Precios
Accede a la pestaña **"Precios"** para configurar las tarifas:

- **Precio Base**: Definido en el panel de Sistema. Es el precio por defecto para cualquier día que no tenga regla.
- **Temporadas**: Puedes crear reglas (ej: "Verano", "Vacaciones de Invierno") con fechas de inicio y fin.
- **Fines de Semana**: Cada regla de temporada permite definir un precio diferenciado para Viernes y Sábado.
- **Prioridad**: Si dos reglas se solapan, la que tenga mayor número de prioridad ganará.
- **Feriados**: El sistema detecta automáticamente los feriados cargados para aplicar la lógica de "Feriado Puente".

---

## 6. Gestión de Disponibilidad
Accede a la pestaña **"Disponibilidad"**:

- **Bloquear Fechas**: Si vas a usar el departamento o necesitas hacer mantenimiento, selecciona el rango de fechas y agrega un motivo. Esto hará que no aparezcan disponibles en la web pública.
- **Desbloquear**: Simplemente elimina el bloqueo en la lista lateral para volver a liberar los días.
- **Conflictos**: El calendario visual te permite ver de un vistazo qué días están ocupados por reservas confirmadas y cuáles por bloqueos manuales.

---

## 7. Gestión de Imágenes
Accede a la pestaña **"Imágenes"**:

- **Subir**: Arrastra o selecciona fotos del departamento. El sistema las optimiza automáticamente para web.
- **Ordenar**: Usa el **Drag & Drop** para reordenar las fotos. La primera foto será la portada de la web.
- **Eliminar**: Elimina fotos antiguas o de baja calidad para mantener la galería premium.

---

## 8. Configuración del Sistema
En la pestaña **"Sistema"** puedes ajustar variables críticas:
- Valor de renta base.
- Email de contacto del dueño.
- Link de WhatsApp.
- Datos bancarios (estos aparecen en el correo de pre-aprobación).

---

## 9. Buenas Prácticas Operativas

- **Respuesta Rápida**: Intenta pre-aprobar solicitudes en menos de 2 horas. Un lead caliente es más propenso a pagar rápido.
- **Calidad de Fotos**: Mantén siempre al menos una foto de la vista al mar como primera imagen.
- **Bloqueos Preventivos**: Si sabes que el departamento estará ocupado (fuera de la plataforma), bloquéalo de inmediato para evitar doble reserva.

---

## 10. Checklist de Control

### Checklist Semanal (Lunes)
- [ ] Revisar solicitudes pendientes de pago (hacer seguimiento si pasan 24h).
- [ ] Verificar que los precios de la próxima semana sean correctos.
- [ ] Archivar solicitudes rechazadas o completadas.

### Checklist Mensual
- [ ] Revisar el calendario de feriados del mes siguiente.
- [ ] Actualizar fotos si ha habido cambios en la decoración o mobiliario.
- [ ] Revisar métricas de visitas (si están integradas).

---

## 11. Solución de Problemas
- **No llega el correo al admin**: Revisa la carpeta Spam o verifica que `ALLOWED_ADMIN_EMAILS` sea correcto.
- **El precio en la web no coincide**: Verifica si hay una regla de temporada con mayor prioridad sobreescribiendo el precio base.
- **Error al subir fotos**: Asegúrate de que la foto no pese más de 10MB y sea formato JPG/PNG.

---
*Este manual es propiedad de Coastal Alchemist. Ante dudas técnicas contactar al soporte de desarrollo.*
