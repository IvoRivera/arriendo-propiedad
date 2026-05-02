"use client";

import React, { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { ImageService, type ImageCategory, type DbImage } from '@/services/image-service';
import { Trash2, Plus, Loader2, Image as ImageIcon, AlertCircle, Info } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { SortableImage } from './SortableImage';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { revalidateImages } from '@/app/actions/images';
import { Lightbox } from '../coastal/Lightbox';
import { AnimatePresence } from 'framer-motion';

export function ImageManager() {
  const [images, setImages] = useState<DbImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ images: { src: string; alt: string }[]; index: number } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabaseAdmin
        .from('images')
        .select('*')
        .order('priority', { ascending: true });

      if (fetchError) throw fetchError;
      setImages(data || []);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('No se pudieron cargar las imágenes.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta imagen? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setDeletingId(id);
      await ImageService.deleteImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
      await revalidateImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error al eliminar la imagen.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (id: string, payload: Partial<DbImage>) => {
    try {
      console.log(`[Update] Image: ${id}`, payload);
      
      const currentImage = images.find(img => img.id === id);
      if (!currentImage) return;

      let finalPayload = { ...payload };
      let imagesToPersist: DbImage[] = [];
      
      // CASO 1: Cambio de categoría (sin especificar prioridad manual)
      if (payload.category && payload.category !== currentImage.category && payload.priority === undefined) {
        const targetCategoryImages = images.filter(img => img.category === payload.category);
        const maxPriority = targetCategoryImages.reduce((max, img) => Math.max(max, img.priority), 0);
        finalPayload.priority = maxPriority + 1;
        
        // Simplemente actualizamos este registro
        await ImageService.updateImage(id, finalPayload);
        
        setImages(prev => {
          const updated = prev.map(img => img.id === id ? { ...img, ...finalPayload } as DbImage : img);
          return [...updated].sort((a, b) => a.priority - b.priority);
        });
      } 
      // CASO 2: Cambio de prioridad manual (Smart Shift) dentro de la misma categoría
      else if (payload.priority !== undefined && payload.priority !== currentImage.priority && (!payload.category || payload.category === currentImage.category)) {
        const categoryKey = currentImage.category;
        const catImages = images
          .filter(img => img.category === categoryKey)
          .sort((a, b) => a.priority - b.priority);

        const oldIndex = catImages.findIndex(img => img.id === id);
        // Aseguramos que el nuevo índice esté dentro de los límites
        const newIndex = Math.max(0, Math.min(catImages.length - 1, payload.priority - 1));

        if (oldIndex !== -1) {
          const movedImages = arrayMove(catImages, oldIndex, newIndex);
          const reorderedCat = movedImages.map((img, idx) => ({
            ...img,
            priority: idx + 1
          }));

          imagesToPersist = reorderedCat;
          
          // Optimistic update
          const otherImages = images.filter(img => img.category !== categoryKey);
          setImages([...otherImages, ...reorderedCat].sort((a, b) => a.priority - b.priority));
          
          await ImageService.reorderImages(reorderedCat);
        }
      }
      // CASO 3: Actualización normal (alt text, etc.)
      else {
        await ImageService.updateImage(id, finalPayload);
        setImages(prev => prev.map(img => img.id === id ? { ...img, ...finalPayload } as DbImage : img));
      }
      
      await revalidateImages();
    } catch (err) {
      console.error('Error updating image:', err);
      alert('Error al actualizar la imagen.');
      fetchImages(); // Rollback
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent, categoryKey: ImageCategory) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      // 1. Obtener imágenes de la categoría y ASEGURAR que estén ordenadas por prioridad
      // Esto es CRÍTICO: si el array no está ordenado por prioridad, el reordenamiento visual
      // no coincidirá con el reordenamiento de los datos.
      const catImages = images
        .filter(img => img.category === categoryKey)
        .sort((a, b) => a.priority - b.priority);
      
      console.log(`[DragEnd] Categoría: ${categoryKey}`);
      console.log('Orden antes:', catImages.map(img => ({ id: img.id.substring(0, 4), priority: img.priority })));

      const oldIndex = catImages.findIndex(img => img.id === active.id);
      const newIndex = catImages.findIndex(img => img.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return;

      // 2. Reordenar usando la función pura arrayMove
      const movedImages = arrayMove(catImages, oldIndex, newIndex);

      // 3. Recalcular 'priority' para TODOS los elementos (index + 1)
      const reorderedCat = movedImages.map((img, idx) => ({
        ...img,
        priority: idx + 1
      }));
      
      console.log('Orden después:', reorderedCat.map(img => ({ id: img.id.substring(0, 4), priority: img.priority })));

      // 4. Actualizar estado local inmediatamente (Optimistic Update)
      const otherImages = images.filter(img => img.category !== categoryKey);
      const finalImages = [...otherImages, ...reorderedCat].sort((a, b) => {
        // Mantenemos el estado global ordenado
        if (a.category !== b.category) return 0; // Agrupados por categoría naturalmente
        return a.priority - b.priority;
      });

      setImages(finalImages);

      // 5. Persistir en backend
      try {
        setIsReordering(true);
        
        // Enviamos el payload completo para cumplir con restricciones NOT NULL de upsert
        console.log('Payload a backend:', reorderedCat.map(img => ({ id: img.id.substring(0, 4), priority: img.priority })));
        
        await ImageService.reorderImages(reorderedCat);
        await revalidateImages();
      } catch (err) {
        console.error('Error persisting order:', err);
        alert('No se pudo guardar el nuevo orden. Reintentando cargar datos...');
        fetchImages(); // Rollback en caso de error
      } finally {
        setIsReordering(false);
      }
    }
  };

  const handlePreview = (id: string, category: ImageCategory) => {
    const categoryImages = images
      .filter(img => img.category === category)
      .sort((a, b) => a.priority - b.priority);
    
    const index = categoryImages.findIndex(img => img.id === id);
    if (index === -1) return;

    const formattedImages = categoryImages.map(img => ({
      src: img.url,
      alt: img.metadata?.alt || "Vista previa"
    }));

    setPreviewData({ images: formattedImages, index });
  };

  const handleUploadComplete = (category: ImageCategory) => {
    fetchImages();
    
    // Give it a small delay for the state to update and elements to be available
    setTimeout(() => {
      const element = document.getElementById(`category-${category}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Optional: brief highlight effect
        element.classList.add('ring-2', 'ring-[#6b7c4a]/30', 'ring-offset-8', 'rounded-2xl');
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-[#6b7c4a]/30', 'ring-offset-8', 'rounded-2xl');
        }, 2000);
      }
    }, 500);
  };

  const categories: { key: ImageCategory; label: string; isSingleton?: boolean }[] = [
    { key: 'hero', label: 'Imagen Hero', isSingleton: true },
    { key: 'property', label: 'Propiedad' },
    { key: 'amenities', label: 'Amenidades' },
    { key: 'featured', label: 'Destacadas' }
  ];

  if (loading && images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#6b7c4a] animate-spin mb-4" />
        <p className="text-[#6b5d4f] text-sm italic">Cargando galería...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 p-5 rounded-2xl text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Upload Section */}
      <ImageUploader onUploadComplete={handleUploadComplete} />

      {/* Gallery Sections by Category */}
      {categories.map(cat => {
        const catImages = images.filter(img => img.category === cat.key);
        
        return (
          <div key={cat.key} id={`category-${cat.key}`} className="space-y-6 scroll-mt-24 transition-all duration-700">
            <div className="flex items-center gap-4">
              <h2 className="font-serif-luxury text-2xl text-[#2c2416] italic tracking-tight">{cat.label}</h2>
              <div className="h-px flex-1 bg-[#e2d9cc]/50" />
              <span className="text-[10px] font-bold uppercase tracking-luxury text-[#9a8a78] bg-white border border-[#e2d9cc] px-3 py-1 rounded-full">
                {catImages.length} {catImages.length === 1 ? 'foto' : 'fotos'}
              </span>
            </div>

            {cat.isSingleton && catImages.length > 1 && (
              <div className="bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-[24px] text-xs flex items-center gap-3 font-medium tracking-luxury-sm">
                <Info className="w-4 h-4 shrink-0" />
                Se han detectado varias imágenes Hero. El sitio solo mostrará la primera en la lista de prioridades.
              </div>
            )}

            {catImages.length === 0 ? (
              <div className="bg-[#faf7f2]/50 border border-dashed border-[#e2d9cc] rounded-[32px] py-12 text-center">
                <p className="text-[#9a8a78] text-sm italic font-serif-luxury opacity-60">No hay imágenes en esta categoría.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={(event) => handleDragEnd(event, cat.key)}
              >
                <SortableContext
                  items={catImages.map(img => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className={`grid gap-6 ${cat.isSingleton ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                    {catImages.map(img => (
                      <SortableImage 
                        key={img.id} 
                        id={img.id} 
                        image={img} 
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        onPreview={(id) => handlePreview(id, cat.key)}
                        isDeleting={deletingId === img.id}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay
                  dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                      styles: {
                        active: {
                          opacity: '0.5',
                        },
                      },
                    }),
                  }}
                >
                  {activeId ? (
                    <div className="w-full h-full opacity-90 scale-105 transition-transform duration-200">
                      <SortableImage 
                        id={activeId}
                        image={images.find(img => img.id === activeId)!}
                        onDelete={() => {}}
                        onUpdate={async () => {}}
                        isDeleting={false}
                        isOverlay
                      />
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        );
      })}

      <AnimatePresence>
        {previewData && (
          <Lightbox
            images={previewData.images}
            initialIndex={previewData.index}
            onClose={() => setPreviewData(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
