import {
  EntityManager,
  EntityRepository,
  MikroORM,
  QueryOrder,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ShortenLinkDto, ShortenLinkMethodDto } from '../dto/shortenlink.dto';
import { NumberLink } from '../entities/numberlink.entity';
import { Session } from '../entities/session.entity';
import { ShortenLink } from '../entities/shortenlink.entity';
import { CrudShortenLinkService } from './crud/shortenlink.crud.service';
const format = require('date-fns/format');

@Injectable()
export class ShortenLinkService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(ShortenLink)
    private shortenLinkRepository: EntityRepository<ShortenLink>,
    @InjectRepository(NumberLink)
    private numberLinkRepository: EntityRepository<NumberLink>,
    @InjectRepository(Session)
    private sessionRepository: EntityRepository<Session>,
    private readonly crudShortenLinkRepository: CrudShortenLinkService,
  ) {}

  async generateString(length: Number): Promise<string> {
    var result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async createShortenLink(
    username: string,
    urlString: string,
  ): Promise<ShortenLinkDto> {
    var sqlResultNumberLink = await this.numberLinkRepository.find(
      {
        username: username,
      },
      {
        orderBy: { datelink: QueryOrder.ASC },
      },
    );
    var checkDate = false;
    for (var numberlink of sqlResultNumberLink) {
      if (numberlink.datelink < new Date()) continue;
      else {
        var currentlink = numberlink.currentlink;
        numberlink.currentlink = Number(currentlink) + Number(1);
        await this.numberLinkRepository.persistAndFlush(numberlink);
        checkDate = true;
        break;
      }
    }
    if (!checkDate) {
      throw new HttpException(
        'Out of available links, please register or extend',
        HttpStatus.BAD_REQUEST,
      );
    }

    var checkShortenLink = false;
    do {
      const shortenLink = await this.generateString(7);

      var sqlResultShortLink = await this.shortenLinkRepository.findOne({
        shortenlink: shortenLink,
      });
      if (!sqlResultShortLink) {
        const data = await this.crudShortenLinkRepository.createShortenLink(
          username,
          urlString,
          shortenLink,
        );
        checkShortenLink = true;
        return data;
      } else {
        checkShortenLink = false;
      }
    } while (!checkShortenLink);
  }

  async getHistory(username: string): Promise<ShortenLinkDto[]> {
    var resultHistory = await this.crudShortenLinkRepository.getAllShortenLinks(
      username,
    );
    return resultHistory;
  }

  async activeShortenLink(
    username: string,
    shortenlink: string,
    status: number,
  ): Promise<ShortenLinkDto> {
    const sqlResultShortenLink = await this.shortenLinkRepository.findOne({
      username: username,
      shortenlink: shortenlink,
    });
    if (!sqlResultShortenLink) {
      throw new HttpException(
        'Link does not exist or you do not have access',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (status == 1) sqlResultShortenLink.status = 1;
    if (status == 0) sqlResultShortenLink.status = 0;
    const data =
      this.crudShortenLinkRepository.updateShortenLink(sqlResultShortenLink);
    return data;
  }

  async getURL(shortenlink: string, sessionID: string): Promise<ShortenLink> {
    const resultShortLink = await this.crudShortenLinkRepository.getShortenLink(
      shortenlink,
    );
    const resultSession = await this.sessionRepository.findOne({
      sessionID: sessionID,
    });
    if (!resultSession) {
      resultShortLink.view += 1;
      await this.crudShortenLinkRepository.updateShortenLink(resultShortLink);
      const newSession = new Session(null, sessionID);
      await this.sessionRepository.persistAndFlush(newSession);
    }
    return new ShortenLinkMethodDto().getUrl(resultShortLink.url);
  }
}
