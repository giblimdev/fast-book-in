import Link from "next/link";
import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

export default function BackHome() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
