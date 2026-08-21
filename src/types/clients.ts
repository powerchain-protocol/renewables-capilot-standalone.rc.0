export type ClientStatus = "configured" | "degraded" | "unconfigured";
export type ExternalClient = { id: string; name: string; category: "ai" | "rpc" | "oracle" | "database" | "wallet"; status: ClientStatus; serverOnly?: boolean };
