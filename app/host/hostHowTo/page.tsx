import React from "react";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 md:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
            Guide d'utilisation{" "}
            <span className="text-sky-600 dark:text-sky-400">FastBookInn</span>{" "}
            pour les Hôteliers
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Bienvenue sur FastBookInn ! Ce guide vous accompagne dans la
            découverte de votre plateforme de gestion hôtelière complète. Suivez
            ces étapes pour optimiser votre présence et maximiser vos
            réservations.
          </p>
        </header>

        {/* Configuration initiale */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">🏨</span>
            Configuration initiale de votre établissement
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Étape 1 : Créer votre fiche hôtel
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3 font-medium">
                Informations essentielles :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>
                  Nom de l'établissement : Choisissez un nom clair et
                  reconnaissable
                </li>
                <li>
                  Classification : Sélectionnez votre nombre d'étoiles (1 à 5)
                </li>
                <li>
                  Type d'hébergement : Hôtel, B&B, Auberge, Résidence, etc.
                </li>
                <li>
                  Localisation précise : Adresse complète avec code postal
                </li>
                <li>
                  Description : Rédigez une présentation attractive de 150-300
                  mots
                </li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Étape 2 : Définir votre adresse et localisation
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3">
                Renseignez avec précision :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Numéro et nom de rue</li>
                <li>Code postal et ville</li>
                <li>
                  Coordonnées GPS (latitude/longitude) pour un géoréférencement
                  optimal
                </li>
                <li>Quartier si applicable</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Gestion des visuels */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">📸</span>
            Gestion des visuels
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Photos de votre établissement
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3 font-medium">
                Conseils pour des photos attractives :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>
                  Minimum 8 photos : Façade, hall, chambres types, espaces
                  communs
                </li>
                <li>Résolution élevée : Images nettes et bien éclairées</li>
                <li>
                  Ordre d'affichage : Priorisez vos meilleures photos en premier
                </li>
                <li>Diversité : Montrez différents angles et ambiances</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Organisation de votre galerie
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3">
                Catégorisez vos images par type :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Photos de l'hôtel (extérieur/intérieur)</li>
                <li>Photos des chambres (par type)</li>
                <li>Espaces communs (restaurant, spa, piscine)</li>
                <li>Vues depuis l'établissement</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Configuration des chambres */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">🛏️</span>
            Configuration de vos chambres
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Création des types de chambres
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3">
                Pour chaque type de chambre, définissez :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Nom de la chambre : Standard, Supérieure, Suite, etc.</li>
                <li>Capacité maximum : Nombre de personnes</li>
                <li>Configuration des lits : Type et nombre de lits</li>
                <li>Superficie : En mètres carrés</li>
                <li>Tarif de base : Prix par nuit</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Gestion des équipements
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3 font-medium">
                Équipements de chambre disponibles :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Climatisation/Chauffage</li>
                <li>WiFi gratuit</li>
                <li>Télévision</li>
                <li>Minibar</li>
                <li>Coffre-fort</li>
                <li>Balcon/Terrasse</li>
                <li>Vue (mer, montagne, jardin)</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Stratégie tarifaire */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">💰</span>
            Stratégie tarifaire
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Tarification de base
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Prix régulier : Votre tarif standard</li>
                <li>Prix promotionnel : Pour les offres spéciales</li>
                <li>Devise : EUR par défaut (modifiable)</li>
                <li>Taxes : Précisez si incluses ou en sus</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Gestion du calendrier de disponibilité
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3 font-medium">
                Fonctionnalités avancées :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Tarifs variables selon les dates</li>
                <li>Séjour minimum/maximum</li>
                <li>Blocage des ventes pour maintenance</li>
                <li>Prix saisonniers automatisés</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Mise en valeur de l'établissement */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">🏷️</span>
            Mise en valeur de votre établissement
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Labels et certifications
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3">
                Ajoutez vos distinctions :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Labels qualité (Logis, Châteaux & Hôtels)</li>
                <li>Certifications environnementales</li>
                <li>Récompenses TripAdvisor, Booking</li>
                <li>Spécialisations (Business, Famille, Romantique)</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Points forts et atouts
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-3 font-medium">
                Catégories de mise en valeur :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Localisation : Proximité sites touristiques, transports</li>
                <li>Services : Spa, restaurant, piscine</li>
                <li>Vues : Panoramas exceptionnels</li>
                <li>Offres : Forfaits, promotions en cours</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Équipements et services
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                    Services hôteliers :
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                    <li>Réception 24h/24</li>
                    <li>Service en chambre</li>
                    <li>Petit-déjeuner (continental, buffet)</li>
                    <li>Restaurant/Bar</li>
                    <li>Spa/Wellness</li>
                    <li>Salle de fitness</li>
                    <li>Piscine (intérieure/extérieure)</li>
                    <li>Parking (gratuit/payant)</li>
                  </ul>
                </div>
                <div>
                  <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                    Accessibilité :
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                    <li>Accès personnes à mobilité réduite</li>
                    <li>Ascenseur</li>
                    <li>Chambres adaptées</li>
                    <li>Animaux acceptés</li>
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* Politiques de l'établissement */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">📋</span>
            Politiques de l'établissement
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Conditions de séjour
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                    Horaires standard :
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                    <li>Arrivée : 15h00 (modifiable)</li>
                    <li>Départ : 11h00 (modifiable)</li>
                    <li>Langues parlées : À la réception</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Politiques importantes
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                Règles de l'établissement :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Politique animaux de compagnie</li>
                <li>Autorisation fumeur/non-fumeur</li>
                <li>Politique fêtes et événements</li>
                <li>Conditions enfants et lits supplémentaires</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Politiques d'annulation
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Configurez vos conditions :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Annulation gratuite : Jusqu'à X jours avant l'arrivée</li>
                <li>Pénalités : Pourcentage ou montant fixe</li>
                <li>No-show : Politique en cas d'absence</li>
                <li>Modification : Conditions de changement de dates</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Tableau de bord hôtelier */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">📊</span>
            Tableau de bord hôtelier
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Métriques essentielles
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Suivez vos performances :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Taux d'occupation : Pourcentage de chambres occupées</li>
                <li>Revenus mensuels : Chiffre d'affaires généré</li>
                <li>Prix moyen : ADR (Average Daily Rate)</li>
                <li>RevPAR : Revenue Per Available Room</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Gestion des réservations
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                Vue d'ensemble :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Réservations du jour</li>
                <li>Arrivées/Départs prévus</li>
                <li>Clients actuellement présents</li>
                <li>Taux d'annulation</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Suivi de la satisfaction
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                Indicateurs qualité :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Note moyenne des avis clients</li>
                <li>Nombre total d'avis</li>
                <li>Taux de réponse aux commentaires</li>
                <li>Évolution des scores</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Gestion des avis clients */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">💬</span>
            Gestion des avis clients
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Suivi des évaluations
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                Monitoring actif :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Nouveaux avis à traiter</li>
                <li>Notes par catégorie</li>
                <li>Commentaires positifs/négatifs</li>
                <li>Tendances d'amélioration</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Réponses aux avis
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                Bonnes pratiques :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Répondez dans les 24h</li>
                <li>Personnalisez chaque réponse</li>
                <li>Remerciez pour les avis positifs</li>
                <li>Proposez des solutions pour les critiques constructives</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Maintenance et mise à jour */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">🔧</span>
            Maintenance et mise à jour
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Indisponibilités planifiées
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Gérez les chambres hors service :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Motif : Maintenance, rénovation, problème technique</li>
                <li>Période : Dates de début et fin</li>
                <li>Notes internes : Détails pour l'équipe</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Mises à jour régulières
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Éléments à actualiser :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Photos saisonnières</li>
                <li>Tarifs et promotions</li>
                <li>Services temporaires</li>
                <li>Événements locaux</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Optimisation de la visibilité */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">🎯</span>
            Optimisation de votre visibilité
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                SEO et attractivité
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Conseils pour améliorer votre classement :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Description détaillée et unique</li>
                <li>Photos professionnelles régulièrement renouvelées</li>
                <li>Réponse systématique aux avis</li>
                <li>Mise à jour des disponibilités en temps réel</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Promotions et offres spéciales
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2 font-medium">
                Types de promotions :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Réservation anticipée</li>
                <li>Séjours prolongés</li>
                <li>Forfaits thématiques</li>
                <li>Offres dernière minute</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Programme de fidélité
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Participez au système de récompenses :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Points accordés aux clients</li>
                <li>Avantages partenaires</li>
                <li>Recommandations croisées</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Support et assistance */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-sky-700 dark:text-sky-300 mb-6">
            <span className="text-3xl">📱</span>
            Support et assistance
          </h2>

          <div className="space-y-8">
            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Centre d'aide
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>FAQ : Réponses aux questions fréquentes</li>
                <li>Tutoriels vidéo : Guides pas-à-pas</li>
                <li>Support technique : Contact direct</li>
              </ul>
            </article>

            <article className="bg-white/70 dark:bg-slate-800/60 backdrop-blur rounded-xl shadow ring-1 ring-slate-100 dark:ring-slate-700 p-6">
              <h3 className="text-lg font-medium text-blue-600 dark:text-blue-300 mb-3">
                Notifications importantes
              </h3>
              <p className="text-slate-700 dark:text-slate-200 mb-2">
                Restez informé :
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 dark:text-slate-200">
                <li>Nouvelles réservations</li>
                <li>Avis clients</li>
                <li>Problèmes techniques</li>
                <li>Mises à jour système</li>
              </ul>
            </article>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-20 space-y-4">
          <div className="bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur rounded-xl p-6 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-800 dark:text-amber-200 font-medium flex items-center justify-center gap-2">
              <span className="text-xl">💡</span>
              Conseil pro : Maintenez votre fiche à jour quotidiennement et
              répondez rapidement à vos clients pour optimiser votre taux de
              conversion et votre réputation sur la plateforme.
            </p>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Pour toute question spécifique, n'hésitez pas à contacter notre
            équipe support dédiée aux hôteliers.
          </p>
        </footer>
      </div>
    </div>
  );
}
