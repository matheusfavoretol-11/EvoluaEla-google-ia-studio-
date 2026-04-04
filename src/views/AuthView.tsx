import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, AlertCircle, Check, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  onLogin: (name: string) => void;
  onRegister: (name: string) => void;
}

export default function AuthView({ onLogin, onRegister }: AuthViewProps) {
  const { theme } = useTheme();
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [keepConnected, setKeepConnected] = useState(false);
  
  // Error states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isLogin) {
      if (!email || !password) {
        setError('Ops, parece que faltou preencher algum campo.');
        return;
      }
      if (!email.includes('@')) {
        setError('Hmm, esse e-mail não parece válido. Dá uma olhadinha?');
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) throw signInError;
        
        const user = data.user;
        if (user) {
          const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuária';
          onLogin(displayName);
        }
      } catch (err: any) {
        console.error("Login error:", err);
        const errorMsg = err.message || '';
        if (errorMsg.includes('Invalid login credentials')) {
          setError('E-mail ou senha incorretos. Dá uma conferida!');
        } else if (errorMsg.includes('Email not confirmed')) {
          setError('Você precisa confirmar seu e-mail antes de entrar. Dá uma olhada na sua caixa de entrada!');
        } else if (errorMsg.includes('Connection error')) {
          setError('Ops, parece que estamos com problemas de conexão. Tenta de novo em instantes?');
        } else {
          setError(`Erro: ${errorMsg || 'Ops, deu um errinho ao fazer login. Tenta de novo?'}`);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Ops, parece que faltou preencher algum campo.');
        return;
      }
      if (!email.includes('@')) {
        setError('Hmm, esse e-mail não parece válido. Dá uma olhadinha?');
        return;
      }
      if (password.length < 6) {
        setError('A senha precisa ter pelo menos 6 caracteres, tá bom?');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não estão iguais. Dá uma conferida!');
        return;
      }
      if (!acceptTerms) {
        setError('Você precisa aceitar os Termos de Uso para a gente continuar.');
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name,
            }
          }
        });
        
        if (signUpError) throw signUpError;

        const user = data.user;
        if (user) {
          if (!data.session) {
            setSuccessMsg('Eba, conta criada! Dá uma olhadinha no seu e-mail para confirmar antes de entrar.');
            setIsLogin(true);
          } else {
            onRegister(name);
          }
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        const errorMsg = err.message || '';
        if (errorMsg.includes('already registered')) {
          setError('Esse e-mail já está cadastrado com a gente!');
        } else if (errorMsg.includes('security purposes') || errorMsg.includes('rate limit')) {
          setError('Muitas tentativas! Dá um tempinho de 1 minuto e tenta de novo.');
        } else if (errorMsg.includes('Connection error')) {
          setError('Ops, parece que estamos com problemas de conexão. Tenta de novo em instantes?');
        } else {
          setError(`Erro ao criar conta: ${errorMsg || 'Ops, deu um errinho. Tenta de novo?'}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-[#0A0A0A] font-sans selection:bg-[#E8B4BC] selection:text-black">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#E8B4BC]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#D4B996]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10 max-w-lg mx-auto w-full">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <img src="/logo.png?v=4" alt="EvoluaEla Logo" className="w-10 h-10 object-contain" />
            <span className="font-bold text-3xl tracking-tighter text-white">EVOLUAELA</span>
          </motion.div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/30 font-bold text-[10px] uppercase tracking-[0.3em]"
          >
            A Nova Era da Evolução Feminina
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-8 sm:p-12 rounded-[2.5rem] w-full border border-white/5 shadow-2xl"
          >
            <h2 className="text-3xl font-bold text-white mb-10 text-center tracking-tight">
              {isLogin ? 'Bem-vinda de volta' : 'Crie sua conta'}
            </h2>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-4 rounded-2xl bg-red-500/10 text-red-400 text-sm flex items-start gap-3 border border-red-500/20"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8 p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 text-sm flex items-start gap-3 border border-emerald-500/20"
              >
                <Check size={18} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{successMsg}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Nome Completo</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/10 group-focus-within:text-[#E8B4BC] transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#E8B4BC]/50 focus:bg-white/10 focus:outline-none transition-all text-white placeholder:text-white/20 font-medium text-base"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">E-mail</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/10 group-focus-within:text-[#E8B4BC] transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#E8B4BC]/50 focus:bg-white/10 focus:outline-none transition-all text-white placeholder:text-white/20 font-medium text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Senha</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/10 group-focus-within:text-[#E8B4BC] transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#E8B4BC]/50 focus:bg-white/10 focus:outline-none transition-all text-white placeholder:text-white/20 font-medium text-base"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">Confirmar Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-white/10 group-focus-within:text-[#E8B4BC] transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-[#E8B4BC]/50 focus:bg-white/10 focus:outline-none transition-all text-white placeholder:text-white/20 font-medium text-base"
                    />
                  </div>
                </div>
              )}

              {isLogin ? (
                <div className="flex items-center justify-between text-[10px]">
                  <label className="flex items-center gap-3 cursor-pointer text-white/40 font-bold uppercase tracking-widest">
                    <div 
                      className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                      style={{ 
                        backgroundColor: keepConnected ? '#E8B4BC' : 'transparent',
                        borderColor: keepConnected ? '#E8B4BC' : 'rgba(255,255,255,0.1)'
                      }}
                      onClick={() => setKeepConnected(!keepConnected)}
                    >
                      {keepConnected && <Check size={12} color="#000" strokeWidth={3} />}
                    </div>
                    Manter
                  </label>
                  <button type="button" className="font-bold text-[#E8B4BC] hover:text-white transition-colors uppercase tracking-widest">
                    Esqueci a senha
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="flex items-start gap-4 cursor-pointer">
                    <div 
                      className="w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={{ 
                        backgroundColor: acceptTerms ? '#E8B4BC' : 'transparent',
                        borderColor: acceptTerms ? '#E8B4BC' : 'rgba(255,255,255,0.1)'
                      }}
                      onClick={() => setAcceptTerms(!acceptTerms)}
                    >
                      {acceptTerms && <Check size={14} color="#000" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                      Aceito os <button type="button" className="text-[#E8B4BC] hover:underline">Termos de Uso</button>
                    </span>
                  </label>
                </div>
              )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-full font-bold text-black shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-8 bg-gradient-to-r from-[#E8B4BC] to-[#D4B996] disabled:opacity-70 active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span className="text-base">Processando...</span>
                  </div>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-white/20 text-[10px] font-bold mb-3 uppercase tracking-widest">
                {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-bold text-lg text-[#E8B4BC] hover:text-white transition-colors tracking-tight"
              >
                {isLogin ? 'Cadastre-se agora' : 'Faça login'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
