import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'session' })
export class Session {
  @PrimaryKey()
  id: number;

  @Property()
  sessionID: string;

  constructor(id: number, sessionID: string) {
    this.id = id;
    this.sessionID = sessionID;
  }
}
