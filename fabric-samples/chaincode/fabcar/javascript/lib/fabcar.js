/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { all } = require('async');
const { Contract } = require('fabric-contract-api');
const { normalize } = require('path');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const vaccines = [
            {
                current_owner:'InitializeABC',
                issue_date:'01-01-2021',
                amount:50,
                unit:'bottles',
                vaccine_number:'syl_A',
                issuer_org:'affr',
                key:'vaccine0',
                owners:['producer:a','distributor:b','distributor:c'],

            },    
        ];
        const users=[
            {
                email:'ini_A_tialize@gmail.com',
                password:'1234',
                role:'Producer',
                name:'abc',
                key:'user0'
            


            }
        ];

        
        for (let i = 0; i < vaccines.length; i++) {
            vaccines[i].docType = 'vaccine';
            await ctx.stub.putState('vaccine' + i, JSON.stringify(vaccines[i]));
            console.info('Added <--> ', vaccines[i]);
        }
        for (let i = 0; i < users.length; i++) {
            users[i].docType = 'user';
            await ctx.stub.putState('user' + i, JSON.stringify(users[i]));
            console.info('Added <--> ', users[i]);
        }
        
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryVaccine(ctx, vaccineNumber) {
        const carAsBytes = await ctx.stub.getState(vaccineNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${vaccineNumber} does not exist`);
        }
        console.log(carAsBytes.toString());
        return carAsBytes.toString();
    }
    async queryVaccineByOwner(ctx, current_owner) {
        //   0
        // 'bob'
        
    
        
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'vaccine';
        queryString.selector.owner = current_owner;
        
        let queryResults = await this.getQueryResultForQueryString(ctx,JSON.stringify(queryString));
        return queryResults.toString(); //shim.success(queryResults);
      }

    async createVaccine(ctx, id, current_owner, current_owner_email,vaccine_number,issue_date,latitude,longitude) {
        console.info("============= START : Create Car ===========");

        const vaccine = {
            id,
            current_owner,
            current_owner_email,
            vaccine_number,
            issue_date,
            issuer_name:current_owner,
            owners:[{"owner":current_owner,"date":issue_date,"latitude":latitude,"longitude":longitude,"delivered":"no"}],
            longitude:longitude,
            latitude:latitude,
            key:id,
            delivered:"no",
            docType: 'vaccine'
            
        };

        await ctx.stub.putState(id,JSON.stringify(vaccine));

        console.info("============= END : Create Car ===========");
    }
    async registerUser(ctx, userId, email, password, name,role) {
        console.info("============= START : Register User ===========");
      
        const user = {
            docType: "user",
            email,
            password,
            name,
            role,
            key: userId,
        };
    

        await ctx.stub.putState(userId, JSON.stringify(user));
        console.info("============= END : Register User ===========");

    }
     
  
  
      async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
    
            if (isHistory && isHistory === true) {
              jsonRes.TxId = res.value.tx_id;
              jsonRes.Timestamp = res.value.timestamp;
              jsonRes.IsDelete = res.value.is_delete.toString();
              try {
                jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Value = res.value.value.toString('utf8');
              }
            } else {
              jsonRes.Key = res.value.key;
              try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
              }
            }
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;
          }
        }
      }
    
    
      async getQueryResultForQueryString(ctx, queryString) {

        console.info('- getQueryResultForQueryString queryString:\n' + queryString)
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        
    
        let results = await this.getAllResults(resultsIterator, false);
    
        return JSON.stringify(results);
      }
      async queryVaccineByOwner(ctx,current_owner) {
        
    
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType= 'vaccine';
        queryString.selector.current_owner= current_owner;
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return queryResults; //shim.success(queryResults);
      }
      async loginUser(ctx,email,password,role) {
        //   0
        // 'bob'
        if (email=='' || password=='' || role=='') {
          throw new Error('Incorrect number of arguments. Expecting owner name.')
        }
    
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType= 'user';
        queryString.selector.email= email;
        queryString.selector.password=password;
        queryString.selector.role=role;
        
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        if(!queryResults || queryResults.length==0){
          throw new Error(" User doesnot Exist");
        }
        return queryResults; //shim.success(queryResults);
      }
    
    async changeVaccineOwner(ctx, vaccineNumber,newOwner,newowner_mail,date,latitude,longitude,check) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(vaccineNumber); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${vaccineNumber} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.current_owner = newOwner;
        car.current_owner_email=newowner_mail;
        car.date=date;
        car.longitude=longitude;
        car.latitude=latitude;
        car.delivered=check;
        car.owners.push({"owner":newOwner,"date":date,"latitude":latitude,"longitude":longitude,"delivered":check})
        await ctx.stub.putState(vaccineNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }
    async findEmail(ctx,email){
      let queryString = {};
        queryString.selector = {};
        queryString.selector.docType= 'user';
        queryString.selector.email= email;
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        
        return queryResults; //shim.success(queryResults);
      
        
    }

}

module.exports = FabCar;
