import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  if (!showButton) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="العودة لأعلى الصفحة"
      title="العودة لأعلى الصفحة"
      className="
        fixed
        bottom-5
        left-5
        z-[100]
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-2xl
        border
        border-zinc-800
        bg-black
        text-[#39ff14]
        shadow-[0_12px_35px_rgba(0,0,0,0.22)]
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#39ff14]
        hover:bg-[#39ff14]
        hover:text-black
        active:scale-95
      "
    >
      <ArrowUp
        size={21}
        strokeWidth={2.5}
      />
    </button>
  );
}

export default ScrollToTopButton;