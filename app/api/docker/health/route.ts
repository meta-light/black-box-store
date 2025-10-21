import { NextResponse } from 'next/server';
import { checkDockerInstalled } from '@/lib/docker';
import { ApiResponse } from '@/app/types';

export async function GET() {
  try {
    const isInstalled = await checkDockerInstalled();
    const response: ApiResponse = {
      success: isInstalled,
      data: {dockerInstalled: isInstalled, status: isInstalled ? 'running' : 'not_running'},
      message: isInstalled ? 'Docker is running' : 'Docker is not running or not installed'
    };
    return NextResponse.json(response, { status: isInstalled ? 200 : 503 });
  } 
  catch (error: any) {
    const response: ApiResponse = {success: false, error: error.message};
    return NextResponse.json(response, { status: 500 });
  }
}