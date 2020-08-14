if [ -z "$TRAVIS_PULL_REQUEST" ] || [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  npm install -g npm-cli-login
  npm-cli-login -u seolhun -p $GITHUB_NPM_REGISTRY_TOKEN -e shun10116@gmail.com -r https://npm.pkg.github.com/
  npm set //npm.pkg.github.com/:_authToken=$GITHUB_NPM_REGISTRY_TOKEN

  ######################################################################################
  # If jobs has Github Tag, Docker is pushed
  ######################################################################################
  if [ ! -z "$TRAVIS_TAG" ]; then
    npm run release
  fi

  if [ "$TRAVIS_BRANCH" == "master" ]; then
    npm run release
  elif [ "$TRAVIS_BRANCH" == "develop" ]; then
    npm run release:dev
  fi
fi
