import React from "react";

const steps = [
  {
    title: "Landing page",
    path: "app/demo/page.jsx",
    description: "Accueil et présentation de la solution de réservation.",
  },
  {
    title: "Sélection de votre hôtel",
    path: "app/demo/findedHotel/page.tsx",
    description: "Choisissez l'hôtel qui correspond à vos besoins.",
  },
  {
    title: "Sélection de votre chambre",
    path: "app/demo/findYourRoom/page.tsx",
    description: "Parcourez les chambres disponibles et faites votre choix.",
  },
  {
    title: "Ajout d'options",
    path: "",
    description: "Ajoutez des services ou options supplémentaires.",
  },
  {
    title: "Formulaire d'inscription",
    path: "",
    description:
      "Saisissez vos informations pour créer ou compléter votre compte.",
  },
  {
    title: "Vérification et paiement",
    path: "",
    description: "Vérifiez votre réservation et procédez au paiement sécurisé.",
  },
  {
    title: "Confirmation",
    path: "",
    description: "Recevez la confirmation de votre réservation.",
  },
];

export default function RodmapResa() {
  return (
    <section className="max-w-2xl mx-auto p-6 bg-purple-400">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Roadmap du parcours de réservation
      </h1>
      <ol className="relative border-l border-blue-200">
        {steps.map((step, idx) => (
          <li key={idx} className="mb-10 ml-6">
            <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
              <span className="text-blue-600 font-bold">{idx + 1}</span>
            </span>
            <h3 className="flex items-center mb-1 text-lg font-semibold text-blue-800">
              {step.title}
              {step.path && (
                <span className="ml-2 text-xs bg-blue-50 text-blue-500 rounded px-2 py-0.5">
                  {step.path}
                </span>
              )}
            </h3>
            <p className="text-gray-600">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
