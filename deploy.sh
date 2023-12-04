#! /bin/bash

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

# log out
# scp -r -i ~/.ssh/pq3.pem letsencrypt/ ubuntu@34.210.212.45:realtimeresults
# log back in
# cd realtimeresults
# docker-compose up --build -d
