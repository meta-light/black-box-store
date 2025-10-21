import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { getComposeFilePath } from './storage';

const execAsync = promisify(exec);

export interface DockerComposeResult {success: boolean; output?: string; error?: string;}
function sanitizeProjectName(name: string): string {return name.toLowerCase().replace(/[^a-z0-9-]/g, '-');}

export async function checkDockerInstalled(): Promise<boolean> {
  try {await execAsync('docker --version'); await execAsync('docker compose version'); return true;} 
  catch (error) {return false;}
}

export async function composeUp(appId: string, projectName: string): Promise<DockerComposeResult> {
  try {
    const composePath = getComposeFilePath(appId);
    const sanitizedName = sanitizeProjectName(projectName);
    const composeDir = path.dirname(composePath);
    const { stdout, stderr } = await execAsync(`docker compose -f "${composePath}" -p "${sanitizedName}" up -d`, { cwd: composeDir, shell: '/bin/bash' });
    return {success: true, output: stdout + stderr};
  } 
  catch (error: any) {return {success: false, error: error.message, output: error.stdout || error.stderr};}
}

export async function composeDown(appId: string, projectName: string): Promise<DockerComposeResult> {
  try {
    const composePath = getComposeFilePath(appId);
    const sanitizedName = sanitizeProjectName(projectName);
    const composeDir = path.dirname(composePath);
    const { stdout, stderr } = await execAsync(`docker compose -f "${composePath}" -p "${sanitizedName}" down`, { cwd: composeDir, shell: '/bin/bash' });
    return {success: true, output: stdout + stderr};
  } 
  catch (error: any) {return {success: false, error: error.message, output: error.stdout || error.stderr};}
}

export async function composeStop(appId: string, projectName: string): Promise<DockerComposeResult> {
  try {
    const composePath = getComposeFilePath(appId);
    const sanitizedName = sanitizeProjectName(projectName);
    const composeDir = path.dirname(composePath);
    const { stdout, stderr } = await execAsync(`docker compose -f "${composePath}" -p "${sanitizedName}" stop`, { cwd: composeDir, shell: '/bin/bash' });
    return {success: true, output: stdout + stderr};
  } 
  catch (error: any) {return {success: false, error: error.message, output: error.stdout || error.stderr};}
}

export async function composeStart(appId: string, projectName: string): Promise<DockerComposeResult> {
  try {
    const composePath = getComposeFilePath(appId);
    const sanitizedName = sanitizeProjectName(projectName);
    const composeDir = path.dirname(composePath);
    const { stdout, stderr } = await execAsync(`docker compose -f "${composePath}" -p "${sanitizedName}" start`, { cwd: composeDir, shell: '/bin/bash' });
    return {success: true, output: stdout + stderr};
  } 
  catch (error: any) {return {success: false, error: error.message, output: error.stdout || error.stderr};}
}

export async function composePs(projectName: string): Promise<DockerComposeResult> {
  try {
    const sanitizedName = sanitizeProjectName(projectName);
    const { stdout, stderr } = await execAsync(`docker compose -p ${sanitizedName} ps --format json`);
    return {success: true, output: stdout};
  } 
  catch (error: any) {return {success: false, error: error.message, output: error.stdout || error.stderr};}
}

export async function composeLogs(projectName: string, tail: number = 100): Promise<DockerComposeResult> {
  try {
    const sanitizedName = sanitizeProjectName(projectName);
    const { stdout, stderr } = await execAsync(`docker compose -p ${sanitizedName} logs --tail=${tail}`);
    return {success: true, output: stdout + stderr};
  } 
  catch (error: any) {return {success: false, error: error.message, output: error.stdout || error.stderr};}
}