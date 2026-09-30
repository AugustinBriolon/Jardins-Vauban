# DECISIONS.md — Les Jardins de Vauban (KALIMO Promotion)

## 1. Ce qui a été traité

- **Expérience & Design System (UI/UX)** :
  - Identité visuelle haut de gamme inspirée de la pierre bordelaise et de la nature (Bleu Vauban `#1B2A4A`, Or sablé `#C9A96E`, Pierre naturelle `#F8F6F1`).
  - Architecture des pages aérée, responsive et sans chevauchement : accueil immersive (Hero contrasté, atouts RE2020, carte OpenStreetMap Vauban-Nansouty, engagements promoteur), catalogue des 48 lots filtrable instantanément (type, budget slider, disponibilité) avec badges d'état clairs, et page contact rassurante.
  - Micro-interactions fluides : élévation des cartes au survol (`card-lift`), animations d'apparition en cascade (`fade-up`), switch animé.
  - Performance perçue & transitions instantanées : intégration de **Skeletons** d'articles (`LotCardSkeleton`) lors de la navigation et des filtrages, et barre de filtres à layout stable (pas de décalage visuel lors de l'apparition du bouton de réinitialisation).
- **Architecture de Données & Airtable** :
  - **Structure 2 tables** : `Lots` (48 enregistrements typés avec surfaces, étages, expositions, terrasses, prix et statuts) et `Demandes` (leads qualifiés avec horodatage, lot ciblé, message et consentement).
  - Mode sans friction & **Instant Navigation** : passage en **ISR (Incremental Static Regeneration)** avec `revalidate: 60` et `prefetch={true}`. Dès l'apparition du lien, Next.js précharge les données en tâche de fond. Le clic sur "Les lots" est donc **instantané (0 ms de latence réseau)** au lieu d'attendre 800ms l'API distante d'Airtable comme en SSR traditionnel. Quand la commerciale modifie un statut dans Airtable, Vercel régénère la page en tâche de fond toutes les minutes.
  - Script d'initialisation et de seed automatisé (`scripts/setup.ts`).
- **Sécurité & Résilience technique** :
  - **Protection des quotas Airtable (limite 5 req/s)** : cache mémoire in-memory côté serveur pour neutraliser les attaques par cache-busting ou les pics d'affluence.
  - **Protection anti-injection pour tableurs** : neutralisation des formules malveillantes (`=`, `+`, `-`, `@`) dans les champs texte avant stockage Airtable (sécurité des exports CSV/Excel de la commerciale).
  - **Rate Limiting IP** : limitation à 5 requêtes par tranche de 10 min sur l'API de contact.
  - **Protection anti-bot** : champ honeypot invisible piégeant les scrapers sans gêner les prospects réels.
  - **Validation Zod stricte** : typage et bornes de longueur sur chaque champ pour prévenir tout crash serveur ou payload DoS (`bodyParser: 16kb`).
  - **En-têtes HTTP de sécurité (OWASP)** : CSP stricte, HSTS, `X-Frame-Options: SAMEORIGIN` (anti-clickjacking), `X-Content-Type-Options: nosniff`, suppression du header `X-Powered-By`.
- **Conformité RGPD stricte (en réponse aux remarques de l'avocat)** :
  - Recueil du consentement libre et éclairé avec case à cocher explicite non pré-cochée.
  - Mention légale détaillée avec finalités, durée de conservation (12 mois) et sous-traitants (Vercel, Airtable sous garanties DPF/CCT).
  - Page dédiée complète [`/politique-de-confidentialite`](file:///Users/H6245/Documents/DEV/PRO/jardins-de-vauban/pages/politique-de-confidentialite.tsx) répertoriant l'ensemble des droits (accès, rectification, effacement, limitation, opposition, portabilité, réclamation CNIL).

## 2. Ce qui a été volontairement laissé de côté (et pourquoi)

| Élément | Raisonnement & Justification |
|---------|------------------------------|
| **Carte interactive lourde (Mapbox/Google Maps API)** | Coût d'abonnement potentiel (> 0 €), besoin d'une clé API supplémentaire et impact sur le chargement. L'intégration OpenStreetMap responsive répond parfaitement au besoin sans frais ni tracking tiers. |
| **Envoi d'emails via SendGrid / Resend** | Les demandes sont immédiatement consultables par l'équipe commerciale dans Airtable (interface collaborative native). Une automatisation sans code native Airtable suffit pour les alertes email sans complexité technique supplémentaire. |
| **Authentification administrateur dédiée** | Airtable remplit déjà le rôle de back-office sécurisé avec gestion des droits d'accès pour la commerciale. Développer un dashboard d'administration dédié aurait gaspillé le budget temps de 4h. |
| **Paiement d'acompte / Réservation en ligne** | L'objectif de la phase d'avant-première est la captation et la qualification de prospects, non la contractualisation juridique immédiate (qui exige la signature d'un contrat de réservation VEFA notarié). |

## 3. Travail avec l'IA

- **Outils utilisés** : Antigravity (Google Deepmind) avec Claude et Gemini.
- **Découpage & Méthodologie** :
  1. *Cadrage & Architecture* : arbitrage collégial Next.js Pages Router vs App Router (stabilité, simplicité de maintenance pour le développeur junior qui reprendra la main) et Airtable vs Baserow (respect strict du brief imposé).
  2. *Scaffolding & Seed* : génération du script de création automatisée des tables et des 48 lots.
  3. *Audit & Hardening* : invocation d'un sous-agent spécialisé en sécurité pour auditer le code (détection des risques d'épuisement de quota Airtable, injection de formules dans les tableurs, failles CSRF, lacunes RGPD).
  4. *Passe UX/UI* : maquettage préalable (skill Generative UI) puis refonte soignée des composants avec Tailwind CSS et primitives Base UI / shadcn.
- **Part personnelle & Relecture critique** :
  - Validation manuelle de chaque choix d'architecture (notamment la protection de la clé d'API Airtable qui ne doit jamais transiter côté client).
  - Rédaction et vérification juridique des mentions RGPD au regard des exigences de la CNIL.
  - Tests en conditions réelles des cas limites (soumissions sans JavaScript, entrées malveillantes, limitation de débit).

## 4. Hébergement & Coût mensuel réel

| Composant | Fournisseur / Offre | Coût mensuel réel |
|-----------|---------------------|-------------------|
| **Hébergement Frontend & API** | Vercel (Plan Hobby gratuit) | 0,00 € |
| **Base de données & CRM lots** | Airtable (Plan Free — jusqu'à 1 000 enregistrements) | 0,00 € |
| **Statistiques d'audience** | Vercel Analytics (inclus, sans cookies, conforme CNIL) | 0,00 € |
| **Certificat SSL / CDN mondial** | Vercel Edge Network | 0,00 € |
| **Total** | | **0,00 € / mois** |

*Respect de la contrainte client (< 20 €/mois) : Budget préservé à 100%.*

## 5. Ce qu'il manquerait pour confier le site en production réelle

- **Plaquette commerciale définitive** : remplacer le fichier modèle `public/brochure.pdf` par le livrable du graphiste.
- **Nom de domaine personnalisé** : relier `lesjardinsdevauban.fr` ou `jardins-vauban.kalimo-promotion.fr` dans les DNS Vercel (coût : ~12 €/an chez OVH ou Gandi).
- **Automatisation d'alerte email** : activer dans Airtable une automatisation en 2 clics (*"When record created in Demandes -> Send email to commercial@kalimo-promotion.fr"*).
- **Passation avec le développeur junior** : session de 30 minutes s'appuyant sur le README complet fourni (explication de la structure Next.js, des variables d'environnement et du script de seed).

## 6. Temps passé

Grâce à un pilotage direct et itératif de l'IA, le projet a été conçu, développé, sécurisé et déployé en **~1h30 de travail effectif** (bien en dessous du plafond de 4h fixé par le brief) :

| Étape | Durée effective |
|-------|-----------------|
| Cadrage du brief, choix d'architecture & initialisation base Airtable | 15 min |
| Développement complet (composants Next.js, API routes, client Airtable) | 35 min |
| Audit de sécurité automatisé, durcissement (Zod, Rate limit, CSP) & page RGPD | 20 min |
| Itérations design UI/UX (layout, skeletons, suppression image hero, filtres) | 20 min |
| **Total effectif** | **~1h30** |
