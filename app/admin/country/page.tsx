// @/app/admin/country/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, MapPin } from "lucide-react";
import CountryForm from "@/components/admin/CountryForm";

interface Country {
  id: string;
  name: string;
  order: number;
  code: string;
  language: string | null;
  currency: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    cities: number;
  };
}

interface CountryFormData {
  name: string;
  code: string;
  language: string;
  currency: string;
  order: number;
}

export default function CountryPage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Charger les pays
  const fetchCountries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/country");
      if (!response.ok) throw new Error("Erreur lors du chargement");
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  // Filtrer les pays
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (formData: CountryFormData) => {
    setFormLoading(true);

    try {
      const url = editingCountry
        ? `/api/country/${editingCountry.id}`
        : "/api/country";

      const method = editingCountry ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      await fetchCountries();
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setFormLoading(false);
    }
  };

  // Supprimer un pays
  const handleDelete = async (id: string) => {
    const country = countries.find((c) => c.id === id);
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${country?.name}" ?`))
      return;

    try {
      const response = await fetch(`/api/country/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression");
      }

      await fetchCountries();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  // Ouvrir le formulaire pour modification
  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setShowForm(true);
    setError(null);
  };

  // Ouvrir le formulaire pour ajout
  const handleAdd = () => {
    setEditingCountry(null);
    setShowForm(true);
    setError(null);
  };

  // Fermer le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCountry(null);
    setError(null);
  };

  if (showForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <CountryForm
            country={editingCountry}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseForm}
            isLoading={formLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Pays</h1>
          <p className="text-gray-600">{countries.length} pays enregistrés</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un pays
        </Button>
      </div>

      {/* Barre de recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setError(null)}
              className="mt-2"
            >
              Fermer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Liste des pays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Liste des pays ({filteredCountries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? "Aucun pays trouvé pour cette recherche"
                : "Aucun pays enregistré"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Nom</th>
                    <th className="text-left p-3 font-medium">Code</th>
                    <th className="text-left p-3 font-medium">Langue</th>
                    <th className="text-left p-3 font-medium">Devise</th>
                    <th className="text-left p-3 font-medium">Ordre</th>
                    <th className="text-left p-3 font-medium">Villes</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map((country) => (
                    <tr key={country.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{country.name}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="font-mono">
                          {country.code}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">
                        {country.language || "—"}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">
                          {country.currency || "—"}
                        </Badge>
                      </td>
                      <td className="p-3 text-gray-600">{country.order}</td>
                      <td className="p-3">
                        <Badge variant="outline">
                          {country._count?.cities || 0} villes
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(country)}
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(country.id)}
                            title="Supprimer"
                            disabled={
                              !!country._count?.cities &&
                              country._count.cities > 0
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
