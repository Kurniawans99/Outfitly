export default function PathError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-4xl font-bold text-slate-700">
        404 - Halaman Tidak Ditemukan
      </h1>
      <p className="text-slate-500 mt-2">
        Maaf, halaman yang Anda cari tidak ada.
      </p>
      <a
        href="/dashboard"
        className="mt-6 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
      >
        Kembali ke Dashboard
      </a>
    </div>
  );
}
