# Instrctions to run a development build

Install nvm and add to .bashrc/.zshrc

```sh
brew install scons
cd node_modules/react-native/third-party/double-conversion-1.1.6; make
```

Edit node_modules/react-native/scripts/launchPackager.command to add:

```sh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && . "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm use 8.3.0
```

In mobile_wallet
```sh
nvm use 8.3.0
brew install watchman
npm install -g react-native-cli
./node_modules/.bin/rn-nodeify --hack --install
react-native run-ios # You only have to do this once
```

Build and run the project in Xcode
