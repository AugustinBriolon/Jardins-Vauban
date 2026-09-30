# Les Jardins de Vauban — Site programme

Mini-site de commercialisation du programme immobilier **Les Jardins de Vauban** (48 logements, Bordeaux). Réalisé par Kalimo Promotion.

## Stack technique

| Élément | Choix |
|---------|-------|
| Framework | Next.js 16 (Pages Router, TypeScript) |
| Styles | Tailwind CSS v4 |
| Base de données | Airtable (plan gratuit) |
| Hébergement | Vercel (plan gratuit) |
| Analytics | Vercel Analytics (cookie-free) |

## Lancement local

```bash
# 1. Cloner et installer
git clone <repo>
cd jardins-de-vauban
npm install

# 2. Configurer l'environnement
cp .env.local.example .env.local
# → Remplir AIRTABLE_API_KEY et AIRTABLE_BASE_ID dans .env.local

# 3. Créer automatiquement la structure Airtable et insérer les 48 lots
npx ts-node --skip-project scripts/setup.ts

# 4. Lancer en dev
npm run dev
```

Le site sera disponible sur http://localhost:3000.

## Structure Airtable

### Table `Lots`
| Champ | Type | Valeurs |
|-------|------|---------|
| Référence | Texte | A101, B302… |
| Type | Sélection | T2, T3, T4 |
| Surface (m²) | Nombre | |
| Étage | Nombre | 0 = RDC |
| Exposition | Sélection | Nord, Sud, Est, Ouest, Nord-Est… |
| Prix (€) | Nombre | |
| Statut | Sélection | **Disponible**, Optionné, Vendu |
| Terrasse (m²) | Nombre | (optionnel) |
| Description | Texte long | (optionnel) |

### Table `Demandes`
| Champ | Type |
|-------|------|
| Nom | Texte |
| Prénom | Texte |
| Email | Email |
| Téléphone | Téléphone |
| Lot souhaité | Texte |
| Message | Texte long |
| Consentement RGPD | Case à cocher |
| Date de demande | Date/heure |
| Source | Texte |

## Mise à jour des statuts (commerciale)

La responsable commerciale accède directement à la table **Lots** dans Airtable et modifie le champ **Statut** (Disponible / Optionné / Vendu). Le site se met à jour automatiquement dans la minute suivante (ISR, revalidate 60s).

## Déploiement Vercel

1. Pousser le code sur GitHub
2. Importer le repo dans Vercel (vercel.com)
3. Ajouter les variables d'environnement dans Vercel > Settings > Environment Variables :
   - `AIRTABLE_API_KEY`
   - `AIRTABLE_BASE_ID`
4. Déployer → l'URL est générée automatiquement

## Plaquette PDF

Déposer le fichier PDF de la plaquette commerciale dans `public/brochure.pdf`.
Il sera accessible à l'URL `/brochure.pdf`.
# Jardins-Vauban
