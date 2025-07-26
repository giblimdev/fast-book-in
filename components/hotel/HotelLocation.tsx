"use client";
import React, { useState } from "react";

export default function HotelLocation() {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [hotels, setHotels] = useState([
    {
      id: 1,
      name: "Hotel Le Grand Paris",
      location: "Paris, France",
      address: "123 Rue de Rivoli, 75001 Paris",
      coordinates: { lat: 48.8566, lng: 2.3522 },
      rating: 4.5,
      price: "€120/nuit",
      amenities: ["WiFi", "Climatisation", "Petit-déjeuner", "Parking"],
    },
    {
      id: 2,
      name: "Resort Paradise",
      location: "Nice, France",
      address: "456 Promenade des Anglais, 06000 Nice",
      coordinates: { lat: 43.7102, lng: 7.262 },
      rating: 4.8,
      price: "€180/nuit",
      amenities: ["Piscine", "Spa", "Vue mer", "Restaurant"],
    },
    {
      id: 3,
      name: "Mountain Lodge",
      location: "Chamonix, France",
      address: "789 Route du Mont-Blanc, 74400 Chamonix",
      coordinates: { lat: 45.9237, lng: 6.8694 },
      rating: 4.2,
      price: "€95/nuit",
      amenities: ["Ski", "Cheminée", "Sauna", "Randonnée"],
    },
  ]);

  const locations = [...new Set(hotels.map((hotel) => hotel.location))];

  const filteredHotels = selectedLocation
    ? hotels.filter((hotel) => hotel.location === selectedLocation)
    : hotels;

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
    <div className="hotel-location-container">
      <h1>Localisation des Hôtels</h1>
      <p>Trouvez les meilleurs hôtels par destination</p>

      <div className="location-filter">
        <label htmlFor="location-select">Filtrer par destination :</label>
        <select
          id="location-select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="location-dropdown"
        >
          <option value="">Toutes les destinations</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className="hotels-grid">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="hotel-header">
              <h3>{hotel.name}</h3>
              <div className="hotel-rating">
                <span className="stars">{renderStars(hotel.rating)}</span>
                <span className="rating-number">({hotel.rating})</span>
              </div>
            </div>

            <div className="hotel-location-info">
              <p className="location">📍 {hotel.location}</p>
              <p className="address">{hotel.address}</p>
              <p className="price">💰 {hotel.price}</p>
            </div>

            <div className="amenities">
              <h4>Équipements :</h4>
              <div className="amenities-list">
                {hotel.amenities.map((amenity, index) => (
                  <span key={index} className="amenity-tag">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="hotel-actions">
              <button className="view-map-btn">Voir sur la carte</button>
              <button className="book-btn">Réserver</button>
            </div>
          </div>
        ))}
      </div>

      <div className="map-placeholder">
        <h3>Carte interactive</h3>
        <p>Intégration Google Maps ou Leaflet à venir...</p>
      </div>
    </div>
  );
}
