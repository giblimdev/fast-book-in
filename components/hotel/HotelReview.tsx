"use client";
import React, { useState } from "react";

export default function HotelReview() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      hotelName: "Hotel Example",
      rating: 4,
      author: "Jean Dupont",
      date: "2024-07-15",
      comment:
        "Excellent séjour, personnel très accueillant et chambre confortable.",
      location: "Paris, France",
    },
    {
      id: 2,
      hotelName: "Resort Paradise",
      rating: 5,
      author: "Marie Martin",
      date: "2024-07-10",
      comment: "Vue magnifique, service impeccable. Je recommande vivement !",
      location: "Nice, France",
    },
  ]);

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="hotel-review-container">
      <h1>Avis sur les Hôtels</h1>
      <p>Découvrez les avis de nos voyageurs sur leurs hébergements</p>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <h3>{review.hotelName}</h3>
              <div className="rating">
                <span className="stars">{renderStars(review.rating)}</span>
                <span className="rating-number">({review.rating}/5)</span>
              </div>
            </div>

            <div className="review-meta">
              <span className="author">Par {review.author}</span>
              <span className="date">
                Le {new Date(review.date).toLocaleDateString("fr-FR")}
              </span>
              <span className="location">📍 {review.location}</span>
            </div>

            <p className="review-comment">{review.comment}</p>
          </div>
        ))}
      </div>

      <div className="add-review-section">
        <h2>Ajouter votre avis</h2>
        <button className="add-review-btn">Écrire un avis</button>
      </div>
    </div>
  );
}
