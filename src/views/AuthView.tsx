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
        setError('Por favor, preencha todos os campos.');
        return;
      }
      if (!email.includes('@')) {
        setError('Por favor, insira um e-mail válido.');
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
        if (err.message?.includes('Invalid login credentials')) {
          setError('E-mail ou senha incorretos.');
        } else if (err.message?.includes('Email not confirmed')) {
          setError('Por favor, confirme seu e-mail antes de entrar.');
        } else {
          setError('Erro ao fazer login. Verifique suas credenciais.');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!name || !email || !password || !confirmPassword) {
        setError('Por favor, preencha todos os campos.');
        return;
      }
      if (!email.includes('@')) {
        setError('Por favor, insira um e-mail válido.');
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        return;
      }
      if (!acceptTerms) {
        setError('Você precisa aceitar os Termos de Uso para continuar.');
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
          // Initialize user document in Supabase
          const { error: insertError } = await supabase
            .from('users')
            .insert([
              {
                id: user.id,
                email: user.email,
                display_name: name,
                level: 'Despertando',
                is_premium: false,
                subscription_status: 'free',
                coach_messages_count: 0
              }
            ]);
            
          if (insertError) {
            console.error("Error creating user profile:", insertError);
            // We don't throw here because auth succeeded, but we log it
          }

          if (!data.session) {
            setSuccessMsg('Conta criada! Verifique sua caixa de entrada para confirmar o e-mail antes de fazer login.');
            setIsLogin(true);
          } else {
            onRegister(name);
          }
        }
      } catch (err: any) {
        console.error("Registration error:", err);
        if (err.message?.includes('already registered')) {
          setError('Este e-mail já está em uso.');
        } else if (err.message?.includes('security purposes') || err.message?.includes('rate limit')) {
          setError('Muitas tentativas. Por favor, aguarde cerca de 1 minuto antes de tentar novamente.');
        } else {
          setError('Erro ao criar conta. Tente novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden bg-stone-50">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
          background: `radial-gradient(circle at top right, ${theme.primary}, transparent 60%), radial-gradient(circle at bottom left, ${theme.accent}, transparent 60%)` 
        }}
      />

      <div className="flex-1 flex flex-col justify-center px-6 py-12 relative z-10">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center mb-6 premium-shadow gradient-bg-light overflow-hidden"
            style={{ color: theme.primary }}
          >
            <img 
              src="/logo.png" 
              alt="EvoluaEla Logo" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }} 
            />
            <span className="text-4xl font-serif font-bold hidden">E</span>
          </motion.div>
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-serif font-bold tracking-tight mb-3 text-stone-800"
          >
            EvoluaEla
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 font-medium text-sm uppercase tracking-widest"
          >
            Comece hoje a sua evolução
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-8 rounded-3xl soft-shadow w-full max-w-sm mx-auto"
          >
            <h2 className="text-2xl font-serif font-bold text-stone-800 mb-6 text-center">
              {isLogin ? 'Bem-vinda de volta' : 'Criar Conta'}
            </h2>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-600 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            {successMsg && (
              <div className="mb-6 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm flex items-start gap-2">
                <Check size={16} className="shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:outline-none transition-all text-stone-800"
                      style={{ focusRingColor: theme.primary }}
                    />
                  </div>
                </div>
              )}

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:outline-none transition-all text-stone-800"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:outline-none transition-all text-stone-800"
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type="password"
                      placeholder="Confirmar senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:outline-none transition-all text-stone-800"
                    />
                  </div>
                </div>
              )}

              {isLogin ? (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600">
                    <div 
                      className="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                      style={{ 
                        backgroundColor: keepConnected ? theme.primary : 'transparent',
                        borderColor: keepConnected ? theme.primary : '#e5e7eb'
                      }}
                      onClick={() => setKeepConnected(!keepConnected)}
                    >
                      {keepConnected && <Check size={14} color="#fff" />}
                    </div>
                    Manter conectado
                  </label>
                  <button type="button" className="font-semibold hover:underline" style={{ color: theme.primary }}>
                    Esqueci a senha
                  </button>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <div 
                      className="w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors"
                      style={{ 
                        backgroundColor: acceptTerms ? theme.primary : 'transparent',
                        borderColor: acceptTerms ? theme.primary : '#e5e7eb'
                      }}
                      onClick={() => setAcceptTerms(!acceptTerms)}
                    >
                      {acceptTerms && <Check size={14} color="#fff" />}
                    </div>
                    <span className="text-xs text-stone-600 leading-relaxed">
                      Li e aceito os <button type="button" className="font-semibold hover:underline" style={{ color: theme.primary }}>Termos de Uso</button> e confirmo que li o aviso legal abaixo.
                    </span>
                  </label>
                  
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <p className="text-[10px] text-stone-500 leading-relaxed">
                      <strong>Aviso Importante:</strong> O EvoluaEla é uma ferramenta de apoio e não substitui acompanhamento profissional como médicos, nutricionistas ou educadores físicos.
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-[1.5rem] font-bold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-6 gradient-bg hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processando...</span>
                  </div>
                ) : (
                  <>
                    {isLogin ? 'Entrar' : 'Criar conta'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-stone-500 text-sm">
                {isLogin ? 'Ainda não tem uma conta?' : 'Já tem uma conta?'}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMsg('');
                }}
                className="mt-2 font-bold text-lg hover:underline transition-all"
                style={{ color: theme.primary }}
              >
                {isLogin ? 'Criar conta' : 'Fazer login'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
