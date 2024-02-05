import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {PbnLink} from "../../pbn-links/entities/pbn-link.entity";

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public url: string;

    @Column()
    public text: string;

    @ManyToOne(() => PbnLink, (pbnLink) => pbnLink.links)
    public website: PbnLink;

}
