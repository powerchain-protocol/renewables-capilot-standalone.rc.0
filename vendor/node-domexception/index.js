"use strict";

if (typeof globalThis.DOMException !== "function") {
  throw new Error("Native DOMException is required. PowerChain requires Node >= 24.19.0.");
}

module.exports = globalThis.DOMException;
module.exports.DOMException = globalThis.DOMException;
