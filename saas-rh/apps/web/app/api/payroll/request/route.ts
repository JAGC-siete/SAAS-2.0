import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { queues } from '@saas-rh/utils';

const Body = z.object({ period_start: z.string().date(), period_end: z.string().date(), type: z.enum(['Q1','Q2','MONTH']) });
export async function POST(req: NextRequest) {
	const input = Body.parse(await req.json());
	await queues.payroll.add('request', input, { jobId: `${input.period_start}:${input.type}` });
	return NextResponse.json({ ok: true });
}