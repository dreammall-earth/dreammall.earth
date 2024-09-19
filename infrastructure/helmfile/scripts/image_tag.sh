#!/usr/bin/env bash
echo "sha-$(git rev-parse HEAD | cut -c 1-7)"
