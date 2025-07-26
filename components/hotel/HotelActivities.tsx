"use client";
import React, { useState } from "react";

export default function HotelActivities() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activities, setActivities] = useState([
    {
      id: 1,
      hotelName: "Hotel Le Grand Paris",
      location: "Paris, France",
      category: "Culture",
      activities: [
        {
          name: "Visite guidée du Louvre",
          duration: "3h",
          price: "€45",
          description: "Découverte des œuvres majeures avec guide expert",
        },
        {
          name: "Croisière sur la Seine",
          duration: "1h30",
          price: "€25",
          description: "Vue panoramique sur les monuments parisiens",
        },
        {
          name: "Tour Eiffel et Champs-Élysées",
          duration: "4h",
          price: "€65",
          description: "Visite des sites emblématiques de Paris",
        },
      ],
    },
    {
      id: 2,
      hotelName: "Resort Paradise",
      location: "Nice, France",
      category: "Détente",
      activities: [
        {
          name: "Spa et massage",
          duration: "2h",
          price: "€80",
          description: "Moment de relaxation avec vue sur la mer",
        },
        {
          name: "Plongée sous-marine",
          duration: "3h",
          price: "€120",
          description: "Exploration des fonds marins méditerranéens",
        },
        {
          name: "Cours de cuisine provençale",
          duration: "2h30",
          price: "€90",
          description: "Apprenez les secrets de la cuisine locale",
        },
      ],
    },
    {
      id: 3,
      hotelName: "Mountain Lodge",
      location: "Chamonix, France",
      category: "Aventure",
      activities: [
        {
          name: "Randonnée Mont-Blanc",
          duration: "6h",
          price: "€55",
          description: "Trek avec guide professionnel en montagne",
        },
        {
          name: "Ski alpin",
          duration: "Journée",
          price: "€75",
          description: "Location matériel et forfait remontées inclus",
        },
        {
          name: "Via ferrata",
          duration: "4h",
          price: "€85",
          description: "Parcours d'escalade sécurisé avec équipement",
        },
      ],
    },
  ]);

  const categories = [...new Set(activities.map((hotel) => hotel.category))];

  const filteredActivities = selectedCategory
    ? activities.filter((hotel) => hotel.category === selectedCategory)
    : activities;

  return (
    <div className="hotel-activities-container">
      <h1>Activités Hôtelières</h1>
      <p>Découvrez les activités proposées par nos hôtels partenaires</p>

      <div className="category-filter">
        <label htmlFor="category-select">Filtrer par catégorie :</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-dropdown"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="hotels-activities-grid">
        {filteredActivities.map((hotel) => (
          <div key={hotel.id} className="hotel-activities-card">
            <div className="hotel-info">
              <h2>{hotel.hotelName}</h2>
              <p className="location">📍 {hotel.location}</p>
              <span className="category-badge">{hotel.category}</span>
            </div>

            <div className="activities-list">
              <h3>Activités disponibles :</h3>
              {hotel.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-header">
                    <h4>{activity.name}</h4>
                    <div className="activity-meta">
                      <span className="duration">⏱️ {activity.duration}</span>
                      <span className="price">💰 {activity.price}</span>
                    </div>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  <button className="book-activity-btn">Réserver</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="popular-activities">
        <h2>Activités les plus populaires</h2>
        <div className="popular-grid">
          <div className="popular-item">🏛️ Visites culturelles</div>
          <div className="popular-item">🏖️ Activités nautiques</div>
          <div className="popular-item">🏔️ Sports de montagne</div>
          <div className="popular-item">🍷 Dégustations</div>
        </div>
      </div>
    </div>
  );
}
