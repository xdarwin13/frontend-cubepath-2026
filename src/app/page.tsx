'use client';

import Link from 'next/link';
import { BookOpen, Sparkles, Users, BarChart3, Mic, Image, GraduationCap, ArrowRight, Star, Zap, Shield, Globe } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function LandingPage() {
  const { user } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'teacher') return '/teacher';
    if (user.role === 'student') return '/student';
    if (user.role === 'admin') return '/admin';
    return '/login';
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">EduCubeIA</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="text-slate-300 hover:text-white transition-colors">Como Funciona</a>
            <a href="#roles" className="text-slate-300 hover:text-white transition-colors">Roles</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href={getDashboardLink()} className="btn-primary text-sm">
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">Iniciar Sesion</Link>
                <Link href="/register" className="btn-primary text-sm">Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-800/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-slate-300">Potenciado por Inteligencia Artificial</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Cursos creados con{' '}
              <span className="gradient-text">Inteligencia Artificial</span>
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Profesores generan cursos completos con texto, imagenes y audio usando IA.
              Estudiantes acceden a contenido educativo de alta calidad en segundos.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register?role=teacher" className="btn-primary text-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                <GraduationCap className="w-5 h-5" />
                Soy Profesor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register?role=student" className="btn-secondary text-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                <BookOpen className="w-5 h-5" />
                Soy Estudiante
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto animate-fade-in">
            {[
              { label: 'Generacion con IA', icon: Sparkles, value: 'Automatica' },
              { label: 'Texto + Audio', icon: Mic, value: 'Incluido' },
              { label: 'Imagenes', icon: Image, value: 'Pexels API' },
              { label: '100% Gratuito', icon: Star, value: 'Gratis' },
            ].map((stat, i) => (
              <div key={i} className="glass rounded-xl p-4 text-center">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Funcionalidades <span className="gradient-text">Poderosas</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Todo lo que necesitas para crear y consumir contenido educativo de calidad
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Generacion con IA',
                description: 'Crea cursos completos con un solo prompt. La IA genera estructura, contenido y materiales automaticamente.',
                color: 'from-blue-600 to-blue-800',
              },
              {
                icon: Mic,
                title: 'Audio con TTS',
                description: 'Genera narraciones automaticas de cada leccion. Tus estudiantes pueden escuchar el contenido.',
                color: 'from-teal-600 to-teal-800',
              },
              {
                icon: Image,
                title: 'Imagenes Relevantes',
                description: 'Imagenes profesionales de alta calidad seleccionadas automaticamente para cada leccion.',
                color: 'from-orange-500 to-orange-700',
              },
              {
                icon: BarChart3,
                title: 'Panel de Administrador',
                description: 'Estadisticas detalladas con graficas. Monitorea usuarios, cursos e inscripciones en tiempo real.',
                color: 'from-emerald-600 to-emerald-800',
              },
              {
                icon: Users,
                title: 'Multi-Rol',
                description: 'Tres roles diferenciados: Profesor, Estudiante y Administrador. Cada uno con su dashboard personalizado.',
                color: 'from-rose-600 to-rose-800',
              },
              {
                icon: Shield,
                title: 'Seguridad JWT',
                description: 'Autenticacion segura con tokens JWT. Proteccion basada en roles para cada endpoint.',
                color: 'from-violet-600 to-violet-800',
              },
            ].map((feature, i) => (
              <div key={i} className="card p-6 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Como <span className="gradient-text">Funciona</span>
            </h2>
            <p className="text-slate-400 text-lg">Tres simples pasos para comenzar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Escribe un Prompt',
                description: 'El profesor describe el curso que quiere crear. La IA entiende el contexto y genera la estructura completa.',
                icon: Zap,
              },
              {
                step: '02',
                title: 'La IA Genera Todo',
                description: 'Contenido, imagenes, audio narrado... La IA crea un curso completo listo para publicar o personalizar.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Estudiantes Aprenden',
                description: 'Los estudiantes exploran el catalogo, se inscriben y aprenden con contenido multimedia de alta calidad.',
                icon: GraduationCap,
              },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="glass rounded-2xl p-8 text-center h-full">
                  <div className="text-6xl font-extrabold gradient-text opacity-30 mb-4">{item.step}</div>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <ArrowRight className="w-8 h-8 text-blue-500/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Elige tu <span className="gradient-text">Rol</span>
            </h2>
            <p className="text-slate-400 text-lg">Cada rol tiene un dashboard personalizado</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Profesor</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Genera cursos completos con IA. Crea contenido con texto, imagenes y audio.
                Organiza modulos y lecciones.
              </p>
              <Link href="/register?role=teacher" className="btn-primary inline-flex items-center gap-2">
                Registrarme <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-xs font-bold rounded-bl-lg">
                POPULAR
              </div>
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Estudiante</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Explora cursos de alta calidad. Aprende con contenido multimedia generado por IA.
                Rastrea tu progreso.
              </p>
              <Link href="/register?role=student" className="btn-primary inline-flex items-center gap-2">
                Registrarme <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="card p-8 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Administrador</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Monitorea la plataforma completa. Estadisticas en tiempo real con graficas interactivas.
              </p>
              <Link href="/login" className="btn-secondary inline-flex items-center gap-2">
                Acceder <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/8 to-teal-600/8"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">
              Empieza a crear cursos con <span className="gradient-text">IA hoy</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Unite a EduCubeIA y transforma la manera en que creas y consumes contenido educativo
            </p>
            <Link href="/register" className="btn-primary text-lg inline-flex items-center gap-2">
              Comenzar Ahora <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">EduCubeIA</span>
          </div>
          <p className="text-sm text-slate-500">
            Hackathon CubePath 2026 &copy; {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Globe className="w-4 h-4" />
            Desplegado en CubePath
          </div>
        </div>
      </footer>
    </div>
  );
}
