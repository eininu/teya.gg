import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BlockedDomain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  domainName: string;
}
