[![Competition](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)
[![Rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/irfanirawan1108-spec/tiny-stack-vm-01/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard)
[![Reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/irfanirawan1108-spec/tiny-stack-vm-01/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122)

# tiny-stack-vm-01

A tiny stack virtual machine for make.fun's tiny stack ISA v1 (32-bit
wrapping integers, 256-value stack, branches, calls, 256 words of memory,
input/output, ten traps, step and output limits).

## Files

- `main.ts` — the entry: runs every `/input/<id>/program.bin` on its
  `/input/<id>/input.bin` and writes `/output/<id>/stdout.bin` and
  `/output/<id>/exit.txt`. Node 22, no dependencies, deterministic.

## Run locally

```sh
mkdir -p out && MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
```
