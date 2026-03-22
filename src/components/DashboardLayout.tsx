'use client';

import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, LogOut, Home, BarChart3, GraduationCap, Users, Sparkles, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== allowedRole)) {
      router.push('/login');
    }
  }, [user, loading, allowedRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050a18]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#38bdf8]/20 border-t-[#38bdf8] rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-[#818cf8]/10 border-b-[#818cf8] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }

  if (!user || user.role !== allowedRole) return null;

  const roleConfig: Record<string, { label: string; icon: any; gradient: string; glow: string; navItems: { href: string; label: string; icon: any }[] }> = {
    teacher: {
      label: 'Profesor',
      icon: GraduationCap,
      gradient: 'from-[#3b82f6] to-[#6366f1]',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
      navItems: [
        { href: '/teacher', label: 'Mis Cursos', icon: BookOpen },
        { href: '/teacher/create', label: 'Crear Curso', icon: Sparkles },
      ],
    },
    student: {
      label: 'Estudiante',
      icon: BookOpen,
      gradient: 'from-[#06b6d4] to-[#0ea5e9]',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      navItems: [
        { href: '/student/my-courses', label: 'Mis Cursos', icon: GraduationCap },
        { href: '/student', label: 'Explorar Cursos', icon: BookOpen },
      ],
    },
    admin: {
      label: 'Administrador',
      icon: BarChart3,
      gradient: 'from-[#10b981] to-[#059669]',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      navItems: [
        { href: '/admin', label: 'Dashboard', icon: BarChart3 },
        { href: '/admin/users', label: 'Usuarios', icon: Users },
        { href: '/admin/courses', label: 'Cursos', icon: BookOpen },
      ],
    },
  };

  const config = roleConfig[allowedRole];
  const RoleIcon = config.icon;

  const isActive = (href: string) => {
    if (href === `/${allowedRole}`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-[#050a18]">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-[#050a18]/90 backdrop-blur-xl border-b border-slate-800/50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl glass border border-slate-700/50"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-0.5">
          <NextImage
            src="/logo.png"
            alt="Logo EduCubeIA"
            width={40}
            height={40}
            className="h-9 w-9 object-contain scale-125"
          />
          <span className="text-base font-bold gradient-text">EduCubeIA</span>
        </Link>
      </div>

      {/* Sidebar overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-72 glass-strong fixed h-full flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo + close button */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
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
                />
              </motion.div>
              <span className="text-lg font-bold gradient-text">EduCubeIA</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${config.gradient} ${config.glow} mb-8 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-xs text-white/60">{config.label}</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="space-y-1">
            {config.navItems.map((item, i) => {
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative group ${
                      active
                        ? 'text-white bg-white/5 border border-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-gradient-to-b from-[#38bdf8] to-[#818cf8]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-[#38bdf8]' : 'group-hover:text-[#38bdf8]'}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="mt-auto p-6 space-y-1 border-t border-slate-800/30">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group">
            <Home className="w-5 h-5 group-hover:text-[#38bdf8] transition-colors" />
            <span className="text-sm">Inicio</span>
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all w-full group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 flex-1 p-4 pt-[72px] sm:p-6 sm:pt-[72px] lg:p-8 lg:pt-8 min-h-screen">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
