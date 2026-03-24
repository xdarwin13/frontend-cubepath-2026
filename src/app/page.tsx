'use client';

import Link from 'next/link';
import NextImage from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  Image as ImageIcon,
  Mic,
  Shield,
  Sparkles,
  Star,
  Users,
  ArrowRight,
  Zap,
  Globe,
  ChevronRight,
  Menu,
  X,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Heart,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { REGISTRATION_DISABLED } from '@/lib/config';

const BrainModel = dynamic(() => import('@/components/BrainModel'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <div className="w-24 h-24 rounded-full border-2 border-[#38bdf8]/30 border-t-[#38bdf8] animate-spin" />
    </div>
  ),
});

/* ========== ANIMATED COUNTER ========== */
function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  return (
    <motion.span
      className="number-counter"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {value}{suffix}
    </motion.span>
  );
}

/* ========== FLOATING PARTICLES ========== */
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationId: number;
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 20 : 40;
    const connectionDistSq = isMobile ? 8100 : 14400; // 90² / 120²
    const connectionDist = isMobile ? 90 : 120;

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number };
    const particles: Particle[] = [];

    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 200);
    };
    window.addEventListener('resize', debouncedResize);

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() * 60 + 190,
      });
    }

    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const animate = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = cw;
        else if (p.x > cw) p.x = 0;
        if (p.y < 0) p.y = ch;
        else if (p.y > ch) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistSq) {
            const alpha = 0.06 * (1 - Math.sqrt(distSq) / connectionDist);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(200, 80%, 70%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', debouncedResize);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ willChange: 'contents' }} />;
}

/* ========== TYPING EFFECT ========== */
function TypingEffect({ words }: { words: string[] }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const typeSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && currentChar === word.length) {
        setTimeout(() => setIsDeleting(true), 2000);
        return;
      }
      if (isDeleting && currentChar === 0) {
        setIsDeleting(false);
        setCurrentWord((prev) => (prev + 1) % words.length);
        return;
      }

      setCurrentChar((prev) => prev + (isDeleting ? -1 : 1));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [currentChar, isDeleting, currentWord, words]);

  return (
    <span className="gradient-text-animated">
      {words[currentWord].substring(0, currentChar)}
      <span className="animate-pulse text-[#38bdf8]">|</span>
    </span>
  );
}

/* ========== SECTION WRAPPER WITH SCROLL ANIMATION ========== */
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}


/* ========== FEATURE CARD ========== */
function FeatureCard({ feature, index }: { feature: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="glass-card p-8 group cursor-default"
    >
      <div className="relative mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38bdf8]/20 to-[#818cf8]/20 flex items-center justify-center border border-[#38bdf8]/10 group-hover:border-[#38bdf8]/30 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]">
          <feature.icon className="h-7 w-7 text-[#38bdf8] group-hover:text-[#818cf8] transition-colors duration-500" />
        </div>
        <div className="absolute -inset-2 bg-[#38bdf8] opacity-0 group-hover:opacity-5 blur-2xl rounded-full transition-opacity duration-500" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white group-hover:text-[#38bdf8] transition-colors duration-300">{feature.title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
    </motion.div>
  );
}

/* ========== STEP CARD ========== */
function StepCard({ item, index }: { item: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="relative z-10 glass-card p-8 text-center group"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#0a1128] to-[#0a1128] border-2 border-[#38bdf8]/20 group-hover:border-[#38bdf8]/50 transition-all duration-500 relative"
      >
        <div className="absolute inset-0 rounded-full bg-[#38bdf8] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
        <span className="text-2xl font-bold gradient-text-animated">{item.number}</span>
      </motion.div>
      <h3 className="mb-3 text-xl font-semibold text-white">{item.title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
    </motion.div>
  );
}

/* ========== DATA ========== */
const stats = [
  { value: 'Automática', label: 'Estructuración Generativa', icon: Sparkles },
  { value: 'Integral', label: 'Creación E2E para Profesores', icon: Mic },
  { value: 'Pexels API', label: 'Enriquecimiento Visual', icon: ImageIcon },
  { value: 'Gratuita', label: 'Acceso Inmediato Base', icon: Star },
];

const features = [
  { title: 'Generación Textual con IA', description: 'Estructura inteligentemente el texto, el temario y el contenido interactivo del curso.', icon: Sparkles },
  { title: 'Audio Narrado con TTS', description: 'Convierte el texto en audio natural mediante generadores TTS de última generación.', icon: Mic },
  { title: 'Imágenes Relevantes', description: 'Cobertura visual automática con imágenes semánticamente conectadas al contenido.', icon: ImageIcon },
  { title: 'Panel Multi-Rol', description: 'Gates omnidireccionales controlados para Estudiantes, Profesores y Administradores.', icon: Users },
  { title: 'Analíticas en Tiempo Real', description: 'Dashboard de administrador con métricas avanzadas sobre el uso de la IA.', icon: BarChart3 },
  { title: 'Seguridad JWT', description: 'Cifrado de grado empresarial mediante JSON Web Tokens para todas las sesiones.', icon: Shield },
];

const steps = [
  { number: '01', title: 'Especificación de Prompt', description: 'Define el tema central utilizando una instrucción clara para nuestra Inteligencia Artificial.' },
  { number: '02', title: 'Síntesis Estructural', description: 'El motor inteligente de EduCube extrae el temario, imágenes, cuestionarios y contenido de manera autónoma.' },
  { number: '03', title: 'Despliegue Educativo', description: 'Tu curso se publica para que la comunidad interactúe con el entorno de aprendizaje al instante.' },
];

/* ========== MAIN COMPONENT ========== */
export default function LandingPage() {
  const { user } = useAuth();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const navBg = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const [navSolid, setNavSolid] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = navBg.on('change', (v) => setNavSolid(v > 0.5));
    return unsubscribe;
  }, [navBg]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'teacher') return '/teacher';
    if (user.role === 'student') return '/student';
    if (user.role === 'admin') return '/admin';
    return '/login';
  };

  return (
    <div className="min-h-screen relative bg-[#050a18] text-white selection:bg-[#38bdf8]/30 overflow-x-hidden">
      <FloatingParticles />

      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{ contain: 'strict' }}>
        <div className="orb w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#38bdf8] top-[-200px] right-[-200px]" style={{ animation: 'morphBlob 15s ease-in-out infinite' }} />
        <div className="orb w-[350px] h-[350px] md:w-[500px] md:h-[500px] bg-[#818cf8] bottom-[-100px] left-[-100px]" style={{ animation: 'morphBlob 18s ease-in-out infinite reverse' }} />
        <div className="orb w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[#a78bfa] top-[40%] left-[60%]" style={{ animation: 'morphBlob 12s ease-in-out infinite' }} />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 grid-pattern pointer-events-none z-[1]" style={{ contain: 'strict' }} />

      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 px-4 sm:px-6 py-4 z-50 transition-all duration-500 ${
          navSolid || mobileMenuOpen ? 'bg-[#050a18]/90 backdrop-blur-xl border-b border-slate-800/50 shadow-lg shadow-black/20' : ''
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5 group">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
            >
              <NextImage
                src="/logo.png"
                alt="Logo EduCubeIA"
                width={52}
                height={52}
                className="h-12 w-12 object-contain scale-125 -mr-2"
                priority
              />
            </motion.div>
            <span className="text-xl font-bold tracking-tight gradient-text">EduCubeIA</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {['Características', 'Cómo Funciona', 'Perfiles'].map((item, i) => (
              <a key={i} href={`#${['features', 'how-it-works', 'roles'][i]}`} className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#38bdf8] to-[#818cf8] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href={getDashboardLink()} className="hidden sm:block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-[#38bdf8] px-5 py-2.5 rounded-full border border-[#38bdf8]/30 hover:bg-[#38bdf8]/10 transition-all flex items-center gap-2"
              >
                {user ? 'Mi Dashboard' : 'Iniciar Sesión'}
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-6 pb-4 pt-2 border-t border-slate-800/50"
          >
            <div className="flex flex-col gap-3">
              {['Características', 'Cómo Funciona', 'Perfiles'].map((item, i) => (
                <a
                  key={i}
                  href={`#${['features', 'how-it-works', 'roles'][i]}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors py-2"
                >
                  {item}
                </a>
              ))}
              <Link href={getDashboardLink()} onClick={() => setMobileMenuOpen(false)} className="sm:hidden">
                <div className="text-sm font-semibold text-[#38bdf8] px-5 py-2.5 rounded-full border border-[#38bdf8]/30 hover:bg-[#38bdf8]/10 transition-all flex items-center justify-center gap-2 w-full">
                  {user ? 'Mi Dashboard' : 'Iniciar Sesión'}
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
        {/* ========== HERO SECTION ========== */}
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-32 pb-32 min-h-[90vh]"
        >
          <div className="max-w-xl z-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#38bdf8]/5 border border-[#38bdf8]/15 text-[#38bdf8] text-sm font-medium mb-8"
            >
              <Zap className="w-4 h-4" />
              Plataforma educativa potenciada por IA
              <ChevronRight className="w-4 h-4" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.05]"
            >
              Cursos creados
              <br />
              con <TypingEffect words={['Inteligencia Artificial', 'Tecnología Avanzada', 'Innovación Educativa']} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-slate-400 text-lg md:text-xl mb-10 leading-relaxed max-w-md"
            >
              Profesores generan cursos completos con inteligencia artificial. Texto, audio e imágenes — todo automatizado.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href={REGISTRATION_DISABLED ? '/login' : '/register?role=teacher'}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-gradient-glow h-12 sm:h-14 min-w-[180px] sm:min-w-[220px] text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 flex items-center justify-center gap-2 leading-none">
                  <GraduationCap className="w-5 h-5 shrink-0" />
                  Soy Profesor
                </motion.div>
              </Link>
              <Link href={REGISTRATION_DISABLED ? '/login' : '/register?role=student'}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="h-12 sm:h-14 min-w-[180px] sm:min-w-[220px] px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-base sm:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 leading-none">
                  <BookOpen className="w-5 h-5 shrink-0" />
                  Soy Estudiante
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 sm:gap-6 mt-12 text-slate-500 text-sm"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>100% Gratuito</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Seguro & Privado</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-slate-700" />
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>IA en Tiempo Real</span>
              </div>
            </motion.div>
          </div>

          {/* Brain Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end z-10 lg:-mr-24 xl:-mr-32 mt-12 lg:mt-0"
          >
            <div className="relative w-[600px] h-[600px] mx-auto">
              {/* Animated glow rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-[#38bdf8]/5 rounded-full" style={{ animation: 'spinSlow 20s linear infinite', willChange: 'transform' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] border border-[#818cf8]/5 rounded-full hidden md:block" style={{ animation: 'spinSlow 30s linear infinite reverse', willChange: 'transform' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-[#a78bfa]/3 rounded-full hidden md:block" style={{ animation: 'spinSlow 40s linear infinite', willChange: 'transform' }} />

              {/* Main glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-gradient-to-br from-[#38bdf8] to-[#818cf8] opacity-[0.06] blur-[60px] md:blur-[100px] rounded-full" style={{ animation: 'morphBlob 10s ease-in-out infinite', willChange: 'transform, border-radius', contain: 'layout style paint' as any }} />

              {/* 3D Brain Model */}
              <div className="absolute inset-0 z-10">
                <BrainModel />
              </div>

              {/* Orbiting dots */}
              <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-[#38bdf8] shadow-[0_0_15px_rgba(56,189,248,0.6)] z-20" style={{ animation: 'orbit 8s linear infinite', willChange: 'transform' }} />
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#818cf8] shadow-[0_0_15px_rgba(129,140,248,0.6)] hidden md:block z-20" style={{ animation: 'orbit 12s linear infinite reverse', willChange: 'transform' }} />
            </div>
          </motion.div>
        </motion.section>

        {/* ========== STATS ========== */}
        <AnimatedSection>
          <section className="pb-24 relative z-10 border-b border-slate-800/30">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass-card p-6 flex items-start gap-4"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#38bdf8]/10 to-[#818cf8]/10 border border-[#38bdf8]/10">
                    <stat.icon className="h-5 w-5 text-[#38bdf8]" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-slate-400 leading-snug">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* ========== FEATURES ========== */}
        <section id="features" className="py-24 border-b border-slate-800/30">
          <AnimatedSection className="mb-16 text-center">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#818cf8]/5 border border-[#818cf8]/15 text-[#818cf8] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Funcionalidades
            </motion.div>
            <h2 className="text-3xl font-bold sm:text-5xl text-white mb-4">
              Características <span className="gradient-text">Principales</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Herramientas diseñadas para potenciar la enseñanza y el aprendizaje con IA de última generación.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </section>

        {/* ========== HOW IT WORKS ========== */}
        <section id="how-it-works" className="py-24 border-b border-slate-800/30">
          <AnimatedSection className="mb-16 text-center">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#06b6d4]/5 border border-[#06b6d4]/15 text-[#06b6d4] text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Proceso
            </motion.div>
            <h2 className="text-3xl font-bold sm:text-5xl text-white mb-4">
              ¿Cómo <span className="gradient-text">Funciona</span>?
            </h2>
            <p className="text-slate-400 text-lg">Crea tu curso en tres sencillos pasos</p>
          </AnimatedSection>

          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[72px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-[#38bdf8]/15 to-transparent" />
            {steps.map((item, i) => (
              <StepCard key={i} item={item} index={i} />
            ))}
          </div>
        </section>

        {/* ========== ROLES ========== */}
        <section id="roles" className="py-24 border-b border-slate-800/30">
          <AnimatedSection className="mb-16 text-center">
            <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a78bfa]/5 border border-[#a78bfa]/15 text-[#a78bfa] text-sm font-medium mb-6">
              <Users className="w-4 h-4" />
              Perfiles
            </motion.div>
            <h2 className="text-3xl font-bold sm:text-5xl text-white mb-4">
              Elige tu <span className="gradient-text">Perfil</span>
            </h2>
            <p className="text-slate-400 text-lg">Plataforma adaptada a tus necesidades educativas</p>
          </AnimatedSection>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Teacher */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 sm:p-10 text-center flex flex-col h-full"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6]/10 to-[#818cf8]/10 border border-[#3b82f6]/20">
                <GraduationCap className="h-10 w-10 text-[#38bdf8]" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Profesor</h3>
              <p className="mb-8 text-sm text-slate-400 flex-grow">Arquitecto del conocimiento. Diseña y despliega cursos automáticos con IA generativa.</p>
              <Link href={REGISTRATION_DISABLED ? '/login' : '/register?role=teacher'}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full rounded-full border border-[#38bdf8]/30 bg-transparent px-6 py-3 font-semibold text-[#38bdf8] transition-all hover:bg-[#38bdf8]/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]">
                  Acceso Profesor
                </motion.div>
              </Link>
            </motion.div>

            {/* Student - Popular */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -12 }}
              className="glass-card !overflow-visible p-8 sm:p-10 text-center relative flex flex-col h-full md:scale-105 border-[#38bdf8]/20 z-10"
              style={{ boxShadow: '0 0 60px rgba(56,189,248,0.08), 0 20px 50px rgba(0,0,0,0.4)' }}
            >
              <div className="absolute top-0 inset-x-0 mx-auto -translate-y-1/2 w-max">
                <div className="rounded-full bg-gradient-to-r from-[#38bdf8] to-[#818cf8] px-5 py-1.5 text-xs font-bold text-white uppercase tracking-widest shadow-lg shadow-[#38bdf8]/20 animate-float-medium">
                  ⚡ Más Popular
                </div>
              </div>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#38bdf8]/15 to-[#818cf8]/15 border border-[#38bdf8]/30 shadow-[0_0_30px_rgba(56,189,248,0.12)]">
                <BookOpen className="h-10 w-10 text-[#38bdf8]" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Estudiante</h3>
              <p className="mb-8 text-sm text-slate-300 flex-grow">El nodo receptor. Aprende y consume conocimiento eficientemente con contenido generado por IA.</p>
              <Link href={REGISTRATION_DISABLED ? '/login' : '/register?role=student'}>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full btn-gradient-glow flex items-center justify-center text-center">
                  Unirse como Estudiante
                </motion.div>
              </Link>
            </motion.div>

            {/* Admin */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="glass-card p-8 sm:p-10 text-center flex flex-col h-full sm:col-span-2 md:col-span-1"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700/20 to-slate-600/20 border border-slate-600/20">
                <BarChart3 className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-white">Administrador</h3>
              <p className="mb-8 text-sm text-slate-400 flex-grow">Monitoreo absoluto del ecosistema y de los agentes de inteligencia artificial.</p>
              <Link href="/login">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full rounded-full border border-slate-700 bg-transparent px-6 py-3 font-semibold text-slate-300 transition-all hover:bg-slate-800/50">
                  Acceso Consola
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section className="py-32">
          <AnimatedSection>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mx-auto max-w-4xl text-center glass-card relative overflow-hidden p-6 sm:p-12 lg:p-20 border-[#38bdf8]/10"
              style={{ boxShadow: '0 0 80px rgba(56,189,248,0.05)' }}
            >
              {/* Animated gradient bg */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#38bdf8]/5 via-transparent to-[#818cf8]/5 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#38bdf8]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#818cf8]/30 to-transparent" />

              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                viewport={{ once: true }}
                className="mx-auto mb-8 w-16 h-16 rounded-full bg-gradient-to-br from-[#38bdf8]/20 to-[#818cf8]/20 flex items-center justify-center border border-[#38bdf8]/20"
              >
                <Sparkles className="w-8 h-8 text-[#38bdf8]" />
              </motion.div>

              <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl text-white relative z-10">
                Comienza a <span className="gradient-text-animated">Crear Hoy</span>
              </h2>
              <p className="mb-10 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto relative z-10">
                Únete a la nueva era de la educación asistida por inteligencia artificial y despliega cursos completos en minutos.
              </p>
              <Link href={REGISTRATION_DISABLED ? '/login' : '/register'} className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-gradient-glow px-10 py-4 text-xl inline-flex items-center gap-3"
                >
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          </AnimatedSection>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/30">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050a18] to-[#030712] pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-1 mb-4 group w-fit">
                <NextImage
                  src="/logo.png"
                  alt="Logo EduCubeIA"
                  width={44}
                  height={44}
                  className="h-10 w-10 object-contain scale-125 -mr-1"
                />
                <span className="text-lg font-bold tracking-tight gradient-text">EduCubeIA</span>
              </Link>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
                Plataforma educativa potenciada por inteligencia artificial. Transforma la forma en que enseñas y aprendes.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Mail, href: 'mailto:contacto@educubeia.com', label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 transition-all hover:bg-[#38bdf8]/10 hover:border-[#38bdf8]/30 hover:text-[#38bdf8] hover:shadow-[0_0_12px_rgba(56,189,248,0.15)]"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Plataforma */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Plataforma</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Características', href: '#features' },
                  { label: 'Cómo Funciona', href: '#how-it-works' },
                  { label: 'Para Profesores', href: '#roles' },
                  { label: 'Para Estudiantes', href: '#roles' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-slate-400 hover:text-[#38bdf8] transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-[#38bdf8] transition-colors" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Recursos</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Documentación', href: '#' },
                  { label: 'Guía de Inicio', href: '#' },
                  { label: 'API Reference', href: '#' },
                  { label: 'Soporte', href: '#' },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-sm text-slate-400 hover:text-[#38bdf8] transition-colors flex items-center gap-2 group">
                      <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-[#38bdf8] transition-colors" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Mail className="w-4 h-4 text-[#38bdf8]/50 shrink-0" />
                  contacto@educubeia.com
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Globe className="w-4 h-4 text-[#38bdf8]/50 shrink-0" />
                  www.educubeia.com
                </li>
              </ul>
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#38bdf8]/5 to-[#818cf8]/5 border border-[#38bdf8]/10">
                <p className="text-xs text-slate-400 mb-3">Mantente al día con las novedades</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 min-w-0 px-3 py-2 text-xs rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-[#38bdf8]/40 transition-colors"
                  />
                  <button className="px-3 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-[#38bdf8] to-[#818cf8] text-white shrink-0 hover:shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-shadow">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} EduCubeIA. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-1 text-xs text-slate-600">
              Hecho con <Heart className="w-3 h-3 text-rose-500/70 mx-0.5" /> para la educación del futuro
            </div>
            <div className="flex items-center gap-4">
              {['Privacidad', 'Términos', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
