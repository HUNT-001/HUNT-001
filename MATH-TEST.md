# Math rendering test

Push this file, open it on GitHub, and note which cells render as **real equations**
and which show **raw LaTeX**. Delete the file once we know.

Nothing here needs enabling — GitHub math is on by default for every account.
This is only about which *syntax* survives which *context*.

---

## A — outside any HTML block

**A1. inline, plain dollars:** the discount factor is $\gamma \in [0,1)$ here.

**A2. inline, backtick form:** the discount factor is $`\gamma \in [0,1)`$ here.

**A3. block, double-dollar on one line:**

$$Q^{*}(s,a) = \mathbb{E}\left[\, r + \gamma \max_{a'} Q^{*}(s',a') \,\right]$$

**A4. block, triple-backtick `math` fence:**

```math
Q^{*}(s,a) = \mathbb{E}\left[\, r + \gamma \max_{a'} Q^{*}(s',a') \,\right]
```

---

## B — inside a `<details>` block

<details open>
<summary><b>B — expand me</b></summary>

<br>

**B1. inline, plain dollars:** the discount factor is $\gamma \in [0,1)$ here.

**B2. inline, backtick form:** the discount factor is $`\gamma \in [0,1)`$ here.

**B3. block, double-dollar on one line:**

$$Q^{*}(s,a) = \mathbb{E}\left[\, r + \gamma \max_{a'} Q^{*}(s',a') \,\right]$$

**B4. block, triple-backtick `math` fence:**

```math
Q^{*}(s,a) = \mathbb{E}\left[\, r + \gamma \max_{a'} Q^{*}(s',a') \,\right]
```

</details>

---

## C — a long expression inside `<details>`

Matches the real complexity in the README, in case length or `\underbrace` is the problem.

<details open>
<summary><b>C — expand me</b></summary>

<br>

**C1. double-dollar, one line:**

$$\mathcal{L}(\theta,\phi) \;=\; \mathbb{E}_{q_\phi}\!\left[\sum_{t=1}^{T} \underbrace{\ln p_\theta(o_t \mid h_t, z_t)}_{\text{reconstruction}} \;-\; \beta \underbrace{\mathrm{KL}\!\left[\, q_\phi \,\|\, p_\theta \,\right]}_{\text{complexity}}\right]$$

**C2. double-dollar, spanning lines:**

$$
\mathcal{L}(\theta,\phi) \;=\; \mathbb{E}_{q_\phi}\!\left[\sum_{t=1}^{T} \underbrace{\ln p_\theta(o_t \mid h_t, z_t)}_{\text{reconstruction}} \;-\; \beta \underbrace{\mathrm{KL}\!\left[\, q_\phi \,\|\, p_\theta \,\right]}_{\text{complexity}}\right]
$$

</details>

---

## What to report back

Just tell me which of these show raw LaTeX instead of equations:

```
A1  A2  A3  A4
B1  B2  B3  B4
C1  C2
```

From your last screenshot we already know **B2 works** (inline backtick, inside details)
and **B4 fails** (triple-backtick math fence, inside details). The README now uses B3 everywhere.
If B3 also fails, the fallback is to move every equation out of the `<details>` blocks,
or to typeset them as SVG like the two showpiece plates already are.
