import { PageWrapper } from "../layout/PageWrapper";

export const PlaceholderPage = ({ title }: { title: string }) => (
  <PageWrapper title={title}>
    <p>
      Konten untuk halaman <span className="font-semibold">{title}</span> akan
      segera hadir.
    </p>
    <p className="mt-4 text-sm text-slate-600">
      Ini adalah placeholder. Anda dapat menggantinya dengan komponen halaman
      yang sesungguhnya.
    </p>
  </PageWrapper>
);
