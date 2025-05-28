export function ShowcaseSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-sky-50">
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
          <div className="bg-white p-3 rounded-xl shadow-2xl transform transition-transform hover:scale-105">
            {/* Ganti dengan mockup wardrobe */}
            <img
              src="https://placehold.co/600x400/e0f2fe/0ea5e9?text=Digital+Wardrobe+View"
              alt="Outfitly Wardrobe Mockup"
              className="rounded-lg w-full"
            />
            <p className="text-center text-sm text-slate-600 mt-2 font-medium">
              Atur Lemari Digitalmu dengan Mudah
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl shadow-2xl transform transition-transform hover:scale-105">
            {/* Ganti dengan mockup rekomendasi */}
            <img
              src="https://placehold.co/600x400/ecfccb/84cc16?text=AI+Outfit+Recommendation"
              alt="Outfitly Recommendation Mockup"
              className="rounded-lg w-full"
            />
            <p className="text-center text-sm text-slate-600 mt-2 font-medium">
              Dapatkan Rekomendasi Outfit Cerdas
            </p>
          </div>
        </div>
        {/* Video Demo */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">
            Tonton Video Demo Singkat Kami
          </h3>
          <div className="aspect-video max-w-3xl mx-auto bg-slate-300 rounded-lg shadow-xl">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
