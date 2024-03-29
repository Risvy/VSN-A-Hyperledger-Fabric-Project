
# Vaccine Supply Chain 

## Abstract
In the context of the COVID-19 pandemic, while we’re trying to slow down the spread of coronavirus, the success will highly depend on performing a successful vaccination program. In this
case, some of the obstacles that may arise include but are not limited to, the risk of counterfeit
COVID-19 vaccines, not transporting the vaccines in an expected way throughout their journey,
the possibility of altering sensitive data, e.g., changing production or expiration date, etc. In
this context, we propose a Blockchain-based solution. The proposed solution ensures end-to-end
traceability and transparency in the supply chain while maintaining a proper distribution of the
vaccine. As the government is highly concerned about managing healthcare during and after the
COVID-19 pandemic, building trust and reducing costs by implementing a secure and transparent
system to flatten the curve will have a promising impact on both public health and the economy of
our country. Moreover, this system will help to increase revenue by reducing the loss of sales due
to counterfeit vaccines. The private blockchain can have a promising impact on the supply chain
environment and its relative sections.



# Contributors: 

    * Muhid Hassan Risvy                              * Rim Chowdhury
    * Email: hassan.risvy1@gmail.com                  * Email: rimchy32@gmail.com
    * https://github.com/Risvy                        * https://github.com/RimChy  
                                                                            

### Prerequisites
* Git
* Curl
* Docker
* Docker Compose
* Node.js

### Intalling Node.js

Install NVM (Node Version Manager):
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
```

We have used node version 14.15.0. To install v14.15.0 (Optional):

```
nvm install v14.15.0
nvm use v14.15.0
```

 To install LTS (Long-term support) version of node (Optional):
```

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

### Installing Hyperleger Fabric
To install hyperledger Fabric version 2.2, run the command:
```
cd $HOME
curl -sSL https://raw.githubusercontent.com/hyperledger/fabric/master/scripts/bootstrap.sh | bash -s -- 2.2.3 1.5.0
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
Add the following lines at the end of the script, save, and exit.
```
export PATH=$PATH:$HOME/fabric-samples/bin
export FABRIC_CFG_PATH=$HOME/fabric-samples/config
```

###  Downloading VSN: Vaccine Supply Chain Project
```
    cd $HOME
    git clone https://github.com/Risvy/VSN-A-Hyperledger-Fabric-Project.git
```
If you are running the project for the first time, you must install all the dependencies. If you not running the project for the first time see the #Optional Part below.

### Move Necessary Files
This is the most important part. We need to move our files from 'VSN-A-Hyperledger-Fabric-Project' to 'fabric-samples' folder.

#PART 1:



After installing Hyperledger Fabric, a folder named "fabric-samples" was created in the 'Home' directory. Inside 'fabric-samples/chaincode/fabcar/javascript/lib', we need to rename the existing chaincode file 'fabcar.js' to something else. 


Simply follow the commands below to rename it to 'old_fabcar.js'.
```
cd ~/fabric-samples/chaincode/fabcar/javascript/lib
mv fabcar.js old_fabcar.js
```
Now go to the directory-> 'HOME/VSN-A-Hyperledger-Fabric-Project/Chaincode- javascript/'

You will find a file named 'fabcar.js'. Copy this file to 'fabric-samples/chaincode/fabcar/javascript/lib' (Where the 'old_fabric.js' file is located). Now inside the lib folder we have 'fabcar.js' and 'old_fabcar.js'.



#PART 2:

Go to the directory -> 'HOME/VSN-A-Hyperledger-Fabric-Project/Api- VSN/'. You should find 3 files: 'public', 'views' and  'app.js'. Copy these 3 files to -> 'HOME/fabric-samples/fabcar/javascript/' (inside the javascript folder).




### Stop Network, Start network, Create Channel and Deploy Chaincode (All in one)

As we are using Javascript, we need to run the command:
```
cd $HOME/fabric-samples/fabcar
sudo ./startFabric.sh javascript
```
If we want to use any other language, we have to replace 'javascript' portion of the command with that language. 

### Installing Libraries For Running The Project
Now, run the following commands: 
```
cd javascript
npm install 
npm i express hbs body-parser async express-session express-validator alert process querystring qrcode jimp qrcode-reader --save 
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

Hope the first time installation was successful.

Now every time we need to run the project, we just have to run the following commands.
```
cd $HOME/fabric-samples/fabcar
./startFabric.sh javascript
cd javascript
npm install 
node enrollAdmin.js 
node registerUser.js
nodemon app.js
```
Now hit the URL: http://localhost:3000/ and we are online!  


P.S: For development purpose, if we make any changes to the chaincode, we have to restart the network and run these commands again.   
 
### Troubleshoot
1. For any kind of permission related problem, act as root user and try again.
```
sudo -i
#Your command
```
2. For API, Javascript or dependency related problem, you can replace the local 'javascript' folder (Directory -> 'HOME/fabric-samples/fabcar/javascript/') with
   <a href="https://drive.google.com/drive/folders/1IqSUmFsQPofiBaHHphKBRQzQSi5svgKe?usp=sharing">this folder!</a> 

3. If the problem persists, replace the whole 'fabric-samples' folder with <a href="https://drive.google.com/drive/folders/135v0JaqAz3M-VWD2h1fYsgadNAOJzPbl?usp=sharing">this folder!</a>.





