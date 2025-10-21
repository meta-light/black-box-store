export interface DepinApp {
  id: string;
  name: string;
  description: string;
  company: string;
  version: string;
  category: string;
  dockerComposeFile: string;
  docs: string;
  icon: string;
  status: 'available' | 'installed' | 'running' | 'stopped' | 'error';
  networkStatus: 'mainnet' | 'testnet' | 'devnet';
  requirements: {
    minMemoryGb: string;
    minCpu: string;
    minDiskGb: string;
  };
}

export interface AppInstallation {
  appId: string;
  installedAt: string;
  status: 'running' | 'stopped' | 'error';
  containerId?: string;
  projectName: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}