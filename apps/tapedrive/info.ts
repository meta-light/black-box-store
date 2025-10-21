import { Info } from "../interface";

export const info: Info = {
    name: "TapeDrive",
    description: "TapeDrive is a decentralized storage network that allows you to store and retrieve data using tape drives.",
    company: "TapeDrive",
    version: "1.0.0",
    category: "Storage",
    dockerComposeFile: "docker-compose.yaml",
    docs: "https://github.com/spool-labs/deploy",
    icon: "/icons/tapedrive.jpg",
    requirements: {
        minMemoryGb: "2",
        minCpu: "1",
        minDiskGb: "10"
    },
    status: "devnet"
}