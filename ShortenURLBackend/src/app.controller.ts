import { Controller, Get, Param } from '@nestjs/common';
import { ShortenLinkService } from './link/services/shortenlink.service';

@Controller()
export class AppController {
  constructor(private readonly linkService: ShortenLinkService) {}
}
