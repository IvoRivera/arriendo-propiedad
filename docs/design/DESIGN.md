# Design System Document: The Coastal Alchemist

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Sanctuary"** under the concept of **"The Coastal Alchemist."**

We are not building a utility app; we are curating a digital experience that mimics the sensation of walking onto a sun-drenched veranda in La Serena. The design should feel like it was shaped by wind, light, and time.

### Core Principles
- **Atmospheric over Utility**: Prioritize the feeling of the space over dense information.
- **Editorial Composition**: Use asymmetry and large typography to mimic high-end travel magazines.
- **Effortless Premium**: Interactions should be smooth, with subtle shimmers and progressive revelations.
- **Tonal Separation**: Use background contrast and spacing instead of harsh structural borders.

---

## 2. Colors & Light

Our palette is a dialogue between shoreline warmth and Pacific depth.

### Brand Palette
*   **Pacific Blue (`#00628f`)** → Primary actions, deep ocean feeling.
*   **Teal Accents (`#66B8B6`)** → Highlights, specialized headlines (e.g., "mar").
*   **Warm Sand (`#faf7f2`)** → Base surface, mimics sun-bleached sand.
*   **Dune Gold (`#e6d29c`)** → Eyebrow text, secondary emphasis.
*   **Coastal Pine (`#6b7c4a`)** → Selection highlights (e.g., calendar selected days).

### CTA Rules
Primary actions MUST use a **cinematic gradient** or shimmer:
- **Gradient**: `linear-gradient(120deg, rgba(255,255,255,0.08), rgba(0,180,255,0.25), rgba(255,255,255,0.08))`
- **Shimmer**: A subtle light-sweep animation moving across the button.

### Surface Hierarchy
Layer UI using tonal hierarchy instead of borders:
- `surface` (#faf7f2) → Base
- `surface-container-low` (#f5f0e8) → Secondary areas
- `surface-container-high` (#e7e2da) → Interactive areas/inputs

---

## 3. Typography: The Editorial Voice

Typography balances timeless elegance with modern clarity.

### Display: Newsreader (Serif)
- **Use**: Headlines, emotional quotes, featured cards.
- **Style**: Often used in *Italic* for a softer, more sophisticated "editorial" look.
- **Tracking**: Slight negative tracking (**-0.02em**) for larger headlines.
- **Class**: `.font-serif-luxury`

### Body: Inter (Sans)
- **Use**: UI labels, metadata, functional text.
- **Tracking**: Luxury tracking for tags (**0.15em**) and small labels (**0.08em**).
- **Class**: `.font-sans-luxury`, `.tracking-luxury`, `.tracking-luxury-sm`

### Rhythm
- Maintain significant whitespace between text blocks.
- Never stack more than 3 lines of dense body text in featured sections.

---

## 4. Shape Language

The system uses **two distinct shape rules** to reinforce hierarchy:

1.  **Interactive Elements (Buttons, Chips, Tags):**
    - → **Capsule (`rounded-full`)**
    - Reinforces "touchability" and softness.
2.  **Structural Containers (Cards, Images, Modals):**
    - → **Soft Radius (`12px` or `24px`)**
    - Provides a modern, grounded feel without being "sharp."

---

## 5. Components & Interactions

### The Editorial Gallery
- **Progressive Revelation**: Images should not just "appear"; they should feel curated.
- **Narrative Stack**: Limit featured images to 3 in a stack to maintain scannability.
- **Contextual CTAs**: "Ver más" counters integrated into the last image of a stack.

### Glassmorphism
- Used for "Floating" elements (eyebrows, price badges).
- **Backdrop Blur**: `20px` minimum.
- **Border**: `1px` at `15%` white opacity.

### Micro-animations
- **Shimmers**: For loading states and primary CTAs.
- **Floating**: Subtle Y-axis oscillation for Hero elements.
- **Smooth Scroll**: Cinematic transitions between sections.

---

## 6. Admin Panel Vision: Luxury Management

The Admin Panel should not feel like a separate, generic app. It should be the **"Internal Sanctuary."**

### Aesthetics
- **Light Mode Primary**: Maintain the `#faf7f2` base for clarity and focus.
- **Luxury Grids**: Use the same `12px` radius for data cards.
- **Typography**: Apply `Newsreader Italic` for section titles to keep the premium feel.
- **Actions**: Admin buttons use the same Capsule shape, but with solid tonal backgrounds (e.g., Pine or Navy) instead of shimmers for better readability in high-frequency use.
- **Data Visualization**: Clean, minimal graphs using the Brand Palette.

---

## 7. Do's and Don'ts

### Do:
- ✅ Use asymmetry to create rhythm.
- ✅ Let images bleed to the edges on mobile.
- ✅ Use background color shifts for separation.
- ✅ Apply "Luxury Tracking" to all uppercase labels.

### Don't:
- ❌ Use pure black (#000000). Use `#1a150e` for deep shadows.
- ❌ Use rectangular buttons for primary actions.
- ❌ Use 1px borders to separate main layout sections.
- ❌ Overcrowd the viewport with text.

---

## Final Principle

If an element feels **loud, rigid, or generic**, it does NOT belong in this system. Everything should feel like it was crafted by an alchemist who understands the harmony of the coast.
el like it was shaped by wind, light, and time.