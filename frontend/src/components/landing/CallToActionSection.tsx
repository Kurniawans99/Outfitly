import { PartyPopper } from "lucide-react";

export function CallToActionSection() {
  return (
    <section className="py-20 md:py-32 bg-slate-800 text-white">
      <div className="container mx-auto px-6 text-center">
        <PartyPopper className="h-16 w-16 text-teal-400 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Siap Mengubah Cara Anda Berpakaian?
        </h2>
        <p className="text-lg md:text-xl text-stone-300 mb-10 max-w-2xl mx-auto">
          Bergabunglah dengan ribuan pengguna yang telah menemukan kembali isi
          lemari mereka bersama Outfitly. Mulai perjalanan gayamu sekarang!
        </p>
        <a
          href="/signup"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-10 rounded-lg text-xl transition-transform transform hover:scale-105 shadow-xl"
        >
          Daftar Gratis & Mulai Styling!
        </a>
      </div>
    </section>
  );
}
