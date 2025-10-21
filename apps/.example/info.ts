import { Info } from "../interface";

export const info: Info = {
    name: "Example DePIN Node",
    description: "Replace this with a clear description of what your DePIN node does. Explain its purpose and benefits in 2-3 sentences.",
    company: "Your Company Name",
    version: "1.0.0",
    category: "Storage",  // Options: Storage, Network, Compute, IoT, Other
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://your-project.com/docs",
    icon: "https://your-project.com/icon.png",
    requirements: {
        minMemoryGb: "2",    // Minimum RAM in GB
        minCpu: "1",         // Minimum CPU cores
        minDiskGb: "10"      // Minimum disk space in GB
    },
    status: "mainnet"  // Options: mainnet, testnet, devnet
}

