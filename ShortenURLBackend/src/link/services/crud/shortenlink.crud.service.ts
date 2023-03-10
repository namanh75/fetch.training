import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ShortenLink } from 'src/link/entities/shortenlink.entity';

export class CrudShortenLinkService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(ShortenLink)
    private shortenLinkRepository: EntityRepository<ShortenLink>,
  ) {}

  async getShortenLink(shortenlink: string): Promise<ShortenLink> {
    const sqlResultShortLink = await this.shortenLinkRepository.findOne({
      shortenlink: shortenlink,
    });
    if (!sqlResultShortLink) {
      throw new HttpException(
        'This link does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (sqlResultShortLink.status == 0) {
      throw new HttpException(
        'This link is not available',
        HttpStatus.BAD_REQUEST,
      );
    }
    return sqlResultShortLink;
  }

  async getAllShortenLinks(username: string): Promise<ShortenLink[]> {
    const sqlResultShortentLinks = await this.shortenLinkRepository.find({
      username: username,
    });
    return sqlResultShortentLinks;
  }

  async createShortenLink(
    name: string,
    urlString: string,
    shortenLink: string,
  ): Promise<ShortenLink> {
    const { id, username, url, shortenlink, status, view, createdate } = {
      id: null,
      username: name,
      url: urlString,
      shortenlink: shortenLink,
      status: 1,
      view: 0,
      createdate: new Date(),
    };
    const data = new ShortenLink(
      id,
      username,
      url,
      shortenlink,
      status,
      view,
      createdate,
    );
    await this.shortenLinkRepository.persistAndFlush(data);
    return data;
  }

  async updateShortenLink(shortenlink: ShortenLink): Promise<ShortenLink> {
    await this.shortenLinkRepository.persistAndFlush(shortenlink);
    return shortenlink;
  }

  async deleteShortenLink(
    username: string,
    shortenlink: string,
  ): Promise<ShortenLink> {
    const data = await this.shortenLinkRepository.removeAndFlush({
      username: username,
      shortenlink: shortenlink,
    });
    return;
  }
}
