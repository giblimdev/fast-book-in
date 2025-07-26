"use client";

import React, { useState } from "react";

export default function HotelParking() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [hotelParkingData, setHotelParkingData] = useState([
    {
      id: 1,
      hotelName: "Hotel Le Grand Paris",
      location: "Paris, France",
      overallRating: 4.5,
      parking: {
        id: "park-001",
        isAvailable: true,
        spaces: 50,
        notes:
          "Parking souterrain sécurisé avec surveillance 24h/24. Accès direct à l'hôtel par ascenseur.",
        pricePerDay: 25,
        features: ["Couvert", "Sécurisé", "Accès handicapé", "Voiturier"],
      },
    },
    {
      id: 2,
      hotelName: "Resort Paradise",
      location: "Nice, France",
      overallRating: 4.8,
      parking: {
        id: "park-002",
        isAvailable: true,
        spaces: 120,
        notes:
          "Grand parking extérieur avec places ombragées. Vue sur mer depuis certaines places.",
        pricePerDay: 15,
        features: ["Extérieur", "Places ombragées", "Gratuit", "Proche plage"],
      },
    },
    {
      id: 3,
      hotelName: "Mountain Lodge",
      location: "Chamonix, France",
      overallRating: 4.2,
      parking: {
        id: "park-003",
        isAvailable: true,
        spaces: 30,
        notes:
          "Parking adapté aux conditions hivernales avec déneigement régulier.",
        pricePerDay: 10,
        features: [
          "Déneigement",
          "Accès skis",
          "Couvert partiel",
          "Bornes électriques",
        ],
      },
    },
    {
      id: 4,
      hotelName: "City Business Hotel",
      location: "Lyon, France",
      overallRating: 4.0,
      parking: {
        id: "park-004",
        isAvailable: false,
        spaces: 0,
        notes:
          "Parking complet. Parkings publics disponibles à 200m de l'hôtel.",
        pricePerDay: 0,
        features: ["Complet", "Alternatives à proximité"],
      },
    },
  ]);

  const filteredHotels =
    selectedFilter === "all"
      ? hotelParkingData
      : selectedFilter === "available"
      ? hotelParkingData.filter((hotel) => hotel.parking.isAvailable)
      : hotelParkingData.filter((hotel) => !hotel.parking.isAvailable);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      "★".repeat(fullStars) +
      (hasHalfStar ? "☆" : "") +
      "☆".repeat(5 - Math.ceil(rating))
    );
  };

  const getParkingStatusColor = (isAvailable: boolean, spaces: number) => {
    if (!isAvailable) return "unavailable";
    if (spaces > 50) return "high-availability";
    if (spaces > 20) return "medium-availability";
    return "low-availability";
  };

  return (
    <div className="hotel-parking-container">
      <h1>Parking des Hôtels</h1>
      <p>
        Informations détaillées sur les solutions de stationnement de nos hôtels
        partenaires
      </p>

      <div className="parking-stats">
        <div className="stat-card">
          <h3>🚗 {hotelParkingData.length}</h3>
          <p>Hôtels recensés</p>
        </div>
        <div className="stat-card">
          <h3>
            ✅ {hotelParkingData.filter((h) => h.parking.isAvailable).length}
          </h3>
          <p>Parkings disponibles</p>
        </div>
        <div className="stat-card">
          <h3>
            🅿️ {hotelParkingData.reduce((sum, h) => sum + h.parking.spaces, 0)}
          </h3>
          <p>Places totales</p>
        </div>
      </div>

      <div className="parking-filter">
        <label htmlFor="availability-select">Filtrer par disponibilité :</label>
        <select
          id="availability-select"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">Tous les hôtels</option>
          <option value="available">Parking disponible</option>
          <option value="unavailable">Parking complet</option>
        </select>
      </div>

      <div className="hotels-parking-grid">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-parking-card">
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

            <div className="parking-info">
              <div
                className={`parking-status ${getParkingStatusColor(
                  hotel.parking.isAvailable,
                  hotel.parking.spaces
                )}`}
              >
                <div className="status-header">
                  <h3>
                    {hotel.parking.isAvailable
                      ? "🅿️ Parking Disponible"
                      : "🚫 Parking Complet"}
                  </h3>
                  <span className="spaces-count">
                    {hotel.parking.spaces > 0
                      ? `${hotel.parking.spaces} places`
                      : "Aucune place"}
                  </span>
                </div>

                {hotel.parking.pricePerDay > 0 && (
                  <div className="pricing">
                    <span className="price">
                      💰 {hotel.parking.pricePerDay}€/jour
                    </span>
                  </div>
                )}

                {hotel.parking.pricePerDay === 0 &&
                  hotel.parking.isAvailable && (
                    <div className="pricing">
                      <span className="free-parking">🆓 Gratuit</span>
                    </div>
                  )}
              </div>

              <div className="parking-features">
                <h4>Caractéristiques :</h4>
                <div className="features-list">
                  {hotel.parking.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="parking-notes">
                <h4>Informations complémentaires :</h4>
                <p>{hotel.parking.notes}</p>
              </div>
            </div>

            <div className="hotel-actions">
              <button className="contact-btn">Contacter l'hôtel</button>
              <button
                className="reserve-btn"
                disabled={!hotel.parking.isAvailable}
              >
                {hotel.parking.isAvailable
                  ? "Réserver une place"
                  : "Parking complet"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="parking-tips">
        <h2>💡 Conseils de stationnement</h2>
        <div className="tips-grid">
          <div className="tip-item">
            <h3>🕐 Réservation anticipée</h3>
            <p>
              Réservez votre place de parking en même temps que votre chambre
              pour garantir la disponibilité.
            </p>
          </div>
          <div className="tip-item">
            <h3>🗺️ Alternatives</h3>
            <p>
              Vérifiez les parkings publics à proximité en cas de complet à
              l'hôtel.
            </p>
          </div>
          <div className="tip-item">
            <h3>⚡ Bornes électriques</h3>
            <p>
              Certains hôtels proposent des bornes de recharge pour véhicules
              électriques.
            </p>
          </div>
          <div className="tip-item">
            <h3>🔒 Sécurité</h3>
            <p>
              Privilégiez les parkings couverts et sécurisés pour vos objets de
              valeur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
