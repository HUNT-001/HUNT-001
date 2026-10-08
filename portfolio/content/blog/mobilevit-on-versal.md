---
title: "MobileViTv2 on the Versal VCK-190"
type: "Case study"
date: "2026-10-07"
read: "8 min"
tags: ["edge-ai", "hls", "versal", "transformers"]
summary: "A transformer on edge silicon is a memory-hierarchy problem wearing an attention mask — what it actually took to fit one in an FPGA datapath."
---

**TL;DR —** I deployed an INT8-quantized MobileViTv2-XS vision transformer on the AMD
Versal VCK190 at ADRIN (ISRO), hitting sub-100 ms onboard inference for Earth
observation. The interesting part was never the FLOPs. It was the memory hierarchy.

## The problem

Onboard Earth-observation inference can't wait for a downlink. The model has to run on
the satellite's compute, under a hard latency and power budget, on an FPGA-class part —
the AMD Versal VCK190.

A vision transformer is an awkward fit for that. The attention block is bandwidth-bound,
not compute-bound, and a naive port spends all its time moving tensors.

## The approach

Working through the Vitis AI / Vitis HLS / Vivado flow, the model was quantized to INT8
and the datapath restructured around the memory hierarchy rather than the arithmetic. I
ran latency / throughput / utilization trade-off analysis across both the Versal and Zynq
UltraScale+ platforms to find where the attention block actually wanted to live.

## What worked

Sub-100 ms inference, onboard, within budget. The win came from treating attention as a
data-movement problem and scheduling around it — everything else was arithmetic that fit.

## What I'd change

More time on the quantization-aware fine-tuning loop; there was accuracy left on the table
that a tighter calibration set would have recovered.
