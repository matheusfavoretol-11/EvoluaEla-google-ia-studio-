import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowRight, AlertCircle, Check } from 'lucide-react';
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
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-white font-sans selection:bg-[#E8B4BC] selection:text-white">
      {/* Background Gradient - More subtle and elegant */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          background: `radial-gradient(circle at 10% 10%, #E8B4BC, transparent 40%), radial-gradient(circle at 90% 90%, #A8C4B8, transparent 40%)` 
        }}
      />

      <div className="flex-1 flex flex-col justify-center px-8 py-20 relative z-10 max-w-lg mx-auto w-full">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4"
          >
            <span className="font-serif font-light text-5xl tracking-[0.15em] text-[#3F2A2F]">EVOLUAELA</span>
          </motion.div>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#3F2A2F]/30 font-medium text-xs uppercase tracking-[0.3em]"
          >
            Desperte a mulher poderosa que você nasceu para ser
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white p-12 md:p-14 rounded-[3.5rem] soft-shadow w-full border border-[#3F2A2F]/5"
          >
            <h2 className="text-3xl font-serif font-light text-[#3F2A2F] mb-10 text-center leading-tight">
              {isLogin ? 'Bem-vinda de volta' : 'Crie sua conta'}
            </h2>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-10 p-5 rounded-2xl bg-red-50 text-red-600 text-sm flex items-start gap-4 border border-red-100"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
            
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-10 p-5 rounded-2xl bg-emerald-50 text-emerald-700 text-sm flex items-start gap-4 border border-emerald-100"
              >
                <Check size={20} className="shrink-0 mt-0.5" />
                <p className="font-medium leading-relaxed">{successMsg}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#3F2A2F]/40 ml-5">Nome Completo</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#3F2A2F]/10 group-focus-within:text-[#E8B4BC] transition-colors">
                      <User size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Como quer ser chamada?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-16 pr-8 py-5 bg-[#FAF9F6] border border-transparent rounded-2xl focus:border-[#E8B4BC]/30 focus:bg-white focus:outline-none transition-all text-[#3F2A2F] placeholder:text-[#3F2A2F]/20 font-light"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#3F2A2F]/40 ml-5">E-mail</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#3F2A2F]/10 group-focus-within:text-[#E8B4BC] transition-colors">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-[#FAF9F6] border border-transparent rounded-2xl focus:border-[#E8B4BC]/30 focus:bg-white focus:outline-none transition-all text-[#3F2A2F] placeholder:text-[#3F2A2F]/20 font-light"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#3F2A2F]/40 ml-5">Senha</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#3F2A2F]/10 group-focus-within:text-[#E8B4BC] transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-16 pr-8 py-5 bg-[#FAF9F6] border border-transparent rounded-2xl focus:border-[#E8B4BC]/30 focus:bg-white focus:outline-none transition-all text-[#3F2A2F] placeholder:text-[#3F2A2F]/20 font-light"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#3F2A2F]/40 ml-5">Confirmar Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-[#3F2A2F]/10 group-focus-within:text-[#E8B4BC] transition-colors">
                      <Lock size={20} />
                    </div>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-16 pr-8 py-5 bg-[#FAF9F6] border border-transparent rounded-2xl focus:border-[#E8B4BC]/30 focus:bg-white focus:outline-none transition-all text-[#3F2A2F] placeholder:text-[#3F2A2F]/20 font-light"
                    />
                  </div>
                </div>
              )}

              {isLogin ? (
                <div className="flex items-center justify-between text-[10px]">
                  <label className="flex items-center gap-3 cursor-pointer text-[#3F2A2F]/40 font-medium uppercase tracking-widest">
                    <div 
                      className="w-4 h-4 rounded border flex items-center justify-center transition-all"
                      style={{ 
                        backgroundColor: keepConnected ? '#E8B4BC' : 'transparent',
                        borderColor: keepConnected ? '#E8B4BC' : '#3F2A2F10'
                      }}
                      onClick={() => setKeepConnected(!keepConnected)}
                    >
                      {keepConnected && <Check size={12} color="#fff" strokeWidth={3} />}
                    </div>
                    Manter
                  </label>
                  <button type="button" className="font-medium text-[#E8B4BC] hover:text-[#3F2A2F] transition-colors uppercase tracking-widest">
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
                        borderColor: acceptTerms ? '#E8B4BC' : '#3F2A2F10'
                      }}
                      onClick={() => setAcceptTerms(!acceptTerms)}
                    >
                      {acceptTerms && <Check size={14} color="#fff" strokeWidth={3} />}
                    </div>
                    <span className="text-[10px] text-[#3F2A2F]/40 leading-relaxed font-light">
                      Aceito os <button type="button" className="font-medium text-[#E8B4BC] hover:underline">Termos de Uso</button> e a política de privacidade.
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 rounded-full font-sans font-light text-white shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 mt-10 bg-[#E8B4BC] hover:bg-[#3F2A2F] disabled:opacity-70 hover:scale-[1.02] active:scale-95"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <>
                    <span className="uppercase tracking-[0.2em] text-sm">{isLogin ? 'Entrar' : 'Criar Conta'}</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[#3F2A2F]/30 text-xs font-light mb-3 uppercase tracking-widest">
                {isLogin ? 'Ainda não tem uma conta?' : 'Já possui uma conta?'}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMsg('');
                }}
                className="font-serif font-light text-2xl text-[#E8B4BC] hover:text-[#3F2A2F] transition-colors italic"
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
