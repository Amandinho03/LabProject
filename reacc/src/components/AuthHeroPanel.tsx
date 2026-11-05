import { useState } from "react";
import backIcon from "../assets/back.svg";
import sureLogo from "../assets/img/sure.png";
import dotImg from "../assets/img/dot.png";
import milkImg from "../assets/img/milk.webp";

// const gallery = import.meta.glob('./img/slideshow/*.{png,jpg,jpeg,webp,}', { eager: true });
// const images = Object.values(gallery).map((mod) => mod.default);


const PAIRINGS = [
  {
    image: dotImg,
    quote: "Look again at that dot. That's here. That's home. That's us.",
    author: "Carl Sagan",
  },
  {
    image: milkImg,
    quote: "We are a way for the cosmos to know itself.",
    author: "Carl Sagan",
  },
  
];

export default function AuthHeroPanel() {

  const [selected] = useState(
    () => PAIRINGS[Math.floor(Math.random() * PAIRINGS.length)],
  );

  return (
    <div className="relative hidden overflow-hidden bg-[#1f2021] md:block">
      <a
        href="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 bg-white/95 hover:bg-white px-3 py-2 rounded-md shadow-sm transition-colors text-gray-800 no-underline"
      >
        <img src={backIcon} alt="Logo" className="h-3 w-auto" />
        <img src={sureLogo} alt="Logo" className="h-7 w-auto" />
      </a>

      <img
        src={selected.image}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-[center_12%] z-0"
      />

      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(190deg, rgba(31,32,33,0) 35%, rgba(10,58,24,0.92) 100%), linear-gradient(100deg, rgba(59,181,74,0.28), rgba(31,32,33,0.05) 45%)",
        }}
      />

      <blockquote className="absolute bottom-9 left-8 right-8 z-20 text-white m-0">
        <p className="font-serif italic text-[1.2rem] leading-[1.5] mb-[0.6em]">
          "{selected.quote}"
        </p>
        <cite className="not-italic text-[1.2rem] text-white/80">
          — {selected.author}
        </cite>
      </blockquote>
    </div>
  );
}
