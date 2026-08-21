export type MpcPolicy = { enabled:boolean; custody:"none"|"external-provider"; browserKeyShares:false };
export const DEFAULT_MPC_POLICY: MpcPolicy = { enabled:false, custody:"none", browserKeyShares:false };
