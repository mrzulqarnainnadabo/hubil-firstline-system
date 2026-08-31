/**
 * FirstLine landing — dual-track diagnostic front door.
 * Institutions and serious brands. Outcomes only. No prices.
 */
import { DiagnosticFlow } from "@/components/DiagnosticFlow";
import { DIAGNOSTIC_SOURCE, DiagnosticResponse } from "@/config/diagnostic";
import { SITE, PRIMARY_WHATSAPP_MESSAGE } from "@/config/site";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock3,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";

const directWhatsApp = `${SITE.primaryWhatsAppUrl}?text=${PRIMARY_WHATSAPP_MESSAGE}`;

function SignalLabel({
  children,
  light = false,
}: {
  children: string;
  light?: boolean;
}) {
  return (
    <div
      className={`mb-5 flex items-center gap-3 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] ${
        light ? "text-[#F5B8BB]" : "text-[#B8121C]"
      }`}
    >
      <span className="h-px w-9 bg-[#B8121C]" />
      {children}
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastDiagnostic, setLastDiagnostic] =
    useState<DiagnosticResponse | null>(null);

  const jumpTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  function recordDiagnostic(response: DiagnosticResponse) {
    setLastDiagnostic(response);
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#F8F6F1] text-[#0D2037]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-[#0D2037]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12 xl:px-16">
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="Hubil Group FirstLine homepage"
          >
            <span className="grid h-11 w-11 place-items-center overflow-hidden border border-[#E14C53]/55 bg-white p-1 shadow-lg shadow-black/10">
              <img
                src={SITE.images.hubilLogo}
                alt="Hubil Group"
                className="h-full w-full object-contain"
              />
            </span>
            <span className="leading-none">
              <span className="font-display block text-[1.45rem] tracking-[-0.06em] text-white transition-colors group-hover:text-[#F5B8BB]">
                FirstLine
              </span>
              <span className="mt-1 block text-[0.5rem] font-extrabold uppercase tracking-[0.18em] text-white/55">
                {SITE.systemDescriptor}
              </span>
            </span>
            <span className="hidden border-l border-white/20 pl-3 text-[0.51rem] font-bold uppercase leading-3 tracking-[0.14em] text-white/50 xl:block">
              A Hubil
              <br />
              Group System
            </span>
          </a>
          <nav
            className="hidden items-center gap-8 text-[0.78rem] font-extrabold text-white/75 lg:flex"
            aria-label="Primary navigation"
          >
            <a href="#diagnostic" className="transition-colors hover:text-white">
              Diagnostic
            </a>
            <a href="#systems" className="transition-colors hover:text-white">
              Systems
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </nav>
          <button
            type="button"
            onClick={() => jumpTo("#diagnostic")}
            className="hidden items-center gap-2 bg-[#B8121C] px-4 py-2.5 text-xs font-extrabold text-white transition-all duration-200 hover:bg-[#D02832] active:scale-[0.97] sm:inline-flex"
          >
            <ShieldCheck size={16} /> Start diagnostic
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-10 w-10 place-items-center text-white transition-colors hover:bg-white/10 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="border-t border-white/10 bg-[#0D2037] px-5 pb-5 pt-3 lg:hidden"
            aria-label="Mobile navigation"
          >
            {[
              ["#diagnostic", "Start the diagnostic"],
              ["#systems", "The systems"],
              ["#contact", "Contact Hubil"],
            ].map(([href, label]) => (
              <button
                key={href}
                type="button"
                onClick={() => jumpTo(href)}
                className="flex w-full items-center justify-between border-b border-white/10 py-4 text-left text-sm font-bold text-white"
              >
                {label}
                <ChevronRight size={18} className="text-[#E14C53]" />
              </button>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="relative isolate overflow-hidden bg-[#0D2037] pt-[76px] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_88%,rgba(184,18,28,0.35),transparent_25%),radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.06),transparent_24%)]" />
          <div className="mx-auto grid min-h-[640px] max-w-[1480px] lg:grid-cols-[0.94fr_1.06fr]">
            <div className="relative z-10 flex flex-col justify-between px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-14 lg:pt-24 xl:px-16">
              <div className="animate-rise max-w-[700px]">
                <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-[#F5B8BB]">
                  <span className="inline-flex items-center gap-2">
                    <span className="status-dot h-2 w-2 rounded-full bg-[#E14C53]" />{" "}
                    Institutional & brand systems
                  </span>
                  <span className="h-3 w-px bg-white/25" />
                  <span>FL–01 diagnostic</span>
                </div>
                <h1 className="font-display max-w-[720px] text-[2.7rem] leading-[0.96] tracking-[-0.05em] text-white sm:text-[3.9rem] lg:text-[4.6rem]">
                  {SITE.headline}
                </h1>
                <p className="mt-7 max-w-xl text-[1rem] leading-7 text-slate-200 sm:text-lg sm:leading-8">
                  {SITE.tagline}
                </p>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => jumpTo("#diagnostic")}
                    className="group inline-flex items-center justify-center gap-3 bg-[#B8121C] px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D02832] active:scale-[0.97]"
                  >
                    <ShieldCheck size={20} /> Start the Diagnostic{" "}
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => jumpTo("#systems")}
                    className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-4 text-sm font-extrabold text-white transition-colors duration-200 hover:border-white hover:bg-white/10 active:scale-[0.97]"
                  >
                    See the systems <ChevronRight size={17} />
                  </button>
                </div>
              </div>
              <div className="mt-12 grid max-w-[680px] gap-4 border-t border-white/15 pt-5 sm:grid-cols-3 sm:gap-5 lg:mt-8">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl text-[#E14C53]">07</span>
                  <p className="text-xs font-semibold leading-5 text-slate-300">
                    Short questions. Honest answers.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock3 size={18} className="text-[#E14C53]" />
                  <p className="text-xs font-semibold leading-5 text-slate-300">
                    Brief generated for Hubil review.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-[#E14C53]" />
                  <p className="text-xs font-semibold leading-5 text-slate-300">
                    Human reply — no auto-pitch.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-gradient-to-br from-[#0A1A2E] via-[#0D2037] to-[#1A0A12] lg:min-h-0">
              <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at 70% 30%, #B8121C33 0%, transparent 55%)" }} />
              <div className="relative z-10 px-5 pb-6 pt-10 sm:px-8 sm:pb-8 lg:px-10">
                <div className="max-w-[300px] border-l-2 border-[#B8121C] bg-[#0D2037]/85 px-4 py-3 backdrop-blur-md">
                  <p className="text-[0.58rem] font-bold uppercase tracking-[0.17em] text-[#F5B8BB]">
                    Core promise
                  </p>
                  <p className="mt-1 text-sm font-bold leading-5 text-white">
                    Systems that last — strategy, structure, growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#D8D4CC] bg-[#ECE8DF] px-5 py-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1360px]">
            <p className="text-sm font-extrabold leading-6 text-[#0D2037]">
              {SITE.corePromise}
            </p>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-[#526174]">
              <span className="font-bold text-[#0D2037]">Who this is for:</span>{" "}
              {SITE.whoThisIsFor}
            </p>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <SignalLabel>What FirstLine is for</SignalLabel>
            <h2 className="font-display max-w-3xl text-3xl leading-[1.05] tracking-[-0.04em] text-[#0D2037] sm:text-5xl">
              Diagnose the friction. Then install the right system.
            </h2>
            <div className="mt-10 grid gap-px border border-[#D8D4CC] bg-[#D8D4CC] sm:grid-cols-3">
              {SITE.valuePillars.map((pillar) => (
                <article key={pillar.title} className="bg-[#F8F6F1] px-6 py-7">
                  <h3 className="text-sm font-extrabold text-[#0D2037]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#526174]">
                    {pillar.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="diagnostic" className="bg-[#F8F6F1] py-20 sm:py-28">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
              <div>
                <SignalLabel>Start here</SignalLabel>
                <h2 className="font-display max-w-3xl text-4xl leading-[1.02] tracking-[-0.04em] text-[#0D2037] sm:text-5xl">
                  FirstLine diagnostic.
                </h2>
              </div>
              <p className="max-w-md text-base leading-7 text-[#526174] lg:justify-self-end">
                Seven short steps. We learn what you are building, where work is
                hardest, and when you need progress. A structured brief is
                generated for Hubil — then a human continues with you if there is
                fit.
              </p>
            </div>
            <div className="mt-12">
              <DiagnosticFlow
                whatsappUrl={directWhatsApp}
                onComplete={recordDiagnostic}
              />
            </div>
            {lastDiagnostic && (
              <p className="sr-only">
                Diagnostic completed for {lastDiagnostic.orgName || lastDiagnostic.fullName} from{" "}
                {DIAGNOSTIC_SOURCE}.
              </p>
            )}
          </div>
        </section>

        <section id="systems" className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <SignalLabel>The systems we install</SignalLabel>
            <h2 className="font-display max-w-3xl text-4xl leading-[1.03] tracking-[-0.04em] text-[#0D2037] sm:text-5xl">
              Matched to the dominant gap.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#526174]">
              After the diagnostic we map you to the lightest system that solves
              the real problem — not the heaviest package on the menu.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SITE.systems.map((system) => (
                <article
                  key={system.code}
                  className="flex flex-col border border-[#D8D4CC] bg-[#F8F6F1]"
                >
                  <div className="border-b border-[#D8D4CC] bg-[#0D2037] px-5 py-4 text-white">
                    <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[#F5B8BB]">
                      System {system.code}
                    </p>
                    <h3 className="mt-1 font-display text-2xl tracking-[-0.03em]">
                      {system.name}
                    </h3>
                  </div>
                  <div className="flex flex-1 flex-col px-5 py-5">
                    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#B8121C]">
                      Best for
                    </p>
                    <p className="mt-2 text-sm font-bold leading-6 text-[#0D2037]">
                      {system.bestFor}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-[#526174]">
                      <span className="font-extrabold text-[#0D2037]">
                        What this solves:
                      </span>{" "}
                      {system.solves}
                    </p>
                    <ul className="mt-4 grid gap-2 border-t border-[#D8D4CC] pt-4">
                      {system.includes.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2 text-xs leading-5 text-[#314154]"
                        >
                          <Check
                            size={14}
                            className="mt-0.5 shrink-0 text-[#B8121C]"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F8F6F1] py-16 sm:py-20">
          <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
            <SignalLabel>How we work</SignalLabel>
            <h2 className="font-display max-w-2xl text-3xl tracking-[-0.04em] text-[#0D2037] sm:text-4xl">
              Diagnostic → brief → human reply → discovery → systems.
            </h2>
            <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {SITE.howWeWork.map((step, index) => (
                <li
                  key={step}
                  className="border border-[#D8D4CC] bg-white px-4 py-5"
                >
                  <span className="font-display text-2xl text-[#B8121C]">
                    0{index + 1}
                  </span>
                  <p className="mt-2 text-xs font-bold leading-5 text-[#0D2037]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
            <div className="mt-10 border-l-2 border-[#B8121C] pl-5">
              <p className="text-sm leading-6 text-[#526174]">
                <span className="font-extrabold text-[#0D2037]">Why Hubil.</span>{" "}
                {SITE.whyHubil}
              </p>
              <p className="mt-3 text-sm font-bold text-[#0D2037]">
                Led by {SITE.managingDirector}.
              </p>
            </div>
          </div>
        </section>

        <section
          id="contact"
          className="relative overflow-hidden bg-[#0D2037] py-20 text-white sm:py-24"
        >
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(ellipse at 20% 80%, #B8121C22 0%, transparent 50%)" }} />
          <div className="relative mx-auto grid max-w-[1480px] gap-10 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20 lg:px-12 xl:px-16">
            <div>
              <SignalLabel light>Next step</SignalLabel>
              <h2 className="font-display text-4xl leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
                Complete the diagnostic. We continue with context.
              </h2>
              <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
                Or message directly if you need to speak now. We still tell you
                honestly whether there is fit and what the practical next step
                looks like.
              </p>
            </div>
            <div className="overflow-hidden border border-white/15 text-sm">
              <div className="flex items-center justify-between border-b border-white/15 bg-white/[0.06] px-5 py-3">
                <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.17em] text-[#F5B8BB]">
                  FirstLine operational panel
                </p>
                <span className="inline-flex items-center gap-2 text-[0.56rem] font-extrabold uppercase tracking-[0.14em] text-slate-300">
                  <span className="status-dot h-1.5 w-1.5 rounded-full bg-[#E14C53]" />{" "}
                  Open
                </span>
              </div>
              <div className="grid sm:grid-cols-3">
                <a
                  href={directWhatsApp}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 border-b border-white/15 px-5 py-5 text-white transition-colors hover:bg-white/5 sm:border-b-0 sm:border-r"
                >
                  <MessageCircle size={19} className="text-[#E14C53]" />
                  <span>
                    <span className="block text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                      WhatsApp
                    </span>
                    <span className="mt-1 block text-xs font-bold">
                      {SITE.primaryWhatsAppDisplay}
                    </span>
                  </span>
                </a>
                <div className="flex items-center gap-3 border-b border-white/15 px-5 py-5 sm:border-b-0 sm:border-r">
                  <Phone size={19} className="text-[#E14C53]" />
                  <span>
                    <span className="block text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                      Phone
                    </span>
                    <span className="mt-1 block text-xs font-bold">
                      {SITE.secondaryPhoneDisplay}
                    </span>
                  </span>
                </div>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 px-5 py-5 text-slate-200 transition-colors hover:bg-white/5"
                >
                  <Mail size={19} className="text-[#E14C53]" />
                  <span>
                    <span className="block text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                      Email
                    </span>
                    <span className="mt-1 block break-all text-xs font-bold">
                      {SITE.email}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#09182A] px-5 py-7 text-sm text-slate-400 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-3">
            <img
              src={SITE.images.hubilLogo}
              alt="Hubil Group"
              className="h-8 w-8 rounded-sm bg-white object-contain p-0.5"
            />
            <span>
              <span className="font-bold text-white">FirstLine</span> · Hubil
              Group · {SITE.taglineBrand}
            </span>
          </p>
          <a
            href={SITE.systemsDashboardUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-slate-300 transition-colors hover:text-white"
          >
            Hubil Group Systems <ArrowUpRight size={13} className="ml-1 inline" />
          </a>
        </div>
      </footer>
    </div>
  );
}
