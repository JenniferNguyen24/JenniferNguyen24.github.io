---
title: "Publishing a paper about Memorization Capacity of ML models"
date: 2024-10-11
category: achievements
lang: en
excerpt: "First paper that I published"
tags: ["loss landscape", "MIA", "geometry"]
---
# The first ever paper that I published in my freshman year

During my freshman year, I was lucky enough to get to work with my first supervisor - a professor from Human-Machine Interaction Laboratory in University of Engineering and Technology. He was the first one who placed trust in me from the start with no hesitation. Thanks to his sharp judgements, I was able to work with Geometric Optimization, learning about Loss Landscape and derive a formula that can visualize the impact of learning rate on the risk of machine learning models memorizing the data, hence disclosing its data privacy. After a 3-months period of learning, I successfully validated my hypothesis about the geometry of loss landscape, published my own finding in Proceedings of the 15th International Conference on Knowledge System Engineering. 

## The paper content


**Title:** Optimizing Region of Convergence to Preserve Model Privacy from Membership Inference Attack

**Published at:** KSE 2023 (15th International Conference on Knowledge and Systems Engineering)

**Co-authors:** Tuan Dung Pham, Viet Cuong Ta — HMI Lab, VNU University of Engineering and Technology

**Summary:**

Membership Inference Attacks (MIA) are a class of privacy attacks where an adversary tries to determine whether a specific data record was used to train a machine learning model — effectively leaking information about sensitive training data. Our work investigates how the geometry of the loss landscape, shaped by the choice of learning rate during SGD training, directly influences a model's vulnerability to these attacks.

We found that training with a large learning rate guides the optimizer toward *flat minima* in the loss landscape — wide, stable regions where the loss changes little around the optimal parameters. Models converging in flat regions generalize better and, crucially, reveal significantly less about their training data. To measure this, we formalized the ε-sharpness of a local minimum as the maximum loss increase within a ball of radius ε around the converged weights, approximated using the gradient direction.

We validated this hypothesis across three architectures — ResNet-18, VGG-11, and a 2-layer MLP — on FashionMNIST and CIFAR10. Results consistently show that increasing the learning rate reduces MIA success rate by 2–4% while maintaining or improving test accuracy. For instance, on FashionMNIST, ResNet-18 trained at learning rate 0.5 reached ε-sharpness < 0.01 and an attack accuracy of only 53.99%, compared to 61.30% at learning rate 0.01.

The key takeaway: **a flatter loss landscape means a more private model** — and large learning rates are a simple, zero-cost mechanism to achieve it.