export interface Info {
    name: string;
    description: string;
    company: string;
    version: string;
    category: string;
    dockerComposeFile: string;
    docs: string;
    icon: string;
    requirements: {
        minMemoryGb: string;
        minCpu: string;
        minDiskGb: string;
    };
    status: "mainnet" | "testnet" | "devnet";
}