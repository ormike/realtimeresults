#!/bin/bash
set -e
HOME=/home/app exec chpst -u app /usr/local/bin/node /home/app/realtimeresults/server.js >> /tmp/node_run 2>&1


