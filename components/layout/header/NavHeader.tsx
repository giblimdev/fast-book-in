// @/components/layout/header/NavHeader.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

interface NavHeaderProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function NavHeader({
  isMobile = false,
  onLinkClick,
}: NavHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { id: 1, label: "Public", link: "/" },
    { id: 2, label: "Voyageurs", link: "/traveler" },
    { id: 3, label: "Hébergeurs", link: "/host" },
    { id: 4, label: "Blog", link: "/blog" },
    { id: 5, label: "Admin", link: "/admin" },
    { id: 6, label: "Dev", link: "/dev" },
  ];

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    onLinkClick?.(); // Appelle la fonction parent si elle existe
  };

  // Si c'est utilisé dans le Header parent, on utilise les props
  if (isMobile) {
    return (
      <nav className="space-y-1">
        {links.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            onClick={onLinkClick}
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  // Version desktop : liens horizontaux
  return (
    <nav className="flex items-center space-x-8">
      {links.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 relative group"
        >
          {item.label}
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
        </Link>
      ))}
    </nav>
  );
}
