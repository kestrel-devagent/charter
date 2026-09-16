# Charter free tier — credibility surface (offline)

**Product:** Charter  
**Public thesis:** Human intent as source of truth — record the charter (what was asked), enforce it, verify whether work matched. Agents get smarter; goals shouldn’t get fuzzier.  
**Engine under the hood (not the headline):** preference-quality audits + held-out agent-eval gates from lift-loop research  
**Owner surface:** Asa Verren (HF / verification engine) · Builder (landing / waitlist / billing)  
**Date stamped:** 2026-09-16 · **No Modal / no GPU required for this package**

## What this is

A free, offline-checkable credibility pack for **Charter**:

1. **Held-out verification freeze** — narrow task verifiers that check whether behavior matched an explicit ask; dry-run green offline.
2. **Open research artifacts on Hugging Face** that train/audit the preference-quality engine underneath (technically: strong divergence-DPO data + adapter — diagnostic only).
3. **Honest hedges** — what we claim, what we don’t.

This pack is for reviewers, waitlist visitors, and Builder’s Charter landing CTA. It is **not** a paid SKU. Paid private charter audits are separate (payee below).

## Why this framing

Headline is **not** “DPO dataset factory” or “this year’s coding-agent training stack.” Those age when models jump. Charter ages with intent: the ask stays the source of truth; verification stays the product.

## Hub links (engine artifacts)

| artifact | URL |
|---|---|
| Strong preference split (v2.2 / 386 train · 59 eval) | https://huggingface.co/datasets/asaverren/openhands-divergence-dpo-strong |
| Adapter (Hub default = strong-scale) | https://huggingface.co/asaverren/qwen35-4b-openhands-divergence-dpo |
| Parent mined pairs | https://huggingface.co/datasets/asaverren/openhands-divergence-dpo |
| Written results / hedges | `FINDINGS.md` (see lift-loop root or symlink) |

## Verification freeze (reality check)

| set | path (from lift-loop root) | count | dry-run |
|---|---|---|---|
| **Holdout freeze** | `data/agent_eval_holdout_tasks.json` (v7) | **51** | **51/51** |
| Freeze ids | `data/agent_eval_holdout_ids.json` (v6) | **51** append-only | — |
| Labels | `data/agent_eval_holdout_labels_v6.json` | **140** (toy_like 51 / needs_container 74 / skip 15) | — |
| Catalog | `data/agent_eval_holdout_catalog.jsonl` | **183** | — |
| Synthetic toys (plumbing only) | `data/agent_eval_tasks.json` (v6) | **42** | **41/42** intentional FAIL |

## How to run (dry-run, $0)

From `/workspace/lift-loop`:

```bash
# Holdout freeze plumbing gate (expected 51/51)
python tools/agent_eval_smoke.py --dry-run \
  --tasks data/agent_eval_holdout_tasks.json \
  --out artifacts/agent_eval_holdout_dryrun.json
```

Use project venv if present: `/workspace/lift-loop/.venv/bin/python`.

Live free APIs can exercise the harness; they cannot load our LoRA. Base-vs-adapter needs a local OpenAI-compatible server. See `notes/AGENT_EVAL.md`.

## Preference-quality engine (spot-check)

Strong-scale v2.2 unchanged (**386/59**). Latest human spot-check: **Round 16** → **0/8 junk** (`notes/STRONG_SPOTCHECK.md`). Threshold ≤2/8; no remine.

## Honest hedges (do not oversell)

- Engine pairwise read: 27%→42% raw (+15pp), length-norm **+22pp**, diagnostic **GO only**.
- **No statistical significance claim.** **No end-to-end agent-lift claim** from pairwise logprob alone.
- Freeze dry-run proves **verifier + dry_response plumbing**, not that any model solves the tasks live.
- Toy / narrow-verifier tasks are scaffolding toward real containers — not SWE-bench scores.
- Replay-rules remains a separate long-term product thesis.

## Paid private charter audits

Paid private audits via **Charter** — payee **hudson.gouge@projxon.ai**.  
(No pricing, SLA, or guarantee stated here.)

## Builder landing blurb

See `LANDING_BLURB.txt` for the waitlist CTA paste.
