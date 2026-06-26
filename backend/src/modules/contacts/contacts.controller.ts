import { Controller, Get } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller({ path: 'contacts', version: '1' })
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async findAll() {
    const contacts = await this.contactsService.findAll();
    return { data: contacts, message: 'Contacts retrieved successfully' };
  }
}
