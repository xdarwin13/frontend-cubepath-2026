# EduCubeIA - Frontend

Plataforma educativa interactiva impulsada por inteligencia artificial. Desarrollada con **Next.js 16**, **TypeScript**, **Tailwind CSS 4** y **React 19**. Ofrece dashboards personalizados por rol (Profesor, Estudiante, Administrador) con diseño dark mode, efectos glassmorphism y micro-animaciones.

---

## ✨ Características Principales

### Generación de Cursos con IA
- Creación de cursos completos desde un prompt en lenguaje natural
- Estructura automática: módulos, lecciones, contenido y evaluaciones
- Regeneración de contenido por lección
- Generación de audio TTS (Text-to-Speech) por lección
- Búsqueda de imágenes integrada (Pexels)

### Modelo 3D Interactivo
- Cerebro 3D en la landing page con Three.js + React Three Fiber
- Compresión DRACO para carga optimizada
- Auto-rotación suave y tamaño responsivo (300px móvil → 600px desktop)

### Editor de Texto Enriquecido
- Editor WYSIWYG con Tiptap
- Formatos: negrita, cursiva, subrayado, tachado, encabezados, listas, citas, bloques de código
- Embeds: imágenes (URL o búsqueda Pexels), videos de YouTube
- Conversión Markdown ↔ HTML bidireccional

### Certificados Digitales
- Certificados con código QR verificable
- Descarga en PDF (jsPDF + html2canvas)
- Página pública de verificación (`/verify/[code]`)

### Tours de Onboarding
- Tours guiados interactivos con Driver.js
- Tours específicos por rol (Estudiante: 5 pasos, Profesor: 6 pasos)
- Diseño responsivo con adaptación móvil automática
- Persistencia en localStorage (se muestran solo una vez)
- Botón de ayuda `?` para repetir el tour

### Dashboard de Administrador
- Métricas: usuarios, cursos, inscripciones, certificados
- Gráficas: registros diarios (línea), inscripciones (barras), cursos por categoría (dona), distribución de roles (pie)
- Gestión de usuarios, cursos, inscripciones y certificados

### Seguimiento de Progreso
- Progreso lección por lección (0-100%)
- Auto-resume desde la última lección completada
- Generación y envío de quizzes por lección

---

## 🛠 Tech Stack

| Categoría | Tecnologías |
|-----------|-------------|
| **Framework** | Next.js 16.2 (App Router, standalone output) |
| **Lenguaje** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **3D** | Three.js, @react-three/fiber, @react-three/drei |
| **Editor** | Tiptap (con extensiones: image, link, youtube, placeholder, underline) |
| **Gráficas** | Chart.js + react-chartjs-2 |
| **PDF** | jsPDF, html2canvas-pro |
| **QR** | qrcode |
| **Tours** | Driver.js |
| **Iconos** | Lucide React |
| **Notificaciones** | React Hot Toast |
| **Markdown** | react-markdown, marked, turndown |

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx              # Layout raíz con providers y metadata
│   ├── page.tsx                # Landing page con modelo 3D
│   ├── globals.css             # Estilos globales, tema, animaciones
│   ├── login/page.tsx          # Inicio de sesión
│   ├── register/page.tsx       # Registro (deshabilitado)
│   ├── verify/[code]/page.tsx  # Verificación pública de certificados
│   ├── student/
│   │   ├── page.tsx            # Catálogo de cursos + tour
│   │   ├── my-courses/page.tsx # Cursos inscritos con progreso
│   │   ├── course/[id]/page.tsx       # Visor de curso y lecciones
│   │   └── certificate/[enrollmentId]/page.tsx  # Certificado
│   ├── teacher/
│   │   ├── page.tsx            # Dashboard profesor + tour
│   │   ├── create/page.tsx     # Wizard creación con IA (3 pasos)
│   │   └── course/[id]/page.tsx  # Edición de curso
│   └── admin/
│       ├── page.tsx            # Dashboard con gráficas
│       ├── users/page.tsx      # Gestión de usuarios
│       ├── courses/page.tsx    # Gestión de cursos
│       ├── enrollments/page.tsx # Inscripciones
│       └── certificates/page.tsx # Certificados
├── components/
│   ├── BrainModel.tsx          # Modelo 3D cerebro (Three.js)
│   ├── Certificate.tsx         # Certificado con QR y descarga PDF
│   ├── DashboardLayout.tsx     # Sidebar responsivo por rol
│   ├── Providers.tsx           # AuthProvider + Toaster
│   ├── RedirectIfAuthenticated.tsx  # Guard para rutas públicas
│   └── RichTextEditor.tsx      # Editor WYSIWYG con Tiptap
└── lib/
    ├── api.ts                  # Cliente API centralizado
    ├── auth.tsx                # Context de autenticación (JWT)
    ├── config.ts               # Feature flags
    └── useOnboardingTour.ts    # Hook de tours con Driver.js
```

---

## 🚀 Instalación

### Requisitos
- Node.js **≥ 20.9.0**

### Setup

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Accede a `http://localhost:3000`.

---

## ⚙️ Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL del backend | `http://localhost:4000/api` |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la app | `EduCubeIA` |

---

## 📜 Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción (standalone)
npm run start    # Iniciar build de producción
npm run lint     # ESLint
```

---

## 🔐 Autenticación

- JWT con Bearer token en headers
- 3 roles: **Admin**, **Teacher**, **Student**
- Redirección automática según rol al iniciar sesión
- Rutas protegidas con verificación de rol en cada dashboard
- Token persistido en localStorage
