echo "DIR: data/"
cd data

  echo "NPM: begin"
  npm ci
  echo "NPM: end"

  echo "FETCH: begin"
  bash fetch-all.sh
  echo "FETCH: END"

  echo "PERSIST: begin"
  node data.js
  echo "PERSIST: END"

cd ..
sleep 1
echo


echo "DIR: client/"
cd client

  echo "NPM: begin"
  npm ci
  echo "NPM: end"

  echo "BUILD: begin"
  npm run build
  echo "BUILD: END"

cd ..
sleep 1
echo


echo "DIR: server/"
cd server

  echo "NPM: begin"
  npm ci
  echo "NPM: end"

  echo "BUILD: begin"
  npm run build
  echo "BUILD: END"
