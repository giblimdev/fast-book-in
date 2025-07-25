"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Zap, Handshake, BadgeDollarSign } from "lucide-react"; // Lucide icons

const avantages = [
  {
    titre: "Expertise reconnue",
    description: "Notre équipe possède des années d'expérience dans le domaine, garantissant des solutions innovantes et fiables.",
    icon: <Lightbulb className="w-8 h-8 text-blue-600" />,
  },
  {
    titre: "Support réactif",
    description: "Nous sommes disponibles 7j/7 pour répondre à vos questions et vous accompagner à chaque étape.",
    icon: <Zap className="w-8 h-8 text-blue-600" />,
  },
  {
    titre: "Satisfaction garantie",
    description: "Votre satisfaction est notre priorité. Nous nous engageons à dépasser vos attentes à chaque projet.",
    icon: <Handshake className="w-8 h-8 text-blue-600" />,
  },
  {
    titre: "Tarifs transparents",
    description: "Pas de frais cachés, nos offres sont claires et adaptées à vos besoins.",
    icon: <BadgeDollarSign className="w-8 h-8 text-blue-600" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 via-white to-white pt-25
     pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-blue-700 mb-10">
        Réservez l’esprit libre, profitez pleinement&nbsp;?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {avantages.map((avantage, idx) => (
            <Card
              key={idx}
              className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl transition-shadow hover:shadow-2xl"
            >
              <CardContent className="flex flex-col items-center py-10 px-4">
                <span className="mb-4">{avantage.icon}</span>
                <h3 className="font-bold text-lg mb-2 text-blue-800">{avantage.titre}</h3>
                <p className="text-gray-500 text-base">{avantage.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
