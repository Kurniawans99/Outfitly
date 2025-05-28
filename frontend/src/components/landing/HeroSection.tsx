import { ArrowRight, ScanEye } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-stone-50 to-stone-100 py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
          Stop Bingung Pilih Baju,{" "}
          <span className="text-teal-600">Outfitly</span> Solusinya!
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          Unggah koleksi pakaianmu, dan biarkan AI kami menyulapnya menjadi
          kombinasi outfit stylish untuk setiap kesempatan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <a
            href="/signup"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg flex items-center"
          >
            Coba Gratis Sekarang <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a
            href="#howitworks"
            className="bg-transparent hover:bg-stone-100 text-slate-800 font-semibold py-3 px-8 rounded-lg text-lg border-2 border-slate-800 transition-colors flex items-center"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow-2xl aspect-video border border-stone-200">
            <div className="rounded-lg bg-gradient-to-br from-stone-100 to-stone-200 w-full h-full flex items-center justify-center">
              <div className="text-center">
                <ScanEye className="h-20 w-20 text-teal-600 mx-auto mb-4" />
                <p className="text-lg font-medium text-slate-600">
                  Outfitly App Preview
                </p>
                <p className="text-sm text-slate-500">
                  Smart AI Fashion Assistant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
