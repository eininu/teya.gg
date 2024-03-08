import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Monitoring } from "../../monitoring/entities/monitoring.entity";

@Entity({ name: 'tag' })
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public name: string;

    @ManyToMany(() => Monitoring, (monitoring) => monitoring.tags)
    public domains: Monitoring[];
}