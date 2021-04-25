# VSN-A-Hyperledger-Fabric-Project
# COVID-19 Vaccine Supply Chain           
This project is a blockchain-based supply chain for end-to-end traceability of the COVID-19 vaccine. It will also ensure proper quality and secure distribution of the vaccine.
### Prequisites
* Git
* Curl
* Docker version 19.03.13
* Docker Compose
* Node.js

### Intalling Node.js
#To install nvm<br>
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

#to use nvm<br>
source ~/.bashrc

#We have used version14.15.0<br>
nvm install v14.15.0<br>
nvm use v14.15.0


### Installing Git and Curl
sudo apt install -y git curl

### Installing Docker
https://docs.docker.com/engine/install/ubuntu/

### Installing Docker Compose
https://docs.docker.com/compose/install/

### Downloading COVID-19 Vaccine Supply Chain project
cd $HOME <br>
git clone https://github.com/Risvy/VSN-A-Hyperledger-Fabric-Project.git

### Setting up Environment Variables
nano ~/.bashrc<br>
If you have vs code then use<br>
code ~/.bashrc <br>
export PATH=$PATH:$HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/bin <br>
export FABRIC_CFG_PATH=$HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/config <br>
then save it by pressing ctrl+s and then exit

### Stop ,start network ,create channel and deploy chaincode
cd $HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/fabcar <br>
run the command <br>
sudo ./startFabric.sh javascript

### Installing libraries for running the project
cd javascript <br>
npm install <br>
npm i express,hbs,body-parser,async,express-session,express-validator,alert,process,querystring,qrcode,jimp,qrcode-reader --save <br>
node enrollAdmin.js <br>
node registerUser.js

### CouchDB UI
You can see the database here <br>
http://localhost:5984/_utils/ <br>
Username:admin<br>
Password:adminpw

### Run the project
nodemon app.js
 






