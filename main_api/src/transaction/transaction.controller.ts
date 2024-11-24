import { Body, Controller, Post } from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { TransactionEntity } from './transaction.entity';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) { }

    @Post()
    async getTransaction(@Body() body) {
        const { id, userId } = body;
        const api_url = process.env.api_ur
        const api_port = process.env.api_port
        const url = `${api_url}:${api_port}/transaction`; // URL avec le bon protocole

        // Rechercher une transaction existante
        let trans = await this.transactionService.getTransactionByUid(userId);

        if (!trans) {
            // Créer une nouvelle transaction si aucune n'existe
            trans = new TransactionEntity();
            trans.userId = userId;
            trans.methode = 'POST';
            trans.status = 'Pending';
            await this.transactionService.createtransaction(trans);
        } else if (trans.status === 'Pending') {
            // Retourner immédiatement si une transaction en attente existe déjà
            return { id, status: 'Pending' };
        } else {
            // Sinon, réinitialiser le statut à "Pending"
            trans.status = 'Pending';
            await this.transactionService.updateTransaction(trans);
        }

        try {
            // Configurer un timeout pour Axios
            const response = await axios.post(
                url,
                {
                    id: id
                }, // Si nécessaire, envoyer des données ici
                { timeout: 5000 } // Timeout en millisecondes
            );
            console.log(response);
            if (response.status === 200) {
                // Si la requête réussit
                const json: any = response.data; // Récupérer les données
                await this.transactionService.deleteTransaction(trans.id);
                return { id, status: json.status };
            } else {
                // Gestion des erreurs de réponse
                trans.status = 'Failed';
                await this.transactionService.updateTransaction(trans);

                return {
                    id,
                    status: 'Failed',
                    message: `Request failed with status ${response.status}`,
                };
            }
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                // Gestion des erreurs spécifiques à Axios
                const axiosError = error as AxiosError;

                if (axiosError.code === 'ECONNABORTED') {
                    await this.transactionService.deleteTransaction(trans.id);
                    return { id, status: 'Timeout' };
                }
            }
            await this.transactionService.deleteTransaction(trans.id);
            return { id, status: 'Failed', message: 'An error occurred' };
        }
    }
}

