# Design System Document: The Coastal Alchemist

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Sanctuary."**

We are not building a utility app; we are curating a digital experience that mimics the sensation of walking onto a sun-drenched veranda in La Serena.

The system prioritizes:
- **Calm over stimulation**
- **Editorial composition over rigid grids**
- **Atmosphere over density**

We break conventional layouts through:
- **Intentional asymmetry**
- **Edge-bleeding imagery (especially on 390px viewport)**
- **Tonal separation instead of structural borders**

Every interaction must feel **effortless, warm, and premium**.

---

## 2. Colors

Our palette is a dialogue between shoreline warmth and Pacific depth.

### Core Brand Colors
* **Primary (`#00628f`)** → Coastal blue, used ONLY for primary actions
* **Primary Container (`#007cb3`)** → Lighter coastal tone for gradients

### CTA Rule (Critical)
Primary actions MUST use a **soft gradient**, never flat color:

- Direction: 135°
- From: `#00628f`
- To: `#007cb3`

This gradient defines brand identity.

### Surface System
Layer UI using tonal hierarchy instead of borders:

- `surface` → base
- `surface_container_low`
- `surface_container`
- `surface_container_high`
- `surface_container_highest`

### Rules
- ❌ No 1px borders for layout separation
- ❌ No pure black backgrounds
- ✅ Use background contrast to define structure

### Glass & Atmosphere
- Floating elements use semi-transparent surfaces
- Backdrop blur: **20px**
- Maintain environmental continuity (no visual disconnection)

---

## 3. Typography

Typography balances editorial elegance with clarity.

### Display (Newsreader)
- Used for hero and emotional emphasis
- Slight negative tracking: **-2%**
- Large, confident, never cramped

### Body (Inter)
- Clean, readable, modern
- Used for all functional content

### Spacing Rule
- Minimum **24px vertical breathing space** after large text
- Never stack dense text blocks

---

## 4. Elevation & Depth

Depth must feel **natural, not artificial**.

### Principles
- Prefer **layering over shadows**
- Avoid “floating cards” unless necessary

### Shadows (only when needed)

0px 12px 32px rgba(27, 28, 26, 0.06)


- Never use pure black shadows
- Keep them diffused and subtle

### Ghost Border
Used only when necessary:
- 15% opacity
- Barely visible

---

## 5. Components

### Buttons (UPDATED — Critical Change)

#### Primary (CTA)
- Gradient: `#00628f → #007cb3`
- Text: white
- Shape: **fully rounded capsule (`rounded-full`)**
- Padding: generous (minimum `px-8 py-3`)
- Typography: Inter, semibold, slight negative tracking

Interaction:
- Hover: **brightness increase (no color swap)**
- No shadows
- No borders

👉 Must feel:
- calm
- premium
- touch-friendly
- not aggressive

---

#### Secondary
- Background: `surface_container_low`
- Shape: **rounded-full (capsule)**
- No borders
- Subtle presence

---

#### Tertiary
- No background
- Text-only
- Underline only under text (not full width)
- Color: `primary`

---

### Cards & Lists
- ❌ No dividers
- Use spacing or tonal shift
- Image radius: **12px only (not capsule)**

---

### Input Fields
- Background: `surface_container_high`
- On focus:
  - lighter surface
  - ghost border appears
- No harsh outlines

---

### Chips
- Capsule shape (`rounded-full`)
- Background: `secondary_container`
- Small, subtle, non-dominant

---

### Editorial Quote
- Newsreader italic
- Centered
- Minimal lines above/below
- Used to create rhythm in long layouts

---

## 6. Shape Language (NEW — Important)

The system uses **two distinct shape rules**:

- **Cognitive elements (buttons, chips, actions):**
  → Capsule (`rounded-full`)

- **Content containers (cards, images):**
  → Soft radius (`12px`)

👉 Never mix these arbitrarily.

This contrast reinforces hierarchy:
- Capsules = interactive
- Rounded rectangles = structural

---

## 7. Do's and Don'ts

### Do:
- Use asymmetry intentionally
- Prioritize whitespace
- Let images breathe
- Make CTAs feel touchable and soft

### Don't:
- ❌ Use pure black (#000000)
- ❌ Use harsh hover color changes
- ❌ Use rectangular buttons for primary actions
- ❌ Use borders as separators
- ❌ Overuse the primary color

---

## Final Principle

If an element feels:
- loud
- rigid
- overly sharp
- or generic

→ It does NOT belong in this system.

Everything should feel like it was shaped by wind, light, and time.