import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PbnLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  website: string;

  @Column('jsonb')
  websiteLinks: any;
}
