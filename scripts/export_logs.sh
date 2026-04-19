#!/bin/bash

# Configuration
APP_DATA_DIR="/home/shuaib/.gemini/antigravity"
PROMPTS_DIR="./prompts"
BRAIN_DIR="$APP_DATA_DIR/brain"

# Ensure prompts directory exists
mkdir -p "$PROMPTS_DIR"

# Function to get the latest conversation ID
get_latest_id() {
    ls -dt "$BRAIN_DIR"/*/ | head -n 1 | xargs basename
}

# Determine target ID and Title
CONV_ID=${1:-$(get_latest_id)}
TITLE=${2:-"conversation_$CONV_ID"}

# Sanitize Title for filename
SAFE_TITLE=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | sed 's/[^a-z0-9_]//g')
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

if [ -z "$CONV_ID" ]; then
    echo "Error: No conversation logs found."
    exit 1
fi

LOG_SOURCE="$BRAIN_DIR/$CONV_ID/.system_generated/logs/overview.txt"
LOG_DEST="$PROMPTS_DIR/${TIMESTAMP}-${SAFE_TITLE}.md"

if [ -f "$LOG_SOURCE" ]; then
    node ./scripts/format_logs.js "$LOG_SOURCE" > "$LOG_DEST"
    echo "Successfully exported formatted log to: $LOG_DEST"
else
    echo "Error: Could not find log file at $LOG_SOURCE"
    exit 1
fi
