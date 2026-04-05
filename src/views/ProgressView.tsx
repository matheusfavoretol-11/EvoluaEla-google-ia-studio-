import React, { useState, useRef, useEffect } from 'react';
import { Camera, Plus, TrendingDown, Image as ImageIcon, Lock, TrendingUp } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressSkeleton } from '../components/Skeleton';

export default function ProgressView() {
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newWeight, setNewWeight] = useState('');
  
  const [weightData, setWeightData] = useState([
    { date: 'Sem 1', weight: 71.0 },
    { date: 'Sem 2', weight: 70.5 },
    { date: 'Sem 3', weight: 70.0 },
    { date: 'Sem 4', weight: 69.2 },
    { date: 'Sem 5', weight: 68.8 },
    { date: 'Atual', weight: 68.5 },
  ]);

  const [photos, setPhotos] = useState<{ id: string, url: string, date: string, weight: string }[]>([
    { id: '1', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400', date: 'Mês 1', weight: '71.0 kg' }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotos([...photos, { id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, url, date: 'Hoje', weight: `${weightData[weightData.length - 1].weight} kg` }]);
    }
  };

  const handleAddWeight = () => {
    if (newWeight && !isNaN(Number(newWeight))) {
      const weightNum = Number(newWeight);
      setWeightData([...weightData, { date: `Novo ${weightData.length}`, weight: weightNum }]);
      setNewWeight('');
    }
  };

  const currentWeight = weightData[weightData.length - 1].weight;
  const initialWeight = weightData[0].weight;
  const weightDiff = (currentWeight - initialWeight).toFixed(1);
  const isLoss = currentWeight <= initialWeight;

  if (isLoading) {
    return <ProgressSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 space-y-10 bg-[var(--color-bg)] min-h-full text-[var(--color-text)] font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="relative z-10">
        <h2 className="text-5xl font-bold text-[var(--color-text)] mb-3 tracking-tighter">Sua <span className="gradient-text">Evolução</span></h2>
        <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Acompanhe seus resultados e celebre cada vitória.</p>
      </header>

      {/* Weight Tracker */}
      <section className="p-8 rounded-[2.5rem] border border-[var(--color-border)] glass-card relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-accent)]/5 rounded-full blur-[80px] -mr-10 -mt-10"></div>
        <div className="flex justify-between items-start mb-10 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] block mb-3">Peso Atual</span>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold text-[var(--color-text)] tracking-tighter">{currentWeight.toFixed(1)}</span>
              <span className="font-bold text-[var(--color-text-muted)] text-xl tracking-widest uppercase">kg</span>
            </div>
          </div>
          <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest shadow-2xl border ${isLoss ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
            {isLoss ? <TrendingDown size={18} /> : <TrendingUp size={18} />}
            <span>{weightDiff} kg</span>
          </div>
        </div>

        {/* Add Weight Input */}
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="flex-1 relative group">
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              placeholder="Novo peso (kg)"
              className="w-full bg-[var(--color-text)]/5 border border-[var(--color-border)] rounded-2xl px-8 py-5 text-sm font-bold text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]/30 transition-all placeholder:text-[var(--color-text-muted)]/30"
            />
          </div>
          <button 
            onClick={handleAddWeight}
            disabled={!newWeight}
            className="px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs text-black shadow-2xl hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
          >
            Registrar
          </button>
        </div>

        {/* Recharts Area */}
        <div className="h-64 w-full mt-6 relative z-10" style={{ marginLeft: '-15px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--color-text-rgb), 0.03)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'rgba(var(--color-text-rgb), 0.2)', fontWeight: 700 }} 
                dy={15}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'rgba(var(--color-text-rgb), 0.2)', fontWeight: 700 }}
                dx={-15}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '12px' }}
                labelStyle={{ color: 'var(--color-text)', fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="var(--color-primary)" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight">Comparação Visual</h3>
        </div>
        
        <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
            <Lock size={14} className="text-[var(--color-accent)]" /> Ambiente seguro e privado
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--color-text)]/5 border border-[var(--color-border)] shadow-2xl group">
              {photos.length > 0 ? (
                <>
                  <img src={photos[0].url} alt="Antes" className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-80 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xl text-white text-[10px] font-bold px-4 py-2 rounded-2xl uppercase tracking-widest border border-white/10">Antes</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                    <p className="text-white font-bold text-lg mb-1 tracking-tight">{photos[0].date}</p>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{photos[0].weight}</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)]/10">
                  <ImageIcon size={32} className="mb-3 opacity-20" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sem foto</span>
                </div>
              )}
            </div>
            
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-[var(--color-text)]/5 border border-[var(--color-border)] shadow-2xl group">
              {photos.length > 1 ? (
                <>
                  <img src={photos[photos.length - 1].url} alt="Depois" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-black text-[10px] font-bold px-4 py-2 rounded-2xl uppercase tracking-widest shadow-2xl">Depois</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6">
                    <p className="text-white font-bold text-lg mb-1 tracking-tight">{photos[photos.length - 1].date}</p>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{photos[photos.length - 1].weight}</p>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)]/20 hover:bg-[var(--color-text)]/5 transition-all border-2 border-dashed border-[var(--color-border)] rounded-3xl m-2 group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-black transition-all">
                    <Camera size={28} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">Adicionar Foto</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-text-muted)]/10 italic">
              "Celebre o progresso, não a perfeição."
            </p>
          </div>
        </div>
      </section>

      {/* Photos Timeline */}
      <section className="pb-10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Linha do Tempo</h3>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[var(--color-text)] transition-colors text-[var(--color-primary)]" 
          >
            <Plus size={18} /> Nova Foto
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar">
          {photos.map((photo, index) => (
            <motion.div 
              key={`${photo.id}-${index}`}
              whileHover={{ y: -8, scale: 1.02 }} 
              className="w-40 shrink-0 aspect-[3/4] rounded-3xl overflow-hidden relative group cursor-pointer border border-[var(--color-border)] shadow-2xl transition-all hover:border-[var(--color-primary)]/30 bg-[var(--color-text)]/5" 
            >
              <img 
                src={photo.url} 
                alt={`Evolução ${index + 1}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-5 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-base mb-1 tracking-tight">{photo.date}</span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{photo.weight}</span>
              </div>
            </motion.div>
          ))}
          
          <motion.button 
            whileHover={{ y: -8, scale: 1.02 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-40 shrink-0 aspect-[3/4] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer bg-[var(--color-text)]/5 hover:bg-[var(--color-text)]/10 border-[var(--color-border)] text-[var(--color-text-muted)]/20 group"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[var(--color-text)]/5 transition-all group-hover:bg-[var(--color-primary)] group-hover:text-black">
              <Camera size={28} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Nova Foto</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
