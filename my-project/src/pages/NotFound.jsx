import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-black px-4 text-center text-white">
      <span className="text-7xl font-black text-[#39ff14]">
        404
      </span>

      <h1 className="text-2xl font-black">
        الصفحة غير موجودة
      </h1>

      <Link
        to="/"
        className="rounded-xl bg-[#39ff14] px-6 py-3 font-black text-black transition-transform hover:scale-105"
      >
        الرجوع للرئيسية
      </Link>
    </div>
  );
}

export default NotFound;