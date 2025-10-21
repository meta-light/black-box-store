import { NextResponse } from 'next/server';
import { getAllApps, getInstallation } from '@/lib/storage';
import { ApiResponse, DepinApp } from '@/app/types';

export async function GET() {
  try {
    const apps = getAllApps();
    const appsWithStatus = apps.map(app => {
      const installation = getInstallation(app.id);
      return {...app, status: installation ? installation.status : 'available'};
    });
    const response: ApiResponse<DepinApp[]> = {success: true, data: appsWithStatus as DepinApp[]};
    return NextResponse.json(response);
  } 
  catch (error: any) {
    const response: ApiResponse = {success: false, error: error.message};
    return NextResponse.json(response, { status: 500 });
  }
}