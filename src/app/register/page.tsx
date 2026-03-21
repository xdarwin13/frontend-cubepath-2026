'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRole = searchParams.get('role') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(preselectedRole);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Selecciona un rol');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Cuenta creada exitosamente!');
      if (role === 'teacher') router.push('/teacher');
      else if (role === 'student') router.push('/student');
      else router.push('/');
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 animate-slide-up">
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">EduCubeIA</span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Crear Cuenta</h1>
        <p className="text-slate-400">Unite a la plataforma educativa con IA</p>
      </div>

      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '3rem' }}
              placeholder="Tu nombre completo"
              required
            />
          </div>
        </div>

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
              placeholder="Minimo 6 caracteres"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Soy...</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                role === 'teacher'
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <GraduationCap className="w-6 h-6" />
              <span className="text-sm font-medium">Profesor</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                role === 'student'
                  ? 'border-teal-500 bg-teal-500/10 text-white'
                  : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:border-slate-600'
              }`}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-sm font-medium">Estudiante</span>
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>

      <p className="text-center mt-6 text-slate-400">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Inicia Sesion</Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-600/8 rounded-full blur-3xl"></div>
      </div>
      <Suspense fallback={<div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-400" /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
