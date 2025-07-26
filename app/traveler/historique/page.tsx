import BackHome from "@/components/ui/BackHome";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function HistoryPage() {
  return (
    <div className="p-4">
      <p>
        Depuis la page d'accueil ("/") et le composant
        @/components/landing/HistoriqueNav.tsx, vous êtes arrivé sur cette page.
      </p>
      <p className="my-2">
        Cette page sera utilisée pour afficher l'historique des recherches.
      </p>
      <p className="my-2">Veillez à implémenter :</p>
      <ul className="list-disc pl-5">
        <li>Une table pour enregistrer l'historique de navigation</li>
        <li>Les routes API nécessaires</li>
        <li>Les déclencheurs appropriés pour mettre à jour l'historique</li>
      </ul>
      <BackHome />
    </div>
  );
}
