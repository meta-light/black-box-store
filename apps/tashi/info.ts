import { Info } from "../interface";

export const info: Info = {
    name: "Tashi",
    description: "",
    company: "Tashi",
    version: "1.0.0",
    category: "Compute",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.tashi.network/nodes/node-installation",
    icon: "/icons/tashi.jpg",
    requirements: {minMemoryGb: "2", minCpu: "1", minDiskGb: "10"},
    status: "devnet"
}