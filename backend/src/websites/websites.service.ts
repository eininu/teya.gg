import { Injectable } from '@nestjs/common';
import { Website } from './entities/website.entity';

@Injectable()
export class WebsitesService {
  private websites: Website[] = [];

  findAll(): Website[] {
    return this.websites;
  }

  create(domainName: string): {
    success: boolean;
    message: string;
    website?: Website;
  } {
    const existingWebsite = this.websites.find(
      (w) => w.domainName === domainName,
    );

    if (existingWebsite) {
      return {
        success: false,
        message: `Website with domain name '${domainName}' already exists.`,
      };
    }

    const website: Website = { id: Date.now(), domainName };
    this.websites.push(website);
    return { success: true, message: 'Website created successfully.', website };
  }

  delete(id: number): { deleted: boolean; message: string } {
    const initialLength = this.websites.length;
    this.websites = this.websites.filter((w) => w.id !== id);

    if (this.websites.length < initialLength) {
      return {
        deleted: true,
        message: `Website with id ${id} has been deleted.`,
      };
    } else {
      return { deleted: false, message: `Website with id ${id} not found.` };
    }
  }
}
