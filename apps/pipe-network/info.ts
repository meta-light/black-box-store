import { Info } from "../interface";

export const info: Info = {
    name: "Pipe Network",
    description: "Pipe Network is a decentralized CDN that provides content delivery services.",
    company: "Pipe Network",
    version: "1.0.0",
    category: "Network",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.pipe.network/docs/nodes/mainnet.md",
    icon: "/icons/pipe.jpg",
    requirements: {
        minMemoryGb: "2",
        minCpu: "1",
        minDiskGb: "10"
    },
    status: "mainnet"
}