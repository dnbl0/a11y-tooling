import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Contact endpoint. Validates the submission server-side and logs it. In a real
// deployment this is where you'd send an email (Resend, Postmark) or push to a
// CRM; for the portfolio build we validate + log so the flow is genuinely wired
// end to end without pretending to deliver mail.

const Body = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(160).optional().default(""),
  topic: z.string().max(40).optional().default("other"),
  message: z.string().min(5).max(4000),
});

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, email, topic } = parsed.data;
  // Replace with real delivery in production.
  console.log(`[contact] ${topic} from ${name} <${email}>`);

  return NextResponse.json({ ok: true });
}
