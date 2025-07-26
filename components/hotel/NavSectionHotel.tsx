import Link from "next/link";
import React from "react";

export default function NavSectionHotel() {
  return (
    <div className="flex">
      <Link href="/#">
        <p className="m-2">aperçu (Description)</p>
      </Link>
      <Link href="/#">
        {" "}
        <p className="m-2">Chambres</p>
      </Link>
      <Link href="/#">
        <p className="m-2">Avis Voyageurs</p>
      </Link>
      <Link href="/#">
        <p className="m-2">Service et équipements</p>
      </Link>
      <Link href="/#">
        <p className="m-2">Chambres Condition</p>
      </Link>
      <Link href="/#">
        <p className="m-2">Emplacement</p>
      </Link>
    </div>
  );
}
