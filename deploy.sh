#! /bin/bash

# you already did this to get this file
# git clone https://github.com/ormike/realtimeresults.git

# install docker-ce
sudo apt update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-compose
sudo groupadd docker
sudo usermod -aG docker $USER

# next log out and copy in the server certificate
#
# scp -i ~/.ssh/pq3.pem letsencrypt.tar.gz ubuntu@34.210.212.45:realtimeresults
#
# log back in, untar the server certificate files, and build the container
# 
# cd realtimeresults
# tar -xzvf letsencrypt.tar.gz
# docker-compose up --build -d

# here are the commands to renew the certificate
#
# enter the realtimeresults container
# docker exec -it -u app realtimeresults1 bash
#
# then either
# apt update
# apt install certbot python3-certbot-nginx
# or
# /home/app/certbot_install.sh
# then 
# certbot renew --nginx-ctl /usr/sbin/nginx --nginx-server-root /etc/nginx --dry-run

