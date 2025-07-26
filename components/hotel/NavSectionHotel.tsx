// components/NavSectionHotel.tsx
"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  MapPin,
  Bed,
  Star,
  MessageSquare,
  Wifi,
  FileText,
  Activity,
  Accessibility,
  Car,
  HelpCircle,
  Eye,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const navigationItems: NavItem[] = [
  {
    id: "description",
    label: "Aperçu",
    href: "#description",
    icon: <Eye className="w-5 h-5" />,
    description: "Description générale de l'hébergement",
  },
  {
    id: "room",
    label: "Chambres",
    href: "#room",
    icon: <Bed className="w-5 h-5" />,
    description: "Types de chambres et tarifs",
  },

  {
    id: "amenities",
    label: "Services & Équipements",
    href: "#amenities",
    icon: <Wifi className="w-5 h-5" />,
    description: "Installations et services disponibles",
  },
  {
    id: "policies",
    label: "Conditions",
    href: "#policies",
    icon: <FileText className="w-5 h-5" />,
    description: "Politique d'annulation et règles",
  },

  {
    id: "activities",
    label: "Activités",
    href: "#activities",
    icon: <Activity className="w-5 h-5" />,
    description: "Loisirs et excursions disponibles",
  },

  {
    id: "faq",
    label: "FAQ",
    href: "#faq",
    icon: <HelpCircle className="w-5 h-5" />,
    description: "Questions fréquemment posées",
  },
];

export default function NavSectionHotel() {
  const [activeSection, setActiveSection] = useState<string>("description");
  const [isScrolled, setIsScrolled] = useState(false);

  // Gestion du scroll pour effet sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion de la section active basée sur le scroll
  useEffect(() => {
    const handleScrollSpy = () => {
      const sections = navigationItems.map((item) => item.id);

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy);
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, []);

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);

    // Smooth scroll vers la section
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset pour le header sticky
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const NavItem = ({
    item,
    isMobile = false,
  }: {
    item: NavItem;
    isMobile?: boolean;
  }) => (
    <Link
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        handleNavClick(item.href, item.id);
      }}
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium w-full",
        isMobile ? "justify-start" : "justify-center text-center",
        // Soulignement pour le lien actif
        activeSection === item.id
          ? "text-blue-700 bg-blue-50 underline decoration-2 underline-offset-4 decoration-blue-600"
          : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:underline hover:decoration-2 hover:underline-offset-4 hover:decoration-blue-400"
      )}
    >
      {/* Container principal avec hover complet */}
      <div
        className={cn(
          "flex items-center gap-3 w-full transition-all duration-200",
          isMobile ? "flex-row" : "flex-row justify-center",
          // Hover qui couvre tout
          "group-hover:transform group-hover:scale-105"
        )}
      >
        {/* Icône */}
        <div
          className={cn(
            "flex items-center justify-center flex-shrink-0 transition-colors duration-200",
            activeSection === item.id
              ? "text-blue-700"
              : "text-gray-500 group-hover:text-blue-600"
          )}
        >
          {item.icon}
        </div>

        {/* Texte principal */}
        <div
          className={cn(
            "flex flex-col min-w-0",
            isMobile ? "flex-1" : "items-center"
          )}
        >
          <span
            className={cn(
              "text-sm font-semibold tracking-wide leading-tight font-inter transition-colors duration-200",
              isMobile
                ? "whitespace-normal text-left"
                : "whitespace-nowrap text-center",
              activeSection === item.id
                ? "text-blue-700"
                : "text-gray-800 group-hover:text-blue-700"
            )}
          >
            {item.label}
          </span>

          {/* Description pour mobile uniquement */}
          {isMobile && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-normal">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <>
      {/* Navigation Desktop */}
      <div
        className={cn(
          "sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300",
          isScrolled && "shadow-lg backdrop-blur-sm bg-white/95"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="hidden lg:flex items-center justify-start py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full">
              {navigationItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {/* Container pour chaque item avec largeur fixe */}
                  <div className="flex-shrink-0 min-w-fit">
                    <NavItem item={item} />
                  </div>
                  {index < navigationItems.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-8 mx-2 bg-gray-300 flex-shrink-0"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Navigation Mobile avec Sheet */}
          <div className="lg:hidden flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg text-gray-900 font-inter">
                Navigation
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium underline decoration-2 underline-offset-2 decoration-blue-600">
                  {
                    navigationItems.find((item) => item.id === activeSection)
                      ?.label
                  }
                </span>
              </div>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-medium hover:bg-blue-50 hover:border-blue-300"
                >
                  <Menu className="w-4 h-4 mr-2" />
                  Menu
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl font-inter">
                    Navigation de l'hôtel
                  </SheetTitle>
                  <SheetDescription className="font-medium text-gray-600">
                    Accédez rapidement aux différentes sections
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-1">
                  {navigationItems.map((item) => (
                    <NavItem key={item.id} item={item} isMobile />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Indicateur de progression mobile */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800 font-inter underline decoration-2 underline-offset-2 decoration-blue-600">
              Section actuelle :{" "}
              {navigationItems.find((item) => item.id === activeSection)?.label}
            </span>

            <span className="text-xs text-gray-500 font-medium">
              {navigationItems.findIndex((item) => item.id === activeSection) +
                1}
              /{navigationItems.length}
            </span>
          </div>

          {/* Barre de progression */}
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${
                  ((navigationItems.findIndex(
                    (item) => item.id === activeSection
                  ) +
                    1) /
                    navigationItems.length) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
