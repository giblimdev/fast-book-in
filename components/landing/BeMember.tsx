"use client";
import React from "react";
import { motion } from "framer-motion";
import { Zap, Users, ArrowRight, Star, Gift, Shield } from "lucide-react";

export default function BeMember() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.05),transparent_70%)]" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 px-4 py-2 rounded-full mb-6">
            <Star className="text-blue-600 mr-2" size={18} />
            <span className="text-blue-700 font-semibold text-sm">
              VOYAGEUR FONDATEUR
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Rejoignez la révolution du voyage
            <span className="text-blue-600"> éthique</span>
          </h2>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Fini les frais cachés ! Devenez membre fondateur et voyagez en toute
            transparence avec{" "}
            <span className="font-semibold text-blue-600">Direct Horizon</span>
          </p>

          {/* Benefits - Compact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <motion.div
              className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Gift className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                100 $REBEL offerts
              </h3>
              <p className="text-sm text-gray-600">
                Crédits voyage pour débuter
              </p>
            </motion.div>

            <motion.div
              className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Prix transparents
              </h3>
              <p className="text-sm text-gray-600">
                Garantie zéro frais cachés
              </p>
            </motion.div>

            <motion.div
              className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-3 mx-auto">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Accès exclusif
              </h3>
              <p className="text-sm text-gray-600">
                Bêta et nouvelles fonctionnalités
              </p>
            </motion.div>
          </div>

          {/* Social Proof - Compact */}
          <motion.div
            className="flex justify-center items-center space-x-8 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div>
              <div className="text-2xl font-bold text-blue-600">2,847</div>
              <div className="text-xs text-gray-500">Membres fondateurs</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div>
              <div className="text-2xl font-bold text-green-600">€127k</div>
              <div className="text-xs text-gray-500">Économisés</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div>
              <div className="text-2xl font-bold text-blue-600">4.9/5</div>
              <div className="text-xs text-gray-500">Satisfaction</div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="bg-white border border-blue-200 rounded-2xl p-6 shadow-lg max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Prêt à voyager autrement ?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Inscription gratuite • Sans engagement • Accès immédiat
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="mr-2" size={18} />
                Devenir Membre
                <ArrowRight className="ml-2" size={18} />
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                En savoir plus
              </motion.button>
            </div>
          </motion.div>

          {/* Bottom tagline */}
          <motion.p
            className="text-sm text-gray-500 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            ✨ Rejoignez le mouvement pour un voyage plus transparent et éthique
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
