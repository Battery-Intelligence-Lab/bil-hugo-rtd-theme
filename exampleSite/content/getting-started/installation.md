---
title: Installation
weight: 1
---

# Installation

## Prerequisites

You need [Hugo](https://gohugo.io/) (extended edition) and [Go](https://golang.org/) installed.

## As a Hugo Module

Add the theme to your `hugo.toml`:

```toml
[module]
[[module.imports]]
  path = "github.com/Battery-Intelligence-Lab/bil-hugo-rtd-theme"
```

Then run:

```bash
hugo mod get -u
hugo server
```

```note
Hugo extended edition is required for SCSS compilation. Make sure you have the extended version installed.
```

## Directory Structure

Your documentation site should look like:

```
docs/
├── hugo.toml
├── content/
│   ├── _index.md
│   └── getting-started/
│       ├── _index.md
│       └── installation.md
└── static/
    └── docs_logo.png
```

```tip
Use `weight` in front matter to control page ordering within sections. Lower weight = earlier in the list.
```
