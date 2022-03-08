#!/bin/bash
#
# This script runs Jekyll locally because I keep forgetting the command.
#
# Source:
# https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll
#
# Optional: Add environment variable `JEKYLL_ENV=foobarbaz` to change the env.

set -euo pipefail

# Cleans up any local files in the `_site` directory.
bundle exec jekyll clean
# Generates new `_site` directory and serves.
bundle exec jekyll serve
