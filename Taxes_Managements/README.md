# Congo Tax App 🇨🇩

**Congo Tax App** est une plateforme moderne et sécurisée de gestion et de suivi de la collecte des taxes de marché. Elle permet d'automatiser le processus de collecte, de surveiller la conformité fiscale des vendeurs et de générer des rapports analytiques pour la prise de décision.

---

## 🚀 Fonctionnalités Clés

### 1. Gestion Administrative & Sécurité
- **Validation des Comptes** : Les administrateurs doivent valider manuellement chaque nouveau compte (Agent ou Vendeur) avant qu'il ne puisse accéder au système.
- **Contrôle d'Accès par Rôle (RBAC)** : 
  - **Admin** : Gestion complète (utilisateurs, taxes, dashboard).
  - **Agent** : Collecte de terrain et consultation limitée.
  - **Vendeur** : Espace personnel, historique et signalements.
- **Profil Utilisateur** : Modification des informations personnelles et changement de mot de passe sécurisé.

### 2. Système de Notifications
- **Alertes Admin** : Notifications instantanées lors de chaque nouveau paiement effectué sur le terrain.
- **Suivi Signalements** : Les utilisateurs sont notifiés dès que leur signalement d'abus est traité, résolu ou rejeté par l'administration.

### 3. Collecte & Conformité
- **Matrice de Conformité** : Suivi visuel strict des paiements (Journalier, Mensuel, Annuel).
- **Journal des Collectes** : Traçabilité totale avec génération de reçus.
- **Gestion Dynamique des Taxes** : Création et modification des types de taxes par l'administrateur.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, TypeScript, Redux Toolkit, Tailwind CSS, Chart.js.
- **Backend** : FastAPI (Python 3.10+), SQLAlchemy (ORM), JWT Auth.
- **Base de données** : MySQL (Port par défaut : 3308).

---

## ⚙️ Installation Rapide (Automatisée)

Pour faciliter le déploiement, suivez ces étapes :

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/moisebaliyo-vlad/examenGenieLogiciel.git
   cd Congo-Tax-App
   ```

2. **Installer les dépendances** :
   Double-cliquez sur le fichier `install_dependencies.bat` à la racine. Ce script va :
   - Créer l'environnement virtuel Python (`venv`).
   - Installer toutes les bibliothèques Python nécessaires.
   - Installer les packages Node.js pour le frontend.

3. **Initialiser la Base de Données** :
   - Assurez-vous que votre serveur MySQL est lancé.
   - **Note sur le Port** : Le projet est configuré par défaut pour le port **3308** (courant pour MariaDB/WAMP). Si vous utilisez le port par défaut **3306** :
     - Ouvrez le fichier `Backend/.env`.
     - Modifiez la ligne `DATABASE_URL` pour remplacer `3308` par `3306`.
   - Importez le fichier `setup_database.sql` dans votre client MySQL (ex: phpMyAdmin ou MySQL Workbench).

4. **Lancer l'Application** :
   - Double-cliquez sur `start_backend.bat` pour lancer le serveur API.
   - Double-cliquez sur `start_frontend.bat` pour lancer l'interface utilisateur.
   - Accédez à l'app via : `http://localhost:5173`

---

## 🗄️ Documentation de la Base de Données

Le schéma de base de données (`taxe_app_db`) est structuré comme suit :

| Table | Description |
| :--- | :--- |
| **users** | Comptes Admin/Agent (Auth via email, statut `is_active` pour validation). |
| **vendeurs** | Base des commerçants (Auth via identifiant national, statut `is_active`). |
| **taxes** | Catalogue des taxes (nom, montant, fréquence de collecte). |
| **paiements** | Historique des transactions (lie vendeur, taxe et agent collecteur). |
| **signalements** | Registre des abus ou problèmes signalés par les vendeurs. |
| **notifications** | Système d'alertes pour les paiements et les suivis de dossiers. |

---

## 👥 Accès Par Défaut (Développement)

| Rôle | Identifiant | Mot de passe |
| :--- | :--- | :--- |
| **Admin** | `admin@taxe.app` | `admin123` |
| **Agent** | `agent@taxe.app` | `agent123` |
| **Vendeur** | `IRFFSRE` (ID National) | *N/A (Accès ID direct)* |

---

## 🏗️ Architecture du Projet

```text
├── Backend/
│   ├── app/
│   │   ├── models/      # Définitions des tables SQLAlchemy
│   │   ├── routes/      # Logique métier et endpoints API
│   │   ├── schemas/     # Validation de données (Pydantic)
│   │   └── utils/       # Sécurité, JWT et Dépendances
│   └── main.py          # Entrée principale FastAPI
├── FrontEnds/
│   ├── src/
│   │   ├── pages/       # Vues (Dashboard, Profile, AdminUsers, etc.)
│   │   ├── services/    # Couche de communication API
│   │   ├── store/       # État global (Redux)
│   │   └── ui/          # Layout et Navigation protégée
```

---

## 📄 Licence

Ce projet est réalisé dans le cadre de l'Examen de Génie Logiciel. 🇨🇩
