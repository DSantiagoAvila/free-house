import api from './api';
import type { Contact } from '../types/contact.types';

export const contactsService = {
  async getContacts(): Promise<Contact[]> {
    const response = await api.get<{ success: boolean; data: Contact[] }>('/contacts');
    return response.data.data;
  },

  buildWhatsAppUrl(number: string, message: string): string {
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encoded}`;
  },
};
