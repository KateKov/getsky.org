#!/bin/bash
set -e # exit on first error

openssl aes-256-cbc -K $encrypted_fefd698972eb_key -iv $encrypted_fefd698972eb_iv -in ./.travis/id_rsa.getsky.deploy.enc -out ./.travis/id_rsa.getsky.deploy -d

eval "$(ssh-agent -s)" # start ssh-agent cache
# id_rsa is decrypted as the first step of Travis build, see .travis.yml
chmod 600 .travis/id_rsa.getsky.deploy # allow read access to the private key
ssh-add .travis/id_rsa.getsky.deploy # add the private key to SSH

# prevent authenticity confirmations 
ssh-keyscan $IP >> ~/.ssh/known_hosts

# shut down any currently running containers to prevent file locking when pushing new version
ssh $RUN_USER@$IP -p $PORT <<EOF
  cd $DEPLOY_DIR
  docker-compose kill
EOF

# push latest changes to test server's remote repo
git config --global push.default matching
git remote add deploy ssh://$PUSH_USER@$IP:$PORT$DEPLOY_DIR
git push deploy master

# start updated services
ssh $RUN_USER@$IP -p $PORT <<EOF
  export MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
  export MYSQL_USER=${MYSQL_USER}
  export MYSQL_PASSWORD=${MYSQL_PASSWORD}
  export TRADE_MYSQL=${TRADE_MYSQL}

  export RECAPTCHA_SECRET=${RECAPTCHA_SECRET}
  export MAIL_USERNAME=${MAIL_USERNAME}
  export MAIL_PASSWORD=${MAIL_PASSWORD}
  export REACT_APP_RECAPTCHA_KEY=${REACT_APP_RECAPTCHA_KEY}
  export FEEDBACK_ADDRESS=${FEEDBACK_ADDRESS}
  export MAIL_HOST=${MAIL_HOST}
  cd $DEPLOY_DIR
  sudo service docker restart # restart docker service to prevent "timeout" errors (https://github.com/docker/compose/issues/3633#issuecomment-254194717)
  make run-test-docker
  # run migrations
  docker exec backend sh -c "cd /usr/local/go/src/github.com/skycoin/getsky.org/db/ && bash ./migrate.sh"
EOF

# ssh-agent -k
