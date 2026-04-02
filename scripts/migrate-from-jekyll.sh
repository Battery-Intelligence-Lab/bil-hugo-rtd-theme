#!/usr/bin/env bash
#
# migrate-from-jekyll.sh — Migrate a Jekyll docs site to Hugo
# Usage: ./migrate-from-jekyll.sh <path-to-jekyll-docs>
#
# This script converts a Jekyll documentation site (using bil-jekyll-rtd-theme)
# to a Hugo-compatible structure for use with bil-hugo-rtd-theme.

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <path-to-jekyll-docs>"
  echo "Example: $0 /path/to/repo/docs"
  exit 1
fi

SRC="$1"
DEST="${2:-${SRC}_hugo}"

if [ ! -d "$SRC" ]; then
  echo "Error: $SRC is not a directory"
  exit 1
fi

echo "Migrating Jekyll docs from: $SRC"
echo "Output directory: $DEST"
echo ""

# Create Hugo directory structure
mkdir -p "$DEST/content"
mkdir -p "$DEST/static"

# Copy static assets
for ext in png jpg jpeg svg gif ico pdf; do
  find "$SRC" -maxdepth 1 -name "*.$ext" -exec cp {} "$DEST/static/" \;
done

# Process directories
for dir in "$SRC"/*/; do
  [ -d "$dir" ] || continue
  dirname=$(basename "$dir")

  # Skip non-content directories
  case "$dirname" in
    _*|node_modules|.git) continue ;;
  esac

  # Strip numeric prefix and convert underscores to hyphens
  # e.g., "1_getting_started" -> "getting-started"
  newname=$(echo "$dirname" | sed -E 's/^[0-9]+_//' | tr '_' '-')

  echo "Processing: $dirname -> $newname"
  mkdir -p "$DEST/content/$newname"

  # Process markdown files in this directory
  for mdfile in "$dir"*.md; do
    [ -f "$mdfile" ] || continue
    filename=$(basename "$mdfile")

    # Strip numeric prefix from filename
    newfilename=$(echo "$filename" | sed -E 's/^[0-9]+_//' | tr '_' '-')

    # Rename index.md to _index.md
    if [ "$newfilename" = "index.md" ]; then
      newfilename="_index.md"
    fi

    echo "  $filename -> $newfilename"

    # Transform front matter
    sed -E \
      -e 's/^layout: default$//' \
      -e 's/^nav_order: ([0-9]+)/weight: \1/' \
      -e '/^parent:/d' \
      "$mdfile" | sed '/^$/N;/^\n$/d' > "$DEST/content/$newname/$newfilename"
  done

  # Copy images to static
  for ext in png jpg jpeg svg gif; do
    find "$dir" -maxdepth 1 -name "*.$ext" -exec cp {} "$DEST/static/$newname/" \; 2>/dev/null || true
  done
  [ -d "$DEST/static/$newname" ] && [ -z "$(ls -A "$DEST/static/$newname" 2>/dev/null)" ] && rmdir "$DEST/static/$newname"
done

# Process root index.md
if [ -f "$SRC/index.md" ]; then
  echo "Processing: index.md -> _index.md"
  sed -E \
    -e 's/^layout: default$//' \
    -e 's/^nav_order: ([0-9]+)/weight: \1/' \
    -e '/^parent:/d' \
    "$SRC/index.md" | sed '/^$/N;/^\n$/d' > "$DEST/content/_index.md"
fi

# Generate hugo.toml from _config.yml if it exists
if [ -f "$SRC/_config.yml" ]; then
  echo ""
  echo "Found _config.yml. Generating hugo.toml..."

  title=$(grep '^title:' "$SRC/_config.yml" | sed 's/title: *//' | tr -d '"')
  description=$(grep '^description:' "$SRC/_config.yml" | sed 's/description: *//' | tr -d '"')
  repo_url=$(grep '^repo_url:' "$SRC/_config.yml" | sed 's/repo_url: *//' | tr -d '"')

  cat > "$DEST/hugo.toml" << EOF
baseURL = "/"
title = "$title"
languageCode = "en"

[module]
[[module.imports]]
  path = "github.com/Battery-Intelligence-Lab/bil-hugo-rtd-theme"

[params]
  description = "$description"
  repo_url = "$repo_url"
  edit_on_github = true
  search_enabled = true
EOF

  echo "Generated $DEST/hugo.toml"
fi

echo ""
echo "Migration complete!"
echo ""
echo "Next steps:"
echo "  1. cd $DEST"
echo "  2. hugo mod init github.com/YOUR-ORG/YOUR-REPO"
echo "  3. hugo mod get -u"
echo "  4. hugo server"
echo "  5. Review and fix any internal links (strip numeric prefixes from paths)"
echo "  6. Test admonition blocks (```note etc.) — they should work automatically"
