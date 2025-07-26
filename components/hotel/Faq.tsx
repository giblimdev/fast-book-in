// @/components/hotel/Faq.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Star,
  MessageCircle,
} from "lucide-react";

interface FaqProps {
  hotelId?: string;
}

// Données simulées basées sur le nouveau modèle HotelFAQ
const mockFaqs = [
  {
    id: "1",
    question: "Quels sont les horaires d'arrivée et de départ ?",
    answer:
      "L'enregistrement se fait à partir de 15h00 et le départ avant 11h00. Un départ tardif peut être organisé selon disponibilité.",
    category: "Réservation",
    isPopular: true,
    order: 1,
  },
  {
    id: "2",
    question: "Le petit-déjeuner est-il inclus dans le tarif ?",
    answer:
      "Le petit-déjeuner n'est pas inclus dans le tarif de base. Il peut être ajouté pour 35€ par personne et par jour. Il est servi de 7h à 10h sous forme de buffet.",
    category: "Services",
    isPopular: true,
    order: 2,
  },
  {
    id: "3",
    question: "Y a-t-il un parking disponible ?",
    answer:
      "Oui, nous disposons d'un parking privé sécurisé gratuit pour nos clients avec 50 places de stationnement. Aucune réservation nécessaire.",
    category: "Services",
    isPopular: true,
    order: 3,
  },
  {
    id: "4",
    question: "Les animaux de compagnie sont-ils acceptés ?",
    answer:
      "Malheureusement, nous n'acceptons pas les animaux de compagnie dans notre établissement, à l'exception des chiens d'assistance.",
    category: "Général",
    isPopular: false,
    order: 4,
  },
  {
    id: "5",
    question: "Comment puis-je annuler ma réservation ?",
    answer:
      "L'annulation gratuite est possible jusqu'à 24h avant votre arrivée. Au-delà, des frais équivalents à une nuit seront appliqués. Vous pouvez annuler depuis votre espace client ou en nous contactant.",
    category: "Réservation",
    isPopular: true,
    order: 5,
  },
  {
    id: "6",
    question: "Le WiFi est-il gratuit ?",
    answer:
      "Oui, le WiFi haut débit est gratuit dans tout l'établissement, y compris dans les chambres et les espaces communs.",
    category: "Services",
    isPopular: false,
    order: 6,
  },
  {
    id: "7",
    question: "Proposez-vous un service de navette ?",
    answer:
      "Nous proposons un service de navette gratuit vers l'aéroport sur réservation (selon disponibilité). Le service fonctionne de 6h à 22h.",
    category: "Transport",
    isPopular: false,
    order: 7,
  },
  {
    id: "8",
    question: "Le spa est-il accessible à tous les clients ?",
    answer:
      "Oui, le spa est accessible gratuitement à tous nos clients. Certains soins nécessitent une réservation préalable. Les horaires d'ouverture sont de 9h à 21h.",
    category: "Services",
    isPopular: false,
    order: 8,
  },
];

const FaqItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof mockFaqs)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <Card className="border-l-4 border-l-blue-400 hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <button
          onClick={onToggle}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="p-1 bg-blue-100 rounded-full">
              <HelpCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                {faq.isPopular && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-yellow-100 text-yellow-800"
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Populaire
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs">
                {faq.category}
              </Badge>
            </div>
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
          )}
        </button>

        {isOpen && (
          <div className="px-4 pb-4">
            <div className="pl-7 pr-4">
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function Faq({ hotelId }: FaqProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const categories = [...new Set(mockFaqs.map((faq) => faq.category))];

  const filteredFaqs = mockFaqs
    .filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || faq.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Les populaires en premier, puis par ordre
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return a.order - b.order;
    });

  const popularFaqs = mockFaqs.filter((faq) => faq.isPopular);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Questions Fréquentes
        </h2>
        <p className="text-gray-600">
          Trouvez rapidement les réponses à vos questions les plus courantes
        </p>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher dans les FAQ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Toutes
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ populaires */}
      {!searchTerm && !selectedCategory && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            Questions populaires
          </h3>
          <div className="space-y-3">
            {popularFaqs.slice(0, 3).map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.includes(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Toutes les FAQ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {searchTerm || selectedCategory
              ? "Résultats"
              : "Toutes les questions"}
          </h3>
          <Badge variant="secondary">
            {filteredFaqs.length} question{filteredFaqs.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {filteredFaqs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier votre recherche ou parcourez toutes les
                catégories.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
              >
                Voir toutes les questions
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <FaqItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.includes(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contact pour autres questions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Vous ne trouvez pas la réponse à votre question ?
              </h4>
              <p className="text-gray-700 mb-4">
                Notre équipe est disponible 24h/24 pour répondre à toutes vos
                questions.
              </p>
              <div className="flex gap-2">
                <Button size="sm">Nous contacter</Button>
                <Button variant="outline" size="sm">
                  Chat en direct
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
