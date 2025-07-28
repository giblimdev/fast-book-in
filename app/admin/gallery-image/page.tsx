//@/app/admin/gallery-image/page.tsx

import React from "react";

export default function page() {
  return (
    <div>
      <h1>galery-image</h1>
      <section>
        <h1>DestinationType (admin)</h1>
      </section>
      <section>
        <h1>Country(admin)</h1>
      </section>
      <section>
        <h1>City(admin)</h1>
      </section>
      <section>
        <h1>Landmark(admin)</h1>
      </section>
      <section>
        <h1>Neighborhood(admin)</h1>
      </section>
      <section>HotelCard</section>
      <section>
        <h1>HotelRoomType</h1>
      </section>
    </div>
  );
}
/* 



en accord avec mon schema.
écris cette pas qui gère les image  
dans une première partie affiche l'ensemble de s galleries, utilise api/gallery/routes.ts et api/gallery/[id]/routes.ts
crer le composant GaleryFilter pour selectionner la galery a afficher select by imageCategories :
destinationType, city, country, neighborhood, hotelCard, hotelRoom, landmark.
GaleryListe pour crud une galerie. utilise api/galery/routes.ts et api/galery/[id]/routes.ts
Galeryform pour ajouter/modifier une galery.
si galery.Id existe permttre de crud les photos de la galery. route app/ImageGalery/route.ts 

*/
