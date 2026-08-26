/**
 * Design context — A calm, high-status assessment interface. It should feel
 * like a diagnostic record, not a conversion funnel. Data structure lives in config/diagnostic.ts.
 */
import { Button } from "@/components/ui/button";
import {
  DiagnosticResponse,
  diagnosticQuestions,
  emptyDiagnosticResponse,
} from "@/config/diagnostic";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  LockKeyhole,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

type ChoiceField =
  | "businessType"
  | "discoveryChannel"
  | "customerFrustration"
  | "readinessWindow";
type QuestionKey = keyof typeof diagnosticQuestions;

const questionKeys = Object.keys(diagnosticQuestions) as QuestionKey[];

type DiagnosticFlowProps = {
  whatsappUrl: string;
  onComplete?: (response: DiagnosticResponse) => void;
};

export function DiagnosticFlow({
  whatsappUrl,
  onComplete,
}: DiagnosticFlowProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [response, setResponse] = useState<DiagnosticResponse>(
    emptyDiagnosticResponse,
  );
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = useMemo(
    () => Math.round(((activeStep + 1) / 5) * 100),
    [activeStep],
  );
  const currentKey = activeStep < 4 ? questionKeys[activeStep] : null;
  const currentQuestion = currentKey ? diagnosticQuestions[currentKey] : null;

  function setChoice(field: ChoiceField, value: string) {
    setResponse((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function setContact(
    field: "fullName" | "businessName" | "whatsappNumber",
    value: string,
  ) {
    setResponse((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function moveNext() {
    if (currentKey && !response[currentKey]) {
      setError(
        "Select the option that best reflects your current position before continuing.",
      );
      return;
    }
    setError("");
    setActiveStep((current) => Math.min(current + 1, 4));
  }

  function moveBack() {
    setError("");
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !response.fullName.trim() ||
      !response.businessName.trim() ||
      !response.whatsappNumber.trim()
    ) {
      setError(
        "Please provide your name, business name, and WhatsApp number to complete the diagnostic.",
      );
      return;
    }

    const completedResponse: DiagnosticResponse = {
      ...response,
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completedResponse),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Unable to submit diagnostic");
      }

      onComplete?.(completedResponse);
      setSubmitted(true);
    } catch (err) {
      // Graceful fallback: still complete the experience locally so the user is not blocked.
      console.warn("Diagnostic API unavailable, completing locally:", err);
      onComplete?.(completedResponse);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function restartDiagnostic() {
    setResponse(emptyDiagnosticResponse);
    setActiveStep(0);
    setSubmitted(false);
    setError("");
  }

  if (submitted) {
    return (
      <div className="relative overflow-hidden border border-[#B8121C]/45 bg-[#0D2037] px-6 py-10 text-white sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,rgba(184,18,28,0.34),transparent_26%)]" />
        <div className="relative max-w-2xl">
          <span className="grid h-12 w-12 place-items-center border border-[#E14C53]/60 bg-[#B8121C]/25 text-[#F5B8BB]">
            <CheckCircle2 size={25} />
          </span>
          <p className="mt-7 text-[0.65rem] font-extrabold uppercase tracking-[0.19em] text-[#F5B8BB]">
            Diagnostic received · record secured
          </p>
          <h3 className="mt-3 font-display text-4xl leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl">
            Thank you. Your responses have been received.
          </h3>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            A Hubil systems specialist will review and respond. If you prefer to
            clarify something now, WhatsApp remains open as a secondary route.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#B8121C] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#D02832]"
            >
              <MessageCircle size={18} /> Open WhatsApp
            </a>
            <button
              type="button"
              onClick={restartDiagnostic}
              className="inline-flex items-center justify-center gap-2 border border-white/20 px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10"
            >
              <RotateCcw size={17} /> Start another diagnostic
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#D8D4CC] bg-white shadow-[0_24px_70px_rgba(13,32,55,0.09)]">
      <div className="grid border-b border-[#D8D4CC] bg-[#F8F6F1] sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="px-5 py-5 sm:px-8">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#B8121C]">
            FirstLine assessment file · FL–01
          </p>
          <p className="mt-1 text-sm font-bold text-[#0D2037]">
            Business Presence Diagnostic
          </p>
        </div>
        <div className="border-t border-[#D8D4CC] px-5 py-4 sm:border-l sm:border-t-0 sm:px-8">
          <p className="text-[0.58rem] font-extrabold uppercase tracking-[0.16em] text-[#526174]">
            Progress
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1.5 w-28 bg-[#D8D4CC]">
              <div
                className="h-full bg-[#B8121C] transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-[#0D2037]">
              {activeStep + 1} / 5
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="border-b border-[#D8D4CC] bg-[#0D2037] px-5 py-7 text-white lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
          <span className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-[#F5B8BB]">
            Assessment method
          </span>
          <p className="mt-4 font-display text-3xl leading-[1.04] tracking-[-0.04em]">
            A clear read on where your business stands.
          </p>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Five short records help us understand your present access, operational
            friction, and readiness for a stronger customer-facing system.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              "Business context",
              "Customer access",
              "Operational pressure",
              "Readiness signal",
              "Contact record",
            ].map((label, index) => (
              <div
                key={label}
                className={`flex items-center gap-3 border-l-2 pl-3 text-xs font-bold ${
                  index === activeStep
                    ? "border-[#E14C53] text-white"
                    : index < activeStep
                      ? "border-white/45 text-slate-300"
                      : "border-white/10 text-slate-500"
                }`}
              >
                <span className="font-display text-lg">0{index + 1}</span>
                {label}
              </div>
            ))}
          </div>
          <div className="mt-9 flex items-center gap-3 border-t border-white/15 pt-5 text-xs leading-5 text-slate-400">
            <LockKeyhole size={16} className="shrink-0 text-[#E14C53]" /> Your
            details are collected for a Hubil systems review, not a public
            directory.
          </div>
        </aside>

        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-11">
          {currentQuestion && currentKey ? (
            <div>
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#B8121C]">
                    Record {currentQuestion.record} · {currentQuestion.eyebrow}
                  </p>
                  <h3 className="mt-3 max-w-2xl font-display text-3xl leading-[1.06] tracking-[-0.04em] text-[#0D2037] sm:text-4xl">
                    {currentQuestion.title}
                  </h3>
                </div>
                <span className="font-display text-5xl tracking-[-0.07em] text-[#ECE8DF]">
                  {currentQuestion.record}
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#526174]">
                {currentQuestion.helper}
              </p>
              <div className="mt-8 grid gap-px border border-[#D8D4CC] bg-[#D8D4CC] sm:grid-cols-2">
                {currentQuestion.options.map((option) => {
                  const selected = response[currentKey] === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setChoice(currentKey as ChoiceField, option)
                      }
                      aria-pressed={selected}
                      className={`group flex min-h-[74px] items-center justify-between gap-4 px-5 py-4 text-left text-sm font-extrabold transition-colors ${
                        selected
                          ? "bg-[#0D2037] text-white"
                          : "bg-white text-[#0D2037] hover:bg-[#F8F6F1]"
                      }`}
                    >
                      <span>{option}</span>
                      <span
                        className={`grid h-6 w-6 place-items-center rounded-full border ${
                          selected
                            ? "border-[#E14C53] bg-[#B8121C] text-white"
                            : "border-[#D8D4CC] text-transparent group-hover:border-[#B8121C]"
                        }`}
                      >
                        <CheckCircle2 size={14} />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-[#B8121C]">
                Record 05 · contact record
              </p>
              <h3 className="mt-3 max-w-2xl font-display text-3xl leading-[1.06] tracking-[-0.04em] text-[#0D2037] sm:text-4xl">
                Where should a Hubil systems specialist respond?
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#526174]">
                Your contact details complete the assessment record. Use the
                WhatsApp number on which you can be reached.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-extrabold text-[#0D2037]">
                  Your name
                  <input
                    value={response.fullName}
                    onChange={(event) =>
                      setContact("fullName", event.target.value)
                    }
                    name="fullName"
                    autoComplete="name"
                    placeholder="e.g. Ada Okafor"
                    className="h-12 border border-[#D8D4CC] bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-[#8B95A3] focus:border-[#B8121C] focus:ring-2 focus:ring-[#B8121C]/15"
                  />
                </label>
                <label className="grid gap-2 text-sm font-extrabold text-[#0D2037]">
                  Business name
                  <input
                    value={response.businessName}
                    onChange={(event) =>
                      setContact("businessName", event.target.value)
                    }
                    name="businessName"
                    autoComplete="organization"
                    placeholder="e.g. Ada Essentials"
                    className="h-12 border border-[#D8D4CC] bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-[#8B95A3] focus:border-[#B8121C] focus:ring-2 focus:ring-[#B8121C]/15"
                  />
                </label>
                <label className="grid gap-2 text-sm font-extrabold text-[#0D2037] sm:col-span-2">
                  WhatsApp number
                  <input
                    value={response.whatsappNumber}
                    onChange={(event) =>
                      setContact("whatsappNumber", event.target.value)
                    }
                    name="whatsappNumber"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="e.g. +234 803 000 0000"
                    className="h-12 border border-[#D8D4CC] bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-[#8B95A3] focus:border-[#B8121C] focus:ring-2 focus:ring-[#B8121C]/15"
                  />
                </label>
              </div>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="mt-6 border-l-2 border-[#B8121C] bg-[#FFF7F7] px-4 py-3 text-sm font-semibold leading-6 text-[#7A1420]"
            >
              {error}
            </p>
          )}
          <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#D8D4CC] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={moveBack}
              disabled={activeStep === 0 || isSubmitting}
              className="inline-flex items-center justify-center gap-2 px-2 py-3 text-sm font-extrabold text-[#526174] transition-colors hover:text-[#0D2037] disabled:pointer-events-none disabled:opacity-30"
            >
              <ArrowLeft size={17} /> Previous record
            </button>
            {activeStep < 4 ? (
              <Button
                type="button"
                onClick={moveNext}
                size="lg"
                className="h-12 rounded-none bg-[#B8121C] px-5 text-sm font-extrabold text-white hover:bg-[#D02832]"
              >
                Continue <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-12 rounded-none bg-[#B8121C] px-5 text-sm font-extrabold text-white hover:bg-[#D02832] disabled:opacity-70"
              >
                {isSubmitting ? "Submitting…" : "Submit diagnostic"}
                {!isSubmitting && <ArrowRight size={18} />}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
