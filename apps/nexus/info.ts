import { Info } from "../interface";

export const info: Info = {
    name: "Nexus",
    description: "Nexus is building a world supercomputer to enable the AI economy.",
    company: "Nexus",
    version: "1.0.0",
    category: "Network",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.nexus.xyz/layer-1/testnet/cli-node",
    icon: "/icons/nexus.jpg",
    requirements: {
        minMemoryGb: "2",
        minCpu: "1",
        minDiskGb: "10"
    },
    status: "devnet"
}