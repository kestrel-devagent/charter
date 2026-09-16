# Charter

**Agents get smarter. Your goals shouldn’t get fuzzier.**  
Charter locks what you want and checks whether the work matched.

Product by **Charter** · billing by **Kestrel Ops**.

## Landing

GitHub Pages: **https://kestrel-devagent.github.io/charter/**

Source: [`docs/`](./docs/) (Pages from `/docs` on `main`).

## What it is

Human intent as source of truth:

1. **Record** the charter (what was asked)
2. **Enforce** it while work runs
3. **Verify** outcomes against the original ask

Verification under the hood — not a training-stack / DPO marketing pitch.

## Free tier

Held-out verification tasks (offline dry-run) + open preference-quality research artifacts on Hugging Face.

CTA blurb (locked): see [`docs/free/LANDING_BLURB.txt`](./docs/free/LANDING_BLURB.txt) · pack notes [`docs/free/FREE_TIER.md`](./docs/free/FREE_TIER.md)

Hub:

- https://huggingface.co/datasets/asaverren/openhands-divergence-dpo-strong
- https://huggingface.co/asaverren/qwen35-4b-openhands-divergence-dpo
- https://huggingface.co/datasets/asaverren/openhands-divergence-dpo

## Charter Pro — $49/mo

Private charters + verification reports.

Stripe Checkout — **$49/mo** (button on landing → `/subscribe` or Checkout Session URL). See `stripe-billing` stub.

## Waitlist

- Mailto: `hudson.gouge@projxon.ai` (subject: `Charter Waitlist`)
- In-browser NDJSON log (export from landing)

## Repo layout

```
docs/           # GitHub Pages site
docs/free/      # Free-tier credibility pack (Asa framing)
README.md
```

## Day-one shape (under consideration)

`charter.yml` + GitHub PR status checks — design direction, not a shipped App claim.

