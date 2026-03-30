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
    <div className="p-6 space-y-8 bg-[#FAF9F6] min-h-full">
      <header>
        <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-2 italic">Sua Evolução</h2>
        <p className="text-sm font-light text-[#3F2A2F]/40">Acompanhe seus resultados e celebre cada vitória.</p>
      </header>

      {/* Weight Tracker */}
      <section className="p-6 rounded-[2rem] border border-[#3F2A2F]/5 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F6] rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20 block mb-1">Peso Atual</span>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-serif font-light text-[#3F2A2F]">{currentWeight.toFixed(1)}</span>
              <span className="font-light text-[#3F2A2F]/40">kg</span>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.2em] shadow-sm ${isLoss ? 'bg-[#E8B4BC]/10 text-[#E8B4BC]' : 'bg-[#D4B996]/10 text-[#D4B996]'}`}>
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
            className="flex-1 bg-[#FAF9F6] border border-[#3F2A2F]/5 rounded-full px-6 py-3 text-sm font-light focus:ring-1 focus:ring-[#E8B4BC]/20 focus:outline-none transition-all text-[#3F2A2F]"
          />
          <button 
            onClick={handleAddWeight}
            disabled={!newWeight}
            className="px-8 py-3 rounded-full font-light uppercase tracking-[0.2em] text-[10px] text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 bg-[#3F2A2F]"
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
                tick={{ fontSize: 9, fill: '#3F2A2F', opacity: 0.4, fontWeight: 400 }} 
                dy={10}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 9, fill: '#3F2A2F', opacity: 0.4, fontWeight: 400 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                itemStyle={{ color: '#E8B4BC', fontWeight: 400, fontSize: '12px' }}
                labelStyle={{ color: '#3F2A2F', fontWeight: 400, fontSize: '12px', marginBottom: '4px' }}
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
          <h3 className="text-xl font-serif font-light text-[#3F2A2F] italic">Comparação</h3>
        </div>
        
        <div className="bg-white p-5 rounded-[2rem] border border-[#3F2A2F]/5">
          <div className="flex items-center justify-center gap-2 mb-5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">
            <Lock size={12} /> Ambiente seguro e privado
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[#FAF9F6] border border-[#3F2A2F]/5">
              {photos.length > 0 ? (
                <>
                  <img src={photos[0].url} alt="Antes" className="w-full h-full object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md text-[#3F2A2F] text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-[0.2em] border border-[#3F2A2F]/5">Antes</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent p-4">
                    <p className="text-[#3F2A2F] font-serif font-light italic text-sm mb-0.5">{photos[0].date}</p>
                    <p className="text-[#3F2A2F]/60 text-xs font-light">{photos[0].weight}</p>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#3F2A2F]/20">
                  <ImageIcon size={24} className="mb-2 opacity-50" />
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em]">Sem foto</span>
                </div>
              )}
            </div>
            
            <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[#FAF9F6] border border-[#3F2A2F]/5">
              {photos.length > 1 ? (
                <>
                  <img src={photos[photos.length - 1].url} alt="Depois" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-3 right-3 bg-[#3F2A2F] text-white text-[9px] font-medium px-2.5 py-1 rounded-full uppercase tracking-[0.2em] shadow-sm">Depois</div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent p-4">
                    <p className="text-[#3F2A2F] font-serif font-light italic text-sm mb-0.5">{photos[photos.length - 1].date}</p>
                    <p className="text-[#3F2A2F]/60 text-xs font-light">{photos[photos.length - 1].weight}</p>
                  </div>
                </>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex flex-col items-center justify-center text-[#3F2A2F]/20 hover:bg-white transition-colors border-2 border-dashed border-[#3F2A2F]/5 rounded-[1.5rem] m-1"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-[#E8B4BC]/10" style={{ color: '#E8B4BC' }}>
                    <Camera size={20} />
                  </div>
                  <span className="text-[9px] font-medium uppercase tracking-[0.2em]" style={{ color: '#E8B4BC' }}>Adicionar Foto</span>
                </button>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm font-serif font-light italic text-[#3F2A2F]/40">
              "Celebre o progresso, não a perfeição."
            </p>
          </div>
        </div>
      </section>

      {/* Photos Timeline */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#3F2A2F]/20">Linha do Tempo</h3>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] font-medium uppercase tracking-[0.2em] flex items-center gap-1 hover:opacity-80 transition-opacity text-[#E8B4BC]" 
          >
            <Plus size={14} /> Nova Foto
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {photos.map((photo, index) => (
            <motion.div 
              key={`${photo.id}-${index}`}
              whileHover={{ y: -4, scale: 1.02 }} 
              className="w-32 shrink-0 aspect-[3/4] rounded-[1.5rem] overflow-hidden relative group cursor-pointer border border-[#3F2A2F]/5 shadow-sm transition-shadow hover:shadow-md bg-white" 
            >
              <img 
                src={photo.url} 
                alt={`Evolução ${index + 1}`} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3F2A2F]/80 via-[#3F2A2F]/20 to-transparent flex flex-col justify-end p-3 opacity-90 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-serif font-light italic text-sm mb-0.5">{photo.date}</span>
                <span className="text-white/80 text-xs font-light">{photo.weight}</span>
              </div>
            </motion.div>
          ))}
          
          <motion.button 
            whileHover={{ y: -4, scale: 1.02 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-32 shrink-0 aspect-[3/4] rounded-[1.5rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer bg-white hover:bg-[#FAF9F6] border-[#3F2A2F]/5 text-[#3F2A2F]/20"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-[#FAF9F6] transition-colors group-hover:bg-[#3F2A2F]/5">
              <Camera size={20} />
            </div>
            <span className="text-[9px] font-medium uppercase tracking-[0.2em]">Nova Foto</span>
          </motion.button>
        </div>
      </section>
    </div>
  );
}
