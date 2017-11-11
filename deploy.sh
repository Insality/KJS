#!/bin/bash 

echo ""
echo `date`
cd /home/PSS
git checkout deploy
git pull
pkill -f 'nodejs PSS.js'
supervisorctl restart pss
echo "=====" 