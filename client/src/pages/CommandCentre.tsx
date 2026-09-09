import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";

type QueueItem = {
  id: string;
  name: string;
  status: string;
  automationState?: string;
  priority?: string;
  nextAction?: string;
  followUpDue?: string;
  updatedAt?: string;
};

type Summary = {
  totals: {
    all: number;
    new: number;
    discovery: number;
    proposals: number;
    active: number;
    highPriority: number;
    needsAttention: number;
    waiting: number;
  };
  attention: QueueItem[];
  generatedAt: string;
};

export default function CommandCentre() {
  const [token, setToken] = useState(() => sessionStorage.getItem("firstline_ops_token") || "");
  const [draftToken, setDraftToken] = useState(token);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load(activeToken = token) {
    if (!activeToken) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ops/summary", {
        headers: { Authorization: `Bearer ${activeToken}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(response.status === 401 ? "Invalid operations key." : "Unable to load the command centre.");
      const json = (await response.json()) as Summary;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load the command centre.");
    } finally {
      setLoading(false);
    }
  }

  function unlock() {
    const next = draftToken.trim();
    if (!next) return;
    sessionStorage.setItem("firstline_ops_token", next);
    setToken(next);
    load(next);
  }

  useEffect(() => {
    if (token) load(token);
  }, []);

  const cards = useMemo(() => {
    if (!data) return [];
    return [
      ["Needs attention", data.totals.needsAttention, "Follow-up or review required"],
      ["High priority", data.totals.highPriority, "Strongest opportunities"],
      ["Waiting", data.totals.waiting, "Waiting for a response"],
      ["Active", data.totals.active, "Currently in delivery"],
    ];
  }, [data]);

  if (!token || !data) {
    return (
      <main className="min-h-screen bg-[#0D2037] px-5 py-12 text-white sm:px-8">
        <div className="mx-auto max-w-lg pt-16">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center bg-[#B8121C]"><ShieldCheck size={21} /></span>
            <div><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#F5B8BB]">FirstLine</p><h1 className="font-display text-3xl">Command Centre</h1></div>
          </div>
          <div className="border border-white/15 bg-white/5 p-6 backdrop-blur">
            <KeyRound size={20} className="text-[#F5B8BB]" />
            <h2 className="mt-4 text-xl font-extrabold">Private operations access</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Enter the CRON_SECRET configured for FirstLine. This key stays in your browser session and is never stored in the codebase.</p>
            <input value={draftToken} onChange={(e) => setDraftToken(e.target.value)} onKeyDown={(e) => e.key === "Enter" && unlock()} type="password" placeholder="Operations key" className="mt-5 w-full border border-white/15 bg-black/20 px-4 py-3 text-sm outline-none focus:border-[#E14C53]" />
            <button onClick={unlock} disabled={!draftToken.trim() || loading} className="mt-3 flex w-full items-center justify-center gap-2 bg-[#B8121C] px-4 py-3 text-sm font-extrabold disabled:opacity-50">{loading ? <RefreshCw className="animate-spin" size={17} /> : <ArrowUpRight size={17} />} Open Command Centre</button>
            {error && <p className="mt-4 text-sm text-[#F5B8BB]">{error}</p>}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] text-[#0D2037]">
      <header className="border-b border-[#D8D4CC] bg-[#0D2037] px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4">
          <div><p className="text-[0.6rem] font-extrabold uppercase tracking-[0.18em] text-[#F5B8BB]">Hubil Group System</p><h1 className="font-display text-3xl tracking-[-0.04em]">FirstLine Command Centre</h1></div>
          <button onClick={() => load()} className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-xs font-bold hover:bg-white/10" disabled={loading}>{loading ? <RefreshCw className="animate-spin" size={15} /> : <RefreshCw size={15} />} Refresh</button>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 lg:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(([label, value, note]) => <article key={label as string} className="border border-[#D8D4CC] bg-white p-5"><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-[#526174]">{label}</p><p className="mt-3 font-display text-4xl">{value}</p><p className="mt-1 text-xs text-[#526174]">{note}</p></article>)}
        </div>
        <section className="mt-8 border border-[#D8D4CC] bg-white">
          <div className="flex items-center justify-between border-b border-[#D8D4CC] px-5 py-4"><div><p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-[#B8121C]">Today</p><h2 className="mt-1 text-xl font-extrabold">Attention queue</h2></div><span className="text-xs text-[#526174]">Updated {new Date(data.generatedAt).toLocaleString()}</span></div>
          {data.attention.length === 0 ? <div className="px-5 py-12 text-center"><CheckCircle2 className="mx-auto" size={28} /><p className="mt-3 font-bold">Nothing needs attention.</p><p className="mt-1 text-sm text-[#526174]">The autopilot has no overdue work in the current queue.</p></div> : <div className="divide-y divide-[#D8D4CC]">{data.attention.map((item) => <article key={item.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1fr_1.2fr_auto] lg:items-center"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-extrabold">{item.name}</h3>{item.priority && <span className="border border-[#E14C53]/30 bg-[#FFF1F1] px-2 py-1 text-[0.58rem] font-extrabold uppercase text-[#B8121C]">{item.priority}</span>}</div><p className="mt-1 text-xs text-[#526174]">{item.status}{item.automationState ? ` · ${item.automationState}` : ""}</p></div><p className="text-sm leading-6 text-[#526174]"><span className="font-bold text-[#0D2037]">Next:</span> {item.nextAction || "Review client record"}</p><div className="inline-flex items-center gap-2 text-xs font-bold text-[#526174]"><Clock3 size={15} /> {item.followUpDue ? new Date(item.followUpDue).toLocaleDateString() : "Due now"}</div></article>)}</div>}
        </section>
        <div className="mt-6 flex items-center gap-2 text-xs text-[#526174]"><AlertTriangle size={14} /> External client messages remain human-approved.</div>
      </div>
    </main>
  );
}
