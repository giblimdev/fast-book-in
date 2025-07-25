// components/ui/RoleBadge.tsx
import { Badge } from "@/components/ui/badge";
import { Shield, Settings, Eye, Home, User, Ban } from "lucide-react";
import { ROLES, type Role } from "@/lib/utils/roles";

interface RoleBadgeProps {
  role: Role | string; // ✅ Accepte Role ou string pour plus de flexibilité
  showIcon?: boolean;
  variant?: "default" | "outline";
}

export function RoleBadge({
  role,
  showIcon = true,
  variant = "default",
}: RoleBadgeProps) {
  const getRoleConfig = (role: Role | string) => {
    switch (role) {
      case ROLES.ADMIN:
      case "admin":
        return {
          label: "Administrateur",
          className: "bg-gradient-to-r from-red-500 to-orange-500 text-white",
          icon: <Shield className="h-3 w-3" />,
        };
      case ROLES.MANAGER:
      case "manager":
        return {
          label: "Gestionnaire",
          className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
          icon: <Settings className="h-3 w-3" />,
        };
      case ROLES.MODERATOR:
      case "moderator":
        return {
          label: "Modérateur",
          className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
          icon: <Eye className="h-3 w-3" />,
        };
      case ROLES.HOST:
      case "host":
        return {
          label: "Propriétaire",
          className:
            "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
          icon: <Home className="h-3 w-3" />,
        };
      case ROLES.BANNED:
      case "banned":
        return {
          label: "Banni",
          className: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
          icon: <Ban className="h-3 w-3" />,
        };
      default: // GUEST ou autres
        return {
          label: "Invité",
          className: "bg-gradient-to-r from-blue-400 to-blue-500 text-white",
          icon: <User className="h-3 w-3" />,
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <Badge
      variant={variant}
      className={`${config.className} flex items-center gap-1 px-2 py-1 text-xs font-medium`}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}
