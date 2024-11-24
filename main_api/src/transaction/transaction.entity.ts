import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  methode: string;

  @Column()
  status: string;

}