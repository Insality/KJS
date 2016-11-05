#!/bin/bash

cd /home/KJS
git checkout deploy
git pull
pkill 'nodejs KJS.js'
supervisorctl restart kjs
