import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { incrementUsage } from '../../../lib/usage';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const usage = await incrementUsage(user.id);
  if (usage > 3) {
    return NextResponse.json({ error: 'Daily limit reached' }, { status: 429 });
  }

  const { url } = await req.json();
  return NextResponse.json({ message: `Ingested ${url}`, usage });
}
