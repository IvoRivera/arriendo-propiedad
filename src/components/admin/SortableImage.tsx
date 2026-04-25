"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Loader2 } from 'lucide-react';

interface SortableImageProps {
  id: string;
  image: {
    id: string;
    url: string;
    priority: number;
  };
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function SortableImage({ id, image, onDelete, isDeleting }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative bg-white border border-[#e2d9cc] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all"
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        <img
          src={image.url}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Drag Handle Overlay */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-xl border border-[#e2d9cc] text-[#9a8a78] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 pointer-events-none" />
      </div>
      
      <div className="p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-[#9a8a78] uppercase tracking-wider">Orden: {image.priority}</span>
        </div>
        <button
          onClick={() => onDelete(image.id)}
          disabled={isDeleting}
          className="p-2 text-[#9a8a78] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
          title="Eliminar imagen"
        >
          {isDeleting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}
