import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Link} from "../../links/entities/link.entity";

@Entity()
export class PbnLink {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({default: null})
  public website: string;

  @OneToMany(() => Link, (link) =>  link.website)
  public links: Link[]
}
