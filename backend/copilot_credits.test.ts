import {
  MESSAGE_CREDIT_UNIT_PWRC,
  MESSAGE_CREDIT_UNIT_USD_MICROS,
  quoteCopilotCredits,
  requiredUnitsForProviderCost,
} from "./copilot_credits";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const base = quoteCopilotCredits();
assert(MESSAGE_CREDIT_UNIT_PWRC === 10_000n, "base PWRC unit must stay 10,000");
assert(MESSAGE_CREDIT_UNIT_USD_MICROS === 20_000n, "base launch reference must be $0.02");
assert(base.pwrc === "10000", "base quote mismatch");
assert(base.referenceUsd === "0.02", "base USD quote mismatch");
assert(quoteCopilotCredits({ creditClass: "REPORT" }).pwrc === "250000", "report quote mismatch");
assert(quoteCopilotCredits({ pricingMode: "USD_INDEXED", priceUsdMicrosPerPwrc: 4n }).pwrc === "5000", "USD indexed quote mismatch");
assert(requiredUnitsForProviderCost(14_000n, 3_000n) === 1n, "one MCU should cover <= $0.014 provider cost at 30% margin");
assert(requiredUnitsForProviderCost(50_000n, 3_000n) === 4n, "$0.05 provider cost needs four MCU at 30% margin");

import {
  calculateToken2022GrossForNetAtomic,
  calculateToken2022PostFeeAtomic,
} from "./copilot_credits";

const targetNet = 10_000n * 1_000_000_000n;
const grossAtTwoPercent = calculateToken2022GrossForNetAtomic(targetNet, 200);
assert(calculateToken2022PostFeeAtomic(grossAtTwoPercent, 200) >= targetNet, "2% fee gross-up must fund one full MCU");
assert(calculateToken2022PostFeeAtomic(grossAtTwoPercent - 1n, 200) < targetNet, "gross-up must be minimal");
