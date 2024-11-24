"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const transaction_entity_1 = require("./transaction.entity");
let TransactionService = class TransactionService {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger();
        this.transactionRepository = this.dataSource.getRepository(transaction_entity_1.TransactionEntity);
    }
    async createtransaction(createTransaction) {
        try {
            const transaction = await this.transactionRepository.create(createTransaction);
            return await this.transactionRepository.save(transaction);
        }
        catch (err) {
            if (err.code == 23505) {
                this.logger.error(err.message, err.stack);
                throw new common_1.HttpException('Username already exists', common_1.HttpStatus.CONFLICT);
            }
            this.logger.error(err.message, err.stack);
            throw new common_1.InternalServerErrorException('Something went wrong, Try again!');
        }
    }
    async getAllTransactions() {
        return this.transactionRepository.find();
    }
    async getTransactionByUid(uid) {
        return this.transactionRepository.findOneBy({ userId: uid });
    }
    async updateTransaction(transaction) {
        this.transactionRepository.update({ id: transaction.id }, { ...transaction });
    }
    async deleteTransaction(id) {
        await this.transactionRepository.delete({ id });
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map