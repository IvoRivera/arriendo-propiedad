import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const auth = await verifyAdminRequest(req);
    if (!auth.success) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { client: supabase } = auth;
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      email: user.email,
      name: user.user_metadata?.full_name || user.email 
    });
  } catch (err) {
    console.error('Error resolving user:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
