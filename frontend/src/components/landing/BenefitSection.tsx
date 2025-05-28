import { Smile, Clock, Lightbulb, Zap } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Hemat Waktu Setiap Pagi",
      description:
        'Tidak ada lagi drama "tidak tahu mau pakai apa". Dapatkan inspirasi outfit instan!',
    },
    {
      icon: Lightbulb,
      title: "Maksimalkan Koleksi Pakaian",
      description:
        "Temukan kombinasi baru dari pakaian yang sudah Anda miliki. Tak perlu sering belanja.",
    },
    {
      icon: Smile,
      title: "Tampil Percaya Diri Selalu",
      description:
        "Kenakan outfit yang pas dan stylish untuk setiap momen penting dalam hidup Anda.",
    },
    {
      icon: Zap,
      title: "Gaya Personal yang Unik",
      description:
        "AI membantu Anda mengeksplorasi dan mendefinisikan gaya personal yang sesungguhnya.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Lebih Dari Sekadar Aplikasi Fashion
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Outfitly dirancang untuk membuat hidup Anda lebih mudah dan penuh
            gaya.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex items-start space-x-4 p-6 bg-stone-50 rounded-lg shadow hover:shadow-md transition-all duration-300 border border-stone-200"
            >
              <div className="flex-shrink-0 bg-teal-600 text-white p-3 rounded-full mt-1 shadow-md">
                <benefit.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
