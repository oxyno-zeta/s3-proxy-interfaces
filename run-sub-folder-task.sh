#!/bin/bash

# This script exists because pre-commit can only run scripts at the root folder
# Usage:
# ./run-sub-folder-task.sh backend "make code/lint"

# Stop at first error
set -e

# Change directory
cd "$1"

# Execute command
$2
