import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LastCommitDate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;
}
