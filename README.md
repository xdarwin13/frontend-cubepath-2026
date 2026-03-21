# EduCubeIA - Frontend

El frontend de EduCubeIA es una aplicación educativa interactiva impulsada por IA. Fue desarrollada utilizando **Next.js (App Router)**, **TypeScript** y **Tailwind CSS**. Su propósito es ofrecer una plataforma moderna, fluida y con un diseño profesional (dark mode, glassmorphism) tanto para profesores (creadores de contenido) como para estudiantes (consumidores) y administradores.

## 🚀 Características Principales

1. **Dashboard por Roles**: Interfaz personalizada según el rol del usuario autenticado (Estudiante, Profesor o Administrador).
2. **Creación de Cursos con IA**: Integración con el backend para solicitar a la IA la estructura, el texto de las lecciones, el audio TTS (Text-to-Speech) y las imágenes de portada generadas automáticamente.
3. **Consumo de Contenido**: Un visor de lecciones avanzado con soporte de Markdown (`react-markdown`), seguimiento de progreso dinámico interactivo, e integrador de reproductor de audio.
4. **Diseño UI/UX Responsivo**: Colores profesionales (Blue/Teal), efectos glass, y micro-animaciones pensados para dar la mejor experiencia visual.
5. **Autenticación con JWT**: Manejo seguro del flujo de sesión a través de tokens almacenados localmente.

## 🛠 Instalación y Configuración Local

1. Navega a la carpeta de la interfaz gráfica y asegúrate de tener [Node.js](https://nodejs.org/) instalado.
   ```bash
   cd frontend
   npm install
   ```
2. Crea una copia del archivo de ejemplo para tus variables de entorno locales:
   ```bash
   cp .env.example .env.local
   ```
3. Edita `.env.local` si necesitas cambiar la URL del backend (por defecto apunta a `http://localhost:4000/api`).
4. Inicia el servidor de desarrollo en local:
   ```bash
   npm run dev
   ```
5. Accede a `http://localhost:3000` en tu navegador para ver la aplicación funcionando.

## ⚙️ Variables de Entorno

Toda la configuración principal se define a través de variables de entorno. Puedes revisar el archivo `.env.example` para usarlos de base:

| Variable | Descripción | Valor por defecto |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | La URL de la API del backend que consumirá la aplicación. | `http://localhost:4000/api` |
| `NEXT_PUBLIC_APP_NAME` | Nombre dinámico de la aplicación utilizado en algunos textos. | `EduCubeIA` |

---

> **Nota:** Se utiliza `NEXT_PUBLIC_` en variables que necesitan ser accesadas por el navegador (ej: llamadas directas desde los componentes al backend). Mantén tus claves sensibles **fuera** de la configuración del entorno para el frontend.
