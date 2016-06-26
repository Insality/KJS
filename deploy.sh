#!/bin/bash

cd /home/KJS
git pull
supervisorctl restart kjs
