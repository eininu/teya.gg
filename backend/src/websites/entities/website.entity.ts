import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domainName: string;

  @Column({ default: false })
  isDomainRoskomnadzorBanned: boolean;

  @Column({ type: 'timestamptz', default: null })
  public expiredAt: Date | null;
}
