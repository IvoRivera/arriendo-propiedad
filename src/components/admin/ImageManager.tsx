"use client";

import React, { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabase';
import { ImageService, type ImageCategory } from '@/services/image-service';
import { Trash2, Plus, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ImageUploader } from './ImageUploader';

interface DbImage {
  id: string;
  url: string;
  category: string;
  priority: number;
  storage_path: string;
}

export function ImageManager() {
  const [images, setImages] = useState<DbImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Error al eliminar la imagen.');
    } finally {
      setDeletingId(null);
    }
  };

  const categories: { key: ImageCategory; label: string }[] = [
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
                {catImages.length} fotos
              </span>
            </div>

            {catImages.length === 0 ? (
              <div className="bg-[#faf7f2]/50 border border-dashed border-[#e2d9cc] rounded-3xl py-12 text-center">
                <p className="text-[#9a8a78] text-sm italic">No hay imágenes en esta categoría.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {catImages.map(img => (
                  <div key={img.id} className="group relative bg-white border border-[#e2d9cc] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </div>
                    
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#9a8a78] uppercase tracking-wider">Orden: {img.priority}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(img.id)}
                        disabled={deletingId === img.id}
                        className="p-2 text-[#9a8a78] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Eliminar imagen"
                      >
                        {deletingId === img.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
