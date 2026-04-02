---
title: Configuration
weight: 2
---

# Configuration

## Minimal Configuration

A consumer repo needs only ~15 lines in `hugo.toml`:

```toml
baseURL = "https://example.com/"
title = "My Docs"

[module]
[[module.imports]]
  path = "github.com/Battery-Intelligence-Lab/bil-hugo-rtd-theme"

[params]
  description = "My project documentation."
  logo = "logo.png"
  version = "v1.0.0"
  edit_on_github = true
  repo_url = "https://github.com/my-org/my-repo/"
```

## Available Parameters

| Parameter | Default | Description |
|---|---|---|
| `description` | `""` | Site description for meta tags |
| `logo` | `""` | Path to logo image in `static/` |
| `version` | `""` | Version shown below logo |
| `edit_on_github` | `false` | Show "Edit on GitHub" links |
| `repo_url` | `""` | GitHub repository URL |
| `search_enabled` | `true` | Enable Pagefind search |
| `code_copy` | `true` | Show copy button on code blocks |
| `math_globally` | `false` | Load MathJax on all pages |
| `mermaid_globally` | `false` | Load Mermaid on all pages |

```warning
When using Hugo Module mounts (e.g., for Doxygen integration), you must explicitly mount `content` and `static` as well, since Hugo stops using implicit mounts once any explicit mount is declared.
```
