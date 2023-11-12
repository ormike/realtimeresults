FROM       phusion/baseimage:focal-1.0.0

# Expose the sshd and HTML port.
EXPOSE 22
EXPOSE 80

#======================================================================
# Enable sshd
#======================================================================
RUN rm -rf /etc/service/sshd/down

#======================================================================
# Enable cron
#======================================================================
#RUN rm -rf /etc/service/cron/down

#======================================================================
# Install build tools and system packages
#======================================================================
RUN apt-get update && apt-get upgrade -y -o Dpkg::Options::="--force-confold"

RUN  apt-get update \
  && apt-get install -y apt-utils \
    autoconf \
    automake \
    build-essential \
    cpio \
    curl \
    dnsutils \
    inetutils-ping \
    iproute2 \
    less \
    libstdc++-8-dev \
    libssl-dev \
    locales \
    net-tools \
    netcat \
    nmap \
    npm \
    rsync \
    sudo \
    traceroute \
    tzdata \
    vim \
    wget

RUN cd /tmp && \
    wget github.com/PCRE2Project/pcre2/releases/download/pcre2-10.42/pcre2-10.42.tar.gz && \
    tar -zxf pcre2-10.42.tar.gz && \
    cd pcre2-10.42 && \
    ./configure && \
    make -j 2 && \
    sudo make install

RUN cd /tmp && \
    wget http://zlib.net/zlib-1.3.tar.gz && \
    tar -zxf zlib-1.3.tar.gz && \
    cd zlib-1.3 && \
    ./configure && \
    make -j 2 && \
    sudo make install

RUN cd /tmp && \
    wget http://www.openssl.org/source/openssl-1.1.1v.tar.gz && \
    tar -zxf openssl-1.1.1v.tar.gz && \
    cd openssl-1.1.1v && \
    ./config && \
    make -j 2 && \
    sudo make install && \
    # point to the system certs
    rmdir /usr/local/ssl/certs && \
    ln -s /etc/ssl/certs /usr/local/ssl/certs

ENV NGINX_VERSION nginx-1.24.0
ENV LD_LIBRARY_PATH=/usr/local/lib

# #======================================================================
# # Install additional packages
# #======================================================================
RUN apt-get install -y git

RUN git clone https://github.com/hongzhidao/nginx-upload-module.git /tmp/build/nginx-upload-module

#======================================================================
# Install nginx
#======================================================================
RUN mkdir -p /tmp/build/nginx && \
    cd /tmp/build/nginx && \
    wget --no-check-certificate -O ${NGINX_VERSION}.tar.gz https://nginx.org/download/${NGINX_VERSION}.tar.gz && \
    tar -zxf ${NGINX_VERSION}.tar.gz

WORKDIR /tmp/build/nginx/${NGINX_VERSION}
RUN ./configure --with-cc-opt='-g -O2 -fdebug-prefix-map=/tmp/build/nginx/${NGINX_VERSION}=. -fstack-protector-strong -Wformat -Werror=format-security -fPIC -D_FORTIFY_SOURCE=2' --with-ld-opt='-Wl,-Bsymbolic-functions -Wl,-z,relro -Wl,-z,now -fPIC' --add-module=/tmp/build/nginx-upload-module --with-stream --with-debug --with-compat --with-pcre-jit --with-http_ssl_module --with-http_stub_status_module --with-http_realip_module --with-http_auth_request_module --with-http_v2_module --with-http_dav_module --with-http_slice_module --with-threads --with-http_addition_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_sub_module --with-stream=dynamic --with-stream_ssl_module --with-mail=dynamic --with-mail_ssl_module
RUN make -j $(getconf _NPROCESSORS_ONLN)
RUN make install
WORKDIR /

#======================================================================
# Add files to /tmp
#======================================================================
ADD ./files /tmp

RUN cp /tmp/nginx.conf /usr/local/nginx/conf/nginx.conf && \
    cp /tmp/form.html /usr/local/nginx/html

RUN mkdir /etc/runit/runsvdir/default/nginx && \
  cp /tmp/nginx.sh /etc/runit/runsvdir/default/nginx/run && \
  chmod 755 /etc/runit/runsvdir/default/nginx/run

#======================================================================
# Create users
#======================================================================
RUN groupadd -g 1000 app \
  && useradd --create-home --shell /bin/bash -u 1000 -g 1000 app

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
# Install the latest stable nodejs
#======================================================================

RUN \ 
    npm install -g n && \
    n stable

USER app

RUN cd /home/app/realtimeresults && \ 
    npm install

USER root
#======================================================================
# Use baseimage's init system.
#======================================================================
CMD ["/sbin/my_init"]
