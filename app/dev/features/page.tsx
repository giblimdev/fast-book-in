//@/app/dev/features/page.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MapPin,
  Building2,
  Star,
  Wifi,
  Camera,
  Shield,
  Settings,
  Home,
  Search,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Système d'authentification et gestion utilisateur",
      icon: <Users className="h-6 w-6" />,
      description:
        "Gestion complète des utilisateurs avec authentification sécurisée",
      items: [
        "Inscription/connexion (email, mot de passe, OAuth)",
        "Sessions utilisateur sécurisées",
        "Vérification d'email",
        "Gestion de comptes multiples",
        "Adresses utilisateur",
      ],
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Gestion des destinations touristiques",
      icon: <MapPin className="h-6 w-6" />,
      description: "Organisation hiérarchique complète des destinations",
      items: [
        "Hiérarchie pays > villes > quartiers",
        "Points d'intérêt avec géolocalisation",
        "Système de classement pour l'affichage",
        "Support multilangue et multi-devises",
      ],
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Système complet d'hébergements",
      icon: <Building2 className="h-6 w-6" />,
      description: "Gestion avancée des fiches hôtelières",
      items: [
        "Classement par étoiles",
        "Gestion des prix et promotions",
        "Politiques d'annulation flexibles",
        "Système d'évaluations et avis",
        "Types d'hébergement variés",
        "Support des groupes hôteliers",
      ],
      color: "bg-purple-50 border-purple-200",
    },
    {
      title: "Caractéristiques détaillées",
      icon: <Star className="h-6 w-6" />,
      description: "Aménités et services détaillés",
      items: [
        "Aménités catégorisées avec icônes",
        "Options d'accessibilité",
        "Gestion du stationnement",
        "Labels et certifications",
        "Points forts mis en avant",
      ],
      color: "bg-orange-50 border-orange-200",
    },
    {
      title: "Détails des chambres",
      icon: <Wifi className="h-6 w-6" />,
      description: "Informations complètes sur les chambres",
      items: [
        "Aménités spécifiques aux chambres",
        "Descriptions détaillées",
        "Géolocalisation précise",
      ],
      color: "bg-teal-50 border-teal-200",
    },
    {
      title: "Système média",
      icon: <Camera className="h-6 w-6" />,
      description: "Gestion complète des médias",
      items: [
        "Images pour hôtels, villes, chambres",
        "Ordre d'affichage personnalisable",
        "Textes alternatifs pour l'accessibilité",
      ],
      color: "bg-pink-50 border-pink-200",
    },
    {
      title: "Relations complexes",
      icon: <Shield className="h-6 w-6" />,
      description: "Architecture de données flexible",
      items: [
        "Destinations multiples par ville",
        "Labels multiples par hôtel",
        "Système de jointures avancé",
        "Ordonnancement personnalisable",
      ],
      color: "bg-indigo-50 border-indigo-200",
    },
    {
      title: "Fonctionnalités administratives",
      icon: <Settings className="h-6 w-6" />,
      description: "Outils de gestion et d'administration",
      items: [
        "Champs de création/mise à jour automatiques",
        "Système de codes uniques",
        "Scores de popularité",
        "Interface d'administration complète",
      ],
      color: "bg-yellow-50 border-yellow-200",
    },
  ];

  const useCases = [
    "Plateforme de réservation d'hôtels avec filtres avancés",
    "Guide touristique des villes et points d'intérêt",
    "Système de gestion pour chaînes hôtelières",
    "Application de découverte de destinations",
    "Outil de comparaison d'hébergements",
  ];

  const scenarios = [
    {
      title: "Propriétaire d'un gîte met une annonce en ligne",
      icon: <Home className="h-6 w-6 text-green-600" />,
      steps: [
        {
          title: "Création du compte",
          description:
            "Inscription via User avec email/mot de passe dans Account, adresse liée à Neighborhood/City",
        },
        {
          title: "Configuration de l'hébergement",
          description:
            "Création HotelCard avec type 'Gîte', prix de base, classement étoiles, liaison aux destinations",
        },
        {
          title: "Détails des chambres",
          description:
            "HotelDetails avec description des 3 chambres, ajout RoomAmenity et Labels",
        },
        {
          title: "Options spécifiques",
          description:
            "HotelAmenity (piscine, jardin) et HotelHighlight (vue montagne)",
        },
      ],
    },
    {
      title: "Voyageur recherche et réserve un hôtel",
      icon: <Search className="h-6 w-6 text-blue-600" />,
      steps: [
        {
          title: "Recherche",
          description:
            "Filtres par Destination, starRating, HotelAmenity, résultats triés par overallRating",
        },
        {
          title: "Sélection",
          description:
            "Consultation HotelImage, HotelHighlight, Label et RoomAmenity dans HotelDetails",
        },
        {
          title: "Réservation",
          description:
            "Choix des dates, calcul prix via basePricePerNight, création réservation",
        },
      ],
    },
    {
      title: "Hôtelier modifie prix et crée promotions",
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      steps: [
        {
          title: "Modification des prix",
          description:
            "Mise à jour basePricePerNight et regularPrice dans HotelCard",
        },
        {
          title: "Promotion",
          description:
            "Ajout promoMessage et HotelHighlight avec isPromoted: true",
        },
        {
          title: "Mise à jour aménités",
          description:
            "Ajout/suppression HotelCardToHotelAmenity (ex: ajout Spa)",
        },
      ],
    },
    {
      title: "Voyageur consulte ses réservations",
      icon: <Calendar className="h-6 w-6 text-orange-600" />,
      steps: [
        {
          title: "Authentification",
          description: "Connexion via Session utilisateur",
        },
        {
          title: "Requête réservations",
          description:
            "Future table Reservation liée à User et HotelCard avec dates, prix, statut",
        },
        {
          title: "Affichage détaillé",
          description: "HotelCard avec HotelImage et HotelHighlight pertinents",
        },
      ],
    },
  ];

  const improvements = [
    {
      title: "Table Reservation",
      description: "Pour gérer les réservations complètes",
      priority: "Haute",
    },
    {
      title: "Table Review",
      description: "Pour les avis voyageurs liés à User et HotelCard",
      priority: "Haute",
    },
    {
      title: "Champ isAvailable",
      description: "Dans HotelCard pour gérer les fermetures temporaires",
      priority: "Moyenne",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Fonctionnalités FastBooking
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez toutes les fonctionnalités de notre plateforme complète de
          réservation et de gestion d'hébergements touristiques
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card
            key={index}
            className={`${feature.color} transition-transform hover:scale-105`}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                {feature.icon}
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-2 text-sm"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Use Cases Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Cas d'usage typiques
          </CardTitle>
          <CardDescription className="text-center">
            FastBooking s'adapte à de nombreux scénarios d'utilisation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCases.map((useCase, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="p-3 text-center justify-center h-auto text-wrap"
              >
                {useCase}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">
          Scénarios d'utilisation détaillés
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scenarios.map((scenario, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {scenario.icon}
                  <CardTitle className="text-lg">{scenario.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scenario.steps.map((step, stepIndex) => (
                    <div
                      key={stepIndex}
                      className="border-l-2 border-gray-200 pl-4"
                    >
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {stepIndex + 1}. {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Improvements Section */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            <AlertCircle className="h-6 w-6 inline mr-2" />
            Améliorations suggérées
          </CardTitle>
          <CardDescription className="text-center">
            Points à ajouter pour compléter le schéma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {improvements.map((improvement, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{improvement.title}</h4>
                  <Badge
                    variant={
                      improvement.priority === "Haute"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {improvement.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {improvement.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Architecture Highlight */}
      <div className="text-center">
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">
              Architecture technique
            </h3>
            <p className="text-gray-600 max-w-4xl mx-auto">
              Les relations complexes et les nombreuses tables de jointure
              permettent une grande flexibilité dans l'association des
              différentes entités (hôtels, aménités, labels, etc.) tout en
              maintenant un bon niveau de normalisation. Le schéma est
              parfaitement adapté pour une application web/mobile de voyage avec
              à la fois une interface utilisateur riche et un backoffice de
              gestion complet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
