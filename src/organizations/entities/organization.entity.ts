import { BaseUuid } from 'src/common/entities/base-uuid.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Organization extends BaseUuid {
  @Column()
  name: string;
}
