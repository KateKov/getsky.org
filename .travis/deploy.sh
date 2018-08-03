#!/bin/bash
set -e # exit on first error

openssl aes-256-cbc -K $encrypted_fefd698972eb_key -iv $encrypted_fefd698972eb_iv -in ./.travis/id_rsa.getsky.deploy.enc -out ./.travis/id_rsa.getsky.deploy -d

eval "$(ssh-agent -s)" # start ssh-agent cache
# id_rsa is decrypted as the first step of Travis build, see .travis.yml
chmod 600 .travis/id_rsa.getsky.deploy # allow read access to the private key
ssh-add .travis/id_rsa.getsky.deploy # add the private key to SSH

# prevent authenticity confirmations 
ssh-keyscan $IP >> ~/.ssh/known_hosts

# start deployment process
# ssh $RUN_USER@$IP -p $PORT <<EOF
# EOF

# ssh-agent -k
