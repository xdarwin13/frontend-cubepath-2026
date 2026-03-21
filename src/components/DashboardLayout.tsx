'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, LogOut, Home, BarChart3, GraduationCap, Users } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardLayout({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== allowedRole)) {
      router.push('/login');
    }
  }, [user, loading, allowedRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== allowedRole) return null;

  const roleConfig: Record<string, { label: string; icon: any; color: string; navItems: { href: string; label: string; icon: any }[] }> = {
    teacher: {
      label: 'Profesor',
      icon: GraduationCap,
      color: 'from-blue-600 to-blue-800',
      navItems: [
        { href: '/teacher', label: 'Mis Cursos', icon: BookOpen },
        { href: '/teacher/create', label: 'Crear Curso', icon: GraduationCap },
      ],
    },
    student: {
      label: 'Estudiante',
      icon: BookOpen,
      color: 'from-teal-600 to-teal-800',
      navItems: [
        { href: '/student', label: 'Explorar Cursos', icon: BookOpen },
        { href: '/student/my-courses', label: 'Mis Cursos', icon: GraduationCap },
      ],
    },
    admin: {
      label: 'Administrador',
      icon: BarChart3,
      color: 'from-emerald-600 to-emerald-800',
      navItems: [
        { href: '/admin', label: 'Dashboard', icon: BarChart3 },
        { href: '/admin/users', label: 'Usuarios', icon: Users },
        { href: '/admin/courses', label: 'Cursos', icon: BookOpen },
      ],
    },
  };

  const config = roleConfig[allowedRole];
  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass-strong fixed h-full flex flex-col z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">EduCubeIA</span>
          </Link>

          <div className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${config.color} mb-8`}>
            <RoleIcon className="w-5 h-5 text-white" />
            <div>
              <p className="text-sm font-bold text-white">{user.name}</p>
              <p className="text-xs text-white/70">{config.label}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {config.navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            <Home className="w-5 h-5" />
            <span className="text-sm">Inicio</span>
          </Link>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
