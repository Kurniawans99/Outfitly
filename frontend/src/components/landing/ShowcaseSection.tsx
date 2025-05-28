import { Camera, Sparkles } from "lucide-react";

export function ShowcaseSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-stone-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Lihat Outfitly Beraksi
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Bayangkan kemudahan mengatur gaya Anda, semuanya dalam genggaman.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="bg-white p-4 rounded-xl shadow-2xl transform transition-transform hover:scale-105 border border-stone-200">
            <div className="rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-16 w-16 text-teal-700 mx-auto mb-3" />
                <p className="text-lg font-semibold text-teal-800">
                  Digital Wardrobe
                </p>
              </div>
            </div>
            <p className="text-center text-sm text-slate-600 mt-3 font-medium">
              Atur Lemari Digitalmu dengan Mudah
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-2xl transform transition-transform hover:scale-105 border border-stone-200">
            <div className="rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 aspect-video flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="h-16 w-16 text-blue-700 mx-auto mb-3" />
                <p className="text-lg font-semibold text-blue-800">
                  AI Recommendations
                </p>
              </div>
            </div>
            <p className="text-center text-sm text-slate-600 mt-3 font-medium">
              Dapatkan Rekomendasi Outfit Cerdas
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
