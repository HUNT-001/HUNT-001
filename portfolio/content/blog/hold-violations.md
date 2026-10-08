---
title: "Why hold violations survive simulation"
type: "Technical blog"
date: "2026-10-02"
read: "5 min"
tags: ["static-timing", "cts", "rtl", "signoff"]
summary: "Setup violations scale with the clock; hold violations don't. That one asymmetry is the whole story — and why CTS matters more than it looks."
---

**TL;DR —** setup violations scale with the clock; hold violations don't. That one
asymmetry is why hold buffers exist and why clock-tree synthesis matters more than it looks.

## The setup/hold asymmetry

Setup closure requires the clock period to cover the whole combinational path — so you can
always *slow the clock down* to fix a setup violation.

Hold closure is different. It compares the fastest path against the hold requirement, and
it is **frequency-independent**. You cannot slow the clock to fix a hold violation. That is
the entire reason hold buffers exist.

## Why simulation misses it

RTL simulation works on logical events, not real propagation delays. A hold violation is a
physical-timing phenomenon that only shows up once you have real delays from place-and-route
and clock-tree synthesis — which is why a design can pass every simulation and still die in
silicon.

## The takeaway

Treat clock-tree synthesis as a first-class design concern, not a backend afterthought. The
skew it controls is exactly the term that decides whether your hold paths close.
