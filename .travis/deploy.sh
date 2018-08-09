#!/bin/bash
set -e # exit on first error
openssl aes-256-cbc -K $encrypted_9bae4e74c486_key -iv $encrypted_9bae4e74c486_iv -in ./.travis/id_rsa.getsky.deploy.enc -out ./.travis/id_rsa.getsky.deploy -d

eval "$(ssh-agent -s)" # start ssh-agent cache
# id_rsa is decrypted as the first step of Travis build, see .travis.yml
chmod 600 .travis/id_rsa.getsky.deploy # allow read access to the private key
ssh-add .travis/id_rsa.getsky.deploy # add the private key to SSH

# prevent authenticity confirmations 
ssh-keyscan $IP >> ~/.ssh/known_hosts

# start deployment process
# create directory for current version
ssh $RUN_USER@$IP -p $PORT "mkdir -p ${APP_USER_DIR}/getsky.${VERSION}"
# send build archive to the target server via sertificate
rsync -avzhe ssh getsky_build_${VERSION}.tar.gz $RUN_USER@$IP:${APP_USER_DIR}/getsky.${VERSION}
# unpack archive into the version dir, copy build file to the backend and client, migrate database
ssh $RUN_USER@$IP -p $PORT <<EOF
    systemctl stop getsky
    
    cd ${APP_USER_DIR}/getsky.${VERSION}; tar -zxvf getsky_build_${VERSION}.tar.gz

    if [ -d ${APP_USER_DIR}/current_version ]
    then
        rm -rf ${APP_USER_DIR}/current_version
    fi

    ln -s ${APP_USER_DIR}/getsky.${VERSION} current_version
    cp ${APP_USER_DIR}/current_version/backend/trade ${SKYCOIN_SERVICE_PATH}
    rsync -avh ${APP_USER_DIR}/current_version/client ${NGINX_HTML_PATH}
    migrate -database 'mysql://${MYSQL_CONNECTION_STRING}/getskytrade' -source file://current_version/migrations up
    systemctl start getsky
    sudo service nginx restart
EOF

