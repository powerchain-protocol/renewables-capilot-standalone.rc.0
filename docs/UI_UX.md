# UI/UX System

Renewables Copilot is designed as an AI energy-operations console rather than a generic chatbot or crypto dashboard.

## Information architecture

Primary workspace areas are:

- Copilot
- Energy Operations
- P2P Markets
- Forecasting
- Carbon Intelligence
- Tokenized Assets
- PWRC Tokenomics
- Supply Chain
- Solana / SVM
- Sui
- Oracles
- Programs
- Monitoring

## Visual system

- light theme by default with a full dark theme
- white/light-gray surfaces, black/graphite text and dark-green primary actions
- compact enterprise typography
- restrained corner radii
- Radix primitives and icons for controls
- Web3 Icons for networks, tokens and wallets

## AI transparency

The UI should expose:

- active GRIDLLM mode
- selected provider preference/profile
- provider health/configuration
- data-source context
- sample versus live data
- evidence/source provenance where available

## Transaction safety

AI recommendations use `Review` or `Prepare` actions, never a direct autonomous `Execute` action. Wallet approval is a separate explicit step.

## Responsive behavior

Desktop uses a persistent sidebar and contextual workspace panels. Tablet collapses navigation progressively. Mobile uses a drawer/bottom navigation pattern with a sticky AI composer and 44px minimum interaction targets.
