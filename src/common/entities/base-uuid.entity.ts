import { Entity, PrimaryGeneratedColumn } from 'typeorm';

import { Base } from './base.entity';

@Entity({ synchronize: false })
export class BaseUuid extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
