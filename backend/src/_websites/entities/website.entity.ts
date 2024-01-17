import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domainName: string;

  @Column({ default: false })
  isDomainRoskomnadzorBanned: boolean;
}
