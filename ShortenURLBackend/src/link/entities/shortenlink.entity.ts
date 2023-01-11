import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty, IsUrl } from 'class-validator';

@Entity({ tableName: 'shorten_link' })
export class ShortenLink {
  @PrimaryKey({ default: null })
  id: number;

  @Property()
  @AutoMap()
  username: string;

  @Property()
  @AutoMap()
  url: string;

  @Property()
  @AutoMap()
  shortenlink: string;

  @Property()
  @AutoMap()
  status: number;

  @Property()
  @AutoMap()
  view: number;

  @Property()
  @AutoMap()
  createdate: Date;

  constructor(
    id: number,
    username: string,
    url: string,
    shortenlink: string,
    status: number,
    view: number,
    createdate: Date,
  ) {
    this.id = id;
    this.username = username;
    this.url = url;
    this.shortenlink = shortenlink;
    this.status = status;
    this.view = view;
    this.createdate = createdate;
  }
}
