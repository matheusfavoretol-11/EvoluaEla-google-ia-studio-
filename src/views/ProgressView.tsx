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
    <div className="p-6 space-y-8">
      <header>
        <h2 className="text-3xl font-serif font-bold text-stone-800 mb-2">Sua Evolução</h2>
        <p className="text-sm font-medium text-stone-500">Acompanhe seus resultados e celebre cada vitória.</p>
      </header>

      {/* Weight Tracker */}
      <section className="p-6 rounded-[2rem] soft-shadow-sm border border-stone-100 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-1">Peso Atual</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif font-bold text-stone-800">{currentWeight.toFixed(1)}</span>
              <span className="font-medium text-stone-500">kg</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-xl flex items-center gap-1 text-xs font-bold shadow-sm ${isLoss ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isLoss ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            <span>{weightDiff} kg</span>
          </div>
        </div>

        {/* Add Weight Input */}
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <input
            type="number"
            step="0.1"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            placeholder="Novo peso (kg)"
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:outline-none transition-all text-stone-800"
            style={{ focusRingColor: theme.primary }}
          />
          <button 
            onClick={handleAddWeight}
            disabled={!newWeight}
            className="px-6 py-3 rounded-2xl font-bold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 gradient-bg"
          >
            Registrar
          </button>
        </div>

        {/* Recharts Area */}
        <div className="h-48 w-full mt-4 relative z-10" style={{ marginLeft: '-10px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#a8a29e', fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#a8a29e', fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: theme.primary, fontWeight: 'bold' }}
                labelStyle={{ color: '#57534e', fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke={theme.primary} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorWeight)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-serif font-bold text-stone-800">Comparação</h3>
        </div>
        
        <div className="bg-white p-5 rounded-[2rem] soft-shadow-sm border border-stone-100">
          <div className="flex items-center justify-center gap-2 mb-5 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <Lock size={12} /> Ambiente seguro e privado
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-stone-100 border border-stone-100">
              {photos.length > 0 ? (
                <>
                  <img src={photos[0].url} alt="Antes" className="w-full h-full object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-widest border border-white/10">Antes</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <p className="text-white font-bold text-sm mb-0.5">{photos[0].date}</p>
                    <p className="text-white/80 text-xs font-medium">{photos[0].weight}</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                  <ImageIcon size={24} className="mb-2 opacity-50" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Sem foto</span>
                </div>
              )}
            </div>
            
            <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-stone-100 border border-stone-100">
              {photos.length > 1 ? (
                <>
                  <img src={photos[photos.length - 1].url} alt="Depois" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-xl uppercase tracking-widest shadow-sm" style={{ color: theme.primary }}>Depois</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                    <p className="text-white font-bold text-sm mb-0.5">{photos[photos.length - 1].date}</p>
                    <p className="text-white/80 text-xs font-medium">{photos[photos.length - 1].weight}</p>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 hover:bg-stone-50 transition-colors border-2 border-dashed border-stone-200 rounded-[1.5rem] m-1"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 gradient-bg-light" style={{ color: theme.primary }}>
                    <Camera size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: theme.primary }}>Adicionar Foto</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm font-serif font-medium italic text-stone-500">
              "Celebre o progresso, não a perfeição."
            </p>
          </div>
        </div>
      </section>

      {/* Photos Timeline */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Linha do Tempo</h3>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold flex items-center gap-1 hover:opacity-80 transition-opacity" 
            style={{ color: theme.primary }}
          >
            <Plus size={14} /> Nova Foto
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {photos.map((photo, index) => (
            <motion.div 
              key={photo.id}
              whileHover={{ y: -4, scale: 1.02 }} 
              className="w-32 shrink-0 aspect-[3/4] rounded-[1.5rem] overflow-hidden relative group cursor-pointer border border-stone-100 shadow-sm transition-shadow hover:shadow-md" 
              style={{ backgroundColor: theme.bg }}
            >
              <img 
                src={photo.url} 
                alt={`Evolução ${index + 1}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-serif font-bold text-sm mb-0.5">{photo.date}</span>
                <span className="text-white/80 text-xs font-medium">{photo.weight}</span>
              </div>
            </motion.div>
          ))}
          
          <motion.button 
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-32 shrink-0 aspect-[3/4] rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer bg-white hover:bg-stone-50 hover:shadow-sm"
            style={{ borderColor: theme.textMuted, color: theme.textMuted }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-stone-100 transition-colors group-hover:bg-stone-200">
              <Camera size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Nova Foto</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
