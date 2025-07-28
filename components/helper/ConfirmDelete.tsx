// @/components/ui/ConfirmDelete.tsx
"use client";

import React, { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string | ReactNode;
  itemName?: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  icon?: ReactNode;
  showIcon?: boolean;
}

export default function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  description,
  itemName,
  isLoading = false,
  confirmText = "Supprimer",
  cancelText = "Annuler",
  variant = "destructive",
  icon,
  showIcon = true,
}: ConfirmDeleteProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const defaultDescription = itemName ? (
    <>
      Êtes-vous sûr de vouloir supprimer <strong>{itemName}</strong> ?<br />
      Cette action est irréversible.
    </>
  ) : (
    "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible."
  );

  const displayIcon = icon || (
    <AlertTriangle className="h-5 w-5 text-destructive" />
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            {showIcon && displayIcon}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {confirmText}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook personnalisé pour gérer l'état de suppression
export function useConfirmDelete() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<any>(null);

  const openDialog = (item?: any) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  const closeDialog = () => {
    if (!isLoading) {
      setIsOpen(false);
      setItemToDelete(null);
    }
  };

  const confirm = async (onConfirm: (item: any) => Promise<void>) => {
    setIsLoading(true);
    try {
      await onConfirm(itemToDelete);
      closeDialog();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    itemToDelete,
    openDialog,
    closeDialog,
    confirm,
  };
}
