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
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { revalidateImages } from '@/app/actions/images';

export function ImageManager() {
  const [images, setImages] = useState<DbImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

  const handleDragEnd = async (event: DragEndEvent, categoryKey: ImageCategory) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const catImages = images.filter(img => img.category === categoryKey);
      const oldIndex = catImages.findIndex(img => img.id === active.id);
      const newIndex = catImages.findIndex(img => img.id === over.id);

      const reorderedCat = arrayMove(catImages, oldIndex, newIndex).map((img, idx) => ({
        ...img,
        priority: idx + 1
      }));
      
      const finalImages: DbImage[] = [];
      const categoryKeys: ImageCategory[] = ['hero', 'property', 'amenities', 'featured'];
      
      categoryKeys.forEach(key => {
        if (key === categoryKey) {
          finalImages.push(...reorderedCat);
        } else {
          finalImages.push(...images.filter(img => img.category === key));
        }
      });

      setImages(finalImages);

      try {
        setIsReordering(true);
        await ImageService.reorderImages(reorderedCat);
        await revalidateImages();
      } catch (err) {
        console.error('Error persisting order:', err);
        alert('No se pudo guardar el nuevo orden.');
        fetchImages(); 
      } finally {
        setIsReordering(false);
      }
    }
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
      <ImageUploader onUploadComplete={fetchImages} />

      {/* Gallery Sections by Category */}
      {categories.map(cat => {
        const catImages = images.filter(img => img.category === cat.key);
        
        return (
          <div key={cat.key} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-2xl text-[#2c2416] italic">{cat.label}</h2>
              <div className="h-px flex-1 bg-[#e2d9cc]/50" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a8a78] bg-white border border-[#e2d9cc] px-3 py-1 rounded-full">
                {catImages.length} {catImages.length === 1 ? 'foto' : 'fotos'}
              </span>
            </div>

            {cat.isSingleton && catImages.length > 1 && (
              <div className="bg-amber-50 border border-amber-100 text-amber-700 p-4 rounded-2xl text-xs flex items-center gap-3">
                <Info className="w-4 h-4 shrink-0" />
                Se han detectado varias imágenes Hero. El sitio solo mostrará la primera en la lista de prioridades.
              </div>
            )}

            {catImages.length === 0 ? (
              <div className="bg-[#faf7f2]/50 border border-dashed border-[#e2d9cc] rounded-3xl py-12 text-center">
                <p className="text-[#9a8a78] text-sm italic">No hay imágenes en esta categoría.</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
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
                        isDeleting={deletingId === img.id}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        );
      })}
    </div>
  );
}
