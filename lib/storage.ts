import fs from 'fs';
import path from 'path';
import { DepinApp, AppInstallation } from '@/app/types';

const APPS_DIR = path.join(process.cwd(), 'apps');
const DATA_DIR = path.join(process.cwd(), 'data');
const INSTALLATIONS_FILE = path.join(DATA_DIR, 'installations.json');

export function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {fs.mkdirSync(DATA_DIR, { recursive: true });}
  if (!fs.existsSync(INSTALLATIONS_FILE)) {fs.writeFileSync(INSTALLATIONS_FILE, JSON.stringify([], null, 2));}
}

export function getAllApps(): DepinApp[] {
  const apps: DepinApp[] = [];
  if (!fs.existsSync(APPS_DIR)) {return apps;}
  const appDirs = fs.readdirSync(APPS_DIR, { withFileTypes: true }).filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.')).map(dirent => dirent.name);
  for (const appId of appDirs) {
    const infoPath = path.join(APPS_DIR, appId, 'info.ts');
    if (fs.existsSync(infoPath)) {
      try {
        const infoContent = fs.readFileSync(infoPath, 'utf-8');
        const extractValue = (key: string): string => {
          const match = infoContent.match(new RegExp(`${key}:\\s*["']([^"']*)["']`));
          return match ? match[1] : '';
        };
        const extractNestedValue = (parent: string, key: string): string => {
          const parentMatch = infoContent.match(new RegExp(`${parent}:\\s*{([^}]*)}`, 's'));
          if (parentMatch) {
            const nestedMatch = parentMatch[1].match(new RegExp(`${key}:\\s*["']([^"']*)["']`));
            return nestedMatch ? nestedMatch[1] : '';
          }
          return '';
        };
        const app: DepinApp = {
          id: appId,
          name: extractValue('name'),
          description: extractValue('description'),
          company: extractValue('company'),
          version: extractValue('version'),
          category: extractValue('category'),
          dockerComposeFile: extractValue('dockerComposeFile'),
          docs: extractValue('docs'),
          icon: extractValue('icon'),
          status: 'available',
          networkStatus: extractValue('status') as 'mainnet' | 'testnet' | 'devnet',
          requirements: {
            minMemoryGb: extractNestedValue('requirements', 'minMemoryGb'),
            minCpu: extractNestedValue('requirements', 'minCpu'),
            minDiskGb: extractNestedValue('requirements', 'minDiskGb')
          }
        };
        apps.push(app);
      } 
      catch (error) {console.error(`Failed to read info for ${appId}:`, error);}
    }
  }
  return apps;
}

export function getApp(id: string): DepinApp | null {
  const apps = getAllApps();
  return apps.find(app => app.id === id) || null;
}

export function getAllInstallations(): AppInstallation[] {
  initStorage();
  const data = fs.readFileSync(INSTALLATIONS_FILE, 'utf-8');
  return JSON.parse(data);
}

export function getInstallation(appId: string): AppInstallation | null {
  const installations = getAllInstallations();
  return installations.find(inst => inst.appId === appId) || null;
}

export function saveInstallation(installation: AppInstallation): void {
  initStorage();
  const installations = getAllInstallations();
  const index = installations.findIndex(i => i.appId === installation.appId);
  if (index >= 0) {installations[index] = installation;} 
  else {installations.push(installation);}
  fs.writeFileSync(INSTALLATIONS_FILE, JSON.stringify(installations, null, 2));
}

export function deleteInstallation(appId: string): boolean {
  initStorage();
  const installations = getAllInstallations();
  const filtered = installations.filter(inst => inst.appId !== appId);
  if (filtered.length === installations.length) {return false;}
  fs.writeFileSync(INSTALLATIONS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

export function getComposeFilePath(appId: string): string {return path.join(APPS_DIR, appId, 'docker-compose.yaml');}

export function getComposeFileContent(appId: string): string | null {
  const filePath = getComposeFilePath(appId);
  if (!fs.existsSync(filePath)) {return null;}
  return fs.readFileSync(filePath, 'utf-8');
}

export function getAppDocsPath(appId: string): string {return path.join(APPS_DIR, appId, 'docs.md');}

export function getAppDocs(appId: string): string | null {
  const filePath = getAppDocsPath(appId);
  if (!fs.existsSync(filePath)) {return null;}
  return fs.readFileSync(filePath, 'utf-8');
}