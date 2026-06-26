import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ContactType {
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  EMAIL = 'email',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ContactType })
  type: ContactType;

  @Column({ length: 255 })
  value: string;

  @Column({ length: 100, nullable: true })
  label: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
