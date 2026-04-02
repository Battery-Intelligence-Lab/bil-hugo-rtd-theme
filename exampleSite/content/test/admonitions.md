---
title: Admonitions
weight: 1
---

# Admonition Boxes

The theme supports four types of admonition boxes.

## Using Fenced Code Block Syntax

This syntax is backward-compatible with the Jekyll theme:

```note
This is a **note** admonition rendered from a fenced code block. It supports full markdown including `inline code`, [links](https://example.com), and lists.
```

```tip
This is a **tip** admonition. Use tips for helpful suggestions.
```

```warning
This is a **warning** admonition. Use warnings for important cautions.
```

```danger
This is a **danger** admonition. Use danger for critical information that could cause data loss or security issues.
```

## Using Hugo Shortcode Syntax

The same boxes can also be created with Hugo shortcodes:

{{< note >}}
This note was created with the Hugo shortcode syntax.
{{< /note >}}

{{< warning >}}
This warning was created with the Hugo shortcode syntax.
{{< /warning >}}
