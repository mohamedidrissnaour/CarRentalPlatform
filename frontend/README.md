# Car Rental Platform - Frontend

Application React.js moderne pour la plateforme de location de voitures.

## 🚀 Technologies utilisées

- **React.js 18+** avec Hooks
- **React Router v6** pour la navigation
- **Axios** pour les appels API
- **Tailwind CSS** pour le styling
- **React Query (@tanstack/react-query)** pour la gestion du cache
- **React Hook Form** pour les formulaires
- **date-fns** pour la gestion des dates
- **Recharts** pour les graphiques
- **React Icons** pour les icônes
- **React Toastify** pour les notifications

## 📋 Prérequis

- Node.js 18+ et npm
- Les microservices backend doivent être démarrés :
  - CAR-SERVICE (Port 8081)
  - CLIENT-SERVICE (Port 8082)
  - RENTAL-SERVICE (Port 8083)
  - PAYMENT-SERVICE (Port 8084)

## 🛠️ Installation

1. Installer les dépendances :
```bash
npm install
```

2. Créer un fichier `.env` à partir de `.env.example` :
```bash
cp .env.example .env
```

3. Configurer les URLs des services backend dans `.env` si nécessaire.

## 🏃 Démarrage

Démarrer le serveur de développement :
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173` (ou le port indiqué par Vite).

## 📁 Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── common/         # Composants communs (Modal, Badge, etc.)
│   ├── car/            # Composants liés aux voitures
│   ├── booking/        # Composants de réservation
│   ├── payment/        # Composants de paiement
│   └── layout/         # Composants de layout (Navbar, Footer, Sidebar)
├── pages/              # Pages de l'application
│   ├── admin/          # Pages d'administration
│   └── ...             # Pages publiques
├── services/           # Services API
├── context/            # Context API (Auth, Booking)
├── hooks/              # Hooks personnalisés
└── utils/              # Utilitaires
```

## 🎯 Fonctionnalités

### Pages publiques
- **Accueil** (`/`) : Page d'accueil avec recherche et voitures populaires
- **Catalogue** (`/cars`) : Liste de toutes les voitures avec filtres
- **Détails voiture** (`/cars/:id`) : Détails d'une voiture avec formulaire de réservation
- **Réservation** (`/booking/:carId`) : Processus de réservation en 4 étapes
- **Mes réservations** (`/my-bookings`) : Liste des réservations du client

### Pages admin
- **Dashboard** (`/admin`) : Vue d'ensemble avec statistiques et graphiques
- **Gestion voitures** (`/admin/cars`) : CRUD des voitures
- **Gestion réservations** (`/admin/reservations`) : Gestion des réservations
- **Gestion paiements** (`/admin/payments`) : Gestion des paiements
- **Gestion clients** (`/admin/clients`) : Gestion des clients

## 🔐 Authentification

L'authentification est simulée avec localStorage. Pour accéder au mode admin :
1. Se connecter avec un compte client
2. Dans la console du navigateur, exécuter :
```javascript
localStorage.setItem('isAdmin', 'true');
```

## 🎨 Design

Le design utilise Tailwind CSS avec une palette de couleurs moderne :
- Primary: Bleu (#3B82F6)
- Secondary: Indigo (#6366F1)
- Success: Vert (#10B981)
- Warning: Orange (#F59E0B)
- Danger: Rouge (#EF4444)

## 📝 Format des données

- **Dates** : Format français (JJ/MM/AAAA)
- **Prix** : Format EUR avec 2 décimales
- **Statuts** : Badges colorés selon le statut

## 🧪 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

## 📄 Licence

Ce projet fait partie d'une plateforme de location de voitures.
