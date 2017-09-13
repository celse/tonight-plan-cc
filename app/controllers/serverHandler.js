'use strict';

const yelp = require('yelp-fusion');
var myCash = require('../common/cach-var')
var path = process.cwd(),
    Users = require("../models/users").User,
    wait = require("wait-promise");

// Ducati#16


function ClickHander(){
    const client = yelp.client(process.env.ACCES_TOKEN);
    var barList=[]
    function userBarLoad(userBars, callback){
         client.business(userBars)
            .then(function(result){
                
                callback(result.body)
            });
    }
    function api_data ( req, res, location, userBar, barSelect){
        client.search({
            term:'bar',
            location: location
        }).then(response => {
            //console.log('### DATE QUERY ###');
            
            var querylistBars = response.jsonBody.businesses;
            console.log('###  QUERY A ###');
            if(userBar != null && userBar != undefined){
                for(var i = 0; i < querylistBars.length; i++){
                    
                    if(searchKey(querylistBars[i].id,userBar)){
                        querylistBars[i]['add']=true;
                    }
                }
            }
            var logUser = false,
                dataSend  = {};
            
            if (req.user != undefined && req.user._id != undefined ){
                logUser  = req.user.twitter.displayName;
            }
            dataSend  = {'pageload' : response.jsonBody,user : logUser}
            if(barSelect != null && barSelect != undefined){
                dataSend  = {
                    pageload : response.jsonBody,
                    barSelect: barSelect,
                    user : logUser
                 }
            }
            res.json(dataSend);
        }).catch(e => {
            console.log(e);
        });
    };
    function addClick(req, res,local,userId,barId,action){
        var barIds= 'test';
        //userId = req.user._id
        if(userId == undefined){
            
        }else{
            Users
                .findOne({'_id': userId})
                .exec(function(err, doc){
                    if(err){ throw err; }
                    //console.log('## HHHHH A');
                    var listBars = doc.bars;
                    if(local != null){
                        doc.lastSearch = local;
                        if(barId == null){
                           // console.log('## HHHHH C');
                            if(listBars.length > 0){
                                api_data(req, res,myCash.local,listBars)
                            }else{
                                api_data(req, res,myCash.local)
                            }
                        }else{
                            if(action != undefined && action == true){
                                if(listBars.length > 0){
                                    if(searchKey(barId, listBars)){
                                        doc.bars = doc.bars.filter(function(item){
                                            return item !== barId;
                                        })
                                    }else{
                                        doc.bars.push(barId);
                                    }
                                    
                    				//console.log('## HHHHH D');
                                }
                                doc.save((err, doc)=>{
                                    if(err){ throw err}
                                    
                				});
                                //console.log('## HHHHH E');
                                api_data(req,res,local,doc.bars);
                            }else{
                                //load page by selected bar without beffor loggin
                                if(listBars.length > 0){
                                    //console.log('## HHHHH F');
                                    if(!searchKey(barId, listBars)){
                                        doc.bars.push(barId);
                                        
                                    }
                                    doc.save((err, doc)=>{
                                        if(err){ throw err}
                    				});
                                }else{
                                    //console.log('## HHHHH G');
                                    doc.bars.push(barId);
                                    doc.save((err, doc)=>{
                                        if(err){ throw err}
                                        
                    				});
                                }
                                //res.json(barId);
                                //console.log('## HHHHH S');
                                api_data(req,res,local,doc.bars,barId);
                            }
                        }
                    }else{
                        listBars = doc.bars;
                        //console.log('### DOC ###')
                        //console.log(doc);
                        if(doc.lastSearch != undefined){
                            myCash.local= doc.lastSearch
                            if(listBars.length > 0){
                                api_data(req,res,doc.lastSearch,listBars)
                            }else{
                                api_data(req,res,doc.lastSearch)
                            }
                        }else{
                            res.json({data:[]});
                        }
                    }
                    
                })
        }
    };
    
    function databack(data){
        barList.push(data);
        //return data
    }
    function searchKey(urlk, list){
	    var val = false
	    for(var i=0; i< list.length; i++){
	        if(list[i] == urlk){return true;}; 
	    }
	    return val;
	};
	
    
    this.userBarDel = function(req, res){
        console.log('LOAD bar delete')
        barList  = []
        // recup bar id
        var barId = req.originalUrl.split('/api/bars/')[1].split('%20').join(' ');
        console.log(barId)
        if (req.user != undefined ){
            Users
                .findOne({'_id': req.user._id})
                .exec(function(err, doc){
                    if(err){ throw err; }
                    
                    doc.bars = doc.bars.filter(function(value){
                        return value !== barId;
                    });
                    
                    var listBars = doc.bars;
                    //console.log(listBars)
                    
                    doc.save((err, doc)=>{
                        if(err){ throw err}
                        
    				});
                    if(listBars.length > 0){
                        
                        for(var i = 0; i < listBars.length; i++){
                            //load IPA bars selected by user
                            userBarLoad(listBars[i],databack)
                        }
                        var i = 0;
                        var promise = wait.until(function(){
                            return ++i >= 10;
                        });
                        promise.then(function(){
                            res.json({'pageload':{businesses :barList}});
                        });
                        
                    }else{
                        res.json({'data':[]});
                    }
                    
                })
        }
    } ;
    this.userBarGet = function(req, res){
        console.log('LOAD user data')
        barList  = []
        if (req.user != undefined ){
            Users
                .findOne({'_id': req.user._id})
                .exec(function(err, doc){
                    if(err){ throw err; }
                    
                    var listBars = doc.bars;
                    console.log(listBars)
                    if(listBars.length > 0){
                        for(var i = 0; i < listBars.length; i++){
                            userBarLoad(listBars[i],databack);
                        }
                        var i = 0;
                        var promise = wait.until(function(){
                            return ++i >= 10;
                        });
                        promise.then(function(){
                            res.json({'pageload':{businesses :barList}});
                        });
                        
                    }else{
                        res.json({'data':[]});
                    }
                    
                })
        }
    } 
    
    this.searchClick= function(req, res){
        myCash.local = null;
        myCash.bar_id= null;
        console.log('je suis Mordue '+req.originalUrl)
        var url = req.originalUrl.split('/api/')[1].split('%20').join(' ');
        console.log(url)
        myCash.local = url
        
        if(req.user != undefined){
            addClick(req,res,myCash.local, req.user._id,myCash.bar_id,false);
        }else{
            api_data(req, res,url);
        }
    };
    this.pageLoad = function(req, res){
        console.log('load page 1');
        
        console.log(myCash.local);
        if(myCash.local != null ){
            if(req.user != undefined){
                
                console.log('load page 2');
                //console.log(req.user);
                addClick(req,res,myCash.local, req.user._id,myCash.bar_id,true);
            }else{
                console.log('load page 3');
                myCash.local = null
                myCash.bar_id = null
                res.json({user:false,logout:true});
                //addClick(req,res,myCash.local, req.user._id,myCash.bar_id,false);
            }
            
        }else{
            if(req.user != undefined){
                addClick(req,res,myCash.local, req.user._id,false,false);
            }
            
        }
    };
    this.selectBar = function(req, res){
        console.log('Bar selcted '+req.originalUrl);
        //console.log(req.user);
        
        var ind = req.originalUrl.split('/api/')[1].split('%20').join(' ');
        
        if (req.user != undefined && req.user._id != null ){
            var userId=req.user._id;
            console.log('YES connected '+ind);
            addClick(req,res,myCash.local,userId,ind,true);
            //update user bars liste addClick(res,local,userId,barId,action)
        }else{
            myCash.bar_id = ind,
            console.log('NOT connected');
            res.json({user:false});
        }
    }
}
module.exports = ClickHander;
