```markdown
# Design System : L'Autorité Bienveillante

## 1. Overview & Creative North Star : "Le Contraste Précis"

Ce système de design est conçu pour transformer l'acte administratif de collecte de taxes en une expérience fluide, indiscutable et hautement efficace. En extérieur, sur les marchés, la lumière est changeante et l'agitation constante. Notre "Creative North Star" est **"Le Contraste Précis"**.

Contrairement aux applications administratives classiques qui se contentent de grilles rigides et de bordures grises, ce système utilise une approche **éditoriale-robuste**. Nous brisons le "look template" par une hiérarchie typographique imposante et une profondeur créée par des couches de couleurs (Tonal Layering) plutôt que par des traits de contour. L'objectif est une lisibilité instantanée même sous un soleil de midi, avec une allure institutionnelle qui impose le respect et la confiance.

---

## 2. Palette de Couleurs & Chromatisme

L'identité visuelle repose sur un bleu profond (`primary`) pour l'autorité, soutenu par une logique de surfaces ultra-claires pour maximiser le contraste.

### Les Règles d'Or de la Couleur :
- **La règle du "No-Line" :** Il est formellement interdit d'utiliser des bordures de 1px pour séparer les sections. La séparation doit se faire par le changement de fond (ex: une carte en `surface_container_lowest` sur un fond `surface`).
- **Signature Texture & Gradient :** Pour les actions critiques, utilisez un léger dégradé linéaire allant de `primary` (#003f87) à `primary_container` (#0056b3). Cela donne une "pulsation" professionnelle et évite l'aspect plat et bon marché.
- **Glassmorphism Sélectif :** Pour les modales ou les sélecteurs flottants, utilisez `surface` avec une opacité de 85% et un `backdrop-blur` de 12px. Cela permet de garder un lien visuel avec le contexte du marché en arrière-plan.

### Valeurs de Référence :
- **Action Primaire :** `primary` (#003f87) | Text: `on_primary` (#ffffff)
- **Validation (Succès) :** `secondary` (#1b6d24) | Fond doux: `secondary_container` (#a0f399)
- **Alerte/Attention :** `tertiary` (#6e2e00) | Fond doux: `tertiary_container` (#934000)
- **Erreur :** `error` (#ba1a1a)

---

## 3. Typographie : Public Sans Editorial

Nous utilisons **Public Sans**, une police sans-serif géométrique et robuste, conçue pour la clarté administrative.

*   **L'Impact Display :** Utilisez `display-md` (2.75rem) pour les montants totaux collectés. Cela doit être l'élément le plus visible de l'écran.
*   **L'Autorité des Titres :** Les titres de section utilisent `title-lg` en graisse Bold.
*   **Lisibilité Terrain :** Le corps de texte ne descend jamais en dessous de `body-md` (0.875rem) pour garantir la lecture en mouvement.

| Rôle | Taille | Application |
| :--- | :--- | :--- |
| **Display SM** | 2.25rem | Montants de taxes, Chiffres clés |
| **Headline SM** | 1.5rem | Titres de pages |
| **Title LG** | 1.375rem | Noms de commerçants, En-têtes de cartes |
| **Body LG** | 1rem | Inputs, Contenu principal |
| **Label MD** | 0.75rem | Status, Légendes d'icônes |

---

## 4. Élévation & Profondeur : Tonal Layering

L'ombre portée est une exception, pas la règle. Nous créons la hiérarchie par l'empilement des surfaces.

*   **Le Principe de Stacking :** 
    1.  Fond d'écran : `surface` (#fcf9f8)
    2.  Sections de regroupement : `surface_container_low` (#f6f3f2)
    3.  Cartes interactives : `surface_container_lowest` (#ffffff)
*   **L'Ombre Ambiante :** Uniquement pour les éléments qui doivent être "saisis" (boutons flottants). Utilisez une ombre très diffuse : `y: 8px, blur: 24px, color: rgba(27, 28, 28, 0.06)`.
*   **Ghost Border Fallback :** Si un élément nécessite une limite visuelle (ex: champs de saisie), utilisez `outline_variant` à **20% d'opacité** maximum. Ne jamais utiliser de noir pur.

---

## 5. Composants Robustes

### Boutons Tactiles (Touch-Ready)
Les boutons sont le point de contact principal. Ils doivent être massifs.
- **Largeur :** Pleine largeur (Full width) sur mobile.
- **Hauteur :** Minimum 56px pour une manipulation facile avec des gants ou en mouvement.
- **Rayon :** `md` (0.375rem) pour garder un aspect sérieux et structuré.
- **Style :** `primary` avec texte en `on_primary`.

### Cartes d'Information (Sans Diviseur)
- **Structure :** Utilisez le `surface_container_lowest` pour le corps de la carte.
- **Espacement :** Padding interne de 24px (XL) pour laisser respirer les données.
- **Absence de lignes :** Pour séparer le nom du commerçant du montant dû, utilisez un saut de ligne généreux et un changement de graisse typographique plutôt qu'une ligne grise.

### Indicateurs de Statut
- **Pills de statut :** Forme `full` (pillule). 
- **Couleurs :** `secondary_fixed` pour "Payé", `tertiary_fixed` pour "En attente". Le contraste entre le texte sombre (`on_secondary_fixed`) et le fond clair assure la lisibilité.

### Champs de Saisie (Inputs)
- Fond en `surface_container_high`.
- Label flottant en `label-md` pour ne jamais perdre le contexte de ce que l'on saisit.

---

## 6. Do’s and Don’ts

### ✅ À Faire
- Utiliser l'asymétrie : Aligner les montants à droite et les labels à gauche avec des graisses différentes.
- Abuser de l'espace blanc : C'est le luxe de la lisibilité.
- Utiliser des icônes épaisses (2px minimum) pour correspondre à la robustesse de la police.

### ❌ À ne pas Faire
- **Pas de bordures :** Ne jamais utiliser de `border: 1px solid`.
- **Pas de gris pur :** Utilisez toujours les variantes de `surface` qui possèdent une légère teinte chaude pour éviter un aspect "informatique" froid.
- **Pas de petites cibles :** Évitez tout élément interactif de moins de 44x44px.
- **Pas d'ombres portées agressives :** L'interface doit paraître posée, pas flottante.

---

## 7. Composant Signature : "Le Badge de Confiance"
Chaque transaction réussie doit afficher une carte utilisant le `secondary_container` avec une icône de validation massive en `secondary`. Ce feedback visuel doit être si fort qu'il est visible par le commerçant à 2 mètres de distance, renforçant la fiabilité de l'agent de collecte.```