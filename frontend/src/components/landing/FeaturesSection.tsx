import {
  Camera,
  Sparkles,
  Briefcase,
  CalendarHeart,
  Palette,
  Tag,
} from "lucide-react";
export function FeaturesSection() {
  const features = [
    {
      icon: Camera,
      name: "Digitalisasi Wardrobe",
      description:
        "Unggah atau scan pakaian Anda untuk membuat lemari digital pribadi.",
      color: "bg-teal-100 text-teal-700",
    },
    {
      icon: Sparkles,
      name: "Rekomendasi AI",
      description:
        "Dapatkan saran outfit cerdas berdasarkan koleksi dan preferensi gaya Anda.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Briefcase,
      name: "Outfit Sesuai Acara",
      description:
        "Temukan kombinasi pas untuk ke kantor, acara formal, kasual, dan lainnya.",
      color: "bg-slate-100 text-slate-700",
    },
    {
      icon: Palette,
      name: "Analisis Warna & Gaya",
      description:
        "AI kami memahami detail warna, motif, dan gaya setiap item pakaian.",
      color: "bg-stone-100 text-stone-700",
    },
    {
      icon: Tag,
      name: "Pengenalan Jenis Pakaian",
      description:
        "Aplikasi mengenali berbagai jenis pakaian untuk rekomendasi yang lebih akurat.",
      color: "bg-teal-100 text-teal-700",
    },
    {
      icon: CalendarHeart,
      name: "Outfit Planner (Segera Hadir)",
      description:
        "Rencanakan outfit mingguan Anda dan jangan pernah kehabisan ide lagi.",
      color: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Semua yang Anda Butuhkan untuk Tampil Percaya Diri
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Outfitly dilengkapi dengan fitur-fitur canggih untuk merevolusi cara
            Anda berpakaian.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-stone-200 hover:border-teal-200"
            >
              <div className="flex items-center mb-4">
                <div className={`${feature.color} p-3 rounded-full mr-4`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {feature.name}
                </h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
