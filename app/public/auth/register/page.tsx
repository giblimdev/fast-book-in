// app/public/register/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { signUp, useSession } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Upload,
  X,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "file">("url");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, isPending: sessionLoading } = useSession();
  const router = useRouter();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (session && !sessionLoading) {
      router.push("/public/welcome");
    }
  }, [session, sessionLoading, router]);

  // Convertir le fichier en base64 pour Better Auth
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Gestion du changement de fichier
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du fichier
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (file.size > maxSize) {
      setError("L'image ne peut pas dépasser 5MB");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Format d'image non supporté. Utilisez JPG, PNG ou WebP");
      return;
    }

    setImageFile(file);
    setError("");

    // Créer l'aperçu et convertir en base64
    try {
      const base64 = await fileToBase64(file);
      setImagePreview(base64);
    } catch (error) {
      setError("Erreur lors de la lecture du fichier");
    }
  };

  // Gestion du changement d'URL
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);

    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview("");
    }
  };

  // Effacer l'image
  const clearImage = () => {
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Déclencher la sélection de fichier
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation des mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    if (!name.trim()) {
      setError("Le nom est requis");
      setIsLoading(false);
      return;
    }

    try {
      let finalImageData = "";

      // Préparer l'image selon la méthode choisie
      if (uploadMethod === "file" && imageFile) {
        // Better Auth accepte les images en base64
        finalImageData = await fileToBase64(imageFile);
      } else if (uploadMethod === "url" && imageUrl.trim()) {
        // Better Auth accepte aussi les URLs directement
        finalImageData = imageUrl.trim();
      }

      // Inscription avec Better Auth - tous les champs gérés par Better Auth
      const result = await signUp.email({
        email,
        password,
        name: name.trim(),
        image: finalImageData || undefined, // ✅ Base64 ou URL gérée par Better Auth
      });

      if (result.error) {
        setError("Erreur lors de l'inscription. Vérifiez vos informations.");
        return;
      }

      router.push("/public/welcome");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/com" className="inline-block">
            <h1 className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              FastBooking
            </h1>
          </Link>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Créez votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Rejoignez la plateforme de réservation d'hébergement
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Messages d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Nom/Pseudo */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom / Pseudo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Votre nom ou pseudo"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            {/* Image de profil */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Image de profil{" "}
                <span className="text-gray-400">(optionnel)</span>
              </label>

              {/* Sélecteur de méthode */}
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod("url")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadMethod === "url"
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  } border`}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  URL d'image
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("file")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    uploadMethod === "file"
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  } border`}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Fichier local
                </button>
              </div>

              {/* URL d'image */}
              {uploadMethod === "url" && (
                <div className="relative">
                  <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://exemple.com/avatar.jpg"
                  />
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label="Effacer l'image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Upload de fichier */}
              {uploadMethod === "file" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={triggerFileSelect}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                  >
                    <div className="flex flex-col items-center">
                      <Camera className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {imageFile
                          ? imageFile.name
                          : "Cliquez pour sélectionner une image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WebP jusqu'à 5MB
                      </p>
                    </div>
                  </button>
                </div>
              )}

              {/* Aperçu de l'image */}
              {imagePreview && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        setError("Impossible de charger l'image");
                        setImagePreview("");
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      Aperçu de votre image
                    </p>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="text-xs text-red-600 hover:text-red-800 mt-1"
                    >
                      Supprimer l'image
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Création du compte...
                </div>
              ) : (
                "Créer mon compte"
              )}
            </button>

            {/* Lien vers connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Déjà inscrit ?{" "}
                <Link
                  href="/public/auth/login"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Connectez-vous
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            En créant un compte, vous acceptez nos{" "}
            <Link
              href="/com/terms"
              className="text-blue-600 hover:text-blue-500"
            >
              conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link
              href="/com/privacy"
              className="text-blue-600 hover:text-blue-500"
            >
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
