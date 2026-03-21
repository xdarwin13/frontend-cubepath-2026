'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

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
      toast.success('Bienvenido de vuelta!');

      const token = localStorage.getItem('token');
      if (token) {
        const data = await authApi.getMe(token);
        if (data.user?.role === 'teacher') router.push('/teacher');
        else if (data.user?.role === 'student') router.push('/student');
        else if (data.user?.role === 'admin') router.push('/admin');
        else router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-600/8 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">EduCubeIA</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Iniciar Sesion</h1>
          <p className="text-slate-400">Accede a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '3rem' }}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contrasena</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '3rem' }}
                placeholder="Tu contrasena"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {loading ? 'Ingresando...' : 'Iniciar Sesion'}
          </button>
        </form>

        <p className="text-center mt-6 text-slate-400">
          No tienes cuenta?{' '}
          <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
