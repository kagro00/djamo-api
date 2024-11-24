import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransactionEntity } from './transaction.entity';


export interface CreateTransaction extends TransactionEntity {
}

@Injectable()
export class TransactionService {
  private transactionRepository;
  private logger = new Logger();
  //   inject the Datasource provider
  constructor(private dataSource: DataSource) {
    // get users table repository to interact with the database
    this.transactionRepository = this.dataSource.getRepository(TransactionEntity);
  }
  //  create handler to create new user and save to the database
  async createtransaction(createTransaction: CreateTransaction): Promise<TransactionEntity> {
    try {
      const transaction = await this.transactionRepository.create(createTransaction);
      return await this.transactionRepository.save(transaction);
    } catch (err) {
      if (err.code == 23505) {
        this.logger.error(err.message, err.stack);
        throw new HttpException('Username already exists', HttpStatus.CONFLICT);
      }
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException(
        'Something went wrong, Try again!',
      );
    }
  }

  //  fetch all transactions
  async getAllTransactions(): Promise<TransactionEntity[]> {
    return this.transactionRepository.find();
  }
  //  fetch transaction by uid

  async getTransactionByUid(uid: string): Promise<TransactionEntity> {
    return this.transactionRepository.findOneBy({ userId: uid });
  }

  async updateTransaction(transaction: TransactionEntity): Promise<void> {
    this.transactionRepository.update({ id: transaction.id }, { ...transaction });
  }

  async deleteTransaction(id: any): Promise<void> {
    await this.transactionRepository.delete({ id });
  }
}