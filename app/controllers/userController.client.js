'use strict';

(function(){
    
    var btnSearch = document.getElementById('btn_Search') || null;
    var inputSearch = document.getElementById('yourCity') || null;
    var page = document.getElementById('pagination1')|| null;
    var btn_view = document.getElementById('btn_view')|| null;
    
    
    // page load
   
    //api_data();
    var url = appUrl +'/api/';
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET',url,function(data){
        //console.log(data);
        dataSearch(data);
    }))
    console.log('RUN LOAD');
    if(btn_view != null){
        btn_view.addEventListener('click', function() {
            ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET','/api/bars',dataSearch));
        })
    }
    if(btnSearch != null){
       
        
        var action = 'GET';
        console.log('#######  Bt serche#######  '+inputSearch.value);
        btnSearch.addEventListener('click', function(){
            if(inputSearch != null && inputSearch.value != ''){
                url = url + inputSearch.value;
                ajaxFunctions.ready(ajaxFunctions.ajaxRequest(action,url,dataSearch));
            }else{
                inputSearch.focus();
        }
        });
        
        
    }
    
    
    
    
    
    
})();