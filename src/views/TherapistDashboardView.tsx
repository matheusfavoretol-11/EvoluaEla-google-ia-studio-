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
    <div className="flex flex-col h-full bg-[var(--color-bg)] text-[var(--color-text)] p-6 pb-32 overflow-y-auto hide-scrollbar">
      <div className="mb-10">
        <h2 className="text-5xl font-bold text-[var(--color-text)] mb-3 tracking-tighter">Painel da <span className="gradient-text">Terapeuta</span></h2>
        <p className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-widest">Gerencie suas sessões, participantes e replays.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--color-border)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Total de Sessões</p>
          <p className="text-4xl font-bold text-[var(--color-text)]">{sessions.length}</p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--color-border)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Próxima Sessão</p>
          <p className="text-2xl font-bold text-[var(--color-primary)]">
            {sessions.find(s => isAfter(new Date(s.date), new Date())) ? 
              format(new Date(sessions.find(s => isAfter(new Date(s.date), new Date()))!.date), "dd/MM 'às' HH:mm") : 
              'Nenhuma'}
          </p>
        </div>
        <div className="glass-card p-8 rounded-[2.5rem] border border-[var(--color-border)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Participantes Totais</p>
          <p className="text-4xl font-bold text-[var(--color-text)]">{sessions.reduce((acc, s) => acc + (s.participants?.length || 0), 0)}</p>
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border border-[var(--color-border)] overflow-hidden">
        <div className="p-8 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight">Todas as Sessões</h3>
          <button className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-text)] transition-colors">Exportar Relatório</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">
                <th className="px-8 py-6">Data/Hora</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6">Participantes</th>
                <th className="px-8 py-6">Link Host</th>
                <th className="px-8 py-6">Replay</th>
                <th className="px-8 py-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-[var(--color-text)]/5 transition-all group">
                  <td className="px-8 py-6">
                    <p className="font-bold text-[var(--color-text)]">{format(new Date(session.date), "dd 'de' MMMM", { locale: ptBR })}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{format(new Date(session.date), "HH:mm")}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      isAfter(new Date(session.date), new Date()) 
                        ? 'bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20' 
                        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20'
                    }`}>
                      {isAfter(new Date(session.date), new Date()) ? 'Agendada' : 'Concluída'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => { setSelectedSession(session); setShowParticipants(true); }}
                      className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                      <Users size={16} /> {session.participants?.length || 0} confirmadas
                    </button>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => window.open(session.zoom_link, '_blank')}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-accent)] hover:text-[var(--color-text)] transition-colors"
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
                        className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        Adicionar Link
                      </button>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors">
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
            className="glass-card p-10 max-w-2xl w-full shadow-2xl relative border border-[var(--color-border)]"
          >
            <button onClick={() => setShowParticipants(false)} className="absolute top-6 right-6 text-[var(--color-text-muted)] hover:text-[var(--color-text)]">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-bold mb-2 tracking-tight">Participantes</h3>
            <p className="text-[var(--color-text-muted)] mb-8 font-medium">Sessão de {format(new Date(selectedSession.date), "dd/MM/yyyy HH:mm")}</p>
            
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-4">
              {selectedSession.participants?.length > 0 ? selectedSession.participants.map((pId, idx) => (
                <div key={pId} className="flex items-center justify-between p-4 bg-[var(--color-text)]/5 rounded-2xl border border-[var(--color-border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text)]">Usuária {pId.substring(0, 8)}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]">Presente</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-green-500" size={20} />
                </div>
              )) : (
                <p className="text-center py-10 text-[var(--color-text-muted)] font-bold uppercase tracking-widest text-xs">Nenhuma participante confirmada ainda.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
