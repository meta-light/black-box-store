import { Info } from "../interface";

export const info: Info = {
    name: "Bless",
    description: "The world's first shared computer.",
    company: "Bless",
    version: "1.0.0",
    category: "Compute",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://docs.bless.network/run-a-node/native-node/get-started",
    icon: "/icons/bless.jpg",
    requirements: {
        minMemoryGb: "2",
        minCpu: "1",
        minDiskGb: "10"
    },
    status: "mainnet"
}

