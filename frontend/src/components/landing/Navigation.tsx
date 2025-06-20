import { ScanEye, LogIn } from "lucide-react";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center space-x-2 group">
          {" "}
          {/* Logo Jan Lupa Ganti */}
          <ScanEye className="h-8 w-8 text-sky-600 group-hover:text-sky-700 transition-colors duration-300" />
          <span className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors duration-300">
            Outfitly
          </span>
        </a>
        <div className="space-x-2 sm:space-x-4 flex items-center">
          {" "}
          <a
            href="#features"
            className="px-3 py-2 rounded-md text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 ease-in-out relative group"
          >
            Fitur
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-600 group-hover:w-full transition-all duration-300 ease-out"></span>{" "}
          </a>
          <a
            href="#howitworks"
            className="px-3 py-2 rounded-md text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all duration-300 ease-in-out relative group"
          >
            Cara Kerja
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-600 group-hover:w-full transition-all duration-300 ease-out"></span>{" "}
          </a>
          <a
            href="/signin"
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-300 ease-in-out flex items-center shadow-sm hover:shadow-md transform hover:scale-105"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Masuk
          </a>
        </div>
      </div>
    </nav>
  );
}
