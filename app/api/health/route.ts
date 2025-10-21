import { NextResponse } from 'next/server';
import { checkDockerInstalled } from '@/lib/docker';
import { getAllApps, getAllInstallations } from '@/lib/storage';

export async function GET() {
  try {
    const dockerInstalled = await checkDockerInstalled();
    const apps = getAllApps();
    const installations = getAllInstallations();
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      checks: {docker: dockerInstalled ? 'ok' : 'error', storage: 'ok', api: 'ok'},
      stats: {totalApps: apps.length, installedApps: installations.length, runningApps: installations.filter(i => i.status === 'running').length}
    };
    return NextResponse.json(health);
  } 
  catch (error: any) {return NextResponse.json({ status: 'unhealthy', error: error.message, timestamp: new Date().toISOString() }, { status: 500 });}
}