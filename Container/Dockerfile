FROM       phusion/passenger-customizable:2.6.0

# Expose the sshd and HTML port.
EXPOSE 22
EXPOSE 80
EXPOSE 443

#======================================================================
# Enable sshd
#======================================================================
RUN rm -rf /etc/service/sshd/down

#======================================================================
# Enable cron
#======================================================================
#RUN rm -rf /etc/service/cron/down

#======================================================================
# Enable nginx
#======================================================================
RUN rm -rf /etc/service/nginx/down

#======================================================================
# Install build tools and system packages
#======================================================================
RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold"

RUN  apt-get update \
  && apt-get install -y apt-utils ca-certificates curl gnupg \
    dnsutils \
    inetutils-ping \
    less \
    net-tools \
    netcat \
    nmap \
    rsync \
    sudo \
    traceroute \
    vim \
    wget

ENV TERM=xterm-256color

#======================================================================
#   Node.js and Meteor 
#======================================================================
RUN /pd_build/nodejs.sh 20

#======================================================================
# Add files to /tmp
#======================================================================
COPY ./files /tmp

#======================================================================
# Create users and make the data folder
#======================================================================
#RUN groupadd -g 1000 app && \
#    useradd --create-home --shell /bin/bash -u 1000 -g 1000 app && \
#    mkdir /data && \
#    chmod 777 /data

#======================================================================
# Change UID and GID of app user (provided by base image)
#======================================================================
RUN usermod -u 1000 app && \
    groupmod -g 1000 app 

RUN for username in app; do \
  adduser $username sudo \
  && adduser $username adm \
  && cp -R /tmp/home-$username/. /home/$username \
  && rm -rf /tmp/home-$username \
  && touch /home/$username/.sudo_as_admin_successful \
  && chown -R $username /home/$username \
  && chgrp -R $username /home/$username \
  && chmod -R og-rwx /home/$username/.ssh \
  ; done

RUN \
  # the following locks the password for user app
  usermod -p '*' app \
  # set up sshd for keys, not passwords: \
  # && perl -pe 's/^#*PasswordAuthentication\b.*/PasswordAuthentication no/; s/^#*UsePAM\b.*/UsePAM no/;' -i /etc/ssh/sshd_config \
  # inhibit interactive confirmation on first connect to new host: \
  && perl -pe 's/.*\bStrictHostKeyChecking\b.*/StrictHostKeyChecking no/;' -i /etc/ssh/ssh_config \
  && echo "%sudo  ALL=(ALL)  NOPASSWD: ALL" > /etc/sudoers.d/sudogroup

#======================================================================
# Configure nginx
#======================================================================
RUN ln -s /home/app/realtimeresults/realtimeresults.conf /etc/nginx/sites-enabled && \
    rm /etc/nginx/sites-enabled/default

#======================================================================
# Install NPM packages
#======================================================================

USER app
COPY --chown=app:app ./realtimeresults/package*.json /home/app/realtimeresults/
RUN cd /home/app/realtimeresults && \ 
    npm install

#======================================================================
# Install the rest of the web app including nginx configuration
#======================================================================

COPY --chown=app:app ./realtimeresults /home/app/realtimeresults
RUN cd /home/app/realtimeresults && \
    npm run build

#======================================================================
# Use baseimage's init system.
#======================================================================

USER root
CMD ["/sbin/my_init"]

