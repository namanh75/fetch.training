import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NumberLink } from '../../entities/numberlink.entity';

export class CrudNumberLinkService {
  constructor(
    @InjectRepository(NumberLink)
    private numberLinkRepository: EntityRepository<NumberLink>,
  ) {}
  async updateNumberLink(){
    
  }
}
