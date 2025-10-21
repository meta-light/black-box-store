import { Info } from "../interface";

export const info: Info = {
    name: "Grass",
    description: "Grass lets you easily share your unused internet bandwidth.",
    company: "Grass",
    version: "1.0.0",
    category: "Network",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://grass-foundation.gitbook.io/grass-docs/architecture/grass-node",
    icon: "/icons/grass.jpg",
    requirements: {minMemoryGb: "2", minCpu: "1", minDiskGb: "10"},
    status: "mainnet"
}