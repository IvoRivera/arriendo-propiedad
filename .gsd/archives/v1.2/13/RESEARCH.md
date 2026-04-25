# Research: Flexible Upload System (Phase 13)

## Objective
Implement a multi-file upload system with optional client-side optimization to ensure fast uploads and storage efficiency.

## Findings

### 1. Client-Side Optimization
- **Library**: `browser-image-compression`.
- **Capabilities**: Resizing (max width/height), quality adjustment, and Web Worker support to keep the UI responsive.
- **Constraints**: Browsers can handle JPEG, PNG, and WebP. AVIF/HEIC might need server-side conversion or specialized loaders.

### 2. Multi-File Upload UI
- **Component**: `ImageUploader.tsx`.
- **Features**:
  - Drag & Drop support.
  - File list with individual progress bars.
  - Category selector (Propiedad, Amenidades, Destacadas).
  - Optional "Compression" toggle.

### 3. Implementation Details
- **Optimization Strategy**: 
  - Max Width: 1920px.
  - Max Size: 1MB (configurable).
  - Format: WebP (best for web carousels).
- **Concurrency**: Process 2-3 images at a time to avoid memory pressure on mobile devices.

### 4. Optional Logic
- If "Optimize" is OFF: Upload original blob.
- If "Optimize" is ON: Pass through `browser-image-compression` first.

## Decisions
- Use `browser-image-compression`.
- Default optimization to ON.
- Integrated category selection during upload.
