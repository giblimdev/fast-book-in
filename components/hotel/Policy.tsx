// @/components/hotel/Policy.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Users,
  Baby,
  PawPrint,
  Cigarette,
  PartyPopper,
  Bed,
  Coffee,
} from "lucide-react";

interface PolicyProps {
  hotelId?: string;
}

// Données simulées basées sur le nouveau modèle HotelPolicy
const mockPolicy = {
  id: "1",
  checkIn: "15:00",
  checkOut: "11:00",
  cancellation:
    "Annulation gratuite jusqu'à 24h avant l'arrivée. Au-delà, une nuit sera facturée.",
  pets: false,
  smoking: false,
  parties: false,
  children:
    "Les enfants de moins de 12 ans séjournent gratuitement dans un lit existant.",
  extraBed: "Lit d'appoint disponible sur demande (25€/nuit).",
  breakfast: "Petit-déjeuner buffet servi de 7h à 10h (35€/personne).",
  additionalPolicies: [
    {
      title: "Politique d'âge",
      description: "L'âge minimum pour l'enregistrement est de 18 ans.",
      icon: "users",
      type: "info",
    },
    {
      title: "Cartes de crédit acceptées",
      description: "Visa, Mastercard, American Express",
      icon: "credit-card",
      type: "info",
    },
    {
      title: "Dépôt de garantie",
      description:
        "Un dépôt de garantie de 200€ peut être demandé à l'arrivée.",
      icon: "shield",
      type: "warning",
    },
    {
      title: "Politique COVID-19",
      description: "Des mesures sanitaires renforcées sont en place.",
      icon: "alert",
      type: "info",
    },
  ],
};

const PolicyItem = ({
  icon,
  title,
  description,
  allowed,
  type = "info",
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  allowed?: boolean;
  type?: "info" | "success" | "warning" | "error";
}) => {
  const getBgColor = () => {
    if (allowed !== undefined) {
      return allowed
        ? "bg-green-50 border-green-200"
        : "bg-red-50 border-red-200";
    }
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  const getIconColor = () => {
    if (allowed !== undefined) {
      return allowed
        ? "text-green-600 bg-green-100"
        : "text-red-600 bg-red-100";
    }
    switch (type) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className={`p-4 border rounded-lg ${getBgColor()}`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg flex-shrink-0 ${getIconColor()}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {allowed !== undefined && (
              <Badge
                variant={allowed ? "default" : "destructive"}
                className="text-xs"
              >
                {allowed ? "Autorisé" : "Interdit"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function Policy({ hotelId }: PolicyProps) {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Conditions et Règlements
        </h2>
        <p className="text-gray-600">
          Informations importantes concernant votre séjour
        </p>
      </div>

      {/* Horaires d'arrivée et départ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Horaires d'enregistrement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Arrivée</h4>
                <p className="text-lg font-bold text-green-600">
                  À partir de {mockPolicy.checkIn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <XCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Départ</h4>
                <p className="text-lg font-bold text-blue-600">
                  Avant {mockPolicy.checkOut}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Politique d'annulation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            Politique d'annulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-gray-700">{mockPolicy.cancellation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Règles de l'établissement */}
      <Card>
        <CardHeader>
          <CardTitle>Règles de l'établissement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <PolicyItem
              icon={<PawPrint className="w-5 h-5" />}
              title="Animaux de compagnie"
              description="Les animaux ne sont pas autorisés dans l'établissement."
              allowed={mockPolicy.pets}
            />

            <PolicyItem
              icon={<Cigarette className="w-5 h-5" />}
              title="Interdiction de fumer"
              description="Il est interdit de fumer dans tout l'établissement."
              allowed={mockPolicy.smoking}
            />

            <PolicyItem
              icon={<PartyPopper className="w-5 h-5" />}
              title="Fêtes et événements"
              description="Les fêtes et événements ne sont pas autorisés."
              allowed={mockPolicy.parties}
            />

            <PolicyItem
              icon={<Users className="w-5 h-5" />}
              title="Politique d'âge"
              description="L'âge minimum pour l'enregistrement est de 18 ans."
              type="info"
            />
          </div>
        </CardContent>
      </Card>

      {/* Informations sur les enfants et lits supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-blue-600" />
            Enfants et lits supplémentaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PolicyItem
              icon={<Baby className="w-5 h-5" />}
              title="Politique enfants"
              description={mockPolicy.children}
              type="success"
            />

            <PolicyItem
              icon={<Bed className="w-5 h-5" />}
              title="Lits d'appoint"
              description={mockPolicy.extraBed}
              type="info"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services additionnels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-blue-600" />
            Services et suppléments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PolicyItem
            icon={<Coffee className="w-5 h-5" />}
            title="Petit-déjeuner"
            description={mockPolicy.breakfast}
            type="info"
          />
        </CardContent>
      </Card>

      {/* Informations supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Informations supplémentaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mockPolicy.additionalPolicies.map((policy, index) => (
              <PolicyItem
                key={index}
                icon={<AlertTriangle className="w-5 h-5" />}
                title={policy.title}
                description={policy.description}
                type={policy.type as any}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
