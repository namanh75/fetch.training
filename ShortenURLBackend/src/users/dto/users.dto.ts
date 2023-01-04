import { AutoMap } from '@automapper/classes';
import { Unique } from '@mikro-orm/core';
import { IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  @Unique()
  @AutoMap()
  id!: number;

  @IsNotEmpty({ message: 'username is not empty' })
  @Length(5, 255)
  @Unique()
  @AutoMap()
  username!: string;

  @IsNotEmpty({ message: 'password is not empty' })
  @Length(5, 255)
  @AutoMap()
  password!: string;
}
