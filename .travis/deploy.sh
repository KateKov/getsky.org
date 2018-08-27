#!/bin/bash
set -e # exit on first error
openssl aes-256-cbc -K $encrypted_732b5993a62d_key -iv $encrypted_732b5993a62d_iv -in ./.travis/id_rsa.getsky.deploy.enc -out ./.travis/id_rsa.getsky.deploy -d

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
    sudo systemctl stop getsky
    
    cd ${APP_USER_DIR}/getsky.${VERSION}; tar -zxvf getsky_build_${VERSION}.tar.gz
	
	if [ -d ${SKYCOIN_CLIENT_PATH}]
    then
        rm -rf ${SKYCOIN_CLIENT_PATH}
    fi	
	ln -s  ${NGINX_PATH} ${SKYCOIN_CLIENT_PATH}
	
	if [ -d ${APP_USER_DIR}/current_version ]
    then
        rm -rf ${APP_USER_DIR}/current_version
    fi
	
    ln -s ${APP_USER_DIR}/getsky.${VERSION} ${APP_USER_DIR}/current_version
    cp ${APP_USER_DIR}/current_version/backend/trade ${SKYCOIN_SERVICE_PATH}
    rsync -avh ${APP_USER_DIR}/current_version/client ${SKYCOIN_CLIENT_PATH}
    migrate -database 'mysql://${MYSQL_CONNECTION_STRING}/getskytrade' -source file://current_version/migrations up
    sudo systemctl start getsky
EOF

