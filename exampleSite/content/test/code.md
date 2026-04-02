---
title: Code Highlighting
weight: 2
---

# Code Highlighting

The theme uses Hugo's built-in Chroma syntax highlighter.

## C++

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

template <typename T>
T dtw_distance(const std::vector<T>& a, const std::vector<T>& b) {
    size_t n = a.size(), m = b.size();
    std::vector<std::vector<T>> dp(n + 1, std::vector<T>(m + 1, std::numeric_limits<T>::max()));
    dp[0][0] = 0;

    for (size_t i = 1; i <= n; ++i) {
        for (size_t j = 1; j <= m; ++j) {
            T cost = std::abs(a[i-1] - b[j-1]);
            dp[i][j] = cost + std::min({dp[i-1][j], dp[i][j-1], dp[i-1][j-1]});
        }
    }
    return dp[n][m];
}
```

## Python

```python
import numpy as np
from dtwcpp import DTW

# Create DTW instance
dtw = DTW(metric="euclidean", band_width=10)

# Compute distance matrix
X = np.random.randn(100, 50)  # 100 time series of length 50
distances = dtw.fit_transform(X)
print(f"Distance matrix shape: {distances.shape}")
```

## Bash

```bash
# Build DTW-C++ from source
git clone https://github.com/battery-intelligence-lab/dtw-cpp.git
cd dtw-cpp
mkdir build && cd build
cmake -G "Unix Makefiles" ..
cmake --build . -j4 --config Release
```
