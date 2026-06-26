export type ContactType = 'whatsapp' | 'instagram' | 'email' | 'phone';

export interface Contact {
  id: number;
  type: ContactType;
  value: string;
  label: string | null;
  is_primary: boolean;
  is_active: boolean;
}
