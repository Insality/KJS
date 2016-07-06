#!/bin/bash

cd /home/KJS
git pull
killall nodejs
supervisorctl restart kjs
