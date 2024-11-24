


## Installation

1. Clonez le projet :

git clone https://github.com/kagro00/djamo-api
cd djamo-api
2. Installez les dépendances :

npm install
3. Configurez les variables d'environnement :
Créez un fichier .env à la racine du projet et ajoutez-y les informations suivantes :

POSTGRES_DB=your_db
POSTGRES_USER=user
POSTGRES_PASSWORD=password
REDIS_HOST=redis_host
MICROSERVICE_PORT=3000

4. Lancer l'application :
L'API utilise Docker pour simplifier la gestion des environnements. Vous pouvez démarrer l'application avec Docker Compose :


docker-compose up --build
Cela démarrera tous les services nécessaires, y compris la base de données PostgreSQL, Redis, et l'API NestJS.

## Utilisation
L'API expose plusieurs endpoints pour interagir avec les transactions :

Créer une transaction
POST /transactions/
Ce endpoint permet de créer une nouvelle transaction.

Exemple de requête :

bash
Copier le code
curl -X POST http://localhost:3000/transactions/ \
    -H "Content-Type: application/json" \
    -d '{"userId": "12345", "status": pending, "id": 1}'
Réponse :

json
Copier le code
{
    "id": 1,
    "userId": "12345",
    "status": "pending",
   
}
Mettre à jour le statut via webhook
POST /webhook/
Ce webhook permet à un service tiers de mettre à jour le statut d'une transaction.

Exemple de requête :


curl -X POST http://localhost:3000/webhook/ \
    -H "Content-Type: application/json" \
    -d '{"id": 1, "status": "completed"}'
Réponse :

json
Copier le code
{
    "message": "Transaction updated successfully"
}

## Tests
Les tests sont écrits avec Jest et Supertest pour valider les différents flux de l'API. Vous pouvez exécuter les tests avec la commande suivante :

e
npm run test
Cela exécutera tous les tests unitaires et d'intégration de l'API.

## CI/CD
Configuration CI/CD

Ce projet utilise GitHub Actions pour l'intégration continue et le déploiement continu (CI/CD). Les tests sont exécutés à chaque push et chaque pull request. Docker est utilisé pour déployer l'API et ses services dans des environnements isolés, assurant ainsi une expérience de déploiement fluide et rapide.

## Contribuer
Étapes pour contribuer :

Forkez ce projet.
Créez une branche (git checkout -b feature-name).
Apportez vos modifications et faites un commit (git commit -am 'Ajoutez une fonctionnalité').
Poussez votre branche (git push origin feature-name).
Ouvrez une pull request.
Merci de respecter les bonnes pratiques de développement et de fournir une description claire des changements.

## Diagramme de séquence
Voici un diagramme de séquence qui décrit le processus de gestion des transactions :


Utilisateur --> API (POST /transactions)
API --> Redis (cache lookup for account balance)
Redis --> API (cache hit/miss)
API --> PostgreSQL (fetch account details if cache miss)
PostgreSQL --> API (return account details)
API --> Service tiers (initiate transaction with external service)
Service tiers --> API (return transaction status/confirmation)
API --> PostgreSQL (update account details and transaction history)
API --> Redis (update cache with new account balance if applicable)
API --> Utilisateur (return transaction status and details)

## Explication du Processus

### Étape 1 : Requête de transaction par le client
L'utilisateur initie une transaction via une interface (web ou mobile) en entrant le montant et le destinataire, puis clique sur "Envoyer". Une requête POST /transactions est envoyée à l'API backend avec les détails de la transaction (montant, destinataire, moyen de paiement, etc.).

### Étape 2 : Validation de la requête par l'API
L'API backend valide les données d'entrée :

Vérification du montant > 0
Vérification du destinataire
Authentification et autorisation de l'utilisateur.

### Étape 3 : Vérification du solde
L'API interroge Redis pour vérifier si les informations de solde de l'utilisateur sont déjà en cache. Si le cache est vide (cache miss), l'API interroge PostgreSQL pour récupérer les données de solde de l'utilisateur.

### Étape 4 : Enregistrement de la transaction
L'API enregistre les détails de la transaction dans la base de données PostgreSQL avec un statut "pending".

### Étape 5 : Appel au service tiers
L'API envoie la demande de transaction à un service tiers (par exemple, une passerelle de paiement).

### Étape 6 : Réponse du service tiers
Le service tiers retourne une réponse de succès ou d'échec :

Si la transaction réussit, son statut passe à "completed".
Si la transaction échoue, le statut devient "failed", et le solde initial est restauré.
### Étape 7 : Mise à jour du cache
L'API met à jour le solde de l'utilisateur dans Redis si la transaction réussit.

### Étape 8 : Notification au client
L'API retourne une réponse au client avec le statut de la transaction et les détails pertinents (nouveau solde, référence de transaction, etc.).

## Piege Observe
Le piege dans l'exercice est que les ports ne sont pas exposes donc cela ne permettait pas la communication entre les differentes composantes.
