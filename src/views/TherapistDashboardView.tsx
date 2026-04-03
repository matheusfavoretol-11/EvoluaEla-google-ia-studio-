import { useState, useEffect } from 'react';
import { Users, Calendar, Play, Video, FileText, Download, CheckCircle2, Clock, ExternalLink, MoreVertical, Trash2, Save, X } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type TherapySession = {
  id: string;
  date: string;
  status: 'scheduled' | 'ongoing' | 'completed';
  zoom_link: string;
  zoom_meeting_id: string;
  password?: string;
  participants: string[];
  recorded_url?: string;
};

export default function TherapistDashboardView() {
  const [sessions, setSessions] = useState<TherapySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [showParticipants, setShowParticipants] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setSessions(data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRecording = async (sessionId: string, url: string) => {
    try {
      const { error } = await supabase
        .from('therapy_sessions')
        .update({ recorded_url: url })
        .eq('id', sessionId);

      if (error) throw error;
      fetchSessions();
    } catch (err) {
      console.error('Error updating recording:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white p-6 pb-32 overflow-y-auto hide-scrollbar">
      <div className="mb-10">
        <h2 className="text-5xl font-bold text-white mb-3 tracking-tighter">Painel da <span className="gradient-text">Terapeuta</span></h2>
        <p className="text-sm font-bold text-white/30 uppercase tracking-widest">Gerencie suas sessões, participantes e replays.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Total de Sessões</p>
          <p className="text-4xl font-bold text-white">{sessions.length}</p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Próxima Sessão</p>
          <p className="text-2xl font-bold text-[#E8B4BC]">
            {sessions.find(s => isAfter(new Date(s.date), new Date())) ? 
              format(new Date(sessions.find(s => isAfter(new Date(s.date), new Date()))!.date), "dd/MM 'às' HH:mm") : 
              'Nenhuma'}
          </p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-2">Participantes Totais</p>
          <p className="text-4xl font-bold text-white">{sessions.reduce((acc, s) => acc + (s.participants?.length || 0), 0)}</p>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Todas as Sessões</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-[#E8B4BC] hover:text-white transition-colors">Exportar Relatório</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/20">
                <th className="px-8 py-6">Data/Hora</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Participantes</th>
                <th className="px-8 py-6">Link Host</th>
                <th className="px-8 py-6">Replay</th>
                <th className="px-8 py-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-white/5 transition-all group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-white">{format(new Date(session.date), "dd 'de' MMMM", { locale: ptBR })}</p>
                    <p className="text-xs text-white/40">{format(new Date(session.date), "HH:mm")}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      isAfter(new Date(session.date), new Date()) 
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                        : 'bg-green-500/10 text-green-500 border-green-500/20'
                    }`}>
                      {isAfter(new Date(session.date), new Date()) ? 'Agendada' : 'Concluída'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => { setSelectedSession(session); setShowParticipants(true); }}
                      className="flex items-center gap-2 text-sm font-bold text-white/60 hover:text-[#E8B4BC] transition-colors"
                    >
                      <Users size={16} /> {session.participants?.length || 0} confirmadas
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => window.open(session.zoom_link, '_blank')}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#D4B996] hover:text-white transition-colors"
                    >
                      <Video size={16} /> Abrir Zoom
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    {session.recorded_url ? (
                      <span className="text-green-500 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                        <CheckCircle2 size={14} /> Liberado
                      </span>
                    ) : (
                      <button 
                        onClick={() => {
                          const url = prompt('Cole o link da gravação do Zoom:');
                          if (url) handleUpdateRecording(session.id, url);
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-[#E8B4BC] transition-colors"
                      >
                        Adicionar Link
                      </button>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participants Modal */}
      {showParticipants && selectedSession && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-10 max-w-2xl w-full shadow-2xl relative border border-white/10"
          >
            <button onClick={() => setShowParticipants(false)} className="absolute top-6 right-6 text-white/20 hover:text-white">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">Participantes</h3>
            <p className="text-white/40 mb-8 font-medium">Sessão de {format(new Date(selectedSession.date), "dd/MM/yyyy HH:mm")}</p>
            
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-4">
              {selectedSession.participants?.length > 0 ? selectedSession.participants.map((pId, idx) => (
                <div key={pId} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#E8B4BC]/10 flex items-center justify-center text-[#E8B4BC] font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white">Usuária {pId.substring(0, 8)}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Presente</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-green-500" size={20} />
                </div>
              )) : (
                <p className="text-center py-10 text-white/20 font-bold uppercase tracking-widest text-xs">Nenhuma participante confirmada ainda.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
