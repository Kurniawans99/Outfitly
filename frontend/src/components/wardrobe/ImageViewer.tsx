import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan path ke 'cn' utility sudah benar

// Kita menggunakan DialogPortal dan DialogOverlay untuk membuat backdrop
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Komponen utama kita
export const ImageViewer = ({
  isOpen,
  onOpenChange,
  imageUrl,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
}) => {
  if (!imageUrl) return null;

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />

        {/* INI BAGIAN UTAMA: Menggunakan DialogPrimitive.Content sebagai kanvas kosong */}
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4", // Layout untuk menengahkan
            "focus:outline-none"
          )}
        >
          {/* Gambar Anda, tidak perlu diubah */}
          <img
            src={imageUrl}
            alt="Fullscreen View"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
          />

          {/* SATU-SATUNYA TOMBOL 'X', diposisikan di pojok kanan atas viewport */}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </DialogPrimitive.Root>
  );
};
