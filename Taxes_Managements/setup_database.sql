-- ============================================================
--  SCRIPT DE CREATION DE LA BASE DE DONNEES : taxe_app_db
--  A executer dans phpMyAdmin (WAMP - port 3306)
-- ============================================================

-- 1. Créer et sélectionner la base de données
CREATE DATABASE IF NOT EXISTS taxe_app_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE taxe_app_db;

-- ============================================================
-- 2. Table : users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255),
    is_active       TINYINT(1)  NOT NULL DEFAULT 1,
    is_admin        TINYINT(1)  NOT NULL DEFAULT 0,
    created_at      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 3. Table : vendeurs
-- ============================================================
CREATE TABLE IF NOT EXISTS vendeurs (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    nom                  VARCHAR(255) NOT NULL,
    prenom               VARCHAR(255) NOT NULL,
    identifiant_national VARCHAR(255) NOT NULL UNIQUE,
    telephone            VARCHAR(255),
    emplacement          VARCHAR(255),
    is_active            TINYINT(1)  NOT NULL DEFAULT 1,
    created_at           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_vendeurs_nom (nom),
    INDEX idx_vendeurs_identifiant (identifiant_national)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. Table : taxes
-- ============================================================
CREATE TABLE IF NOT EXISTS taxes (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nom          VARCHAR(255)   NOT NULL,
    montant_base DOUBLE         NOT NULL,
    frequence    VARCHAR(255)   NOT NULL,
    description  VARCHAR(255),
    INDEX idx_taxes_nom (nom)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. Table : paiements
-- ============================================================
CREATE TABLE IF NOT EXISTS paiements (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    vendeur_id         INT            NOT NULL,
    taxe_id            INT            NOT NULL,
    collection_user_id INT            NOT NULL,
    montant            DOUBLE         NOT NULL,
    date_paiement      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reference          VARCHAR(255)   NOT NULL UNIQUE,
    FOREIGN KEY (vendeur_id)         REFERENCES vendeurs(id) ON DELETE RESTRICT,
    FOREIGN KEY (taxe_id)            REFERENCES taxes(id)    ON DELETE RESTRICT,
    FOREIGN KEY (collection_user_id) REFERENCES users(id)   ON DELETE RESTRICT,
    INDEX idx_paiements_reference (reference)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. Table : signalements
-- ============================================================
CREATE TABLE IF NOT EXISTS signalements (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT          NOT NULL,
    sujet            VARCHAR(255) NOT NULL,
    description      TEXT         NOT NULL,
    date_signalement DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statut           VARCHAR(255) NOT NULL DEFAULT 'Ouvert',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_signalements_sujet (sujet)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. Table : notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT          NOT NULL,
    titre       VARCHAR(255) NOT NULL,
    message     TEXT         NOT NULL,
    is_read     TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. Données initiales : un compte admin par défaut
-- ============================================================
INSERT IGNORE INTO users (email, hashed_password, full_name, is_active, is_admin)
VALUES (
    'admin@taxe.app',
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
    'Administrateur',
    1,
    1
);

-- ============================================================
-- 8. Données initiales : Taxes pour le marché de Virunga
-- ============================================================
INSERT IGNORE INTO taxes (nom, montant_base, frequence, description) VALUES
('Taxe de l''Etat', 500, 'Journalière', 'Taxe officielle journalière pour le marché'),
('Assainissement', 1000, 'Hebdomadaire', 'Entretien du marché'),
('Patente', 35000, 'Annuelle', 'Autorisation d''exercer');

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
SELECT 'Base de données taxe_app_db créée avec succès !' AS statut;
