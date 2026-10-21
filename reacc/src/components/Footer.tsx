import sureLogo from "../assets/img/sure.png";

export default function Footer() {
  return (
    <footer className="bg-ink text-white py-6">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
          <img
            src={sureLogo}
            alt="Open Science Logo"
            className="h-24 w-auto brightness-100 invert"
          />
          <div className="pt-1">
            <p className="font-bold text-lg tracking-wide">
              <span>
                open <span className="font-light">science</span>
              </span>
            </p>
            Labs
            <p className="text-white/70 text-sm mt-1.5 leading-relaxed">
              123 Mulholland Drive, Sunset Boulevard
            </p>
          </div>
        </div>

        <div className="flex items-center">
          <p className="text-sm text-white/70 font-medium">
            Internal instrument booking portal
          </p>
        </div>
      </div>
    </footer>
  );
}
