import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-sky-50 to-indigo-100 py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
          Stop Bingung Pilih Baju,{" "}
          <span className="text-sky-600">Outfitly</span> Solusinya!
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
          Unggah koleksi pakaianmu, dan biarkan AI kami menyulapnya menjadi
          kombinasi outfit stylish untuk setiap kesempatan.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
          <a
            href="/signup"
            className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105 shadow-lg flex items-center"
          >
            Coba Gratis Sekarang <ArrowRight className="ml-2 h-5 w-5" />
          </a>
          <a
            href="#howitworks"
            className="bg-transparent hover:bg-sky-100 text-sky-700 font-semibold py-3 px-8 rounded-lg text-lg border-2 border-sky-600 transition-colors flex items-center"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
        <div className="mt-16 max-w-4xl mx-auto">
          {/* Jan Lupa Ganti Pake gambar mockup aplikasi yang menarik */}
          <div className="bg-white p-4 rounded-xl shadow-2xl aspect-video">
            <img
              src="https://placehold.co/1200x675/e2e8f0/94a3b8?text=App+Screenshot+Here"
              alt="Outfitly App Mockup"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
