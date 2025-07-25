"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Smartphone,
  Download,
  QrCode,
  Apple,
  Play,
  Star,
  Zap,
  Shield,
  ArrowRight,
} from "lucide-react";

export default function InstallApp() {
  const [activeStore, setActiveStore] = useState<"ios" | "android">("ios");

  const storeLinks = {
    ios: {
      url: "https://apps.apple.com/app/direct-horizon",
      qrCode: "/qr-codes/ios-app-store.png", // Remplacez par votre QR code iOS
      icon: <Apple className="w-6 h-6" />,
      label: "App Store",
      color: "from-gray-800 to-black",
    },
    android: {
      url: "https://play.google.com/store/apps/details?id=com.directhorizon",
      qrCode: "/qr-codes/google-play.png", // Remplacez par votre QR code Android
      icon: <Play className="w-6 h-6" />,
      label: "Google Play",
      color: "from-green-600 to-green-700",
    },
  };

  const features = [
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      text: "Réservation instantanée",
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      text: "Prix transparents",
    },
    {
      icon: <Star className="w-5 h-5 text-purple-500" />,
      text: "Expériences authentiques",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.05),transparent_70%)]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div>
              <div className="inline-flex items-center bg-blue-100 border border-blue-200 px-4 py-2 rounded-full mb-4">
                <Smartphone className="text-blue-600 mr-2" size={18} />
                <span className="text-blue-700 font-semibold text-sm">
                  APPLICATION MOBILE
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Voyagez partout avec
                <span className="text-blue-600"> Direct Horizon</span>
              </h2>

              <p className="text-xl text-gray-600 leading-relaxed">
                Téléchargez notre app et découvrez des hébergements
                authentiques, négociez directement avec les hôtes et voyagez en
                toute transparence.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
                    {feature.icon}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Store Selection */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Choisissez votre plateforme :
              </p>
              <div className="flex space-x-3">
                {Object.entries(storeLinks).map(([key, store]) => (
                  <motion.button
                    key={key}
                    onClick={() => setActiveStore(key as "ios" | "android")}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      activeStore === key
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {store.icon}
                    <span className="font-medium">{store.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Direct Download Button */}
            <motion.a
              href={storeLinks[activeStore].url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center px-6 py-4 bg-gradient-to-r ${storeLinks[activeStore].color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="mr-2" size={20} />
              Télécharger maintenant
              <ArrowRight
                className="ml-2 group-hover:translate-x-1 transition-transform"
                size={20}
              />
            </motion.a>
          </motion.div>

          {/* Right QR Code Section */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-gray-100">
              {/* QR Code Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                  <QrCode className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Scan & Télécharge
                </h3>
                <p className="text-gray-600 text-sm">
                  Scannez le QR code avec votre appareil photo pour télécharger
                  l'app
                </p>
              </div>

              {/* QR Code Display */}
              <motion.div
                className="bg-white border-4 border-gray-100 rounded-2xl p-6 mb-6 flex items-center justify-center"
                key={activeStore}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Placeholder QR Code - Remplacez par vos vrais QR codes */}
                <div className="w-48 h-48 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <QrCode className="text-gray-400 mx-auto mb-2" size={48} />
                    <p className="text-xs text-gray-500">
                      QR Code {storeLinks[activeStore].label}
                    </p>
                  </div>
                </div>
                {/* Utilisez ceci quand vous avez vos vrais QR codes :
                <img
                  src={storeLinks[activeStore].qrCode}
                  alt={`QR Code pour ${storeLinks[activeStore].label}`}
                  className="w-48 h-48 rounded-xl"
                />
                */}
              </motion.div>

              {/* Store Badge */}
              <div className="text-center">
                <div
                  className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${storeLinks[activeStore].color} text-white rounded-full text-sm font-medium`}
                >
                  {storeLinks[activeStore].icon}
                  <span className="ml-2">
                    Disponible sur {storeLinks[activeStore].label}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Comment scanner :
                </h4>
                <ol className="text-xs text-gray-600 space-y-1">
                  <li>1. Ouvrez l'appareil photo de votre téléphone</li>
                  <li>2. Pointez vers le QR code</li>
                  <li>3. Appuyez sur la notification qui apparaît</li>
                  <li>4. Téléchargez l'application</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">50k+</div>
            <div className="text-gray-600">Téléchargements</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
            <div className="text-gray-600">Note moyenne</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-gray-600">Support client</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
