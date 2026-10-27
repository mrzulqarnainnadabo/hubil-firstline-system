/**
 * Founder alerts for FirstLine diagnostics.
 * Email (Resend) and/or WhatsApp (Twilio) when env vars are set.
 * All priorities get email when configured. High also attempts WhatsApp.
 * Failures are logged; they never block the diagnostic response.
 */

export type NotifyBrief = {
  priority: "High" | "Medium" | "Watch";
  track: string;
  orgType: string;
  fullName: string;
  contact: string;
  orgName?: string;
  dominantGap: string;
  notionUrl?: string;
  firstMove?: string;
};

function buildAlertBody(b: NotifyBrief): string {
  const org = b.orgName?.trim() || "—";
  const lines = [
    `FIRSTLINE · ${b.priority.toUpperCase()}`,
    `Name: ${b.fullName}`,
    `Org: ${org}`,
    `Type: ${b.orgType}`,
    `Track: ${b.track}`,
    `Gap: ${b.dominantGap}`,
    `Contact: ${b.contact}`,
  ];
  if (b.firstMove) lines.push(`First move: ${b.firstMove}`);
  if (b.notionUrl) lines.push(`Notion: ${b.notionUrl}`);
  lines.push(
    b.priority === "High"
      ? "Status: Briefed — respond within 1 business day."
      : "Status: Briefed — review and reply when ready.",
  );
  return lines.join("\n");
}

async function sendWhatsApp(body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.FOUNDER_WHATSAPP_TO;
  if (!sid || !token || !from || !to) return false;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
  const auth = Buffer.from(`${sid}:${token}`).toString("base64");
  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: body.slice(0, 1500),
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      JSON.stringify({
        event: "firstline.notify.whatsapp_error",
        status: res.status,
        body: text.slice(0, 300),
      }),
    );
    return false;
  }
  return true;
}

async function sendEmail(body: string, brief: NotifyBrief): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.FOUNDER_EMAIL_TO;
  const from =
    process.env.NOTIFY_EMAIL_FROM || "FirstLine <onboarding@resend.dev>";
  if (!apiKey || !to) return false;

  const org = brief.orgName?.trim() || brief.fullName;
  const subject = `[FirstLine] ${brief.priority} · ${org} · ${brief.track}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: body,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(
      JSON.stringify({
        event: "firstline.notify.email_error",
        status: res.status,
        body: text.slice(0, 300),
      }),
    );
    return false;
  }
  return true;
}

/**
 * Notify founder on every new diagnostic when channels are configured.
 * WhatsApp reserved for High. Email for all priorities.
 */
export async function notifyFounderOnDiagnostic(brief: NotifyBrief): Promise<{
  attempted: boolean;
  whatsapp: boolean;
  email: boolean;
}> {
  const body = buildAlertBody(brief);
  let whatsapp = false;
  let email = false;
  let attempted = false;

  if (brief.priority === "High") {
    attempted = true;
    try {
      whatsapp = await sendWhatsApp(body);
    } catch (err) {
      console.error(
        JSON.stringify({
          event: "firstline.notify.whatsapp_exception",
          message: err instanceof Error ? err.message : String(err),
        }),
      );
    }
  }

  try {
    email = await sendEmail(body, brief);
    if (email) attempted = true;
  } catch (err) {
    console.error(
      JSON.stringify({
        event: "firstline.notify.email_exception",
        message: err instanceof Error ? err.message : String(err),
      }),
    );
  }

  // If no email env, still mark High as attempted when WhatsApp ran
  if (brief.priority === "High") attempted = true;

  console.log(
    JSON.stringify({
      event: "firstline.notify.diagnostic",
      priority: brief.priority,
      whatsapp,
      email,
      track: brief.track,
      name: brief.fullName,
    }),
  );

  return { attempted, whatsapp, email };
}

/** @deprecated use notifyFounderOnDiagnostic */
export async function notifyFounderIfHigh(brief: NotifyBrief) {
  return notifyFounderOnDiagnostic(brief);
}
