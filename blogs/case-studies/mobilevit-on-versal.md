---
title: "MobileViTv2 on the Versal VCK-190: a vision transformer in an edge datapath"
date: 2026-10-07
type: case-study
tags: [edge-ai, hls, versal, transformers, hardware-aware-ml]
summary: "A transformer on edge silicon is a memory-hierarchy problem wearing an attention mask."
repo: ""
status: draft
---

# MobileViTv2 on the Versal VCK-190

**TL;DR —** I designed a custom HLS datapath to run MobileViTv2 on the AMD Versal
ACAP (VCK-190) during my time at ADRIN (ISRO). The interesting part was not the
FLOPs — it was the memory hierarchy. The attention block is the bandwidth problem;
everything else is arithmetic you can schedule.

## The problem

_Draft. Fill in: the sensing/remote-data use case, why the model had to run at the
edge rather than in the cloud, and the hard constraint the Versal imposed._

## The approach

_Draft. The HLS datapath design, how the attention block was restructured for the
memory hierarchy, and the hardware-aware optimisations._

## What worked / What I'd change

_Draft._
