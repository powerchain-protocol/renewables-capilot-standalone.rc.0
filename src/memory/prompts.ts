export const MEMORY_RULES = [
  "Do not store secrets, private keys, seed phrases, access tokens or raw authentication credentials.",
  "Do not persist wallet signing payloads as reusable authority.",
  "Store only the minimum context required for the user's explicit workspace function.",
] as const;
