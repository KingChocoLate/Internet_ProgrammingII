import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  receiptId: string;

  @Column({ type: 'varchar', length: 255})
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2})
  price: number;

  @Column({ type: 'timestamp' })
  issuedAt: Date;
}
