export type EmbeddedWalletProvider = "disabled" | "external";
export type EmbeddedWalletState = { enabled:boolean; provider:EmbeddedWalletProvider; address?:string };

// PowerChain does not custody or synthesize private keys. This boundary is ready for a
// reviewed embedded-wallet provider, while the default remains external wallet signing.
export const embeddedWalletConfig: EmbeddedWalletState = { enabled:false, provider:"disabled" };
