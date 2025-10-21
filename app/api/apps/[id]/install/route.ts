import { NextRequest, NextResponse } from 'next/server';
import { getApp, getInstallation, saveInstallation } from '@/lib/storage';
import { composeUp, checkDockerInstalled } from '@/lib/docker';
import { ApiResponse, AppInstallation } from '@/app/types';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const dockerRunning = await checkDockerInstalled();
    if (!dockerRunning) {
      const response: ApiResponse = {success: false, error: 'Docker is not running. Please start Docker and try again.'};
      return NextResponse.json(response, { status: 503 });
    }
    const { id } = await params;
    const app = getApp(id);
    if (!app) {
      const response: ApiResponse = {success: false, error: 'App not found'};
      return NextResponse.json(response, { status: 404 });
    }
    const existingInstallation = getInstallation(id);
    if (existingInstallation) {
      const response: ApiResponse = {success: false, error: 'App is already installed'};
      return NextResponse.json(response, { status: 400 });
    }
    const projectName = `depin-${app.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${id.slice(0, 8)}`;
    const result = await composeUp(id, projectName);
    if (!result.success) {
      const response: ApiResponse = {success: false, error: `Failed to install app: ${result.error}`, data: { output: result.output }};
      return NextResponse.json(response, { status: 500 });
    }
    const installation: AppInstallation = {appId: id, installedAt: new Date().toISOString(), status: 'running', projectName};
    saveInstallation(installation);
    const response: ApiResponse = {success: true, message: 'App installed successfully', data: { installation, output: result.output }};
    return NextResponse.json(response);
  } 
  catch (error: any) {
    const response: ApiResponse = {success: false, error: error.message};
    return NextResponse.json(response, { status: 500 });
  }
}