# DECISIONS — Les Jardins de Vauban

## Traité

- **Parcours acheteur** :
  - recherche par typologie et budget dès l'accueil ;
  - façade interactive (une fenêtre = un lot) et tableau triable, filtres gardés dans l'URL ;
  - **fiche partageable par lot** (`/lots/A012`) avec formulaire pré-rempli : le lien que la commerciale envoie.
- **Airtable** : table `Lots` (modifiée par la commerciale, lue par le site) et table `Demandes` (écrite par le formulaire, validée par un schéma Zod partagé entre navigateur et serveur, avec anti-bot).
- **Données fiables** : chaque lot est validé à la lecture (prix au m² entre 2 000 et 15 000 €). Une faute de frappe écarte le lot et le signale dans les logs, au lieu de l'afficher.
- **Fraîcheur** : un webhook Airtable régénère les listes en quelques secondes après un changement de statut.
- **Données personnelles** :
  - consentement non pré-coché, conservation 12 mois ;
  - mentions légales et politique de confidentialité ;
  - audience mesurée sans cookie ;
  - formulaire en POST (rien dans l'URL) ;
  - carte chargée à la demande.
- **Statistiques** : Vercel Web Analytics (visites, provenance) et table `Demandes` (volume, lot visé).
- **Reprise par un junior** : 49 tests, 7 ADR dans `docs/adr/`, README avec commandes et conventions.

## Laissé de côté

- **Back-office** : Airtable en fait déjà office (vues, droits).
- **Alerte e-mail et purge à 12 mois** : une automation Airtable native suffit, elle reste à activer.
- **Demande liée au lot par un champ lié, source UTM par demande** : j'ai priorisé la fiabilité et la fraîcheur des données.
- **Hypothèses** : programme fictif (lots générés, livraison T4 2028), photos de Bordeaux et non du programme. « Le lendemain » est interprété ainsi : listes exactes en quelques secondes, fiches lot sous environ 24 h.

## Travail avec l'IA

- **Outils** : Antigravity (Claude, Gemini) pour la v1, Claude Code pour la refonte, les tests, les ADR et les commits.
- **Méthode** : un plan validé avant chaque étape, un ADR par choix structurant, des commits atomiques, et chaque affirmation technique vérifiée dans la documentation.
- **Corrigé à la relecture** :
  - des valeurs inventées par l'IA (un prix manquant affiché « 200 000 € ») ;
  - des arguments marketing fictifs ;
  - une affirmation fausse sur la licence de fonds de carte ;
  - un crash du site sans WebGL2, trouvé en test navigateur.
- **Refusé côté produit** : la première refonte (belle, peu utile), au profit de la recherche dès l'accueil, des fiches dédiées et d'une vraie carte.

## Hébergement et coût mensuel réel

- **Démo : 0 €** (Vercel Hobby, Airtable Free, carte OpenFreeMap).
- **Production : ≈ 19,5 €/mois**, parce que Vercel Hobby **interdit l'usage commercial**. Il faut Vercel Pro (20 $, soit ≈ 18,5 €) plus le domaine (≈ 1 €). C'est sous la limite, mais de peu.
- **Contrainte structurante : le plan Airtable Free plafonne à 1 000 appels API par mois.** Chaque régénération de page coûte un appel. D'où le webhook en voie principale et une régénération quotidienne seulement, pour environ 690 appels/mois estimés (ADR 0007).

## Manque pour la production

1. Passer sur un hébergement autorisant l'usage commercial, puis brancher le domaine.
2. Créer le webhook en production (script fourni). À confirmer : qu'il fonctionne bien en plan Free, ce qui n'est pas documenté.
3. Activer l'alerte e-mail et la purge dans Airtable.
4. Compléter les mentions légales (SIREN, directeur de publication) et les faire valider par l'avocat.
5. Brancher les vrais visuels, la plaquette et la grille de prix.
6. Ajouter un test de bout en bout du parcours, et vérifier les animations sur de vrais téléphones.
7. **Avec plus de temps** : migrer vers l'App Router, avec un cache Airtable unique invalidé par tag. Un changement coûterait alors un seul appel, et les 50 pages seraient exactes en quelques secondes.

## Temps passé

Environ 4 h au total (v1, puis refonte).
