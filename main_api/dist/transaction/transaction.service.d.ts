import { DataSource } from 'typeorm';
import { TransactionEntity } from './transaction.entity';
export interface CreateTransaction extends TransactionEntity {
}
export declare class TransactionService {
    private dataSource;
    private transactionRepository;
    private logger;
    constructor(dataSource: DataSource);
    createtransaction(createTransaction: CreateTransaction): Promise<TransactionEntity>;
    getAllTransactions(): Promise<TransactionEntity[]>;
    getTransactionByUid(uid: string): Promise<TransactionEntity>;
    updateTransaction(transaction: TransactionEntity): Promise<void>;
    deleteTransaction(id: any): Promise<void>;
}
