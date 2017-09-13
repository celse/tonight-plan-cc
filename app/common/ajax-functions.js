'use strict';

    var appUrl = window.location.origin;
    var data_api;
    var ajaxFunctions ={
        ready : function ready (fn){
            if (typeof fn !== 'function'){
                return;
            }
            
            if(document.readyState == 'complete'){
                return fn();
            }
            
            document.addEventListener('DOMContentLoad', fn , false);
        },
    
    ajaxRequest: function ajaxRequest(method, url, callback){
        
        var xmlhttp = new XMLHttpRequest();
        console.log(url)
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState == 4 && xmlhttp.status=== 200){
                callback(xmlhttp.response);
            }
        };
        
        xmlhttp.open(method, url, true);
        xmlhttp.send();
    }
};
function dataSelect(data){
    console.log('##  Click Button ###');
    console.log(data);
    console.log(data.user);
    var userObject = JSON.parse(data)
    console.log(userObject.user);
    
    //request user login 
    if(userObject.user == false){
        window.location.href = 'https://dynamic-web-app-celsio.c9users.io/auth/twitter';
    }
   
}
function dataSearch(data){
    console.log('##  Click ###');
    
    var userObject = JSON.parse(data),
    
    data_api = userObject.pageload,
    barSelect = userObject.barSelect;
    if(userObject.logout ==undefined || userObject.logout != true){
        
        console.log(userObject);
        console.log('save date '+data_api.businesses.length);
        var li_parent = document.getElementById("pagination1") || null;
        var dataview = document.getElementById('dataview')|| null;
        console.log(dataview);
        if(userObject.user != false){
            var menubar = document.getElementById('myNavbar');
            var display_name = document.getElementById('usename');
            var btn_view = document.getElementById('btn_view');
            display_name.innerHTML= userObject.user
            menubar.style.display = 'block';
            btn_view.style.display = 'block';
            console.log(menubar)
        }
        var elemPerpage = 8,curentPage = 1,
            tt_Item = data_api.businesses.length,
            listItem =data_api.businesses,
            respage = tt_Item % elemPerpage;
        var ttpage = Math.floor(tt_Item / elemPerpage);
        if(barSelect != undefined){
            for(var i = 0; i < listItem.length; i++){
                if(listItem[i].id == barSelect){
                    curentPage = Math.floor(i/elemPerpage) + 1;
                }
            }
        }
        if (respage != 0){
            ttpage += 1;
        }
        console.log(curentPage);
        if(li_parent != null){
        	$.jqPaginator('#pagination1', {
    		        totalPages: ttpage,
    		        visiblePages: 3,
    		        currentPage: curentPage,
    		        onPageChange: function (num, type) {
    		            $('#p1').text(type + '：' + num);
    		            
    		            if(dataview != null){
    		                
                            while (dataview.firstChild) {
                                dataview.removeChild(dataview.firstChild);
                            }
                            viewDataPerPage(dataview, listItem, num, elemPerpage);
    		            }
    		        }
    		    });
        }
    }    
    console.log(userObject);
     
}
function viewDataPerPage(parent, data_list, currentPage, visiblepage){
    var index = (currentPage - 1) * visiblepage,
        limitepage = index + visiblepage;
    
    if(limitepage > data_list.length){ limitepage = data_list.length}
    
    for(var id =index; id < limitepage; id++){
        if(data_list[id] != undefined){
            viewLayout(parent,data_list[id]);
        }else{
            break;
        }
    }
}
function btnBarSelect(btn,belog){
    var url = appUrl +'/api/'+ btn.getAttribute('id');
    console.log('url '+url);
    ajaxFunctions.ready(ajaxFunctions.ajaxRequest('POST',url,dataSelect));
}


function viewLayout(parent, item){
    
    var bt_tex = 'add',
        bt_option = 'btn btn-success',
        bt_url = '/api/',
        bt_action='POST',
        fn_back =dataSelect;
    if(typeof(item) == 'string'){
        item  = JSON.parse(item)
        bt_tex = 'Delete';
        bt_option = 'btn btn-danger';
        bt_url='/api/bars/';
        bt_action='DELETE';
        fn_back = dataSearch;
    }
    var address= item.location.address1,
        zip = item.location.zip_code,
        city = item.location.city,
        country = item.location.display_address[2],
        phone = item.display_phone,
        name = item.name,
        rating = item.rating,
        imgUrl = item.image_url,
        ids = item.id;
        var str_cartego;
        console.log(item.categories)
        
        if(imgUrl == ""){imgUrl = "/public/img/No-image-available.jpg"}
    if (item.categories!= undefined){
        var catego= [];
        for(var i= 0; i < item.categories.length; i++){
            catego.push(item.categories[i].title)
        }
        str_cartego = catego.toString();
        str_cartego = str_cartego.replace(',',', ');
    }
   var  div1 = document.createElement("div"),
        div2 = document.createElement("div"),
        div3 = document.createElement("div"),
        div4 = document.createElement("div"), 
        div5 = document.createElement("div"),
        
        divA1 = document.createElement("div"),
        divA2= document.createElement("div"),
        divB1 = document.createElement("div"),
        divB2 = document.createElement("div"),
        divrow = document.createElement("div"),
        hr = document.createElement("hr"),
        
        starempty = 5 - rating,
        
        img = document.createElement("img"),
        h4 = document.createElement("h4"),
        title = document.createTextNode(name),
        bt_label = document.createTextNode('CLICK ME!'),
        txt1 = document.createTextNode(address),
        txt2 = document.createTextNode(zip +', '+city),
        txt3 = document.createTextNode(phone),
        txt4 = document.createTextNode(country),
        txt5 = document.createTextNode(str_cartego),
        p1 = document.createElement("p"),
        p2 = document.createElement("p"),
        p3 = document.createElement("p"),
        p4 = document.createElement("p"),
        p5 = document.createElement("p"),
        
        btn = document.createElement("button"),
        btn_label = document.createElement("label"),
        btn_input = document.createElement("input"),
        btn_txt = document.createTextNode(bt_tex),
        btn_span = document.createElement("span");
        
   
   
    btn_label.setAttribute('for',ids);
    btn_label.setAttribute('class',bt_option);
    btn_label.appendChild(btn_txt);
    
    btn_input.setAttribute('class','badgebox');
    btn_input.setAttribute('id',ids);
    btn_input.setAttribute('type',"checkbox");
    btn_label.appendChild(btn_input);
    if(item.add != undefined && item.add ==true){
        btn_input.checked = true;
    }
    btn_input.addEventListener('click', function(){
        var url = appUrl +bt_url+ this.getAttribute('id');
        ajaxFunctions.ready(ajaxFunctions.ajaxRequest(bt_action,url,fn_back));
    });
    
    btn_span.setAttribute('class','badge');
    btn_span.innerHTML='&check;'.replace(/&amp;/g, '&');
    
    btn_label.appendChild(btn_span);
    
    div5.setAttribute('class','rating');
    for(var i= 0 ; i < rating; i++){
        var rate1 = document.createElement("span");
        rate1.setAttribute('class','glyphicon glyphicon-star'); 
        div5.appendChild(rate1);
    }
    for(var i= 0 ; i < starempty; i++){
        var rate2 = document.createElement("span");
        rate2.setAttribute('class','glyphicon glyphicon-star-empty'); 
        div5.appendChild(rate2);
       
    }
    
    
    btn.setAttribute('type','submit');
    btn.setAttribute('class','btn btn-add');
    btn.setAttribute('id',ids);
    btn.appendChild(bt_label);
    
    div1.setAttribute('class','col-lg-3 col-md-6 mb-4 bar-item');
    div2.setAttribute('class','card h-100');
    div3.setAttribute('class','card-block');
    div4.setAttribute('class','card-block');
    divrow.setAttribute('class','row');
    
    img.setAttribute('class','card-img-top img-fluid');
    img.setAttribute('src',imgUrl);
    img.setAttribute('alt',"");
    
    p1.setAttribute('class',"card-text");
    p2.setAttribute('class',"card-text");
    p3.setAttribute('class',"card-text");
    p4.setAttribute('class',"card-text");
    p5.setAttribute('class',"card-text");
    p1.appendChild(txt1)
    p2.appendChild(txt2)
    p4.appendChild(txt4)
    p3.appendChild(txt3)
    p5.appendChild(txt5)
    h4.setAttribute('class','card-block');
    h4.appendChild(title);
    h4.appendChild(div5);
    h4.appendChild(p5);
    div4.appendChild(btn_label);
    
    div3.appendChild(p1)
    div3.appendChild(p2)
    div3.appendChild(p4)
    div3.appendChild(p3)
    
    div2.appendChild(div3);
    
    divA1.setAttribute('class','col-md-8');
    divA2.setAttribute('class','col-md-4');
    divA2.appendChild(div2);
    
    divB1.setAttribute('class','col-md-4');
    divB1.appendChild(img);
    
    divB2.setAttribute('class','col-md-8');
    divB2.appendChild(h4);
    divB2.appendChild(div4);
    
    divA1.appendChild(divB1);
    divA1.appendChild(divB2);
    
    divrow.appendChild(divA1);
    divrow.appendChild(divA2);
    
    
    parent.appendChild(divrow)
    parent.appendChild(hr)
        
}