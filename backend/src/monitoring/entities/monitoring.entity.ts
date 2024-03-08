import {Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {Tag} from "../../tags/enitities/tag.entity";

@Entity({ name: 'monitoring' })
export class Monitoring {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @Column({ default: null })
    public comment: string;

    @Column({ type: 'timestamptz', default: null })
    public expiredAt: Date | null;

    @ManyToMany(() => Tag, (tags) => tags.domains)
    @JoinTable()
    public tags: Tag[];
}