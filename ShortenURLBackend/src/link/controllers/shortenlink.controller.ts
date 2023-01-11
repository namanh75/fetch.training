import { MapInterceptor } from '@automapper/nestjs';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Param,
  Req,
  Session,
  Query,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShortenLinkDto } from '../dto/shortenlink.dto';
import { ShortenLink } from '../entities/shortenlink.entity';
import { ShortenLinkService } from '../services/shortenlink.service';

@Controller('shorten-link')
export class LinkController {
  constructor(private readonly linkService: ShortenLinkService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @UsePipes(ValidationPipe)
  @UseInterceptors(MapInterceptor(ShortenLink, ShortenLinkDto))
  async createShortenLink(
    @Body() payload: ShortenLinkDto,
    @Request() req,
  ): Promise<ShortenLinkDto> {
    const result = await this.linkService.createShortenLink(
      req.user.username,
      payload.url,
    );
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    MapInterceptor(ShortenLink, ShortenLinkDto, { isArray: true }),
  )
  @Get('/history')
  async getHistory(@Request() req): Promise<ShortenLinkDto[]> {
    const results = await this.linkService.getHistory(req.user.username);
    return results;
  }

  @Get('/:shortenlink')
  async redirectShortenLink(
    @Param('shortenlink') shortenlink: string,
    @Session() session: Record<string, any>,
  ): Promise<ShortenLinkDto> {
    const sessionId = session.id;
    const result = await this.linkService.getURL(shortenlink, sessionId);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:shortenlink/enable')
  async disableShortenLink(
    @Param('shortenlink') shortenlink: string,
    @Req() req,
    @Query('q') enable: string,
  ): Promise<ShortenLinkDto> {
    const username = req.user.username;
    var status = 0;
    if (enable == 'true') {
      status = 1;
    }
    if (enable == 'false') status = 0;
    const results = await this.linkService.activeShortenLink(
      username,
      shortenlink,
      status,
    );
    return results;
  }

}
