import { NextRequest, NextResponse } from 'next/server';
import { getApp, getInstallation } from '@/lib/storage';
import { composeLogs } from '@/lib/docker';
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
    if (!installation) {
      const response: ApiResponse = {success: false, error: 'App is not installed'};
      return NextResponse.json(response, { status: 400 });
    }
    const { searchParams } = new URL(request.url);
    const tail = parseInt(searchParams.get('tail') || '100');
    const result = await composeLogs(installation.projectName, tail);
    if (!result.success) {
      const response: ApiResponse = {success: false, error: `Failed to get logs: ${result.error}`};
      return NextResponse.json(response, { status: 500 });
    }
    const response: ApiResponse = {success: true, data: { logs: result.output }};
    return NextResponse.json(response);
  } 
  catch (error: any) {
    const response: ApiResponse = {success: false, error: error.message};
    return NextResponse.json(response, { status: 500 });
  }
}