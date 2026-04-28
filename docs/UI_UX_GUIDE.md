# 🎨 Guía de UI/UX - Coastal Alchemist

Esta guía define el lenguaje visual y la experiencia de usuario para la plataforma **Coastal Alchemist**. El objetivo es crear una experiencia que no solo sea funcional, sino que se sienta como un "Santuario Digital".

---

## 1. Filosofía de Diseño: "The Digital Sanctuary"

No estamos construyendo una aplicación de utilidad; estamos curando una experiencia que imita la sensación de entrar en una terraza bañada por el sol en La Serena.

**Pilares:**
- **Calma sobre estimulación**: Espacios en blanco generosos y transiciones suaves.
- **Composición Editorial**: Priorizamos la jerarquía visual de las imágenes sobre las rejillas rígidas.
- **Atmósfera sobre densidad**: Cada elemento debe tener "aire" para respirar.

---

## 2. Identidad Visual

La identidad se basa en el diálogo entre el **calor de la costa** y la **profundidad del Pacífico**.

- **Separación Tonal**: Evitamos bordes de 1px. Usamos cambios sutiles en el color de fondo para definir áreas.
- **Asimetría Intencional**: Rompemos la monotonía con layouts que se sienten orgánicos y dinámicos.
- **Transparencias (Glassmorphism)**: Usamos superficies semi-transparentes con desenfoque de fondo (20px) para mantener la continuidad ambiental.

---

## 3. Paleta de Colores

| Categoría | Color | Valor | Uso |
| :--- | :--- | :--- | :--- |
| **Primary** | Coastal Blue | `#00628f` | Solo para acciones primarias. |
| **Gradient Start** | Deep Sea | `#00628f` | Inicio de degradado en CTAs. |
| **Gradient End** | Light Pacific | `#007cb3` | Fin de degradado en CTAs. |
| **Surface Base** | Sand White | `#fcfcfc` | Fondo principal de la página. |
| **Surface High** | Mist Grey | `#f3f4f6` | Contenedores de inputs y cards. |

**Regla Crítica del CTA:** Las acciones primarias **DEBEN** usar un degradado suave a 135°. Nunca color plano.

---

## 4. Tipografía

Equilibramos la elegancia editorial con la claridad moderna.

- **Display (Newsreader)**: Para títulos principales y énfasis emocionales. Aplicar tracking de `-2%`.
- **Body (Inter)**: Para todo el contenido funcional y administrativo. Legibilidad máxima.
- **Regla de Espaciado**: Mínimo **24px de espacio vertical** después de un título grande.

---

## 5. Componentes UI Key

### Hero Section
- **Visual**: Imágenes que sangran hasta los bordes (edge-to-edge), especialmente en mobile.
- **UX**: El titular debe evocar una emoción antes que una característica técnica.

### Navbar
- **Estilo**: Flotante, con `backdrop-blur` de 20px.
- **Comportamiento**: Se oculta al hacer scroll hacia abajo, aparece al subir para maximizar el espacio visual.

### Booking Widget
- **Diseño**: Superficies suaves (`rounded-2xl`).
- **Feedback**: El precio total debe ser el elemento con mayor contraste visual.

### Calendario
- **UI**: Sin bordes internos. Los días no disponibles se muestran con una opacidad reducida (`opacity-30`).
- **UX**: Selección intuitiva de rango con resaltado suave.

### Cards & Imágenes
- **Radio de Borde**: Siempre `12px` para contenido. Las "cápsulas" (`rounded-full`) se reservan solo para elementos interactivos como botones o chips.

---

## 6. UX Mobile-First

El 80% de nuestros usuarios reservan desde su teléfono.
- **Thumb Zones**: Los botones de acción principal (Reserva) deben estar al alcance del pulgar.
- **Sticky Actions**: En mobile, el botón de "Solicitud de Reserva" debe quedar fijo en la parte inferior si el usuario hace scroll pasado el widget inicial.
- **Gestos**: Las galerías de fotos deben ser *swipeable* con inercia natural.

---

## 7. Estrategia de Conversión

1. **Reducción de Fricción**: Solo pedimos los datos estrictamente necesarios en el formulario inicial.
2. **Prueba Social**: Testimonios con avatares reales y fecha de estancia para generar confianza inmediata.
3. **Claridad de Reglas**: Las "Reglas de la casa" se presentan de forma iconográfica para ser digeridas rápidamente.
4. **Velocidad Percebida**: Usamos *skeleton loaders* para que el usuario sienta que la aplicación ya cargó mientras se traen los datos de Supabase.

---

## 8. Microinteracciones y Animaciones

- **Hover en Botones**: Incremento de brillo sutil (`brightness-110`), no cambio de color drástico.
- **Entradas (Framer Motion)**:
    - Las secciones deben aparecer con un leve `fade-in-up`.
    - Los items de las listas deben entrar de forma escalonada (*staggered*).
- **Feedback Táctil**: Al presionar un botón en mobile, reducir escala a `0.98` momentáneamente.

---

## 9. Accesibilidad

- **Contraste**: Todos los textos sobre fondo deben cumplir con WCAG AA.
- **Focus States**: Los estados de enfoque no deben eliminarse, sino estilizarse para que se sientan integrados en el diseño (usar `ring-offset-2`).
- **ARIA**: Todos los inputs del formulario de reserva deben tener etiquetas descriptivas para lectores de pantalla.

---

## 10. Errores Comunes a Evitar

- ❌ **No usar negro puro (#000)**: Usa grises muy oscuros o azules profundos.
- ❌ **No usar bordes duros**: Prefiere sombras difusas o cambios tonales.
- ❌ **No apilar bloques de texto densos**: Divide el contenido con imágenes o citas editoriales.
- ❌ **No usar botones rectangulares**: Rompen la estética fluida del sistema.

---

## 11. Checklist antes de Publicar

- [ ] ¿El diseño se ve bien en un iPhone 13/14/15?
- [ ] ¿Los degradados de los botones siguen la regla de 135°?
- [ ] ¿Hay suficiente espacio en blanco entre secciones?
- [ ] ¿Las imágenes tienen el atributo `alt` y cargan progresivamente?
- [ ] ¿El widget de reserva funciona sin errores en el cálculo de precio?

---

*Diseñado para ser sentido, no solo usado.*
