---
title: Other features
weight: 3
math: true
---

#  Documentation Features

This page demonstrates some other features available in the theme.

## LaTeX Equations

Inline math: The DTW distance between two series is computed as $d(x, y) = \sqrt{\sum_{k=1}^{K} (x_k - y_k)^2}$.

Display equations with automatic numbering (AMS style):

$$\frac{\partial u_{2:N}}{\partial t} = D_{s,i}(T) A u_{2:N} + B j_i(t) \tag{1}$$

$$E = mc^2 \tag{2}$$

Multi-line aligned equations:

$$\begin{align}
\text{DTW}(i, j) &= d(x_i, y_j) + \min \begin{cases}
\text{DTW}(i-1, j) \\
\text{DTW}(i, j-1) \\
\text{DTW}(i-1, j-1)
\end{cases} \tag{3}
\end{align}$$

MathJax is **auto-loaded** when the page contains `$$` or `\(` — no need for `math: true` in most cases.

---

## Tabbed Code Blocks

Show the same algorithm in multiple languages:

{{< tabs "dtw-example" >}}
{{< tab "C++" >}}
```cpp
#include <vector>
#include <cmath>
#include <algorithm>

double dtw(const std::vector<double>& a, const std::vector<double>& b) {
    size_t n = a.size(), m = b.size();
    std::vector<std::vector<double>> dp(n+1, std::vector<double>(m+1, 1e18));
    dp[0][0] = 0;
    for (size_t i = 1; i <= n; i++)
        for (size_t j = 1; j <= m; j++) {
            double cost = std::abs(a[i-1] - b[j-1]);
            dp[i][j] = cost + std::min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
        }
    return dp[n][m];
}
```
{{< /tab >}}
{{< tab "Python" >}}
```python
import numpy as np

def dtw(a, b):
    n, m = len(a), len(b)
    dp = np.full((n+1, m+1), np.inf)
    dp[0, 0] = 0
    for i in range(1, n+1):
        for j in range(1, m+1):
            cost = abs(a[i-1] - b[j-1])
            dp[i, j] = cost + min(dp[i-1, j], dp[i, j-1], dp[i-1, j-1])
    return dp[n, m]
```
{{< /tab >}}
{{< tab "MATLAB" >}}
```matlab
function d = dtw(a, b)
    n = length(a); m = length(b);
    dp = inf(n+1, m+1);
    dp(1,1) = 0;
    for i = 2:n+1
        for j = 2:m+1
            cost = abs(a(i-1) - b(j-1));
            dp(i,j) = cost + min([dp(i-1,j), dp(i,j-1), dp(i-1,j-1)]);
        end
    end
    d = dp(n+1, m+1);
end
```
{{< /tab >}}
{{< /tabs >}}

---

## Collapsible Sections

{{< details "Mathematical derivation (click to expand)" >}}
Using the eigenvalue decomposition of $A$ we can write:

$$\frac{\partial u_{2:N}}{\partial t} = D_{s,i}(T) V^{-1} \Lambda V u_{2:N} + V B j_i(t)$$

Using $z_{2:N} = V u_{2:N}$ and $\tilde{B} = V B$ we can write:

$$\frac{\partial z_{2:N}}{\partial t} = D_{s,i}(T) \Lambda z_{2:N} + \tilde{B} j_i(t)$$

This equation has the same format as the original equation, but the matrix $\Lambda$ is diagonal.
{{< /details >}}

{{< details "Full error output log" >}}
```
[2024-01-15 14:23:01] INFO: Starting DTW computation...
[2024-01-15 14:23:01] INFO: Loading 1000 time series from data/input.csv
[2024-01-15 14:23:02] INFO: Computing 499500 pairwise distances
[2024-01-15 14:23:15] INFO: Distance matrix complete (13.2s)
[2024-01-15 14:23:15] INFO: Running k-medoids with k=5
[2024-01-15 14:23:16] INFO: Converged after 12 iterations
[2024-01-15 14:23:16] INFO: Silhouette score: 0.742
```
{{< /details >}}

---

## Citations

The DTW-C++ software and its algorithms are described in {{< cite "kumtepeli2024" >}}.
Long-term energy use in off-grid solar home systems is analysed in {{< cite "perriment2026" "Section 4" >}}.
For electrochemical-thermal modelling of high power Li-ion pouch cells, see {{< cite "kumtepeli2026" >}}.

{{< bibliography >}}

---

## YouTube Videos

Embed tutorial or presentation videos:

{{< youtube "Wc4mxcF0NM4" >}}

---

## Admonition Boxes

```note
This note is rendered from a fenced code block — backward compatible with the Jekyll theme.
```

```warning
Ensure your time series have been z-normalized before computing DTW distances.
```

```tip
Use the Sakoe-Chiba band constraint to reduce DTW computation from $O(nm)$ to $O(n \cdot w)$ where $w$ is the band width.
```

```danger
Never use DTW with unnormalized series of different amplitudes — the results will be dominated by amplitude differences rather than shape similarity.
```
