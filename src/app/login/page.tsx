'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Mail, Lock, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import RedirectIfAuthenticated from '@/components/RedirectIfAuthenticated';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Sesión iniciada correctamente');

      const token = localStorage.getItem('token');
      if (token) {
        const data = await authApi.getMe(token);
        if (data.user?.role === 'teacher') router.push('/teacher');
        else if (data.user?.role === 'student') router.push('/student');
        else if (data.user?.role === 'admin') router.push('/admin');
        else router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RedirectIfAuthenticated>
    <div className="min-h-screen flex items-center justify-center px-6 relative bg-[#050a18] text-white overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-[#38bdf8] top-[-200px] left-[-100px]" style={{ animation: 'morphBlob 15s ease-in-out infinite' }} />
        <div className="orb w-[400px] h-[400px] bg-[#818cf8] bottom-[-150px] right-[-100px]" style={{ animation: 'morphBlob 18s ease-in-out infinite reverse' }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern pointer-events-none z-[1]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-6 transition hover:opacity-80 group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring" }}>
              <BookOpen className="w-8 h-8 text-[#38bdf8]" />
            </motion.div>
            <span className="text-3xl font-bold tracking-tight gradient-text">EduCubeIA</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Iniciar Sesión</h1>
          <p className="text-slate-400">Accede a tu cuenta para continuar</p>
        </motion.div>

        {/* Form card */}
        <motion.form
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="glass-card p-8 rounded-2xl w-full max-w-md mx-auto space-y-6"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(56,189,248,0.03)' }}
        >
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div className="relative group">
              <Mail className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-[#38bdf8] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="tu@email.com"
                required
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-[#38bdf8] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Tu contraseña"
                required
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="btn-gradient-glow w-full flex items-center justify-center gap-2 mt-4 py-3.5 text-lg"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-slate-400"
        >
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-[#38bdf8] hover:text-cyan-300 font-medium transition-colors">Regístrate</Link>
        </motion.p>
      </div>
    </div>
    </RedirectIfAuthenticated>
  );
}
