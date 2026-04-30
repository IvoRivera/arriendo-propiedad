'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Inbox as InboxIcon, 
  Calendar, 
  Settings, 
  DollarSign, 
  Image as ImageIcon, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface AdminNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: string;
  setActiveView: (view: any) => void;
  userEmail?: string;
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'inbox', label: 'Inbox de Solicitudes', icon: InboxIcon, description: 'Gestión de reservas y mensajes' },
  { id: 'availability', label: 'Calendario y Bloqueos', icon: Calendar, description: 'Disponibilidad manual' },
  { id: 'pricing', label: 'Gestión de Precios', icon: DollarSign, description: 'Tarifas y reglas de temporada' },
  { id: 'images', label: 'Galería de Imágenes', icon: ImageIcon, description: 'Administración de contenido visual' },
  { id: 'config', label: 'Configuración', icon: Settings, description: 'Ajustes globales del sistema' },
];

export const AdminNavigationDrawer: React.FC<AdminNavigationDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  userEmail,
  onLogout
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1a150e]/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-full max-w-[320px] bg-[#faf7f2] shadow-2xl z-[101] flex flex-col border-r border-[#e2d9cc]/30"
          >
            {/* Header */}
            <div className="p-8 flex items-center justify-between border-b border-[#e2d9cc]/20">
              <div>
                <h2 className="font-serif-luxury text-3xl text-[#2c2416] italic tracking-tight">Menú</h2>
                <p className="text-[10px] text-[#9a8a78] font-bold uppercase tracking-luxury mt-1">Santuario Interno</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-[#e2d9cc] flex items-center justify-center text-[#9a8a78] hover:text-[#2c2416] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center gap-4 p-4 rounded-[24px] transition-all group
                      ${isActive 
                        ? 'bg-[#6b7c4a] text-white shadow-lg shadow-[#6b7c4a]/20' 
                        : 'hover:bg-[#f5f0e8] text-[#6b5d4f] hover:text-[#2c2416]'}
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-colors
                      ${isActive ? 'bg-white/20' : 'bg-white border border-[#e2d9cc]/50 group-hover:border-[#6b7c4a]/30'}
                    `}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`text-[11px] font-bold uppercase tracking-luxury ${isActive ? 'text-white' : 'text-[#2c2416]'}`}>
                        {item.label}
                      </p>
                      <p className={`text-[9px] mt-0.5 ${isActive ? 'text-white/70' : 'text-[#9a8a78] font-medium'}`}>
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}`} />
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-[#e2d9cc]/20 bg-[#f5f0e8]/30">
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="w-8 h-8 rounded-full bg-[#6b7c4a] flex items-center justify-center text-white text-xs font-bold">
                  {userEmail?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-[#9a8a78] font-bold uppercase tracking-luxury leading-none">Sesión Activa</p>
                  <p className="text-[11px] text-[#2c2416] font-medium truncate mt-1">{userEmail}</p>
                </div>
              </div>

              <button 
                onClick={onLogout}
                className="w-full py-4 rounded-full border border-rose-100 text-rose-600 font-bold text-[10px] uppercase tracking-luxury flex items-center justify-center gap-2 hover:bg-rose-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
