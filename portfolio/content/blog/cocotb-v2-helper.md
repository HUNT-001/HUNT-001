---
title: "Automating the cocotb v1 → v2 migration"
type: "Project write-up"
date: "2026-10-05"
read: "6 min"
tags: ["cocotb", "verification", "python", "tooling"]
summary: "Testbench debt compounds faster than design debt. The v1→v2 break is mechanical enough to automate and tedious enough that people defer it."
repo: "https://github.com/HUNT-001/cocotb-v2-migration-helper"
---

**TL;DR —** the cocotb v1 → v2 API break is exactly the kind of mechanical-but-tedious
change people put off, so I built a helper to do it. Testbench debt compounds faster than
design debt.

## The problem

cocotb v2 changed enough of the API surface that existing testbenches won't run unchanged.
The changes are mostly mechanical — renames, signature shifts, deprecations — which means
they're boring to do by hand and easy to get subtly wrong across a large suite.

## The approach

The helper parses the testbench, identifies the v1 patterns, and rewrites them to their v2
equivalents, flagging the handful of cases that genuinely need a human decision.

## What I'd change

Wider coverage of the long tail of edge cases, and a dry-run diff mode so the migration is
reviewable before it's applied.
