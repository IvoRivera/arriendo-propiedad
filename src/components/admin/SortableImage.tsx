"use client";

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Loader2, Edit2, Save, X } from 'lucide-react';
import type { DbImage, ImageCategory } from '@/services/image-service';

interface SortableImageProps {
  id: string;
  image: DbImage;
  onDelete: (id: string) => void;
  onUpdate: (id: string, payload: Partial<DbImage>) => Promise<void>;
  onPreview?: (id: string) => void;
  isDeleting: boolean;
  isOverlay?: boolean;
}

export function SortableImage({ id, image, onDelete, onUpdate, onPreview, isDeleting, isOverlay }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id,
    disabled: isOverlay
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editAlt, setEditAlt] = useState(image.metadata?.alt || '');
  const [editCategory, setEditCategory] = useState<ImageCategory>(image.category);
  const [editPriority, setEditPriority] = useState(image.priority);
  const [isUpdating, setIsUpdating] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms ease',
    zIndex: isDragging ? 0 : isOverlay ? 100 : 'auto',
    opacity: isDragging ? 0.3 : 1,
    cursor: isOverlay ? 'grabbing' : 'inherit',
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(image.id, {
        category: editCategory,
        priority: Number(editPriority),
        metadata: { ...image.metadata, alt: editAlt }
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update image', error);
      alert('Error al actualizar la imagen');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditAlt(image.metadata?.alt || '');
    setEditCategory(image.category);
    setEditPriority(image.priority);
    setIsEditing(false);
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`group relative bg-white border border-[#e2d9cc] rounded-3xl overflow-hidden transition-all flex flex-col ${
        isOverlay ? 'shadow-2xl ring-2 ring-[#6b7c4a]/20 scale-[1.02]' : 'shadow-sm hover:shadow-md'
      }`}
    >
      <div 
        className="aspect-[4/3] relative overflow-hidden bg-gray-100 flex items-center justify-center shrink-0 cursor-zoom-in group/img"
        onClick={() => !isOverlay && onPreview?.(image.id)}
      >
        {image?.url?.trim() ? (
          <img
            src={image.url}
            alt={image.metadata?.alt || "Miniatura de la propiedad"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-[#9a8a78] text-[10px] italic">Sin imagen</div>
        )}
        
        {/* Drag Handle Overlay */}
        {!isOverlay && (
          <div 
            {...attributes} 
            {...listeners}
            className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e2d9cc] text-[#9a8a78] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            style={{ touchAction: 'none' }}
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />
      </div>
      
      <div className="p-4 flex flex-col gap-3 flex-1 bg-white">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#9a8a78] uppercase tracking-wider">Categoría</label>
              <select 
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value as ImageCategory)}
                className="w-full bg-[#faf7f2] border border-[#e2d9cc] rounded-lg px-2 py-1.5 text-base sm:text-xs text-[#2c2416] focus:outline-none focus:ring-1 focus:ring-[#6b7c4a]"
              >
                <option value="property">Propiedad</option>
                <option value="amenities">Amenidades</option>
                <option value="featured">Destacadas</option>
                <option value="hero">Imagen Hero</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#9a8a78] uppercase tracking-wider">Orden (Prioridad)</label>
              <input 
                type="number" 
                value={editPriority}
                onChange={(e) => setEditPriority(parseInt(e.target.value) || 0)}
                className="w-full bg-[#faf7f2] border border-[#e2d9cc] rounded-lg px-2 py-1.5 text-base sm:text-xs text-[#2c2416] focus:outline-none focus:ring-1 focus:ring-[#6b7c4a]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#9a8a78] uppercase tracking-wider">Texto Alternativo (Alt)</label>
              <input 
                type="text" 
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Descripción de la imagen"
                className="w-full bg-[#faf7f2] border border-[#e2d9cc] rounded-lg px-2 py-1.5 text-base sm:text-xs text-[#2c2416] focus:outline-none focus:ring-1 focus:ring-[#6b7c4a]"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button 
                onClick={handleCancel}
                disabled={isUpdating}
                className="p-1.5 text-[#9a8a78] hover:bg-gray-100 rounded-lg transition-colors"
                title="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSave}
                disabled={isUpdating}
                className="p-1.5 text-[#6b7c4a] hover:bg-[#6b7c4a]/10 rounded-lg transition-colors"
                title="Guardar"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col min-w-0 pr-2">
              <span className="text-[10px] font-bold text-[#9a8a78] uppercase tracking-wider truncate">
                {image.metadata?.alt || "Sin descripción"}
              </span>
              <span className="text-[10px] font-semibold text-[#6b7c4a] opacity-70">
                Orden: {image.priority}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-[#9a8a78] hover:text-[#6b7c4a] hover:bg-[#6b7c4a]/5 rounded-xl transition-all"
                title="Editar imagen"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(image.id)}
                disabled={isDeleting}
                className="p-2 text-[#9a8a78] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                title="Eliminar imagen"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
