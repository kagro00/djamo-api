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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const transaction_entity_1 = require("./transaction.entity");
const transaction_service_1 = require("./transaction.service");
let TransactionController = class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async getTransaction(body) {
        const { id, userId } = body;
        const url = 'http://localhost:4000/transaction';
        let trans = await this.transactionService.getTransactionByUid(userId);
        if (!trans) {
            trans = new transaction_entity_1.TransactionEntity();
            trans.userId = userId;
            trans.methode = 'POST';
            trans.status = 'Pending';
            await this.transactionService.createtransaction(trans);
        }
        else if (trans.status === 'Pending') {
            return { id, status: 'Pending' };
        }
        else {
            trans.status = 'Pending';
            await this.transactionService.updateTransaction(trans);
        }
        try {
            const response = await axios_1.default.post(url, {
                id: id
            }, { timeout: 5000 });
            console.log(response);
            if (response.status === 200) {
                const json = response.data;
                await this.transactionService.deleteTransaction(trans.id);
                return { id, status: json.status };
            }
            else {
                trans.status = 'Failed';
                await this.transactionService.updateTransaction(trans);
                return {
                    id,
                    status: 'Failed',
                    message: `Request failed with status ${response.status}`,
                };
            }
        }
        catch (error) {
            console.log(error);
            if (axios_1.default.isAxiosError(error)) {
                const axiosError = error;
                if (axiosError.code === 'ECONNABORTED') {
                    await this.transactionService.deleteTransaction(trans.id);
                    return { id, status: 'Timeout' };
                }
            }
            await this.transactionService.deleteTransaction(trans.id);
            return { id, status: 'Failed', message: 'An error occurred' };
        }
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransaction", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.Controller)('transaction'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map