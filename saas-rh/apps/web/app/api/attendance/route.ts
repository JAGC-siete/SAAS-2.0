import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, createServerClient } from '@saas-rh/utils';

const Body = z.object({
	employee_code: z.string().min(3).max(32),
	check_type: z.enum(['IN','OUT']),
	ts: z.string().datetime()
});

export async function POST(req: NextRequest) {
	const ip = req.headers.get('x-forwarded-for') || '0.0.0.0';
	const allowed = await rateLimit({ key: `att:${ip}`, limit: 10, windowSec: 60 });
	if (!allowed) return NextResponse.json({ error: 'rate_limited' }, { status: 429 });

	const json = await req.json();
	const parsed = Body.safeParse(json);
	if (!parsed.success) return NextResponse.json({ error: 'invalid', issues: parsed.error.issues }, { status: 400 });

	const supabase = createServerClient(); // anon client (NO service role)
	const { data, error } = await supabase.rpc('create_attendance', {
		p_employee_code: parsed.data.employee_code,
		p_check_type: parsed.data.check_type,
		p_ts: parsed.data.ts
	});
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ ok: true, record: data });
}