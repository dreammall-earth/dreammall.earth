#!/usr/bin/env bash
# source https://stackoverflow.com/a/63286099
git rev-parse --abbrev-ref HEAD | iconv -c -t ascii//TRANSLIT | sed -E 's/[~^]+//g' | sed -E 's/[^a-zA-Z0-9]+/-/g' | sed -E 's/^-+|-+$//g' | tr A-Z a-z
