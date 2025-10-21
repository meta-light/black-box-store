import { Info } from "../interface";

export const info: Info = {
    name: "Inference.net",
    description: "Inference.net is the world’s largest distributed GPU network for AI inference.",
    company: "Inference.net",
    version: "1.0.0",
    category: "Compute",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.devnet.inference.net/devnet-epoch-3/overview",
    icon: "/icons/inference.png",
    requirements: {minMemoryGb: "2", minCpu: "1", minDiskGb: "10"},
    status: "devnet"
}