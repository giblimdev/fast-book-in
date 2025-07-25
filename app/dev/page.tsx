import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      daschboard de developpement
      <p>Bienvenue sur la page de développement !</p>
      <Link href="/dev/features">Feature</Link>
    </div>
  );
}
