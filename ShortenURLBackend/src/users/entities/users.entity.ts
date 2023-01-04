import { AutoMap } from '@automapper/classes';
import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsNotEmpty, Length } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';

@Entity({ tableName: 'User' })
export class User {
  @PrimaryKey()
  @Unique()
  @AutoMap()
  id!: number;

  @Property()
  @IsNotEmpty({ message: 'username is not empty' })
  @Length(5, 255)
  @AutoMap()
  username!: string;

  @Property()
  @IsNotEmpty({ message: 'password is not empty' })
  @Length(5, 255)
  password: string;

  @Property()
  roles: Role[];

  constructor(id: number, username: string, password: string) {
    this.id = id;
    this.username = username;
    this.password = password;
  }
}
