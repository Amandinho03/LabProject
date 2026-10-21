import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import dropImg from "../assets/img/drop.jpg";
import blaImg from "../assets/img/bla.png";
import ngImg from "../assets/img/ng.jpg";
import Footer from "../components/Footer";

const STEPS = [
  {
    title: "Create an account",
    description: "Register with the provided user ID and password to access the portal.",
  },
  {
    title: "Request instrument time",
    description: "Sign in and submit a request for the specific facility or tool you want to use.",
  },
  {
    title: "Track its status",
    description: "Follow your request status directly on the dashboard.",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-base text-ink font-sans antialiased flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        <section className="relative py-12 lg:py-20 border-b border-border overflow-hidden flex items-center justify-center min-h-[50vh]">
          <img
            src={dropImg}
            alt="Laboratory Background"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
          />
          <div className="absolute inset-0 bg-primary-soft/30 z-10" />

          <div className="container relative z-20 mx-auto px-6 flex justify-center">
            <div className="max-w-xl w-full bg-white/40 backdrop-blur-xl px-6 py-10 md:px-10 md:py-12 rounded-3xl shadow-2xl border border-white/60 text-center">
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-ink">
                <span>
                  open <span className="font-light">science</span>
                </span>{" "}
                <br />
                <span className="text-primary-dark text-4xl lg:text-5xl mt-1 inline-block drop-shadow-sm">
                  Instruments
                </span>
                <img
                  src={blaImg}
                  alt="Open Source"
                  className="mx-auto h-24 w-auto"
                />
              </h1>

              <p className="text-base lg:text-lg text-ink-muted mb-8 font-bold">
                A portal for user members to request instrument-time and
                track requests.
              </p>

              <Link
                to={user ? "/manage" : "/login"}
                className="inline-block bg-primary text-white font-semibold px-7 py-3 rounded-md text-base hover:bg-primary-dark shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                {user ? "Go to your dashboard" : "Sign in to get started"}
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-16">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="space-y-6 text-ink-muted leading-relaxed">
              <h2 className="text-3xl font-bold text-ink mb-4">
                Our instruments
              </h2>
              <p>
                The Open Science Lab has a suite of over 30 specialised,
                cutting-edge facilities, striving to keep at the frontiers of
                scientic discovery.
              </p>
              <p>
                Gaining access to state-of-the-art laboratory equipment
                remains a difficult challenge for scientists in
                under-resourced regions. This is holding science back,
                creating a knowledge gap between the North and South, and
                resulting in brain drain.
              </p>
            </div>

            <div className="flex items-center justify-center mt-2 lg:mt-0">
              <img
                src={ngImg}
                alt="Scientists collaborating in the lab"
                className="w-full brightness-110 h-auto rounded-xl shadow-sm border border-border object-cover"
              />
            </div>

            <aside className="bg-base-soft border border-border rounded-xl p-8 shadow-sm">
              <span className="inline-block bg-primary-soft text-primary font-bold text-xs uppercase tracking-wider py-1 px-3 rounded-full mb-4">
                Remote Access
              </span>
              <h3 className="text-xl font-bold mb-3">Core Facilities</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                Open Science Lab is enabling scientists in under-resourced
                regions, to access sophisticated scientific equipment without
                leaving their home country. The scientists also receive
                training on how to use this equipment remotely.
              </p>
            </aside>
          </div>
        </section>

        <section className="bg-base-soft py-16 lg:py-24 border-t border-border">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-ink mb-12">
              How the User portal works
            </h2>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="bg-base p-8 rounded-xl shadow-sm border border-border text-center"
                >
                  <span className="inline-flex items-center justify-center w-12 h-12 bg-primary text-white font-bold text-xl rounded-full mb-6">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-ink-muted text-sm">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}