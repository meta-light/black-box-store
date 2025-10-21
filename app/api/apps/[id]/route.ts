import { NextRequest, NextResponse } from 'next/server';
import { getApp, getInstallation } from '@/lib/storage';
import { ApiResponse } from '@/app/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const app = getApp(id);
    if (!app) {
      const response: ApiResponse = {success: false, error: 'App not found'};
      return NextResponse.json(response, { status: 404 });
    }
    const installation = getInstallation(id);
    app.status = installation ? installation.status : 'available';
    const response: ApiResponse = {success: true, data: app};
    return NextResponse.json(response);
  } 
  catch (error: any) {
    const response: ApiResponse = {success: false, error: error.message};
    return NextResponse.json(response, { status: 500 });
  }
}