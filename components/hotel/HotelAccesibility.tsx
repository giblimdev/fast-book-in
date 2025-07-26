//@/components/hotel/hotelAcesibility
"use client";
import React, { useState } from "react";

export default function HotelAccessibility() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [hotelAccessibility, setHotelAccessibility] = useState([
    {
      id: 1,
      hotelName: "Hotel Le Grand Paris",
      location: "Paris, France",
      overallRating: 4.5,
      accessibilityOptions: [
        {
          id: "wheel-access",
          name: "Accès en fauteuil roulant",
          category: "Mobilité",
          description:
            "Accès complet en fauteuil roulant dans tout l'établissement",
          icon: "♿",
          available: true,
        },
        {
          id: "elevator",
          name: "Ascenseur adapté",
          category: "Mobilité",
          description: "Ascenseur avec boutons en braille et annonces vocales",
          icon: "🛗",
          available: true,
        },
        {
          id: "visual-aids",
          name: "Aides visuelles",
          category: "Vision",
          description: "Signalétique en braille et contrastes visuels",
          icon: "👁️",
          available: true,
        },
        {
          id: "hearing-aids",
          name: "Aides auditives",
          category: "Audition",
          description: "Boucles magnétiques et alertes visuelles",
          icon: "👂",
          available: false,
        },
      ],
    },
    {
      id: 2,
      hotelName: "Resort Paradise",
      location: "Nice, France",
      overallRating: 4.8,
      accessibilityOptions: [
        {
          id: "beach-access",
          name: "Accès plage adapté",
          category: "Mobilité",
          description: "Chemin d'accès à la plage pour fauteuils roulants",
          icon: "🏖️",
          available: true,
        },
        {
          id: "pool-lift",
          name: "Élévateur piscine",
          category: "Mobilité",
          description: "Système de mise à l'eau adapté",
          icon: "🏊",
          available: true,
        },
        {
          id: "adapted-rooms",
          name: "Chambres adaptées",
          category: "Hébergement",
          description: "Salles de bain et chambres entièrement accessibles",
          icon: "🛏️",
          available: true,
        },
      ],
    },
    {
      id: 3,
      hotelName: "Mountain Lodge",
      location: "Chamonix, France",
      overallRating: 4.2,
      accessibilityOptions: [
        {
          id: "ground-floor",
          name: "Chambres plain-pied",
          category: "Hébergement",
          description: "Chambres accessibles sans escaliers",
          icon: "🏠",
          available: true,
        },
        {
          id: "adapted-parking",
          name: "Parking adapté",
          category: "Mobilité",
          description: "Places de parking réservées et élargies",
          icon: "🚗",
          available: true,
        },
        {
          id: "service-animals",
          name: "Animaux d'assistance",
          category: "Services",
          description: "Accueil des chiens guides et d'assistance",
          icon: "🐕‍🦺",
          available: true,
        },
      ],
    },
  ]);

  const categories = [
    ...new Set(
      hotelAccessibility.flatMap((hotel) =>
        hotel.accessibilityOptions.map((option) => option.category)
      )
    ),
  ];

  const filteredHotels = selectedCategory
    ? hotelAccessibility.filter((hotel) =>
        hotel.accessibilityOptions.some(
          (option) => option.category === selectedCategory
        )
      )
    : hotelAccessibility;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      "★".repeat(fullStars) +
      (hasHalfStar ? "☆" : "") +
      "☆".repeat(5 - Math.ceil(rating))
    );
  };

  return (
    <div className="hotel-accessibility-container">
      <h1>Accessibilité des Hôtels</h1>
      <p>
        Découvrez les options d'accessibilité proposées par nos hôtels
        partenaires
      </p>

      <div className="accessibility-info">
        <div className="info-banner">
          <h3>🌟 Notre engagement pour l'accessibilité</h3>
          <p>
            Nous nous engageons à rendre le voyage accessible à tous. Tous nos
            hôtels partenaires respectent les normes d'accessibilité.
          </p>
        </div>
      </div>

      <div className="category-filter">
        <label htmlFor="category-select">
          Filtrer par type d'accessibilité :
        </label>
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

      <div className="hotels-accessibility-grid">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-accessibility-card">
            <div className="hotel-header">
              <h2>{hotel.hotelName}</h2>
              <div className="hotel-meta">
                <p className="location">📍 {hotel.location}</p>
                <div className="rating">
                  <span className="stars">
                    {renderStars(hotel.overallRating)}
                  </span>
                  <span className="rating-number">({hotel.overallRating})</span>
                </div>
              </div>
            </div>

            <div className="accessibility-options">
              <h3>Options d'accessibilité :</h3>
              <div className="options-grid">
                {hotel.accessibilityOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`option-item ${
                      option.available ? "available" : "unavailable"
                    }`}
                  >
                    <div className="option-header">
                      <span className="option-icon">{option.icon}</span>
                      <h4>{option.name}</h4>
                      <span
                        className={`status ${
                          option.available ? "available" : "unavailable"
                        }`}
                      >
                        {option.available ? "✅" : "❌"}
                      </span>
                    </div>
                    <p className="option-description">{option.description}</p>
                    <span className="option-category">{option.category}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hotel-actions">
              <button className="contact-btn">Contacter l'hôtel</button>
              <button className="book-btn">Réserver</button>
            </div>
          </div>
        ))}
      </div>

      <div className="accessibility-guide">
        <h2>Guide d'accessibilité</h2>
        <div className="guide-grid">
          <div className="guide-item">
            <h3>♿ Mobilité réduite</h3>
            <p>Accès, ascenseurs, rampes, parking adapté</p>
          </div>
          <div className="guide-item">
            <h3>👁️ Déficience visuelle</h3>
            <p>Braille, contrastes, guidage audio</p>
          </div>
          <div className="guide-item">
            <h3>👂 Déficience auditive</h3>
            <p>Boucles magnétiques, alertes visuelles</p>
          </div>
          <div className="guide-item">
            <h3>🛏️ Hébergement</h3>
            <p>Chambres et salles de bain adaptées</p>
          </div>
        </div>
      </div>
    </div>
  );
}
