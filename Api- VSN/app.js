/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
/////////////////essential api which need to be downloaded/////////////////

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const { urlencoded } = require('express');
const express=require("express");
const hbs=require('hbs');
var bodyParser=require('body-parser');
const { asyncify } = require('async');
const expressSession=require('express-session');
const {check,validationResult}=require('express-validator');
const alert=require('alert');
const { nextTick } = require('process');
const { stringify } = require('querystring');
const {crypto}=require('crypto');
const SESS_NAME='sid';
const qr = require("qrcode");

const SESS_TIME=2*14*24*60*60*1000;
var Jimp = require("jimp");
var qrCode = require('qrcode-reader');
const { circle } = require('jimp');

const user={
    name:'',
    email:'',
    password:'',
    role:''

}







var app=express();
var router=express.Router();
        var static_path=path.join(__dirname +'/public');
        var view_path=path.join(__dirname+'/views');
        app.use(express.static(static_path));
        app.set('view engine','hbs');
        app.set('views',view_path);
        app.use(express.json());
        var urlencodedParser = bodyParser.urlencoded({ extended: false })
        app.use(expressSession({
            name:SESS_NAME,
            secret:"max",
            saveUninitialized:false,
            resave:false,
            cookie:{
                maxAge:SESS_TIME

            }
        }));


async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');

        //const path=require("path");

        

        //this is for the index page     
        app.get('/',(req,res)=>{
            const {userId}=req.session;
            let chain;
            res.render('index',{success:req.session.success,errors:req.session.errors});
            req.session.errors=null;
            
        })
        //this is the register page
        app.get('/register',(req,res)=>{
            res.render('register',{success:req.session.success,errors:req.session.errors});
            req.session.errors=null;
            
        })

        //this is for a producer user home page

        app.get('/producerhome',(req,res)=>{
            
            if(!req.session.userId){
                alert('You are not logged in');
                res.redirect('/');
               
            }
            else{
                console.log(user);
            res.render('producerhome',{user:user});
            req.session.errors=null;
            }
            
        })
        //this is for a distributor user home page
        app.get('/distributorhome',(req,res)=>{
            if(!req.session.userId){
                alert('You are not logged in');
                res.redirect('/');
                
            }
            else{
            res.render('distributorhome',{user:user});
            req.session.errors=null;
            
            }
        })
        //this is for a cusotomer user home page
        app.get('/customerhome',(req,res)=>{
            if(!req.session.userId){
                alert('You are not logged in');
                res.redirect('/');
            }
            else{

            res.render('customerhome',{user:user});
            req.session.errors=null;
            }
            
        })
        app.get('/qrcode',(req,res)=>{
            if(req.session.userId){
            res.render('qrcode',{user:user});
            }
            else{
                alert('You are not logged in');
                res.redirect('/');
            }
        })
     app.get('/searchvaccine',(req,res)=>{
         if(user.role=='Producer'){
           res.redirect('producerhome');
         }
         else if(user.role=='Distributor'){
             res.redirect('distributorhome');
         }
         else{
             res.redirect('customerhome');
         }
        })
        
        app.get('/logout',(req,res)=>{
            
            res.redirect('/');
        })
        //when a user will try to login 
        app.post('/login',urlencodedParser,async(req,res)=>{
           const errors=validationResult(req).array(); //errors are for validation
           var email=req.body.email;
            var password=req.body.password;
            var role=req.body.role;
            
            try{
            const result1 = await contract.submitTransaction('registerUser','userab','ab@gmail.com','abcde','ab','Customer');//for debugging
      

            const result = JSON.parse(await contract.evaluateTransaction('loginUser',email,password,role));
            //console.log("hoise");
            if(result.length>0){
            req.session.userId=result[0]['Key'];
            user.name=(result[0]['Record']['name']).toUpperCase();
            user.email=email;
            user.password=req.body.password;
            user.role=role;
            
            if(role==='Producer'){
                res.redirect('producerhome');
                
            }
            else if(role==='Distributor'){
                res.redirect('distributorhome');
                
            }
            else{
                res.redirect('customerhome');
            
            }
            
            }
            else{
                let a={location:"body",msg:"Wrong credentials! Try again.",param:'email',value:''};
                errors.push(a);
                
                req.session.errors=errors;
                req.session.success=false;
                res.redirect('/');

            }
        }
            catch(error){
                //if user does not exist in the database
                res.send('Something is wrong')
                console.log(errors);
                
            }
            
        
            
        });

        app.post('/register',urlencodedParser,[
            //for checking a email address is valid or not
            check('email','Email is invalid').isEmail(),
        ],
            async function(req,res){
                const errors=validationResult(req).array();
                //if a password doesn't have min 4characters or if password and confirm password arenot matching
                if(req.body.password!=req.body.c_password || (req.body.password).length<4){
                    let a={location:'body',msg:'Passwords are not matching or Password is too short',param:'password',value:''};
                    errors.push(a);
                  
                }
            
            var email=req.body.email;
            var password=req.body.password;
            var role=req.body.role;
            var name=req.body.name;
            var id="user"+email;

            const result1 = await contract.submitTransaction('registerUser','userab','ab@gmail.com','abcde','ab','Customer');
            
            try{

        
            const findemail=JSON.parse(await contract.evaluateTransaction('findEmail',email));
                 
                 if(findemail.length>0){
                     let a={location:"body",msg:"Email address already exists",param:"email",value:""};
                     errors.push(a);
                     //req.session.errors=errors;
                 }
                 else{

                 }
                if(Object.keys(errors).length>0){
                    console.log(Object.keys(errors).length);
                    req.session.success=false;
                    req.session.errors=errors;
                    res.redirect('/register');

                }
                else{
                    
                    req.session.success=true;
                    try{
                        
                    const result= await contract.submitTransaction('registerUser',id,email,password,name.toLowerCase(),role);
                    //promt("You successfully registered");
                   // window.confirm('You are successfully registered');
                    req.session.userId=id;
                    user.name=name.toUpperCase();
                    user.email=email;
                    user.role=role,
                    user.password=password;
                    if(role==='Producer'){
                        res.redirect('producerhome');
                    }
                    else if(role==='Distributor'){
                        res.redirect('distributorhome');
                    }
                    else{
                        res.redirect('customerhome');
                    }
                   
                }
                catch(error){
                    res.send("Something is wrong");
                }

                }
            }
            catch(error){
                res.send('Something is wrong');
            }
        
                
               
        
        })
        app.post('/searchvaccine',urlencodedParser,async (req,res)=>{
            const vaccinenumber=req.body.find;
            const vaccineid="vaccine"+vaccinenumber;
            const result1 = await contract.submitTransaction('registerUser','userab','ab@gmail.com','abcde','ab','Customer');
           try{
               console.log(vaccinenumber);
               const result=JSON.parse(await contract.evaluateTransaction('queryVaccine',vaccineid));
            const result2=result.owners;
            const producer=result2[0];
            producer.owner=producer['owner'].toUpperCase();
            let result3=[];

            let customer;
             
            if(result2[result2.length-1]['delivered']=="Yes"){
                customer=result2[result2.length-1];
                customer.owner=(result2[result2.length-1]['owner']).toUpperCase();
                for(let i=1;i<result2.length-1;i++){
                    result3.push(result2[i]);
                    result3[i-1]['owner']=(result2[i]['owner']).toUpperCase();

                }
            }
            else{
                for(var i=1;i<result2.length;i++){
                   // console.log(result2);
                   result3.push(result2[i]);
                   result3[i-1]['owner']=(result2[i]['owner']).toUpperCase();
               }

            }
        

              console.log(result3);
              console.log(customer);
              console.log(producer);
            
               if(user.role=='Producer')
               res.render('producerhome',{producer,result3,customer,user});
               else if(user.role=='Distributor'){
                   res.render('distributorhome',{producer,result3,customer,user})
               }
               else{
                   res.render('customerhome',{producer,result3,customer,user});
               }

           }
           catch(error){
               alert("Vaccine Doesnot exist");
               if(user.role=='Producer'){
               res.redirect('producerhome');
               }
               else  if(user.role=='Distributor'){
                res.redirect('distributorhome');
                }
                else{
                    res.redirect('/customerhome');
                }

           }
            
        })
     app.post('/insertinfo',urlencodedParser,async (req,res)=>{
            const vaccinenumber=req.body.vaccinenumber;
            const issuedate=req.body.issuedate;
            const producer=req.body.producer;
            const url = vaccinenumber.toString();
            const longitude=req.body.long;
            const latitude=req.body.lati;
            const id="vaccine"+vaccinenumber;
            const email=user.email;
            console.log(email);
            // const url = req.body.url;
            const result=await contract.submitTransaction('createVaccine',id,producer.toLowerCase(),email,vaccinenumber,issuedate,latitude,longitude);

            if (url.length === 0) res.send("Empty Data!");

            qr.toDataURL(url, (err, src) => {

               // var stringdata = src.toString();

                if (err) {
                    res.send("Error occured");
                }

               // res.redirect('scan', { src });
               else{
                   
                 res.render('qrcode',{user:user,src,url});
                  

               }
            });

                
                // res.end();

           

           


        })
        app.post('/changeowner',urlencodedParser,async (req,res)=>{
            var vaccinenumber=req.body.vaccinenumber;
            var newowner=req.body.newowner;
            var newowner_email=req.body.newowner_email;
            var longitude=req.body.long1;
            var latitude=req.body.lati1;
            var date =req.body.date;
            var vaccineid="vaccine"+vaccinenumber;
            var name=user.name.toLowerCase();
            var owner=newowner.toLowerCase();
            let errors;
            const result1 = await contract.submitTransaction('registerUser','userab','ab@gmail.com','abcde','ab','Customer');
            try{ 
            console.log(vaccineid);
            const vaccine=JSON.parse(await contract.evaluateTransaction('queryVaccine',vaccineid));
            console.log(vaccine['current_owner']);
           if(vaccine['current_owner_email']==user.email){
               console.log(vaccineid['current_owner_email']);

                await contract.submitTransaction('changeVaccineOwner',vaccineid,owner,newowner_email,date,latitude,longitude,"no");
                console.log('owner changed');
                alert('Owner Changed Successfully');
                if(user.role=='Producer'){
                res.redirect('/producerhome');
                }
                else if(user.role=='Distributor'){
                    res.redirect('/distributorhome');
                }
                else{
                    res.redirect('/customerhome');
                }
            }
            else{
            
                alert('You are not the current owner of Vaccine');
                if(user.role=='Producer'){
                    res.redirect('/producerhome');
                    }
                    else if(user.role=='Distributor'){
                        res.redirect('/distributorhome');
                    }
                    else{
                        res.redirect('/customerhome');
                    }
               

            }
            
            }
            catch(error){
                console.log(error);
                
                alert('Vaccine doesnot exist');
                if(user.role=='Producer'){
                    res.redirect('/producerhome');
                    }
                    else if(user.role=='Distributor'){
                        res.redirect('/distributorhome');
                    }
                    else{
                        res.redirect('/customerhome');
                    }

            }
            



        })


        app.post('/changeowner1',urlencodedParser,async (req,res)=>{
            var vaccinenumber=req.body.vaccinenumber;
            var newowner=req.body.newowner;
            var newowner_email=req.body.newowner_email;
            var longitude=req.body.long1;
            var latitude=req.body.lati1;
            var date =req.body.date;
            var vaccineid="vaccine"+vaccinenumber;
            var name=user.name.toLowerCase();
            var owner=newowner.toLowerCase();
            var check=req.body.check;
            let errors;
            const result1 = await contract.submitTransaction('registerUser','userab','ab@gmail.com','abcde','ab','Customer');
            try{ 
            console.log(vaccineid);
            const vaccine=JSON.parse(await contract.evaluateTransaction('queryVaccine',vaccineid));
            console.log(vaccine['current_owner']);
           if(vaccine['current_owner_email']==user.email){
                await contract.submitTransaction('changeVaccineOwner',vaccineid,owner,newowner_email,date,latitude,longitude,check);
                console.log('owner changed');
                alert('Owner Changed Successfully');
                if(user.role=='Producer'){
                res.redirect('/producerhome');
                }
                else if(user.role=='Distributor'){
                    res.redirect('/distributorhome');
                }
                else{
                    res.redirect('/customerhome');
                }
            }
            else{
            
                alert('You are not the current owner of Vaccine');
                if(user.role=='Producer'){
                    res.redirect('/producerhome');
                    }
                    else if(user.role=='Distributor'){
                        res.redirect('/distributorhome');
                    }
                    else{
                        res.redirect('/customerhome');
                    }
               

            }
            
            }
            catch(error){
                console.log(error);
                
                alert('Vaccine doesnot exist');
                if(user.role=='Producer'){
                    res.redirect('/producerhome');
                    }
                    else if(user.role=='Distributor'){
                        res.redirect('/distributorhome');
                    }
                    else{
                        res.redirect('/customerhome');
                    }

            }
            



        })
      app.post('/logout',urlencodedParser,(req,res)=>{
          req.session.destroy();
          user.name='';
          user.password='';
          user.email='';
          user.role='';
          res.redirect('/',{user:user});

      })
        
      
      
       
      app.listen(3000,console.log("running"));
       //  console.log(result.toString('utf8'));
        await gateway.disconnect();


        
    } catch (error) {
       console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}
module.exports=router;

main();