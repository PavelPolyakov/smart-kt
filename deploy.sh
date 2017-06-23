#!/bin/bash

ssh_opt="-o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=quiet";

ssh $ssh_opt ocelot "cd /var/www/smart-kt.pavelpolyakov.com ;
git fetch;
git reset --hard origin/master;
npm i;
npm run build;
supervisorctl restart smart-kt";
