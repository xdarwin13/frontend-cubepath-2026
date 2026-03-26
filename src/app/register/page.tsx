'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import NextImage from 'next/image';
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { REGISTRATION_DISABLED } from '@/lib/config';
import toast from 'react-hot-toast';
import RedirectIfAuthenticated from '@/components/RedirectIfAuthenticated';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (REGISTRATION_DISABLED) {
      toast.error('El registro está temporalmente deshabilitado');
      return;
    }
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

  if (REGISTRATION_DISABLED) {
    return (
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-0.5 mb-6 transition hover:opacity-80 group">
            <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring" }}>
              <NextImage
                src="/logo.png"
                alt="Logo EduCubeIA"
                width={48}
                height={48}
                className="h-11 w-11 object-contain scale-125 -mr-1.5"
                priority
              />
            </motion.div>
            <span className="text-3xl font-bold tracking-tight gradient-text">EduCubeIA</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl p-10 text-center"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(56,189,248,0.03)' }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20">
            <Lock className="w-7 h-7 text-[#38bdf8]" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-white">Registro Cerrado</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">
            El registro de nuevas cuentas se encuentra temporalmente deshabilitado para esta demostración.
          </p>
          <Link href="/login">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gradient-glow w-full flex items-center justify-center gap-2 py-3.5 text-lg"
            >
              <ArrowRight className="w-5 h-5" />
              Ir a Iniciar Sesión
            </motion.div>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md relative z-10">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <Link href="/" className="inline-flex items-center gap-0.5 mb-6 transition hover:opacity-80 group">
          <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring" }}>
            <NextImage
              src="/logo.png"
              alt="Logo EduCubeIA"
              width={48}
              height={48}
              className="h-11 w-11 object-contain scale-125 -mr-1.5"
              priority
            />
          </motion.div>
          <span className="text-3xl font-bold tracking-tight gradient-text">EduCubeIA</span>
        </Link>
        <h1 className="text-3xl font-bold mb-2 text-white">Crear Cuenta</h1>
        <p className="text-slate-400">Únete a la plataforma educativa con IA</p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        onSubmit={handleSubmit}
        className="glass-card rounded-2xl p-8 space-y-5"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(56,189,248,0.03)' }}
      >
        {/* Name */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Nombre</label>
          <div className="relative group">
            <User className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-[#38bdf8] transition-colors" />
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Tu nombre completo" required />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <div className="relative group">
            <Mail className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-[#38bdf8] transition-colors" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="tu@email.com" required />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
          <div className="relative group">
            <Lock className="absolute z-10 left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-focus-within:text-[#38bdf8] transition-colors" />
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pr-12" placeholder="Mínimo 6 caracteres" required minLength={6} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-10 right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#38bdf8] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Role Selector */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <label className="block text-sm font-medium text-slate-300 mb-2">Soy...</label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole('teacher')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                role === 'teacher'
                  ? 'border-[#38bdf8]/50 bg-[#38bdf8]/10 text-white shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                  : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600'
              }`}
            >
              <GraduationCap className={`w-7 h-7 transition-colors ${role === 'teacher' ? 'text-[#38bdf8]' : ''}`} />
              <span className="text-sm font-medium">Profesor</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setRole('student')}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                role === 'student'
                  ? 'border-[#38bdf8]/50 bg-[#38bdf8]/10 text-white shadow-[0_0_20px_rgba(56,189,248,0.1)]'
                  : 'border-slate-700/50 bg-slate-800/30 text-slate-400 hover:border-slate-600'
              }`}
            >
              <BookOpen className={`w-7 h-7 transition-colors ${role === 'student' ? 'text-[#38bdf8]' : ''}`} />
              <span className="text-sm font-medium">Estudiante</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="btn-gradient-glow w-full flex items-center justify-center gap-2 mt-2 py-3.5 text-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            {loading ? 'Creando cuenta...' : 'Registrarme'}
          </motion.button>
        </motion.div>
      </motion.form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center mt-6 text-slate-400"
      >
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-[#38bdf8] hover:text-cyan-300 font-medium transition-colors">Inicia Sesión</Link>
      </motion.p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <RedirectIfAuthenticated>
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative bg-[#050a18] text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="orb w-[500px] h-[500px] bg-[#818cf8] top-[-150px] right-[-100px]" style={{ animation: 'morphBlob 15s ease-in-out infinite' }} />
        <div className="orb w-[400px] h-[400px] bg-[#38bdf8] bottom-[-100px] left-[-100px]" style={{ animation: 'morphBlob 18s ease-in-out infinite reverse' }} />
      </div>
      <div className="absolute inset-0 grid-pattern pointer-events-none z-[1]" />

      <Suspense fallback={<div className="text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#38bdf8]" /></div>}>
        <RegisterForm />
      </Suspense>
    </div>
    </RedirectIfAuthenticated>
  );
}
