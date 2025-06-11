import { ScanLine, BrainCircuit, Zap } from "lucide-react";
const steps = [
  {
    icon: ScanLine,
    title: "1. Unggah atau Scan",
    description:
      "Digitalisasikan koleksi pakaian di lemari Anda dengan mudah melalui foto atau scan.",
  },
  {
    icon: BrainCircuit,
    title: "2. Analisis AI Cerdas",
    description:
      "Teknologi AI kami menganalisis warna, gaya, dan jenis setiap pakaian Anda.",
  },
  {
    icon: Zap,
    title: "3. Dapatkan Rekomendasi",
    description:
      "Terima saran kombinasi outfit yang personal dan cocok untuk berbagai acara.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="howitworks" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Semudah Itu Mengatur Gaya Harianmu
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Hanya dengan tiga langkah sederhana, Outfitly membantu Anda tampil
            maksimal setiap hari.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-sky-500 text-white p-4 rounded-full">
                  <step.icon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
