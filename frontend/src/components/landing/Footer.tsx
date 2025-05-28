import { ScanEye, Twitter, Instagram, Facebook } from "lucide-react";
export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-stone-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <a href="#" className="flex items-center space-x-2 mb-4">
              <ScanEye className="h-8 w-8 text-teal-500" />
              <span className="text-2xl font-bold text-white">Outfitly</span>
            </a>
            <p className="text-sm">
              Aplikasi rekomendasi outfit cerdas berdasarkan koleksi wardrobe
              Anda.
            </p>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">
              Tautan Cepat
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#features"
                  className="hover:text-teal-400 transition-colors"
                >
                  Fitur
                </a>
              </li>
              <li>
                <a
                  href="#howitworks"
                  className="hover:text-teal-400 transition-colors"
                >
                  Cara Kerja
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-teal-400 transition-colors"
                >
                  Blog (Contoh)
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-teal-400 transition-colors"
                >
                  Kontak (Contoh)
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-semibold text-white mb-4">
              Ikuti Kami
            </h5>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-stone-400 hover:text-teal-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-teal-400 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-stone-400 hover:text-teal-400 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>&copy; {currentYear} Outfitly. Semua Hak Cipta Dilindungi.</p>
          <p className="mt-1">
            <a
              href="/privacy"
              className="hover:text-teal-400 transition-colors"
            >
              Kebijakan Privasi
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:text-teal-400 transition-colors">
              Syarat & Ketentuan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
