import React, { useState } from 'react';
import { Bell, X, Check, Info, AlertTriangle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../lib/supabase';

export default function NotificationCenter() {
  const { notifications, setNotifications } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .in('id', unreadIds);
    
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Sparkles className="text-green-400" size={18} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={18} />;
      case 'error': return <X className="text-red-400" size={18} />;
      default: return <Info className="text-blue-400" size={18} />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center glass-morphism text-white/40 hover:text-[#D81BFF] transition-all relative"
      >
        <Bell size={20} className="sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D81BFF] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#0F0A1F] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-80 sm:w-96 max-h-[500px] overflow-hidden glass-morphism rounded-3xl border border-white/10 shadow-3xl z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h3 className="font-bold text-white text-sm uppercase tracking-widest">Notificações</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-[#D81BFF] hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Ler todas
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[400px] hide-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/10">
                      <Bell size={32} />
                    </div>
                    <p className="text-xs text-white/20 font-bold uppercase tracking-widest">Nenhuma notificação por aqui</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => !n.read && markAsRead(n.id)}
                      className={`p-4 rounded-2xl transition-all cursor-pointer border ${n.read ? 'bg-transparent border-transparent opacity-60' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <div className="flex gap-4">
                        <div className="mt-1">{getIcon(n.type)}</div>
                        <div className="flex-1 space-y-1">
                          <h4 className={`text-sm font-bold tracking-tight ${n.read ? 'text-white/60' : 'text-white'}`}>{n.title}</h4>
                          <p className="text-xs text-[#B8B0C8] leading-relaxed font-medium">{n.message}</p>
                          <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest pt-1">
                            {new Date(n.created_at).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-[#D81BFF] mt-2 shadow-[0_0_10px_#D81BFF]" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
