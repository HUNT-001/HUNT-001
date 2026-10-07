---
title: "Why hold violations survive simulation and kill silicon"
date: 2026-10-07
type: technical-blog
tags: [static-timing, cts, rtl, signoff]
summary: "You cannot slow the clock to fix a hold violation. That asymmetry is the whole story."
status: draft
---

# Why hold violations survive simulation and kill silicon

**TL;DR —** setup violations scale with the clock; hold violations don't. That one
asymmetry is why hold buffers exist and why clock-tree synthesis matters more than
it looks.

## The setup/hold asymmetry

_Draft. Walk through both closure conditions and why only one is frequency-independent._

## Why simulation misses it

_Draft._

## References

- The main profile README has the timing inequalities rendered as equations.
