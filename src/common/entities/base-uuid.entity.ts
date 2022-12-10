import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from 'src/common/entities/base.entity';

@Entity({ synchronize: false })
export class BaseUuid extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
