# VSN-A-Hyperledger-Fabric-Project
# COVID-19 Vaccine Supply Chain 

A blockchain-based supply chain for end-to-end traceability of the COVID-19 vaccine while ensuring proper distribution and secure transportation.
### Prequisites
* Git
* Curl
* Docker
* Docker Compose
* Node.js

### Intalling Node.js

To Install NVM (Node Version Manager):
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
To Use NVM:
```
source ~/.bashrc
```
Install NVM:

```
#We have used version 14.15.0. To install v14.15.0:

nvm install v14.15.0
nvm use v14.15.0


# To install LTS (Long-term support) version of node:

nvm install --lts
nvm use --lts
nvm alias default --lts
```


### Installing Git and Curl
```
sudo apt install -y git curl
```

### Installing Docker

(We used docker version 19.03.13. If the current version is not compitable please install docker v19.03.13) 

To download docker, please visit:
https://docs.docker.com/engine/install/ubuntu/



### Installing Docker Compose
To download Docker Compose, please visit:
https://docs.docker.com/compose/install/

### Downloading VSN: COVID-19 Vaccine Supply Chain Project
```
cd $HOME
git clone https://github.com/Risvy/VSN-A-Hyperledger-Fabric-Project.git
```

### Setting up Environment Variables

If you have Visual Studio Code installed, open terminal and type:
```
code ~/.bashrc
```
Else
```
nano ~/.bashrc
```
Add the following lines at the end of the script, save, and exit VS Code.
```
export PATH=$PATH:$HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/bin 
export FABRIC_CFG_PATH=$HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/config 
```
### Stop Network, Start network, Create Channel and Deploy Chaincode (All in one)

As we are using Javascript, we need to run the command:
```
cd $HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/fabcar 
sudo ./startFabric.sh javascript
```
If we use any other language, we have to replace 'javascript' portion of the command with that language. 

### Installing Libraries For Running The Project
Now, run the following commands: 
```
cd javascript
npm install 
npm i express,hbs,body-parser,async,express-session,express-validator,alert,process,querystring,qrcode,jimp,qrcode-reader --save 
node enrollAdmin.js 
node registerUser.js
```

### CouchDB UI
You can see the database here <br>
http://localhost:5984/_utils/ <br>
Username:admin<br>
Password:adminpw

After login, go to 'mychannel_fabcar' folder to see the database.

### Run the project
```
node app.js
```
Optional: You can use 'nodemon' instead of 'node'. For that, first install nodemon:
```
npm install -g nodemon

# Now Run:
nodemon app.js
```
Now visit: http://localhost:3000/ 

(If the link doesn't work, try replacing 'http' with 'https').

### Optional

Hope the first time installation if successful.

Now every time we need to run the project, we just have to run the following commands.
```
cd $HOME/VSN-A-Hyperledger-Fabric-Project-main/fabric-samples/fabcar 
sudo ./startFabric.sh javascript
cd javascript
npm install 
node enrollAdmin.js 
node registerUser.js
nodemon app.js
```
Now hit the URL: http://localhost:3000/ and we are online!  


P.S: For development purpose, if we make any changes to the chaincode, we have to restart the network and run these commands again.   
 






