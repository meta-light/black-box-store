import { NextRequest, NextResponse } from 'next/server';
import { getApp, getInstallation, saveInstallation } from '@/lib/storage';
import { composeStop } from '@/lib/docker';
import { ApiResponse } from '@/app/types';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const result = await composeStop(id, installation.projectName);
    if (!result.success) {
      const response: ApiResponse = {success: false, error: `Failed to stop app: ${result.error}`, data: { output: result.output }};
      return NextResponse.json(response, { status: 500 });
    }
    installation.status = 'stopped';
    saveInstallation(installation);
    const response: ApiResponse = {success: true, message: 'App stopped successfully', data: { output: result.output }};
    return NextResponse.json(response);
  } 
  catch (error: any) {
    const response: ApiResponse = {success: false, error: error.message};
    return NextResponse.json(response, { status: 500 });
  }
}