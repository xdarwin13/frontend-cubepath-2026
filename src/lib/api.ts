const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    let errorMsg = data.error || 'Error en la solicitud';
    
    if (typeof errorMsg === 'string' && (errorMsg.includes('rate_limit_exceeded') || errorMsg.includes('Rate limit reached') || errorMsg.includes('429'))) {
      errorMsg = 'Límite de la IA alcanzado. Por favor, espera un momento y vuelve a intentarlo.';
    }
    
    throw new Error(errorMsg);
  }

  return data;
}

// Auth
export const authApi = {
  register: (body: { name: string; email: string; password: string; role: string }) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: (token: string) =>
    fetchApi('/auth/me', { token }),
};

// Teacher
export const teacherApi = {
  getCourses: (token: string) =>
    fetchApi('/teacher/courses', { token }),
  getCourse: (id: string, token: string) =>
    fetchApi(`/teacher/courses/${id}`, { token }),
  createCourse: (body: any, token: string) =>
    fetchApi('/teacher/courses', { method: 'POST', body: JSON.stringify(body), token }),
  updateCourse: (id: string, body: any, token: string) =>
    fetchApi(`/teacher/courses/${id}`, { method: 'PUT', body: JSON.stringify(body), token }),
  deleteCourse: (id: string, token: string) =>
    fetchApi(`/teacher/courses/${id}`, { method: 'DELETE', token }),
  addModule: (courseId: string, body: any, token: string) =>
    fetchApi(`/teacher/courses/${courseId}/modules`, { method: 'POST', body: JSON.stringify(body), token }),
  deleteModule: (moduleId: string, token: string) =>
    fetchApi(`/teacher/modules/${moduleId}`, { method: 'DELETE', token }),
  addLesson: (moduleId: string, body: any, token: string) =>
    fetchApi(`/teacher/modules/${moduleId}/lessons`, { method: 'POST', body: JSON.stringify(body), token }),
  updateLesson: (lessonId: string, body: any, token: string) =>
    fetchApi(`/teacher/lessons/${lessonId}`, { method: 'PUT', body: JSON.stringify(body), token }),
  deleteLesson: (lessonId: string, token: string) =>
    fetchApi(`/teacher/lessons/${lessonId}`, { method: 'DELETE', token }),
};

// Student
export const studentApi = {
  getCourses: (token: string, params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return fetchApi(`/student/courses${query ? `?${query}` : ''}`, { token });
  },
  getCourseDetail: (id: string, token: string) =>
    fetchApi(`/student/courses/${id}`, { token }),
  enroll: (courseId: string, token: string) =>
    fetchApi(`/student/courses/${courseId}/enroll`, { method: 'POST', token }),
  getMyCourses: (token: string) =>
    fetchApi('/student/my-courses', { token }),
  updateProgress: (enrollmentId: string, progress: number, token: string, lastLessonId?: string) =>
    fetchApi(`/student/progress/${enrollmentId}`, { method: 'PUT', body: JSON.stringify({ progress, lastLessonId }), token }),
  generateQuiz: (lessonId: string, token: string) =>
    fetchApi(`/student/quiz/lesson/${lessonId}`, { method: 'POST', token }),
  getCertificate: (enrollmentId: string, token: string) =>
    fetchApi(`/student/certificate/${enrollmentId}`, { token }),
};

// Admin
export const adminApi = {
  getStats: (token: string) =>
    fetchApi('/admin/stats', { token }),
  getUsers: (token: string, role?: string, search?: string) => {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (search) params.set('search', search);
    const qs = params.toString();
    return fetchApi(`/admin/users${qs ? `?${qs}` : ''}`, { token });
  },
  updateUserRole: (id: string, role: string, token: string) =>
    fetchApi(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }), token }),
  deleteUser: (id: string, token: string) =>
    fetchApi(`/admin/users/${id}`, { method: 'DELETE', token }),
  getCourses: (token: string, search?: string, status?: string, category?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    if (category) params.set('category', category);
    const qs = params.toString();
    return fetchApi(`/admin/courses${qs ? `?${qs}` : ''}`, { token });
  },
  toggleCourseStatus: (id: string, token: string) =>
    fetchApi(`/admin/courses/${id}/status`, { method: 'PUT', token }),
  deleteCourse: (id: string, token: string) =>
    fetchApi(`/admin/courses/${id}`, { method: 'DELETE', token }),
  getEnrollments: (token: string, search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi(`/admin/enrollments${qs}`, { token });
  },
  getCertificates: (token: string, search?: string) => {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi(`/admin/certificates${qs}`, { token });
  },
  getChartData: (token: string) =>
    fetchApi('/admin/stats/charts', { token }),
};

// Verify (public, no auth)
export const verifyApi = {
  verifyCertificate: (code: string) =>
    fetchApi(`/verify/${code}`),
};

// AI
export const aiApi = {
  generateCourse: (prompt: string, token: string) =>
    fetchApi('/ai/generate-course', { method: 'POST', body: JSON.stringify({ prompt }), token }),
  generateLessonContent: (lessonId: string, token: string) =>
    fetchApi(`/ai/generate-lesson/${lessonId}`, { method: 'POST', token }),
  generateAudio: (lessonId: string, token: string) =>
    fetchApi(`/ai/generate-audio/${lessonId}`, { method: 'POST', token }),
  searchImages: (query: string, token: string) =>
    fetchApi(`/ai/search-image?query=${encodeURIComponent(query)}`, { token }),
};
