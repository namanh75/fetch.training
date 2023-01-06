import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ShortenLinkDto {
  id: number;

  @AutoMap()
  username: string;

  @IsNotEmpty({ message: 'url không được để trống' })
  @IsUrl()
  @AutoMap()
  url: string;

  @AutoMap()
  shortenlink: string;

  @AutoMap()
  status: number;

  @AutoMap()
  view: number;

  @AutoMap()
  createdate: Date;
}

export class ShortenLinkMethodDto extends ShortenLinkDto {
  getUrl(url: string) {
    super.url = url;
    return this;
  }
}
