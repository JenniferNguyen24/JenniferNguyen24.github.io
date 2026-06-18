---
title: "Flat and Sharp Minima in the Loss Landscape: Geometry, Complexity, and Generalization"
date: 2026-06-18
category: research
lang: en
excerpt: "An exploration of why the geometry of where you land matters as much as how low you go."
tags: ["PAC-learning", "geometry", "generalization"]
---
# Flat and Sharp Minima in the Loss Landscape: Geometry, Complexity, and Generalization

*An exploration of why the geometry of where you land matters as much as how low you go.*

---

## 1. Introduction
<figure style="text-align:center;margin:1.5rem 0">
  <img src="https://raw.githubusercontent.com/JenniferNguyen24/JenniferNguyen24.github.io/main/images/flat_sharp.png" style="max-width:100%;border-radius:6px"/>
  <figcaption style="font-size:.82rem;color:#7A6E62;margin-top:.5rem;font-style:italic">Flat and sharp minima illustration, citing from https://zhuanlan.zhihu.com/p/488198704 </figcaption>
</figure>

The training of a deep neural network is, at its core, an optimization problem. Given a model with parameters $\theta \in \mathbb{R}^d$ and a dataset $\mathcal{D} = \{(x_i, y_i)\}_{i=1}^n$, we minimize an empirical loss:

$$\mathcal{L}(\theta) = \frac{1}{n} \sum_{i=1}^n \ell(f_\theta(x_i),\, y_i)$$

where $f_\theta$ is the network's output function and $\ell$ is a per-sample loss (e.g., cross-entropy). Modern networks have $d$ ranging from millions to hundreds of billions of parameters, making $\mathcal{L}$ a scalar function over an astronomically high-dimensional space. Gradient descent and its variants navigate this space, converging to some local minimum $\theta^*$ satisfying $\nabla_\theta \mathcal{L}(\theta^*) = 0$.

A central and somewhat counterintuitive observation has emerged over the past decade: **not all minima are created equal**. Two solutions $\theta_1^*$ and $\theta_2^*$ may achieve nearly identical training loss, yet differ dramatically in *test* performance. The prevailing geometric explanation is that minima differ in their *sharpness* — the curvature of the loss surface in their vicinity — and that **flat minima generalize better than sharp ones**.

This post develops this idea rigorously: we formalize sharpness, connect it to generalization theory, examine the geometry of the loss landscape, and discuss why certain optimizers find flatter regions.

---

## 2. Formalizing Sharpness

### 2.1 The Hessian and Local Curvature

Near a minimum $\theta^*$, the loss admits a second-order Taylor expansion:

$$\mathcal{L}(\theta^* + \delta) = \mathcal{L}(\theta^*) + \nabla \mathcal{L}(\theta^*)^\top \delta + \frac{1}{2}\delta^\top H \delta + O(\|\delta\|^3)$$

Since $\theta^*$ is a (local) minimum, $\nabla \mathcal{L}(\theta^*) = 0$, so the dominant perturbation term is:

$$\mathcal{L}(\theta^* + \delta) - \mathcal{L}(\theta^*) \approx \frac{1}{2}\delta^\top H\, \delta$$

where $H = \nabla^2_\theta \mathcal{L}(\theta^*) \in \mathbb{R}^{d \times d}$ is the **Hessian matrix**. Since $\theta^*$ is a minimum, $H$ is positive semidefinite, with eigenvalues $0 \leq \lambda_1 \leq \lambda_2 \leq \cdots \leq \lambda_d$.

**Definition (Sharpness).** The sharpness of a minimum $\theta^*$ is characterized by the spectrum of $H$. A minimum is called:

- **Sharp** if $\lambda_{\max}(H)$ is large — small perturbations in the direction of the top eigenvector cause a large increase in loss.
- **Flat** if $\lambda_{\max}(H)$ is small — the loss landscape is nearly flat in all directions around $\theta^*$.

### 2.2 Keskar's $\epsilon$-Sharpness

Keskar et al. (2017) proposed a practical scalar measure. For a perturbation budget $\epsilon > 0$, define:

$$\phi_{\epsilon}(\theta^*) = \frac{\max_{\|\eta\|_2 \leq \epsilon} \mathcal{L}(\theta^* + \eta) - \mathcal{L}(\theta^*)}{ 1 + \mathcal{L}(\theta^*)}$$

This measures the worst-case loss increase over a ball of radius $\epsilon$ around $\theta^*$, normalized by the training loss. A large $\phi_\epsilon$ indicates a sharp minimum; a small value indicates flatness.

Equivalently, for small $\epsilon$:

$$\max_{\|\eta\|_2 \leq \epsilon} \frac{1}{2}\eta^\top H \eta = \frac{\epsilon^2}{2} \lambda_{\max}(H)$$

so $\phi_\epsilon \approx \frac{\epsilon^2 \lambda_{\max}(H)}{2(1 + \mathcal{L}(\theta^*))}$, confirming that the leading eigenvalue of the Hessian is the key quantity.

### 2.3 The Hessian Spectrum in Practice

For large networks, computing $H$ explicitly is infeasible — it has $d^2$ entries. However, one can estimate Hessian-vector products $Hv$ in $O(d)$ time via the identity:

$$Hv = \nabla_\theta \left( \nabla_\theta \mathcal{L}(\theta)^\top v \right)$$

which allows power iteration to find $\lambda_{\max}$ efficiently. Empirically, the Hessian spectrum of deep networks tends to be very **heavy-tailed**: a handful of large eigenvalues ("bulk outliers") coexist with a vast majority of near-zero eigenvalues, reflecting the low intrinsic dimensionality of the loss geometry.

---

## 3. Generalization Theory: Why Flatness Should Matter

### 3.1 PAC-Bayes Bounds

The most principled connection between sharpness and generalization comes from PAC-Bayes theory. Let $P$ be a prior over $\mathbb{R}^d$ and $Q$ a posterior (the distribution induced by the optimizer). The PAC-Bayes theorem states that with probability $\geq 1 - \delta$ over the draw of $\mathcal{D}$:

$$\mathbb{E}_{Q}[\mathcal{L}_{\text{test}}(\theta)] \leq \mathbb{E}_{Q}[\mathcal{L}_{\text{train}}(\theta)] + \sqrt{\frac{D_{\mathrm{KL}}(Q \| P) + \ln(2\sqrt{n}/\delta)}{2n}}$$

where $D_{\mathrm{KL}}(Q \| P) = \mathbb{E}_Q\left[\ln \frac{dQ}{dP}\right]$ is the KL divergence. The generalization gap is controlled by the KL term.

Now consider a Gaussian posterior $Q = \mathcal{N}(\theta^*, \sigma^2 I)$ centered at the minimum, and a standard Gaussian prior $P = \mathcal{N}(0, I)$. The KL divergence is:

$$D_{\mathrm{KL}}(\mathcal{N}(\theta^*, \sigma^2 I) \| \mathcal{N}(0, I)) = \frac{1}{2}\left(\|\theta^*\|^2 + d\sigma^2 - d - d\ln\sigma^2\right)$$

For this bound to be meaningful, we need the posterior variance $\sigma^2$ to be large enough that the perturbed model $\theta^* + \mathcal{N}(0, \sigma^2 I)$ still performs well on training data — i.e., the loss is flat enough to tolerate noise of scale $\sigma$. This directly ties **flatness** (tolerance to perturbations) to a **small KL term** and thus a tight generalization bound.

### 3.2 Flat Minima and the Minimum Description Length Perspective

Hochreiter & Schmidhuber (1997) offered an information-theoretic view. A flat minimum occupies a large volume in weight space: the number of bits needed to describe $\theta^*$ up to precision $\varepsilon$ in a flat region of volume $V$ is approximately:

$$\text{MDL} \sim d \log_2\!\left(\frac{1}{\varepsilon}\right) - \log_2 V$$

A flat minimum, with large $V$, requires fewer bits to specify (since a coarser description still finds a good solution). By the MDL principle, models with lower description length generalize better — flat minima are therefore preferable.

### 3.3 The Stability-Based Perspective

An alternative route connects sharpness to **uniform stability**. An algorithm $\mathcal{A}$ is $\beta$-uniformly stable if for any two datasets $\mathcal{D}$ and $\mathcal{D}'$ differing in one sample:

$$\sup_z |\ell(\mathcal{A}(\mathcal{D}), z) - \ell(\mathcal{A}(\mathcal{D}'), z)| \leq \beta$$

Hardt et al. (2016) showed that SGD run for $T$ steps with learning rate $\eta_t$ satisfies:

$$\beta \leq \frac{2}{n} \sum_{t=1}^{T} \eta_t L$$

where $L$ is the Lipschitz constant of the loss. More refined analyses show that stability depends on the local curvature encountered along the trajectory — high-curvature (sharp) regions lead to larger $\beta$, hence poorer generalization guarantees.

---

## 4. Geometry and Topological Complexity of the Loss Landscape

### 4.1 The Loss Landscape as a Riemannian Manifold

The parameter space $\mathbb{R}^d$ equipped with the **Fisher information metric** $g_{\theta}$ becomes a Riemannian manifold $(\mathbb{R}^d, g)$, where the metric tensor at $\theta$ is:

$$g_{\theta}(\mu, \nu) = \mathbb{E}_{x,y}\!\left[\frac{\partial \log p_\theta(y|x)}{\partial \theta^\mu} \cdot \frac{\partial \log p_\theta(y|x)}{\partial \theta^\nu}\right]$$

This is the **Fisher information matrix** $F(\theta) = \mathbb{E}[\nabla \log p_\theta \, \nabla \log p_\theta^\top]$. The Riemannian gradient (used in natural gradient descent) is $\tilde{\nabla} \mathcal{L} = F(\theta)^{-1} \nabla \mathcal{L}(\theta)$, which accounts for the intrinsic geometry of the model's parameter manifold.

Curvature in this Riemannian sense is captured by the **sectional curvature** $K(\sigma)$ of 2-dimensional sections $\sigma \subset T_\theta \mathbb{R}^d$. Sharp minima correspond to regions of high sectional curvature, while flat minima sit in nearly Euclidean (low-curvature) regions of the manifold.

### 4.2 Saddle Points, Ridges, and the Morse Lemma

Morse theory provides a topological lens. Let $f : M \to \mathbb{R}$ be a smooth function on a manifold $M$. A point $p$ is **critical** if $df_p = 0$. The **Morse index** $\mu(p)$ is the number of negative eigenvalues of the Hessian $H_p f$. Critical points are classified:

- $\mu = 0$: local minimum
- $\mu = k$ for $1 \leq k \leq d-1$: saddle point of index $k$
- $\mu = d$: local maximum

The **Morse Lemma** states that near a nondegenerate critical point $p$, there exist local coordinates $(u_1, \ldots, u_d)$ such that:

$$f(u) = f(p) - u_1^2 - \cdots - u_\mu^2 + u_{\mu+1}^2 + \cdots + u_d^2$$

In deep networks, the loss landscape is populated predominantly by saddle points rather than sharp local minima — a consequence of the high dimensionality. The probability that all $d$ eigenvalues of a random symmetric matrix are positive decreases exponentially in $d$. Dauphin et al. (2014) argue this explains why SGD does not get stuck: it escapes saddle points through the directions of negative curvature.

### 4.3 Loss Surface Connectivity

A remarkable empirical observation (Garipov et al. 2018; Draxler et al. 2018) is that distinct local minima of deep networks are often connected by **low-loss paths**. That is, given two minima $\theta_1^*$ and $\theta_2^*$, there exists a continuous curve $\gamma : [0,1] \to \mathbb{R}^d$ with $\gamma(0) = \theta_1^*$, $\gamma(1) = \theta_2^*$, and:

$$\sup_{t \in [0,1]} \mathcal{L}(\gamma(t)) \approx \mathcal{L}(\theta_1^*) \approx \mathcal{L}(\theta_2^*)$$

This "mode connectivity" suggests that flat minima may be connected into broad, low-loss basins — a **flat manifold of solutions** rather than isolated points. The topology of these basins determines generalization: minima embedded in large basins generalize well.

### 4.4 Intrinsic Dimensionality of the Loss Landscape

The effective dimensionality of the loss landscape — the number of directions in which the loss actually varies — is much smaller than $d$. Define the **$\epsilon$-effective rank** of the Hessian as:

$$r_\epsilon(H) = \left|\{i : \lambda_i(H) \geq \epsilon \lambda_{\max}(H)\}\right|$$

Empirically, $r_\epsilon(H) \ll d$ for most deep networks, meaning the loss surface is essentially flat in the vast majority of directions. This low effective dimensionality implies that perturbations in most directions do not increase the loss — a structural source of flatness that is independent of the specific minimum found.

---

## 5. Batch Size, Learning Rate, and the Implicit Regularization of SGD

### 5.1 The Batch Size Effect

One of the most reproducible empirical findings is that **large-batch SGD converges to sharp minima**, while **small-batch SGD converges to flat minima**, even when both achieve the same training loss (Keskar et al., 2017). Why?

Small-batch SGD introduces gradient noise. Each step uses a stochastic gradient estimate:

$$\tilde{g}_t = \frac{1}{B} \sum_{i \in \mathcal{B}_t} \nabla_\theta \ell(f_\theta(x_i), y_i)$$

The noise covariance is $\Sigma(\theta) = \frac{1}{B}\text{Cov}(\nabla \ell)$. This noise is not purely harmful: it provides an **implicit regularization** that biases optimization toward flat regions. The stochastic gradient trajectory can escape sharp minima (high curvature → large loss sensitivity to perturbations) and settle into flatter ones.

### 5.2 The Noise Scale and SDE Approximation

Mandt et al. (2017) and Li et al. (2017) showed that SGD with learning rate $\eta$ and batch size $B$ approximates a **Langevin-type stochastic differential equation**:

$$d\theta_t = -\nabla \mathcal{L}(\theta_t)\, dt + \sqrt{\frac{\eta}{B}} \Sigma(\theta_t)^{1/2}\, dW_t$$

where $W_t$ is a Brownian motion. The **noise scale** $\eta / B$ determines the effective temperature of this diffusion. At equilibrium, the stationary distribution is approximately:

$$p(\theta) \propto \exp\!\left(-\frac{B}{\eta} \mathcal{L}(\theta)\right)$$

This is a **Boltzmann distribution** over parameters with inverse temperature $\beta = B/\eta$. Low temperature ($B/\eta$ large) concentrates mass at loss minima indiscriminately; high temperature ($B/\eta$ small) spreads mass, preferring **wide, flat minima** (which have larger basin volume and thus larger Boltzmann weight).

This provides a thermodynamic perspective: **flat minima have higher entropy** (larger basin volume) and are thermodynamically favored at high noise temperatures.

### 5.3 Sharpness-Aware Minimization

If flat minima generalize better, can we explicitly optimize for them? **SAM (Sharpness-Aware Minimization)**, proposed by Foret et al. (2021), does exactly this. It solves:

$$\min_\theta \max_{\|\epsilon\|_2 \leq \rho} \mathcal{L}(\theta + \epsilon)$$

The inner maximization finds the worst-case perturbation within a ball of radius $\rho$:

$$\hat{\epsilon}(\theta) = \arg\max_{\|\epsilon\|_2 \leq \rho} \mathcal{L}(\theta + \epsilon) \approx \rho \cdot \frac{\nabla_\theta \mathcal{L}(\theta)}{\|\nabla_\theta \mathcal{L}(\theta)\|_2}$$

(first-order approximation). The SAM gradient update is then:

$$\theta_{t+1} = \theta_t - \eta \nabla_\theta \mathcal{L}(\theta_t + \hat{\epsilon}(\theta_t))$$

This two-step procedure simultaneously optimizes loss value and flatness, and consistently yields lower test error across a wide range of architectures and datasets.

---

## 6. Sharp Minima: Not Always Harmful

While the flat-generalizes-better narrative is compelling, it deserves scrutiny.

### 6.1 The Dinh et al. Critique

Dinh et al. (2017) showed that sharpness is **not invariant to reparameterization**. For a ReLU network with parameters $\theta = (W_1, W_2, \ldots)$, one can rescale:

$$W_k \to \alpha W_k, \quad W_{k+1} \to W_{k+1}/\alpha$$

without changing the function $f_\theta$. This reparameterization changes the Hessian spectrum arbitrarily while keeping the loss and test performance identical. Therefore, a sharp minimum under one parameterization may be flat under another, and the geometric measure of sharpness can be misleading.

This motivates **scale-invariant sharpness measures**, such as:

$$\tilde{\phi}_\epsilon(\theta) = \max_{\|\eta\|_2 \leq \epsilon\|\theta\|_2} \mathcal{L}(\theta + \eta) - \mathcal{L}(\theta)$$

or sharpness in a normalized coordinate system that accounts for the invariances of the architecture.

### 6.2 Sharp Minima and Interpolation

In the interpolation regime (zero training loss), which modern overparameterized networks frequently achieve, all minima have $\mathcal{L}(\theta^*) = 0$ on the training set. The generalization gap is then *entirely* a function of the test behavior. Sharp minima in interpolation settings can still generalize if the function they represent is simple (low complexity) — highlighting that geometry alone is insufficient and must be paired with notions of **function complexity** (e.g., RKHS norm, spectral norm of weight matrices).

---

## 7. Loss Landscape Visualization

Directly visualizing a $d$-dimensional loss surface is impossible for $d \gg 3$. Li et al. (2018) proposed a principled low-dimensional visualization method. Choose two random (or filter-normalized) directions $\delta, \eta \in \mathbb{R}^d$ and plot:

$$\mathcal{L}(\theta^* + \alpha\, \delta + \beta\, \eta), \quad (\alpha, \beta) \in [-1,1]^2$$

**Filter normalization** rescales the directions to match the scale of the corresponding parameter filters:

$$\delta_{i,j} \leftarrow \frac{\delta_{i,j}}{\|\delta_{i,j}\|} \cdot \|W_{i,j}\|$$

where $W_{i,j}$ is the $j$-th filter of the $i$-th layer, removing the reparameterization ambiguity noted above. Under this normalization, flat minima produce smooth, bowl-shaped contours, while sharp minima produce tight, steep contours.

---

## 8. Connections to the PAC-Bayes Flatness Bound

We close by making the PAC-Bayes analysis more explicit. For a Gaussian perturbation $\theta = \theta^* + \mathcal{N}(0, \sigma^2 I)$, the expected perturbed loss is, to second order:

$$\mathbb{E}_\eta[\mathcal{L}(\theta^* + \eta)] \approx \mathcal{L}(\theta^*) + \frac{\sigma^2}{2} \text{tr}(H)$$

For the generalization bound to be tight with large $\sigma^2$ (small KL), we need:

$$\frac{\sigma^2}{2} \text{tr}(H) \ll 1 \implies \text{tr}(H) = \sum_{i=1}^d \lambda_i(H) \ll \frac{2}{\sigma^2}$$

The trace of the Hessian is thus the key flatness quantity here — it aggregates curvature across *all* directions, not just the top eigenvalue. A flat minimum must have small $\sum_i \lambda_i$, which means the loss surface is collectively flat, not just flat in a few directions. This is a strictly stronger condition than small $\lambda_{\max}$.

The resulting generalization bound takes the form:

$$\mathcal{L}_{\text{test}}(\theta^*) \lesssim \mathcal{L}_{\text{train}}(\theta^*) + \underbrace{\frac{\sigma^2}{2}\text{tr}(H)}_{\text{perturbation cost}} + \underbrace{\sqrt{\frac{\|\theta^*\|^2/\sigma^2 + d}{n}}}_{\text{complexity cost}}$$

Optimizing over $\sigma^2$ trades off these two terms, with the optimal $\sigma^2 \propto \sqrt{n/\text{tr}(H)}$ yielding a generalization gap of order $O\!\left(\sqrt{\text{tr}(H)/n}\right)$.

---

## 9. Summary

The geometry of the loss landscape is not merely an academic curiosity — it is a fundamental determinant of a neural network's ability to generalize. The key takeaways are:

1. **Sharpness is curvature**: Formally measured by the Hessian spectrum, sharp minima have large $\lambda_{\max}(H)$ or $\text{tr}(H)$, and are sensitive to perturbations.

2. **Flat minima generalize**: PAC-Bayes theory, MDL, and stability analyses all independently predict that minima with small curvature and large basin volume should generalize better.

3. **SGD has implicit bias toward flatness**: Through its noise structure, SGD at small batch sizes and large learning rates acts as a high-temperature Langevin sampler, thermodynamically preferring flat, high-entropy basins.

4. **Sharpness must be taken carefully**: Reparameterization invariance means naive curvature measures can be misleading; scale-normalized or function-space metrics are more principled.

5. **SAM explicitly optimizes flatness**: By solving a minimax problem over worst-case perturbations, SAM directly navigates toward flat minima and consistently improves generalization.

The interplay between optimization dynamics, loss landscape geometry, and statistical learning theory remains one of the richest open frontiers in deep learning theory.

---

## References

- Hochreiter, S. & Schmidhuber, J. (1997). Flat minima. *Neural Computation*, 9(1), 1–42.
- Keskar, N. S., Mudigere, D., Nocedal, J., Smelyanskiy, M., & Tang, P. T. P. (2017). On large-batch training for deep learning: Generalization gap and sharp minima. *ICLR 2017*.
- Dinh, L., Pascanu, R., Bengio, S., & Bengio, Y. (2017). Sharp minima can generalize for deep nets. *ICML 2017*.
- Dauphin, Y., Pascanu, R., Gulcehre, C., Cho, K., Ganguli, S., & Bengio, Y. (2014). Identifying and attacking the saddle point problem in high-dimensional non-convex optimization. *NeurIPS 2014*.
- Hardt, M., Recht, B., & Singer, Y. (2016). Train faster, generalize better: Stability of stochastic gradient descent. *ICML 2016*.
- Li, H., Xu, Z., Taylor, G., Studer, C., & Goldstein, T. (2018). Visualizing the loss landscape of neural nets. *NeurIPS 2018*.
- Mandt, S., Hoffman, M. D., & Blei, D. M. (2017). Stochastic gradient descent as approximate Bayesian inference. *JMLR*, 18(134).
- Garipov, T., Izmailov, P., Podoprikhin, D., Vetrov, D. P., & Wilson, A. G. (2018). Loss surfaces, mode connectivity, and fast ensembling of DNNs. *NeurIPS 2018*.
- Foret, P., Kleiner, A., Mobahi, H., & Neyshabur, B. (2021). Sharpness-aware minimization for efficiently improving generalization. *ICLR 2021*.