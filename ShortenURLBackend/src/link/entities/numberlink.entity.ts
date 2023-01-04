import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'numberlink' })
export class NumberLink {
  @PrimaryKey()
  @AutoMap()
  id: number;

  @Property()
  @AutoMap()
  username: string;

  @Property()
  @AutoMap()
  currentlink: number;

  @Property()
  @AutoMap()
  maxlink: number;

  @Property()
  @AutoMap()
  datelink: Date;

  constructor(
    id: number,
    username: string,
    currentlink: number,
    maxlink: number,
    datelink: Date,
  ) {
    this.id = id;
    this.username = username;
    this.currentlink = currentlink;
    this.maxlink = maxlink;
    this.datelink = datelink;
  }
}
