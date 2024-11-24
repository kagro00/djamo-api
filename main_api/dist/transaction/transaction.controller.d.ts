import { TransactionService } from './transaction.service';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getTransaction(body: any): Promise<{
        id: any;
        status: any;
        message?: undefined;
    } | {
        id: any;
        status: string;
        message: string;
    }>;
}
