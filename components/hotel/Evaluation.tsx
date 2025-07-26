// @/components/hotel/Evaluation.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, TrendingUp, Award, Users } from "lucide-react";

interface EvaluationProps {
  hotelId?: string;
}

// Données simulées basées sur votre schéma
const mockEvaluation = {
  overallRating: 4.8,
  reviewCount: 1247,
  ratingAdjective: "Exceptionnel",
  starRating: 5,
  ratingBreakdown: {
    5: 78,
    4: 15,
    3: 5,
    2: 1,
    1: 1,
  },
  categoryRatings: [
    { category: "Propreté", rating: 4.9, icon: "✨" },
    { category: "Service", rating: 4.8, icon: "🏨" },
    { category: "Emplacement", rating: 4.7, icon: "📍" },
    { category: "Confort", rating: 4.8, icon: "🛏️" },
    { category: "Rapport qualité/prix", rating: 4.6, icon: "💰" },
    { category: "WiFi", rating: 4.9, icon: "📶" },
  ],
  recentTrend: "+0.2",
  competitorComparison: {
    betterThan: 92,
    category: "Hôtels 5 étoiles de la région",
  },
};

export default function Evaluation({ hotelId }: EvaluationProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-100";
    if (rating >= 4.0) return "text-blue-600 bg-blue-100";
    if (rating >= 3.5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Exceptionnel";
    if (rating >= 4.0) return "Très bien";
    if (rating >= 3.5) return "Bien";
    if (rating >= 3.0) return "Correct";
    return "À améliorer";
  };

  return (
    <div className="space-y-6">
      {/* Note globale */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Notes de l'hôtel
              </h2>
              <p className="text-gray-600">
                Basé sur {mockEvaluation.reviewCount.toLocaleString()} avis
                clients
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(mockEvaluation.starRating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="text-sm text-gray-500">
                  ({mockEvaluation.starRating} étoiles)
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Score principal */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center w-24 h-24 mb-4">
                <svg
                  className="w-24 h-24 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${
                      (mockEvaluation.overallRating / 5) * 251.2
                    } 251.2`}
                    className="text-blue-600"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {mockEvaluation.overallRating}
                  </span>
                </div>
              </div>

              <Badge
                className={`${getRatingColor(
                  mockEvaluation.overallRating
                )} px-3 py-1 text-sm font-semibold`}
              >
                {mockEvaluation.ratingAdjective}
              </Badge>

              {mockEvaluation.recentTrend && (
                <div className="flex items-center justify-center gap-1 mt-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {mockEvaluation.recentTrend} ce mois
                  </span>
                </div>
              )}
            </div>

            {/* Répartition des notes */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Répartition des notes
              </h4>
              <div className="space-y-2">
                {Object.entries(mockEvaluation.ratingBreakdown)
                  .reverse()
                  .map(([star, percentage]) => (
                    <div key={star} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-8">
                        <span className="text-sm text-gray-600">{star}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <Progress
                        value={percentage as number}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Comparaison */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Performance</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Award className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      Meilleur que{" "}
                      {mockEvaluation.competitorComparison.betterThan}%
                    </div>
                    <div className="text-xs text-green-600">
                      {mockEvaluation.competitorComparison.category}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-blue-800">
                      {mockEvaluation.reviewCount.toLocaleString()} avis
                    </div>
                    <div className="text-xs text-blue-600">
                      Volume d'avis élevé
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Notes détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {mockEvaluation.categoryRatings.map((category) => (
              <div
                key={category.category}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-900">
                    {category.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">
                    {category.rating}
                  </span>
                  <Badge
                    className={`${getRatingColor(
                      category.rating
                    )} text-xs px-2 py-1`}
                  >
                    {getRatingText(category.rating)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
