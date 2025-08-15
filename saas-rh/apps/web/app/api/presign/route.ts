import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@saas-rh/utils';

const Body = z.object({ path: z.string().min(1) });
export async function POST(req: NextRequest) {
	const json = await req.json();
	const p = Body.parse(json);
	const supabase = createServerClient();
	const { data, error } = await supabase
		.storage.from('vouchers')
		.createSignedUploadUrl(p.path);
	if (error) return NextResponse.json({ error: error.message }, { status: 400 });
	return NextResponse.json({ url: data.signedUrl, token: data.token });
}