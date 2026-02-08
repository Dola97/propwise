import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  @Index()
  full_name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 50 })
  phone_number: string;

  // --- Sensitive fields ---!!
  @Column({ type: 'varchar', length: 100, nullable: true })
  national_id: string | null;

  @Column({ type: 'text', nullable: true })
  internal_notes: string | null;
}
