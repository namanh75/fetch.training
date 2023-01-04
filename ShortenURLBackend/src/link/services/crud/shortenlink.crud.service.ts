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
      throw new HttpException('Link không tồn tại', HttpStatus.BAD_REQUEST);
    }
    if (sqlResultShortLink.status == 0) {
      throw new HttpException(
        'Link hiện tại không khả dụng',
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
    const { id, username, url, shortenlink, status, createdate } = {
      id: null,
      username: name,
      url: urlString,
      shortenlink: shortenLink,
      status: 1,
      createdate: new Date(),
    };
    const data = new ShortenLink(
      id,
      username,
      url,
      shortenlink,
      status,
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
    return;
  }
}
