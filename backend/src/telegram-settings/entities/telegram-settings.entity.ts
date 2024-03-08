import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'telegram-settings' })
export class TelegramSettings {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public token: string;

    @Column()
    public chatId: number
}