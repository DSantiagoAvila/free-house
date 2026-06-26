export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:8000/api',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER as string ?? '573000000000',
  instagramHandle: import.meta.env.VITE_INSTAGRAM_HANDLE as string ?? 'freehouseco',
};
