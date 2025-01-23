import { NextResponse } from 'next/server';
import { dataManager } from '@/lib/dataManager';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type || !['industry', 'etf', 'stock'].includes(type)) {
    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
  }

  const data = dataManager.getData(type);
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id, status } = body;

  if (!id || !status || !['normal', 'anomaly', 'fixed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const success = dataManager.updateDataStatus(id, status);
  if (!success) {
    return NextResponse.json({ error: 'Data point not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
} 