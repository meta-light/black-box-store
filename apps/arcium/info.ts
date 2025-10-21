import { Info } from "../interface";

export const info: Info = {
    name: "Arcium",
    description: "Encrypt Everything, Compute Anything",
    company: "Arcium",
    version: "1.0.0",
    category: "Network",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.arcium.com/developers/node-setup",
    icon: "/icons/arcium.jpg",
    requirements: {minMemoryGb: "2", minCpu: "1", minDiskGb: "10"},
    status: "devnet"
}