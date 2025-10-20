#!/bin/bash
#
# This script runs Jekyll locally because I keep forgetting the command.
#
# Source:
# https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll
#
# Optional: Add environment variable `JEKYLL_ENV=foobarbaz` to change the env.
#
# If running in GitHub Codespaces, downgrade to Ruby 2.7 first.
#   rvm install ruby-2.7.2
#   rvm use 2.7
#

set -euo pipefail

# Cleans up any local files in the `_site` directory.
bundle exec jekyll clean
# Generates new `_site` directory and serves.
bundle exec jekyll serve
