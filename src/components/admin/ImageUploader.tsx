"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Settings2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { ImageService, type ImageCategory } from '@/services/image-service';
import { revalidateImages } from '@/app/actions/images';

interface FileWithStatus {
  file: File;
  id: string;
  status: 'pending' | 'compressing' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
  previewUrl: string;
}

interface ImageUploaderProps {
  onUploadComplete?: () => void;
}

export function ImageUploader({ onUploadComplete }: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileWithStatus[]>([]);
  const [category, setCategory] = useState<ImageCategory>('property');
  const [optimize, setOptimize] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({
        file,
        id: Math.random().toString(36).substring(7),
        status: 'pending' as const,
        progress: 0,
        previewUrl: URL.createObjectURL(file)
      }));
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const removed = prev.find(f => f.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return filtered;
    });
  };

  const uploadAll = async () => {
    if (selectedFiles.length === 0 || isUploading) return;
    
    setIsUploading(true);
    
    for (const fileStatus of selectedFiles) {
      if (fileStatus.status === 'done') continue;

      try {
        let fileToUpload = fileStatus.file;

        // 1. Optional Compression
        if (optimize) {
          updateFileStatus(fileStatus.id, { status: 'compressing' });
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp'
          };
          fileToUpload = await imageCompression(fileStatus.file, options);
        }

        // 2. Upload
        updateFileStatus(fileStatus.id, { status: 'uploading', progress: 50 });
        await ImageService.uploadImage(fileToUpload, category);
        
        updateFileStatus(fileStatus.id, { status: 'done', progress: 100 });
      } catch (error) {
        console.error('Upload error:', error);
        updateFileStatus(fileStatus.id, { status: 'error', error: 'Error al subir' });
      }
    }

    setIsUploading(false);
    await revalidateImages();
    if (onUploadComplete) onUploadComplete();
  };

  const updateFileStatus = (id: string, updates: Partial<FileWithStatus>) => {
    setSelectedFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="bg-white border border-[#e2d9cc] rounded-[32px] overflow-hidden shadow-sm">
      <div className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-serif italic text-[#2c2416]">Subir nuevas imágenes</h3>
            <p className="text-[#6b5d4f] text-sm">Selecciona una o varias fotos para actualizar la galería.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Category Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Categoría</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as ImageCategory)}
                className="bg-[#faf7f2] border border-[#e2d9cc] rounded-xl px-4 py-2 text-sm text-[#2c2416] focus:outline-none focus:ring-2 focus:ring-[#6b7c4a]/20"
              >
                <option value="property">Propiedad</option>
                <option value="amenities">Amenidades</option>
                <option value="featured">Destacadas</option>
              </select>
            </div>

            {/* Optimization Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78] ml-1">Optimización</label>
              <button 
                onClick={() => setOptimize(!optimize)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${optimize ? 'bg-[#6b7c4a]/5 border-[#6b7c4a]/20 text-[#6b7c4a]' : 'bg-white border-[#e2d9cc] text-[#9a8a78]'}`}
              >
                <Settings2 className="w-4 h-4" />
                <span className="text-xs font-semibold">{optimize ? 'WebP (1MB)' : 'Original'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dropzone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="group border-2 border-dashed border-[#e2d9cc] hover:border-[#6b7c4a] rounded-[24px] p-12 text-center transition-all cursor-pointer bg-[#faf7f2]/30 hover:bg-[#6b7c4a]/5"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#e2d9cc]/50 group-hover:scale-110 transition-transform shadow-sm">
            <Upload className="w-8 h-8 text-[#6b7c4a]" />
          </div>
          <p className="text-[#2c2416] font-medium">Haz clic o arrastra imágenes aquí</p>
          <p className="text-[#9a8a78] text-xs mt-2">Formatos soportados: JPG, PNG, WebP</p>
        </div>

        {/* File List */}
        {selectedFiles.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9a8a78]">Lista de archivos ({selectedFiles.length})</span>
              <button 
                onClick={() => setSelectedFiles([])}
                className="text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-600"
              >
                Limpiar todo
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-[#faf7f2] rounded-2xl border border-[#e2d9cc]/50 group relative">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#e2d9cc]/30 shrink-0">
                    <img src={f.previewUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-8">
                    <p className="text-xs font-medium text-[#2c2416] truncate">{f.file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {f.status === 'pending' && <span className="text-[9px] text-[#9a8a78]">Pendiente</span>}
                      {f.status === 'compressing' && <span className="text-[9px] text-[#6b7c4a] flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Optimizando...</span>}
                      {f.status === 'uploading' && <span className="text-[9px] text-[#6b7c4a] flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin" /> Subiendo...</span>}
                      {f.status === 'done' && <span className="text-[9px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Listo</span>}
                      {f.status === 'error' && <span className="text-[9px] text-rose-500 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" /> {f.error}</span>}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFile(f.id)}
                    className="absolute top-2 right-2 p-1 text-[#9a8a78] hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-6 border-t border-[#e2d9cc]/50">
              <button 
                onClick={uploadAll}
                disabled={isUploading || selectedFiles.every(f => f.status === 'done')}
                className="flex items-center gap-2 px-8 py-3 bg-[#6b7c4a] text-white rounded-full text-sm font-bold uppercase tracking-widest shadow-md hover:bg-[#5a6a3f] disabled:bg-[#6b7c4a]/30 disabled:shadow-none transition-all"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {isUploading ? 'Subiendo...' : 'Iniciar Carga'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
