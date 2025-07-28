// app/documentation/page.tsx
import React from "react";

const DatabaseDocumentation = () => {
  const models = [
    {
      name: "User",
      description: "Table des utilisateurs du système",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "clp7q8p9q0000q9q9q9q9q9q9",
        },
        {
          name: "name",
          type: "String",
          description: "Nom complet",
          example: "Jean Dupont",
        },
        {
          name: "email",
          type: "String",
          description: "Email unique",
          example: "jean.dupont@example.com",
        },
        {
          name: "emailVerified",
          type: "Boolean",
          description: "Email vérifié",
          example: "true",
        },
        {
          name: "image",
          type: "String",
          description: "URL de la photo de profil",
          example: "https://example.com/avatar.jpg",
        },
        {
          name: "firstName",
          type: "String",
          description: "Prénom",
          example: "Jean",
        },
        {
          name: "lastName",
          type: "String",
          description: "Nom de famille",
          example: "Dupont",
        },
        {
          name: "role",
          type: "String",
          description: "Rôle (guest, user, admin)",
          example: "user",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T15:30:00Z",
        },
      ],
    },
    {
      name: "Session",
      description: "Sessions utilisateur actives",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "clp7q8p9q0001q9q9q9q9q9q9",
        },
        {
          name: "userId",
          type: "String",
          description: "ID de l'utilisateur",
          example: "clp7q8p9q0000q9q9q9q9q9q9",
        },
        {
          name: "token",
          type: "String",
          description: "Token de session unique",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        },
        {
          name: "expiresAt",
          type: "DateTime",
          description: "Date d'expiration",
          example: "2023-12-15T10:00:00Z",
        },
        {
          name: "ipAddress",
          type: "String",
          description: "Adresse IP",
          example: "192.168.1.1",
        },
        {
          name: "userAgent",
          type: "String",
          description: "Navigateur utilisateur",
          example: "Mozilla/5.0 (Windows NT 10.0)",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-15T10:05:00Z",
        },
      ],
    },
    {
      name: "Account",
      description: "Comptes liés aux utilisateurs",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "clp7q8p9q0002q9q9q9q9q9q9",
        },
        {
          name: "userId",
          type: "String",
          description: "ID de l'utilisateur",
          example: "clp7q8p9q0000q9q9q9q9q9q9",
        },
        {
          name: "accountId",
          type: "String",
          description: "ID du compte fournisseur",
          example: "123456789",
        },
        {
          name: "providerId",
          type: "String",
          description: "ID du fournisseur (google, facebook)",
          example: "google",
        },
        {
          name: "accessToken",
          type: "String",
          description: "Token d'accès",
          example: "ya29.a0AfB_by...",
        },
        {
          name: "refreshToken",
          type: "String",
          description: "Token de rafraîchissement",
          example: "1//03d...",
        },
        {
          name: "idToken",
          type: "String",
          description: "Token ID",
          example: "eyJhbGciOiJSUzI1NiIsIm...",
        },
        {
          name: "accessTokenExpiresAt",
          type: "DateTime",
          description: "Expiration du token",
          example: "2023-12-15T10:00:00Z",
        },
        {
          name: "refreshTokenExpiresAt",
          type: "DateTime",
          description: "Expiration du refresh token",
          example: "2024-01-15T10:00:00Z",
        },
        {
          name: "scope",
          type: "String",
          description: "Scope OAuth",
          example: "openid profile email",
        },
        {
          name: "password",
          type: "String",
          description: "Mot de passe hashé",
          example: "$2a$10$N9qo8uLOickg...",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T11:20:00Z",
        },
      ],
    },
    {
      name: "Country",
      description: "Pays disponibles",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "name",
          type: "String",
          description: "Nom du pays",
          example: "France",
        },
        {
          name: "order",
          type: "Int",
          description: "Ordre d'affichage",
          example: "1",
        },
        {
          name: "code",
          type: "String",
          description: "Code pays (ISO)",
          example: "FR",
        },
        {
          name: "language",
          type: "String",
          description: "Langue principale",
          example: "fr",
        },
        {
          name: "currency",
          type: "String",
          description: "Devise",
          example: "EUR",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T11:20:00Z",
        },
      ],
    },
    {
      name: "City",
      description: "Villes disponibles",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p2",
        },
        {
          name: "name",
          type: "String",
          description: "Nom de la ville",
          example: "Paris",
        },
        {
          name: "order",
          type: "Int",
          description: "Ordre d'affichage",
          example: "1",
        },
        {
          name: "countryId",
          type: "String",
          description: "ID du pays",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T11:20:00Z",
        },
      ],
    },
    {
      name: "HotelCard",
      description: "Fiche hôtel principale",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "h1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "name",
          type: "String",
          description: "Nom de l'hôtel",
          example: "Hôtel Plaza Athénée",
        },
        {
          name: "idCity",
          type: "String",
          description: "ID de la ville",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p2",
        },
        {
          name: "order",
          type: "Int",
          description: "Ordre d'affichage",
          example: "5",
        },
        {
          name: "shortDescription",
          type: "String",
          description: "Description courte",
          example: "Hôtel de luxe sur l'avenue Montaigne",
        },
        {
          name: "starRating",
          type: "Int",
          description: "Nombre d'étoiles",
          example: "5",
        },
        {
          name: "overallRating",
          type: "Float",
          description: "Note moyenne",
          example: "4.8",
        },
        {
          name: "ratingAdjective",
          type: "String",
          description: "Adjectif de notation",
          example: "Exceptionnel",
        },
        {
          name: "reviewCount",
          type: "Int",
          description: "Nombre d'avis",
          example: "1245",
        },
        {
          name: "basePricePerNight",
          type: "Float",
          description: "Prix de base par nuit",
          example: "450.00",
        },
        {
          name: "regularPrice",
          type: "Float",
          description: "Prix régulier",
          example: "500.00",
        },
        {
          name: "currency",
          type: "String",
          description: "Devise",
          example: "EUR",
        },
        {
          name: "isPartner",
          type: "Boolean",
          description: "Partenaire privilégié",
          example: "true",
        },
        {
          name: "promoMessage",
          type: "String",
          description: "Message promotionnel",
          example: "Offre spéciale -25%",
        },
        {
          name: "imageMessage",
          type: "String",
          description: "Message sur l'image",
          example: "Meilleur hôtel 2023",
        },
        {
          name: "cancellationPolicy",
          type: "String",
          description: "Politique d'annulation",
          example: "Annulation gratuite 48h avant",
        },
        {
          name: "accommodationTypeId",
          type: "String",
          description: "Type d'hébergement",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p3",
        },
        {
          name: "destinationId",
          type: "String",
          description: "ID de destination",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p4",
        },
        {
          name: "hotelGroupId",
          type: "String",
          description: "ID du groupe hôtelier",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p5",
        },
        {
          name: "detailsId",
          type: "String",
          description: "ID des détails",
          example: "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6",
        },
        {
          name: "latitude",
          type: "Float",
          description: "Coordonnée GPS latitude",
          example: "48.865633",
        },
        {
          name: "longitude",
          type: "Float",
          description: "Coordonnée GPS longitude",
          example: "2.321236",
        },
      ],
    },
    {
      name: "HotelRoom",
      description: "Chambres d'hôtel",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "r1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "hotelCardId",
          type: "String",
          description: "ID de l'hôtel",
          example: "h1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "name",
          type: "String",
          description: "Nom de la chambre",
          example: "Suite Deluxe",
        },
        {
          name: "description",
          type: "String",
          description: "Description",
          example: "Suite spacieuse avec vue sur la tour Eiffel",
        },
        {
          name: "maxGuests",
          type: "Int",
          description: "Nombre max d'invités",
          example: "3",
        },
        {
          name: "bedCount",
          type: "Int",
          description: "Nombre de lits",
          example: "2",
        },
        {
          name: "bedType",
          type: "String",
          description: "Type de lit",
          example: "King Size",
        },
        {
          name: "roomSize",
          type: "Float",
          description: "Taille en m²",
          example: "45.5",
        },
        {
          name: "pricePerNight",
          type: "Float",
          description: "Prix par nuit",
          example: "650.00",
        },
        {
          name: "currency",
          type: "String",
          description: "Devise",
          example: "EUR",
        },
        {
          name: "isAvailable",
          type: "Boolean",
          description: "Disponibilité",
          example: "true",
        },
        {
          name: "images",
          type: "String[]",
          description: "URLs des images",
          example: '["img1.jpg", "img2.jpg"]',
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T11:20:00Z",
        },
      ],
    },
    {
      name: "Reservation",
      description: "Réservations des utilisateurs",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "res1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "userId",
          type: "String",
          description: "ID utilisateur",
          example: "clp7q8p9q0000q9q9q9q9q9q9",
        },
        {
          name: "hotelRoomId",
          type: "String",
          description: "ID de la chambre",
          example: "r1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "checkIn",
          type: "DateTime",
          description: "Date d'arrivée",
          example: "2023-12-20T15:00:00Z",
        },
        {
          name: "checkOut",
          type: "DateTime",
          description: "Date de départ",
          example: "2023-12-25T11:00:00Z",
        },
        {
          name: "guests",
          type: "Int",
          description: "Nombre total d'invités",
          example: "2",
        },
        {
          name: "adults",
          type: "Int",
          description: "Nombre d'adultes",
          example: "2",
        },
        {
          name: "children",
          type: "Int",
          description: "Nombre d'enfants",
          example: "0",
        },
        {
          name: "infants",
          type: "Int",
          description: "Nombre de bébés",
          example: "0",
        },
        {
          name: "totalPrice",
          type: "Float",
          description: "Prix total",
          example: "3250.00",
        },
        {
          name: "basePrice",
          type: "Float",
          description: "Prix de base",
          example: "3000.00",
        },
        {
          name: "taxes",
          type: "Float",
          description: "Montant des taxes",
          example: "250.00",
        },
        {
          name: "status",
          type: "String",
          description: "Statut (confirmed, cancelled)",
          example: "confirmed",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T11:20:00Z",
        },
        {
          name: "cancellationReason",
          type: "String",
          description: "Raison d'annulation",
          example: "Changement de plans",
        },
        {
          name: "cancellationDate",
          type: "DateTime",
          description: "Date d'annulation",
          example: "2023-12-18T09:15:00Z",
        },
        {
          name: "specialRequests",
          type: "String",
          description: "Demandes spéciales",
          example: "Lit bébé nécessaire",
        },
        {
          name: "paymentStatus",
          type: "String",
          description: "Statut paiement",
          example: "paid",
        },
        {
          name: "paymentMethod",
          type: "String",
          description: "Méthode de paiement",
          example: "credit_card",
        },
        {
          name: "transactionId",
          type: "String",
          description: "ID de transaction",
          example: "txn_1OABCDEFGHIJK",
        },
        {
          name: "cancellationPolicyId",
          type: "String",
          description: "ID politique annulation",
          example: "cp1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
      ],
    },
    {
      name: "TravelerLoyalty",
      description: "Programme de fidélité des voyageurs",
      fields: [
        {
          name: "id",
          type: "String",
          description: "Identifiant unique",
          example: "loy1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p1",
        },
        {
          name: "userId",
          type: "String",
          description: "ID utilisateur",
          example: "clp7q8p9q0000q9q9q9q9q9q9",
        },
        {
          name: "points",
          type: "Int",
          description: "Points de fidélité",
          example: "1250",
        },
        {
          name: "tier",
          type: "String",
          description: "Niveau (basic, silver, gold)",
          example: "silver",
        },
        {
          name: "membershipNumber",
          type: "String",
          description: "Numéro de membre",
          example: "M123456789",
        },
        {
          name: "joinDate",
          type: "DateTime",
          description: "Date d'adhésion",
          example: "2023-01-15T00:00:00Z",
        },
        {
          name: "lastActivity",
          type: "DateTime",
          description: "Dernière activité",
          example: "2023-11-15T10:00:00Z",
        },
        {
          name: "expiryDate",
          type: "DateTime",
          description: "Date d'expiration",
          example: "2024-01-15T00:00:00Z",
        },
        {
          name: "lifetimePoints",
          type: "Int",
          description: "Points cumulés",
          example: "3250",
        },
        {
          name: "newsletterOptIn",
          type: "Boolean",
          description: "Abonnement newsletter",
          example: "true",
        },
        {
          name: "partnerOffersOptIn",
          type: "Boolean",
          description: "Offres partenaires",
          example: "false",
        },
        {
          name: "totalStays",
          type: "Int",
          description: "Nombre de séjours",
          example: "8",
        },
        {
          name: "totalNights",
          type: "Int",
          description: "Nombre de nuits",
          example: "22",
        },
        {
          name: "totalSpent",
          type: "Float",
          description: "Montant total dépensé",
          example: "4500.00",
        },
        {
          name: "createdAt",
          type: "DateTime",
          description: "Date de création",
          example: "2023-01-15T00:00:00Z",
        },
        {
          name: "updatedAt",
          type: "DateTime",
          description: "Date de mise à jour",
          example: "2023-11-16T11:20:00Z",
        },
      ],
    },
    // Ajoutez ici toutes les autres tables avec le même format
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Documentation du Schéma de Base de Données
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Documentation complète de toutes les tables et champs de
            l'application
          </p>
        </div>

        <div className="space-y-12">
          {models.map((model) => (
            <div
              key={model.name}
              className="bg-white shadow overflow-hidden rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 bg-indigo-600">
                <h2 className="text-lg font-medium text-white">
                  Table: {model.name}
                </h2>
                <p className="mt-1 text-sm text-indigo-100">
                  {model.description}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Champ
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Exemple
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {model.fields.map((field) => (
                        <tr key={field.name}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {field.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {field.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {field.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">
                              {field.example}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Documentation générée le {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseDocumentation;
