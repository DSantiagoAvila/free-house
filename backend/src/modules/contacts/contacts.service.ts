import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact, ContactType } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepo: Repository<Contact>,
  ) {}

  async findAll(): Promise<Contact[]> {
    return this.contactRepo.find({ where: { isActive: true } });
  }

  async findByType(type: ContactType): Promise<Contact | null> {
    return this.contactRepo.findOne({ where: { type, isActive: true } });
  }
}
