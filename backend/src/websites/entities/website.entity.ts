import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

@Entity()
export class Website {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  domainName: string;

  @Column({ default: false })
  isDomainRoskomnadzorBanned: boolean;

  @Column({ default: false })
  isAcmaBanned: boolean;

  @Column({ default: false })
  isPlHazardBanned: boolean;

  @Column({ type: 'timestamptz', default: null })
  public expiredAt: Date | null;
}
