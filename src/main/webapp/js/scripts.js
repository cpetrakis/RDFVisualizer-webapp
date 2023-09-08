/*  
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 Copyright (c) 2016 Kostis Petrakis <cpetrakis@ics.forth.gr>
 
 @TODO:
    -   avoid circles
    -   popup correction after expand
    -   open tree in fixed depth
    -   append fix
    -   expand collapse icon bug fix
 
 */

function visualizeSelected(){
      
   if($('.toggle').length==0){ 
         $('#select_file').modal('show');
   }else {
       
    var file =  JSON.parse(localStorage.getItem('selected_filename')).filename;
    console.log(file)
    localStorage.setItem("filename", file);  
    ShowHome();
   }
  
}

var prefix          = "";
var imgprefix       = "";
var pref_Label_uri  = "";
var type_Label_uri  = "";
var schema_Label_uri= "";
var image_type_uri  = "";
var tree_depth      = "";
var show_incoming_links ="";


/*** Set User configured URIS and labels on local Storage ***/

function submitURIS(){
    
    var jsonURIS = new Object();
    
    jsonURIS['schema_Label_uri']    = $('#schema_label').val();
    jsonURIS['pref_Label_uri']      = $('#pref_labels').val();
    jsonURIS['type_Label_uri']      = $('#type_labels_uri').val();
    jsonURIS['prefix']              = $('#prefix').val();
    jsonURIS['image_type_uri']      = $('#image_type_prefix').val();
    jsonURIS['imgprefix']           = $('#image_prefix').val();
    jsonURIS['show_incoming_links'] = $('#show_incoming_links').find(":selected").val();
    
    localStorage.setItem('URIS_json', JSON.stringify(jsonURIS));
    console.log(jsonURIS);
    location.reload();
       
}

/*** Reset Configuration properties from config.properties  ***/

function resetURIS(){
    $.post("GetPropertiesValues", {
    }, function (response) {
        var json= JSON.parse(response);        
            console.log('URIS reset...');
           // console.log(json);
            prefix = json.prefix;
            imgprefix = json.imgprefix;
            pref_Label_uri = json.pref_Label_uri;
            type_Label_uri = json.type_Label_uri;
            schema_Label_uri = json.schema_Label_uri;
            image_type_uri = json.image_type_uri;
            tree_depth = json.tree_depth;  
            show_incoming_links = json.show_incoming_links;
          
            $('#show_incoming_links').find('option[value="'+json.show_incoming_links+'"]').attr("selected",true);
            $('#schema_label').val(json.schema_Label_uri);
            $('#pref_labels').val(json.pref_Label_uri);
            $('#type_labels_uri').val(json.type_Label_uri);
            $('#prefix').val(json.prefix);
            $('#image_type_prefix').val(json.image_type_uri);
            $('#image_prefix').val(json.imgprefix);
                      
            
            localStorage.setItem('URIS_json', JSON.stringify(json));
    }); 
}
function visualizeThis(subject){
   
    var url_string = window.location.href;
    var url = new URL(url_string);
    window.location =  url.origin + url.pathname +'?resource='+subject;
    
}


    
    var subjectTable =   $('#subjects_table').DataTable({
      'paging'      : true,
      'lengthChange': true,
      'searching'   : true,
      'ordering'    : true,
      'info'        : true,
      'autoWidth'   : false
    });


function createSubjectTable(data) {
    subjectTable.clear()
    if (data) {
        $.each(data, function (key, value) {

            subjectTable.row.add([key, value, `<button onclick="visualizeThis('` + value + `')">Visualize</button></th>`]);
            // html = html+ `<tr> <th>`+key+`</th>
            //                <th>`+value+`</th>    
            //                <th><button onclick="visualizeThis('`+value+`')">Visualize</button></th> </tr>`;
        });
        subjectTable.draw();
        //$('#subjects_content').append(html);
        $('#dataTable').show();
    }
}

function showSubjects(file) {

    $.post("GetAllSubjects", {
        resource: "",
        folderpath: file,
        schema_Label_uri: schema_Label_uri,
        pref_Label_uri: pref_Label_uri

    }, function (response) {
        localStorage.setItem('selected_subjectsToshow', (response));
        createSubjectTable(JSON.parse(response));
      
    });

}

/*** Get Configuration properties from config.properties file or localstorage from user ***/

$.post("GetPropertiesValues", {
    }, function (response) {
        var json= JSON.parse(response);        
      
        if (json.database !== "file") {
         $('#fileUpload_box').hide();
         } else {
             $('#fileUpload_box').show();
         }
       
        if (!localStorage.getItem('URIS_json')){
            console.log('we DONT have configuration');
          //  console.log(json);
            prefix = json.prefix;
            imgprefix = json.imgprefix;
            pref_Label_uri = json.pref_Label_uri;
            type_Label_uri = json.type_Label_uri;
            schema_Label_uri = json.schema_Label_uri;
            image_type_uri = json.image_type_uri;
            tree_depth = json.tree_depth;       
            show_incoming_links = json.show_incoming_links;
           

            $('#show_incoming_links').find('option[value="'+json.show_incoming_links+'"]').attr("selected",true);            
            $('#schema_label').val(json.schema_Label_uri);
            $('#pref_labels').val(json.pref_Label_uri);
            $('#type_labels_uri').val(json.type_Label_uri);
            $('#prefix').val(json.prefix);
            $('#image_type_prefix').val(json.image_type_uri);
            $('#image_prefix').val(json.imgprefix);
            localStorage.setItem('URIS_json', JSON.stringify(json));
            console.log('initial values stored!');
           
        }else {
            var configuredJson= JSON.parse(localStorage.getItem('URIS_json')); 
            console.log('we have configuration');
           
            prefix = configuredJson.prefix;
            imgprefix = configuredJson.imgprefix;
            pref_Label_uri = configuredJson.pref_Label_uri;
            type_Label_uri = configuredJson.type_Label_uri;
            schema_Label_uri = configuredJson.schema_Label_uri;
            image_type_uri = configuredJson.image_type_uri;
            show_incoming_links = configuredJson.show_incoming_links;          
            tree_depth = 0;  
            
            $('#show_incoming_links').find('option[value="'+configuredJson.show_incoming_links+'"]').attr("selected",true);                      
            $('#schema_label').val(configuredJson.schema_Label_uri);
            $('#pref_labels').val(configuredJson.pref_Label_uri);
            $('#type_labels_uri').val(configuredJson.type_Label_uri);
            $('#prefix').val(configuredJson.prefix);
            $('#image_type_prefix').val(configuredJson.image_type_uri);
            $('#image_prefix').val(configuredJson.imgprefix);
                    
        }
        
        /*************** Call getModel fucntion with given resource *******************/
 
        if (!(_GET.resource === undefined)) {    
            $('#resource').val(_GET.resource); 
            getModel(_GET.resource.replace(/ /g, '%20'));
        }
        
        /**
         * @summary Manual Subject Uri
         */

        $(document).ready(function () {
            $('#SubmitBtn').click(function () {
                getModel(($('#resource').val()));
            });
        });

        
    });

/*********************** Get Subject Uri from link****************************/

var _GET = (function () {
    var _get = {};
    var re = /[?&]([^=&]+)(=?)([^&]*)/g;
    while (m = re.exec(location.search))
        _get[decodeURIComponent(m[1])] = (m[2] == '=' ? decodeURIComponent(m[3]) : true);    
    return _get;
})();

/******************* Set to local storage filename value **********************/

if (!(_GET.filename === undefined)) {
   // var folderpath = _GET.filename;   
    localStorage.setItem("filename", _GET.filename);      
}



/*********** Show previous tab button (open in new tab function) **************/

if (!(_GET.prev_resource === undefined)) {      
   // $('#new_tab_buttons').show();
    //getModel(_GET.resource);
}

/******************************************************************************/

/**
 * @summary Press sumbit button on input enter
 * @param {object} event
 */

$("#resource").keyup(function (event) {
    if (event.keyCode === 13) {
        $("#SubmitBtn").click();               
    }
});

/******************************************************************************/


/************************* Remove url from string******************************/
/**
 * @summary Removes url from Label string
 * @param {string} label 
 */
function remove_Url(label) {
    var result = label.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');   
    return result;
}
/************************* Collapse all children ******************************/
function Collapse_All() {
    $('#browser').find("li").each(function () {
        $(this).find('ul').hide();
        $(this).find('i').removeClass('fa-minus').addClass('fa-plus');
    });
}
/************************* Expand all children ******************************/
function Expand_All() {
    $('#browser').find("li").each(function () {
        $(this).find('ul').show();
      // alert($(this).hasClass("collapsable"));
       //if($(this).parent().hasClass("collapsable")){
        $(this).find('i').removeClass('fa-plus').addClass('fa-minus');
    //}
    });
}
/************************* Show Configuration page ****************************/
function ShowConfiguration() {
    $('#home').fadeOut();
    $('.active').removeClass('active');
    $('#nav_configuration').addClass('active');
    $('#configuration').fadeIn();
    
    if(JSON.parse(localStorage.getItem("selected_subjectsToshow"))){
        // createSubjectTable(localStorage.getItem("selected_subjectsToshow"));
    }
    
  
    createSubjectTable(JSON.parse(localStorage.getItem("selected_subjectsToshow")));
   console.log(JSON.parse(localStorage.getItem("selected_subjectsToshow")))
    
}
/************************* Show home page**************************************/
function ShowHome() {
    $('#configuration').fadeOut();
    $('.active').removeClass('active');
    $('#nav_home').addClass('active');
    $('#home').fadeIn();
}
/************************* Remove duplicates entries from a table************************/
/**
 * @summary Removes duplicate entries from a table
 * @param {object} values 
 */
function returnCleanTable(values) {
    var uniq_vals = [];

    $.each(values, function (i, el) {
        if ($.inArray(el, uniq_vals) === -1)
            uniq_vals.push(el);
    });
    return uniq_vals;
}
/************************* Go to next instance******************************/
/**
 * @summary Go to next instance
 * @param {string} id
 */
function goToNext_Instance(id) {
    
    var nextId = parseInt((id.slice(-1))) + 1;
    var next_instance = $('#' + id.slice(0, -1) + nextId);
    
    if (next_instance.length) {
       // console.log($('#'+id).offset().top)
       // console.log($(next_instance).offset().top)
        $(next_instance).effect("highlight", {color: '#d3e4ff'}, 3000);
        $('.dropdown').animate({
            //scrollTop: $(next_instance).offset().top - $('.dropdown').offset().top + $('.dropdown').scrollTop()		
            scrollTop: $(next_instance).offset().top - $('.dropdown').offset().top + $('.dropdown').scrollTop()		
        });
    } else {
        alert('Last instance');
        return;
    }
}
;
/************************* Go to previous instance******************************/
/**
 * @summary Go to previous instance
 * @param {string} id
 */
function goToPrevious_Instance(id) {
    
    var prevId = parseInt((id.slice(-1))) - 1;
    var prev_instance = $('#' + id.slice(0, -1) + prevId);
    
    if (prev_instance.length) {
        
        $(prev_instance).effect("highlight", {color: '#d3e4ff'}, 3000);
        $('.dropdown').animate({
            //scrollTop: $(prev_instance).offset().top + 300 //- $('.dropdown').offset().top + $('.dropdown').scrollTop()		
            scrollTop: $(prev_instance).offset().top + 300 //- $('.dropdown').offset().top + $('.dropdown').scrollTop()		
        });
    } else {
        alert('First instance');
        return;
    }
}
;

/************************ Mark same instances button**************************/

$('.mark_same').click(function () {
    
    if ($(this).hasClass('same_clicked')) {
        $('.same_insta').remove();
        $('.mark_same').removeClass('same_clicked');
    }
    else {
        $('.mark_same').addClass('same_clicked');
        var uris = new Array();
        $('#browser').find("span").each(function () {
            if (($(this).attr("uri"))) {
                uris.push($(this).attr("uri"));
            } else if (($(this).parent().attr("uri"))) {
                uris.push($(this).parent().attr("uri"));
            }
        });
        var obj = {};
        var cnt = 1;

        for (var i = 0, j = uris.length; i < j; i++) {
            obj[uris[i]] = (obj[uris[i]] || 0) + 1;

            if (obj[uris[i]] > 1) {
                var btn = $("[uri=" + uris[i] + "]");
                for (var q = 0; q < $("[uri=" + uris[i] + "]").length; q++) {
                    var html = "<button tabindex='0' id='instance_" + cnt + "_btn_" + q + "' instance='instance_" + cnt + "' class='same_insta' data-toggle='popover' data-trigger='focus' data-placement='right'>" + cnt + "<a class='fa fa-flag'></a></button>";
                    $($(btn)[q]).find('.same_insta').remove();
                    $($(btn)[q]).prepend(html);
                }
                cnt++;
            }
        }

        $(".same_insta").popover({
            html: true,
            animation: true,
            content: function () {
                var btn_id = $(this).attr('id');
                return $("<div id='popover-content'  class='hide'>"
                        + "<ul class='popovermenu'>"
                        + "<li><button class='instance_btn' onclick='goToPrevious_Instance(\"" + btn_id + "\");' style='font-size:12px; cursor:pointer;'>Go to previous instance</button></li>"
                        + "<li><button class='instance_btn' onclick='goToNext_Instance(\"" + btn_id + "\");' style='font-size:12px; cursor:pointer;'>Go to next instance</button></li>"
                        + "</ul></div>").html();
            }
        });
    }
});



function Config_predicates() {
   
    $('#table_of_preds').children().remove();   
    var preds = new Array();    
    var html = "";
    
    $('.predicate').each(function () {
        preds.push($(this).text());        
    });
    
    var clean = returnCleanTable(preds);
       
    $(clean).each(function () {        
        html = html+"<tr><th>"+this+"</th><th><input type='text' id='"+this.replace(/\s/g, "_")+"__' value=''/></th></tr>"; 
    });
         
    $('#table_of_preds').append(html);
     
};

/******************************************************************************/

/******************************************************************************/
function Submit_config_preds() {      
  
  var pred_labels = new Array();
  var pref_preds =  new Array();
    $('#table_of_preds tr').each(function() {
        if((($(this).find("th:first").html())!=='#')){                       
            pred_labels.push($(this).find("th:first").html());
            pref_preds.push($(this).find("th").children('input').val());           
        }  
 });
 
 $(pred_labels).each(function(i) {
     
    if(pref_preds[i]){     
        $('#'+pred_labels[i]).parent().children('span').children('a').text(pref_preds[i]);
    }             
 });
 
 /*
 $.post("UpdateProperties", {
        pred_labels: JSON.stringify(pred_labels) ,
        prefered_preds: JSON.stringify(pref_preds),        
    });*/
 

};

/*******************************************************************************/
/**
 * @summary Change plus or minus icon when element clicked
 * @param {object} node
 */
function changeIcon(node) {
    
    var parent = $(node).parent();
    if ($(parent).hasClass('expandable')) {
        $(node).find('i').removeClass('fa-plus').addClass('fa-minus');
    } else {
        $(node).find('i').removeClass('fa-minus').addClass('fa-plus');
    }
}
;

/*******************************************************************************/
/**
 * @summary Creates and shows the image gallery Modal
 * @param {string} src
 */

function imageModal(src) {

    $('.imagepreview').attr('src', src);
    $('#start_carusel').children().removeClass('active');
    $('.to_delete').remove();
    $('.imagepreview').parent().addClass('active');

    var imgs = new Array();
       
    $('.img_toShow').each(function () {
        imgs.push($(this).attr('src'));    
    
    });   
    
    var html = "";
    for (var i = 0; i < imgs.length; i++) {
        if (!(src === imgs[i])) {            
            html = html + "<div class='item to_delete'><img alt='#' src=" + imgs[i] + " class='' style='width: 100%;' ></div>";
        }
    }
    var btns =  "<a class='left  carousel-control' href='#gallery' role='button' data-slide='prev'><span class='glyphicon glyphicon-chevron-left'></span></a>" +
                "<a class='right carousel-control' href='#gallery' role='button' data-slide='next'><span class='glyphicon glyphicon-chevron-right'></span></a>";

    $('#start_carusel').append(html);
    if (imgs.length > 1) {
        $('#gallery').append(btns);
    }
            
    $('#imagemodal').modal('show');
}
;

//////////////Texts Functions /////////////////////////////////
/**
 * @summary Expands medium text nodes
 * @param {object} node
 */

function text_Expand(node) {
    
    var parentNode = $($($(node)).parent('li')); 
    var txt = ($(parentNode).attr("id"));      
    $(parentNode).find('.subject').text(txt);    
    $(parentNode).find('#hide_text').show();
    $(parentNode).find('#show_text').hide();      
}
//////////////////////////
/**
 * @summary Collapses medium text nodes
 * @param {object} node
 */
function text_Collapse(node) {
    
    var parentNode = $($($(node)).parent('li')); 
    var txt = ($(parentNode).attr("id"));    
    $(parentNode).find('.subject').text(txt.substr(0,500)+"...");    
    $(parentNode).find('#show_text').show();
    $(parentNode).find('#hide_text').hide();         
}
/////////////////////////
/**
 * @summary Creates and shows big texts Modal
 * @param {object} node
 * @param {string} property
 */
function text_popup_Modal(node,property) {
    var parent = $(node);
    var txt = ($(parent).parent('li').attr("id"));

    $('#todel').remove();
    $('#text_wraper').append("<div id='todel'><pre id='text_modal_pre'>"+txt+"</pre></div>");
    $('#text_modtitle').text(property);    
    $("#text_Modal").modal('show');        
}
//////////////////////////////////////////////////////////////////////

/************************ Fix dimensions appearance**************************/
/************ Goes one level deeper and get values **************************/
/**
 * @summary Goes one level deeper and get values
 * @param {json} json
 * @param {string} uri
 * @param {string} type
 */
function fix_dimension_label(json, uri, type) {

    var allpreds = new Array();

    $.each(json.Objects, function () {
        if (this.predicate_uri !== type_Label_uri) {
            allpreds.push(this.predicate_uri);
        }
    });
   
    var preds = returnCleanTable(allpreds);

    $.post("PredicatesPriority", {
        subject_type: json.Subject.type,
        preds: JSON.stringify(preds)
    }, function (response) {
        
        var jsonvalues = JSON.parse(response);       
        var values = new Array();

        for (var i = 0; i < jsonvalues.length; i++) {
            
            $.each(json.Objects, function () {
                var strings = this.uri.split('/');
                var ll = strings[strings.length - 1];
                if (this.predicate_uri === jsonvalues[i]) {
                    values.push(ll.replace("unit#", ""));
                }
            });
        }
        var vals = returnCleanTable(values);
        vals[0] = vals[0] + ": ";
        
        var string = "";
        for (var i = 0; i < vals.length; i++) {
            string = string + " " + vals[i];
        }          
        string = string.replace("%20"," ") + "<a id='" + type + "'> [ " + type + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"/> ]</a>";
 
        var node = $('[uri=' + uri + ']').children('span');        
        $(node).text("");
        $(node).prop("onclick", null);
        $(node).css("cursor", "default");
        $(node).css("color", "#656666");
        $(node).append(string);                
    });


}  
/************************ Check if string is a valid uri ********************/
/**
 * @summary Check if string is a valid uri 
 * @param {string} uri
 */
/*
function is_valid_Uri(uri) {    
  var result = false;
  if(uri.match((/^([a-z][a-z0-9+\-.]*:(\/\/([a-z0-9\-._~%!$&'()*+,;=]+@)?([a-z0-9\-._~%]+|\[[a-f0-9:.]+\]|\[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\])(:[0-9]+)?(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?|(\/?[a-z0-9\-._~%!$&'()*+,;=:@]+(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?)?)|([a-z0-9\-._~%!$&'()*+,;=@]+(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?|(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)+\/?))(\?[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?(#[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/ig))){
      result = true;
  } 
  //result = uri.match(/^([a-z][a-z0-9+\-.]*:(\/\/([a-z0-9\-._~%!$&'()*+,;=]+@)?([a-z0-9\-._~%]+|\[[a-f0-9:.]+\]|\[v[a-f0-9][a-z0-9\-._~%!$&'()*+,;=:]+\])(:[0-9]+)?(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?|(\/?[a-z0-9\-._~%!$&'()*+,;=:@]+(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?)?)|([a-z0-9\-._~%!$&'()*+,;=@]+(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)*\/?|(\/[a-z0-9\-._~%!$&'()*+,;=:@]+)+\/?))(\?[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?(#[a-z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/ig);
  //console.log(result)
  return result;
};
*/


/************************ Fix dimensions appearance**************************/
/************ Goes one level deeper and get values **************************/
/**
 * @summary Goes one level deeper and get values
 * @param {json} json
 * @param {string} lbl
 * @param {string} uri
 * @param {string} color
 */
function create_label(json, lbl, uri, color) {

    var allpreds = new Array();

    $.each(json.Objects, function () {
        if (this.predicate_uri === pref_Label_uri) {
            allpreds.push(this.uri);
        }
    });

    var vals = returnCleanTable(allpreds);

    var string = "";
    for (var i = 0; i < vals.length; i++) {
        string = string + "," + vals[i];
    }

    var result = (lbl.replace(prefix, "*/").replace(imgprefix, "")) + string.replace((lbl.replace(prefix, "*/").replace(imgprefix, "")), "");
    result = result.replace(/,\s*$/, "");

    var res;
           
    if (string.length > 0) { 
        res = "<a style='color:"+color+"' class='grey-tooltip' data-placement='right' data-toggle='tooltip'  title='' data-original-title='"+uri+"' >"+                                        
        result.replace(",,", ",")
          +"</a>";
        return res;        
    } else {            
        res = "<a style='color:"+color+"' class='grey-tooltip' data-placement='right' data-toggle='tooltip'  title='' data-original-title='"+uri+"' >"+                                        
        lbl.replace(prefix, "*/").replace(imgprefix, "");
          +"</a>";
        return res;
    }    
}

/********************** Add uri popover (object uri tooltip)************************/

/**
 * @summary Get all types of an object and return them as a string
 * @param {string} uri
 * @param {string} lbl
 * @param {string} color
 */

function create_uri_popover(uri, lbl, color) {
    
    var result = "<a " + color + "  class='grey-tooltip' data-placement='right' data-toggle='tooltip'  title='' data-original-title='" + decodeURI(uri) + "' >"
            + lbl.replace(prefix, "*/") +
            "</a>";   
    return result;
}
;

/******* Get all types of an object and return them as a string****************/

/**
 * @summary Get all types of an object and return them as a string
 * @param {json} json
 */

function fix_type(json) {

    var alltypes = new Array();

    $.each(json, function () {
        if (this.predicate_uri === type_Label_uri) {
            alltypes.push(this.uri.split('/').pop());
        }
    });

    var vals = returnCleanTable(alltypes);
    var string = "";

    for (var i = 0; i < vals.length; i++) {
        string = string + ", " + vals[i].split('/').pop();
    }
    var result = string.replace(',', '');

    return result;

}
;

/****** Checks if an object has only one "type" child and removes it ***********/
/**
 * @summary Checks if an object has only one "type" child and removes it
 * @param {json} json
 */

function type_is_unique_child(json) {

    var cnt = 0;
    $.each(json, function () {
        if ((this.predicate_uri == type_Label_uri)||(this.predicate_uri == schema_Label_uri) ){
            cnt++;
        }       
    });

    if (json.length == cnt) {
        return true;
    } else {
        return false;
    }
}
;

/****** Checks if an object has only one "prefLabel" child and removes it ***********/
/**
 * @summary Checks if an object has only one "prefLabel" child and removes it
 * @param {json} json
 */
function prefLabel_is_unique_child(json) {
    
    var cnt=0;   
    
    $.each(json, function () {
        if ( (this.predicate_uri == pref_Label_uri)|| (this.predicate_uri == schema_Label_uri)|| (this.predicate_uri == type_Label_uri) ){
            cnt++;
        }        
    });    

    if (json.length == cnt) {
        return true;
    } else {
        return false;
    }
}
;

////////////////////////////////////////////////////////////////////////////
/***************** Creates the first level of the tree  *******************/
/**
 * @summary Creates the first level of the tree (Subject-properties-Objects)
 * @param {string} resource
 */

function getModel(resource) {
    
    var folderpath = localStorage.getItem("filename"); // get filename if exists from localstorage  
    
    
          
    $(".triple").remove();
    var depth = tree_depth; // get value from config.properties file
    //depth = ($('#tree_depth').val());  

    /*$.post("GetTreeDepth", {
    }, function (response) {
        depth = $.trim(response);
    });*/
   
    $.post("GetData", {
        resource: resource,
        folderpath: folderpath,
        schema_Label_uri : schema_Label_uri,
        pref_Label_uri : pref_Label_uri,
        show_incoming_links :show_incoming_links
        
    }, function (response) {
       // console.log(JSON.parse(response));
        if ((response=="")) {
            $("#invalidSubject").modal();
            return;
        } else if ((response.trim() == "check_configuration")) {
            $("#check_configuration").modal();
            return;
        }
        
        var jsondata = JSON.parse(response);
        
        
    
        var htmltr = "";

        // if subject label has no value or no type return
        if ((jsondata.Subject.label == "")) {            
            if((jsondata.Subject.type == "")) {
                $("#invalidSubject").modal();
            }else{
                $("#no_label").modal();
            }                                  
            return;
        }
        

        // creation of expand collapse buttons 
        $('.configuration').show();
        $('#navigator_view,#empty_border').show();

        var predicates = new Array();       // Array of predicate labels
        var predicates_uri = new Array();   // Array of predicate uris

        // Collect predicate's uris and labels
        if ((($(jsondata.Objects).length) > 0)) {
            $.each(jsondata.Objects, function () {
                if (this.predicate.indexOf("NOLABEL") !== -1) {
                    predicates.push(this.predicate_uri);
                } else {
                    predicates.push(this.predicate);
                }
                predicates_uri.push(this.predicate_uri);
            });
        }

        var uniq_predicates = returnCleanTable(predicates); // clean predicate array
        var uniq_pred_uris = returnCleanTable(predicates_uri);  //clean predicate uri array                         
        var prioritized_uris = new Array();

        $.post("PredicatesPriority", {
            subject_type: jsondata.Subject.type,
            preds: JSON.stringify(uniq_pred_uris)
        }, function (response) {
            
            if(response==""){
                $("#fix_properties_xml").modal(); 
                return;
            }                        
            else if (response != -1) {
                prioritized_uris = JSON.parse(response);               
            }                    
            else {
                prioritized_uris = uniq_pred_uris;
                            
            }
                                                

            /************************* Subject Creation **********************************/

            var type = (jsondata.Subject.type).split('/').pop(); 
            
            
            htmltr = htmltr = ("<div class='triple'><li><span oncontextmenu='rightClickMenu(this)' onclick='changeIcon(this)' style='height:inherit; margin-left: 0px; padding-left:10px' uri='" + jsondata.Subject.subject.replace(/[^a-z0-9-_]+/gi, "_") + "' id='" + jsondata.Subject.subject + "' class='" + type + " subject folder'>" +
                    remove_Url(jsondata.Subject.label) + "<a style='pointer-events: none;' id='" + type + "'> [ " + type + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"/> ]</a>"
                    + "<i style='padding-right:8px; padding-top:5px; pointer-events: none;' class='fa fa-minus pull-right' aria-hidden='true'></i></span>");

            /*****************************************************************************/
            /************************* Predicate Creation ********************************/

            var final_preds = new Array();
            var final_pred_labls = new Array();

            // creation of final predicates and predicates uri array
            for (var i = 0; i < prioritized_uris.length; i++) {
                if ($.inArray(prioritized_uris[i], uniq_pred_uris) > -1) {
                    var val = (uniq_pred_uris[($.inArray(prioritized_uris[i], uniq_pred_uris))]);
                    final_preds.push(val.split('/').pop());
                    var val2 = (uniq_predicates[($.inArray(prioritized_uris[i], uniq_pred_uris))]);
                    final_pred_labls.push(val2.split('/').pop());
                }
            }
            


            if (($(jsondata.Objects).length) > 0) {
                htmltr = htmltr + ("<ul style='background-color: #f7f7f7;'>");
                for (var i = 0; i < final_preds.length; i++) {

                    var pred_val = "";
                    if (final_preds[i] == final_pred_labls[i]) {
                        pred_val = final_preds[i];
                    } else {
                        pred_val = final_pred_labls[i];
                    }

/////////////////////////////////////Does not show  'schema' & 'label' properties DEMO//////////////                    
                    var current_pred = final_preds[i].replace(/\#/g, "_");
                    if (!(  (current_pred == (schema_Label_uri.split('/').pop()).replace(/\#/g, "_"))||(current_pred == (type_Label_uri.split('/').pop()).replace(/\#/g, "_"))))
                    {
                        htmltr = htmltr + ("<li  id='predicate_style'><span class='folder predicate'><a pred_id='" + current_pred + "' class=grey-tooltip data-placement='top' data-toggle='tooltip' title='" + (jsondata.Subject.label).replace(/['"/]/gi, '`') + " [" + type + "]'>" + pred_val //+"<i class='fa fa-minus' aria-hidden='true'></i>"
                                + "</a></span><ul class='preds_ul' id =" + current_pred/*.replace(/ /g, "_")*/ + "></span></ul></li>");
                    }                  
                }
                htmltr = htmltr + ("</ul>");
            }
            htmltr = htmltr + ("</div>");
                        

            $('#browser').append(htmltr);

            /******************************************************************/
            /************************** Object Creation ***********************/
            /******************************************************************/

            if (($(jsondata.Objects).length) > 0) {

                $.each(jsondata.Objects, function () {

                    var Id = (this.predicate_uri).split('/').pop();
                    Id = Id.replace(/\#/g, "_");
                    ////////////////////////////////////////////
                    var type = (this.type).split('/').pop();
                    //////////////////////////////////////////////                                                                                                                                                          
                    /*********** Prefetch gia to vathos ********************************/
                    var clean_uri = (this.uri).replace(/[^a-z0-9-_]+/gi, "_");
                    var this_uri = this.uri;
                    var this_label = remove_Url(this.label);
                    var literal = this.uri;
                    var invert = this.invert;
                    //var pred_lbl =this.predicate_uri.split('/').pop();
                    
                    var obj_type = this.type;

                    $.post("GetData", {
                        resource: this.uri,
                        folderpath: folderpath,
                        schema_Label_uri : schema_Label_uri,
                        pref_Label_uri : pref_Label_uri, 
                        show_incoming_links :show_incoming_links,
                        parentProperty : Id

                    }, function (response) {

                        var htmltrob;

                        if ((response=="")) {                            
                            htmltrob = ("<li uri=" + clean_uri + " class='' id='" + literal + "'><span style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject'>" +  
                                    literal.replace(prefix, "*/") + "</span></li>");                            
                            ///////////////////////////////////////// TEXTS///////////////////////////////
                            if ((literal.length > 600) && (literal.length < 1000)) {
                                htmltrob = ("<li uri=" + clean_uri + " class='' id='" + literal.replace(/'/g, "\"") + "'><span style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject'>" +
                                        literal.substr(0, 500) + "...</span><button id='show_text' onclick='text_Expand(this);'  btn-id='' style='margin: 3px 3px 3px 30px;' class='oioi btn btn-default btn-xs'>Expand text<i style='padding-left:5px;' class='fa fa-caret-down'/></button>" +
                                        "<button id='hide_text' style='margin: 3px 3px 3px 30px; display:none;' onclick='text_Collapse(this);' class=' btn btn-default btn-xs'>Collapse text <i style='padding-left:5px;' class='fa fa-caret-up'/></button></li>");
                            }
                            else if ((literal.length > 1001)) {
                                htmltrob = ("<li uri=" + clean_uri + " class='' id='" + literal.replace(/'/g, "\"") + "'><span   style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject " + "'>" +
                                        literal.substr(0, 500) + "...</span><button onclick='text_popup_Modal(this,\"" + Id + "\");'  btn-id='' style='margin: 3px 3px 3px 30px;' class='oioi btn btn-default btn-xs'>View full text<span style='padding-left:5px;' class='glyphicon'></span></button></li>");
                            }
                            ///////////////////////////////////////// TEXTS///////////////////////////////                                         
                        }
                        else {                            
                            var jsonresponse = JSON.parse(response);
                            var lbl = this_label;
                            
                            if (this_label == "NOLABEL") {
                                lbl = this_uri;
                            }
                            var img = ""; //(lbl.indexOf('.jpg') > -1)   //(result.indexOf(".png")>-1)||(result.indexOf(".bmp")>-1)||(result.indexOf(".jpeg")>-1)||(result.indexOf(".jpg")>-1) )                                
                            if ((lbl.match(/\.(jpeg|jpg|gif|png)$/)!=null)|| (obj_type== image_type_uri) ){
                                img = "<a href='#' class='pop'><img class='hover_zoom img_toShow' onclick='imageModal(\"" + lbl + "\");' id='myImg' src='" + lbl + "' /></a>";                           
                            }

                            if (($(jsonresponse.Objects).length) > 0) {                                
                                //  If the Object has only one child "type" then don't show expand button
                                if (type_is_unique_child($(jsonresponse.Objects))) {
                                    htmltrob = ("<li uri=" + clean_uri + " id='" + this_uri + "'>" + img +
                                                "<span oncontextmenu='rightClickMenu(this)'  style='color:#656666; height:inherit;  margin-right:8px; padding-left:10px' class='folder subject " + type + "''>" +
                                                create_label(jsonresponse,lbl,this_uri,'#333333')+ "<a id='" + type + " '> [ " +
                                                fix_type(($(jsonresponse.Objects))) + /*type +*/ " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"/> ]</a><i style=' padding-top: 5px; padding-right: 8px; margin-left: 5px;' class='' id='add'></i></span></li>");
                                }                                                                                          
                                else {
                                    htmltrob = ("<li uri=" + clean_uri + " id='" + this_uri + "'>" + img + 
                                                "<span oncontextmenu='rightClickMenu(this)'  style='height:inherit; cursor:pointer;  margin-right:8px; padding-left:10px' class=' folder subject " + type + "'onclick='objectToSubject(\"" + this_uri + "\"," + (-1) + "," + (-2) + "," + (-2) + ",this)'>" +
                                                create_label(jsonresponse, lbl, this_uri,'#333333')+ "<a id='" + type + "'> [ " +
                                                fix_type(($(jsonresponse.Objects))) + /*type +*/ " <img style='padding-bottom: 3px;' src='img/" +  type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"/> ]</a><i style=' cursor:pointer; padding-top: 5px; padding-right: 8px; margin-left: 5px;' class='fa fa-plus pull-right' id='add'></i></span></li>");
                                }                                
                                //  If the Object has only one child "prefLabel" then don't show expand button
                                if (prefLabel_is_unique_child($(jsonresponse.Objects)) ) {
                                    htmltrob = ("<li uri=" + clean_uri + " id='" + this_uri + "'>" + img +                                                                                                      // OBJECT MOUSOVER 
                                                "<span oncontextmenu='rightClickMenu(this)'  style='color:#656666; height:inherit;  margin-right:8px; padding-left:10px' class='folder subject " + type + "''>" +//"<a class=grey-tooltip data-placement='auto' data-toggle='tooltip' title='" + this_uri + "'>"+
                                                 create_label(jsonresponse, lbl,this_uri) + "<a id='" + type + "'> [ " +
                                                 fix_type(($(jsonresponse.Objects))) + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"/> ]</a><i style=' padding-top: 5px; padding-right: 8px; margin-left: 5px;' class='' id='add'></i></span></li>");
                                }
                                
                                //  Fix dimension appearance                                
                                /*   if (type == "E54_Dimension") {
                                    fix_dimension_label(jsonresponse, clean_uri, type)
                                }*/
                                ////////////////////////////////////////////////////////////////////
                            }
                            else {
                                if (obj_type == "NOTYPE") {
                                    var txt = literal.replace(prefix, "*/");
                                    htmltrob = ("<li uri=" + clean_uri + " class='' id='" + literal + "'><span  style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject'>" +
                                            txt + "</span></li>");
                                    ///////////////////////////////////////// TEXTS///////////////////////////////
                                    if ((txt.length > 600) && (txt.length < 1000)) {
                                        htmltrob = ("<li uri=" + clean_uri + " class='' id='" + literal.replace(/'/g, "\"") + "'><span   style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject " + "'>" +
                                                txt.substr(0, 500) + "...</span><button id='show_text' onclick='text_Expand(this);'  btn-id='' style='margin: 3px 3px 3px 30px;' class='oioi btn btn-default btn-xs'>Expand text<i style='padding-left:5px;' class='fa fa-caret-down'/></button>" +
                                                "<button id='hide_text' style='margin: 3px 3px 3px 30px; display:none;' onclick='text_Collapse(this);' class=' btn btn-default btn-xs'>Collapse text <i style='padding-left:5px;' class='fa fa-caret-up'/></button></li>");
                                    }
                                    else if ((txt.length > 1001)) {
                                        htmltrob = ("<li uri=" + clean_uri + " class='' id='" + literal.replace(/'/g, "\"") + "'><span   style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject " + "'>" +
                                                txt.substr(0, 500) + "...</span><button onclick='text_popup_Modal(this,\"" + Id + "\");'  btn-id='' style='margin: 3px 3px 3px 30px;' class='oioi btn btn-default btn-xs'>View full text<span style='padding-left:5px;' class='glyphicon'></span></button></li>");
                                    }
                                    ///////////////////////////////////////// TEXTS///////////////////////////////                                    
                                }
                                else {
                                    htmltrob = ("<li uri=" + clean_uri + " class='' id='" + this_uri + "'>" + img + "<span  style='color:#656666; margin-right:8px; padding-left:10px' class='folder subject " + type + "'>" +
                                    lbl.replace(prefix, "*/") + "<a id='" + type + "'> [ " + type + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"/> ]</a></span></li>");
                                }
                            }                          
                        }                        
/**************************************************************************************************************/
                        if (invert == true) {
                            if ((($('#browser').find("[pred_id=" + Id + "]")).find('.fa-long-arrow-left').length) < 1) {
                                ($('#browser').find("[pred_id=" + Id + "]")).append(" <i class='fa fa-long-arrow-left rotate-45-right' aria-hidden='true'></i> <a> (reverse property, is referred from the below)</a>");
                            }
                        }
/*************************************************************************************************************/                        
        
                        ($('#browser').find("#" + Id)).append(htmltrob);                      

                        var html_object = $('#browser').find("#" + Id).find('[uri=' + clean_uri + ']');

                        if ($(html_object).length > 1) {
                            $(html_object).last().remove();
                        }
                                                                                              
                        if (depth > 0) {
                            //console.log($(htmltrob).html())
                            //thelei ftiaximo gia to vathos
                            var pp = $(htmltrob).children('span')[0];
                            // $(pp).children('a').remove()
                            // $(pp).children('i').remove()
                            // console.log(pp)                                
                            objectToSubject(this_uri, depth, true, 0, pp);
                        }
                        //console.log($(htmltrob).children('span')[0])                    
                        showHide(); //hide more than 4 children

                    });
                    /******************************************************************/
                });
            }
            /*****************************************************************************/
            $('#browser').treeview();
            /*****************************************************************************/
        });

    }, "html");

}
////////////////////////////////////////////////////////////////////////////////////
/************** Transforms an object leaf to subject element *******************/

/**
 * @summary Transforms an object leaf to subject element
 * 
 * @param {string} resource To be transformed into Subject
 * @param {int} depth    
 * @param {string} showflag
 * @param {int} curdepth    Current depth of node (used for open in new tab)
 * @param {object} pred_pos Current position of parent property
 */

function objectToSubject(resource, depth, showflag, curdepth, pred_pos) {
    
    var folderpath = localStorage.getItem("filename");
    var parentNode = $(document.getElementById(resource)).parent();
    var parentProperty = ($(parentNode).parent().find('.preds_ul').attr('id'));
   //console.log($(parentNode).parent().find('.preds_ul').attr('id'));
   
    $.post("GetData", {
        resource: resource,
        folderpath: folderpath,
        schema_Label_uri : schema_Label_uri,
        pref_Label_uri : pref_Label_uri,
        show_incoming_links : show_incoming_links,
        parentProperty : parentProperty
    }, function (response) {

        var jsondata = JSON.parse(response);
        var parentNode = $(document.getElementById(resource)).parent();
        var predicates = new Array();
        var predicates_uri = new Array();

        var current_depth = $("[uri=" + resource.replace(/[^a-z0-9-_]+/gi, "_") + "]").parents().length;

       // console.log(jsondata)   
     
        if (($(jsondata.Objects).length) > 0) {

            $.each(jsondata.Objects, function () {
                if (this.predicate.indexOf("NOLABEL") !== -1) {
                    predicates.push(this.predicate_uri);
                } else {
                    predicates.push(this.predicate);
                }
                predicates_uri.push(this.predicate_uri);
            });

            var uniq_predicates = returnCleanTable(predicates);
            var uniq_pred_uris  = returnCleanTable(predicates_uri);
            var prioritized_uris = new Array();

            $.post("PredicatesPriority", {
                subject_type: jsondata.Subject.type,
                preds: JSON.stringify(uniq_pred_uris)
            }, function (response) {
                
                if (response != -1) {
                    prioritized_uris = JSON.parse(response);                  
                } else {
                    prioritized_uris = uniq_pred_uris;
                }
/**************************************** Subject Creation ****************************************************/

                var type = (jsondata.Subject.type).split('/').pop();
                var outlbl = jsondata.Subject.label;
                
                if (jsondata.Subject.label == "") {
                    outlbl = resource;
                }

                var img = ""; // (outlbl.indexOf('.jpg') > -1)
                if ((outlbl.match(/\.(jpeg|jpg|gif|png)$/)!=null)||(jsondata.Subject.type==image_type_uri) ){
                    img = "<a href='#' class='pop' style='padding:0px 40px 0px 0px;margin-left: -40px;'><img class='hover_zoom img_toShow' onclick='imageModal(\"" + outlbl + "\");' id='myImg' src='" + outlbl + "' /></a>";                                       
                }               
                
                var html = ("<li><span oncontextmenu='rightClickMenu(this)' uri='" + jsondata.Subject.subject.replace(/[^a-z0-9-_]+/gi, "_") + "' onclick='changeIcon(this)' style='height:inherit; padding-left:10px;' id='" + jsondata.Subject.subject + "' class='" + type + " subject folder'>" + img +
                            create_label(jsondata, outlbl,jsondata.Subject.subject,'#333333' )+ /*(outlbl.replace(prefix, "* /")).replace(imgprefix, "") +*/ "<a style='pointer-events: none;' id='" + type + "'> [ " + fix_type(($(jsondata.Objects))) + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\" /> ]</a>" +
                            "<i style='pointer-events: none; padding-right:8px; padding-top:5px;' class='fa fa-minus pull-right' aria-hidden='true'></i></span><ul>");

/**************************************************************************************************************/
/***************************************** Predicate Creation *************************************************/

                var final_preds = new Array();
                var final_pred_labls = new Array();

                for (var i = 0; i < prioritized_uris.length; i++) {
                    if ($.inArray(prioritized_uris[i], uniq_pred_uris) > -1) {
                        var val = (uniq_pred_uris[($.inArray(prioritized_uris[i], uniq_pred_uris))]);
                        final_preds.push(val.split('/').pop());
                        var val2 = (uniq_predicates[($.inArray(prioritized_uris[i], uniq_pred_uris))]);
                        final_pred_labls.push(val2.split('/').pop());
                    }
                }

                html = html + ("<ul>");
                for (var i = 0; i < final_preds.length; i++) {
                    var pred_val = "";
                    if (final_preds[i] == final_pred_labls[i]) {
                        pred_val = final_preds[i];                        
                    } else {
                        pred_val = final_pred_labls[i];
                    }
                    
                    /////////////////////////////////////Does not show  'schema' & 'label' properties DEMO////////////// 
                    var current_pred = final_preds[i].replace(/\#/g, "_");
                    if (!(  (current_pred == (schema_Label_uri.split('/').pop()).replace(/\#/g, "_"))||   
                            (current_pred == (type_Label_uri.split('/').pop()).replace(/\#/g, "_"))||     
                            (current_pred == (pref_Label_uri.split('/').pop()).replace(/\#/g, "_") )                              
                        )){
                            html = html + ("<li id='inner_predicate'><span pred_uri='"+pred_val+"' class='folder predicate'> <a class=grey-tooltip data-placement='top' data-toggle='tooltip' title='" + (jsondata.Subject.label).replace(/['"/]/gi, '`') + " [" + type + "]'>" + pred_val
                                   + "</a></span ><ul class='preds_ul' id =" + (current_pred).replace(".", "_") + "></ul></span></li>");                    
                        }                                                       
                }
                html = html + ("<ul>");

                // var branches = $(html).appendTo($(parentNode));
                var expand_position = $(pred_pos).parent('li');

                /**************** insert After for expansion in right place ******/
                //var container = ($(parentNode).find('[uri=' + jsondata.Subject.subject.replace(/[^a-z0-9-_]+/gi, "_") + ']'));
                
                var branches = $(html).insertAfter($(expand_position));
                
/**************************************************************************************************************/
/*********************************** Object Creation **********************************************************/
 
                if (($(jsondata.Objects).length) > 0) {

                    $.each(jsondata.Objects, function () {

                        var Id = (this.predicate_uri).split('/').pop();
                        Id = Id.replace(/\#/g, "_").replace(/\./g , "_");

                        var type = (this.type).split('/').pop();
                        /*********** Prefetch gia to vathos ********************************/
                        var uri_i = (this.uri).replace(/[^a-z0-9-_]+/gi, "_");
                        var this_uri = this.uri;
                        var this_label = this.label;
                        var literal = this.uri;
                        var obj_type = this.type;  
                        var invert = this.invert;
                        var prd_uri=this.predicate_uri;
         
                     
                        $.post("GetData", {
                            resource: this.uri,
                            folderpath: folderpath,
                            schema_Label_uri : schema_Label_uri,
                            pref_Label_uri : pref_Label_uri,
                            show_incoming_links: show_incoming_links,
                            parentProperty : Id
                        }, function (response) {
                                              
                            var htmltrob;

                            if ((response=="")) {                                 
                                htmltrob = ("<li uri=" + uri_i + " class='' id='" + literal + "'><span   style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject " + literal.replace("CRM: ", "") + "'>" + (literal.replace(prefix, "*/")) + "</span></li>");
                            }
                            else {
                                var jsonresponse = JSON.parse(response);
                                var lbl = this_label;
                                if (this_label == "NOLABEL") {
                                    lbl = this_uri;
                                }
                                
                                if (($(jsonresponse.Objects).length) > 0) {                                     
                                    //  If the Object has only one child "type" then don't show expand button
                                    if (type_is_unique_child($(jsonresponse.Objects))) {                                        
                                        htmltrob = ("<li class=''  uri=" + uri_i + " id='" + this_uri + "'><span oncontextmenu='rightClickMenu(this)'  style=' color:#656666; margin-right:8px; padding-left:10px;' class='folder subject " + type + "'>"
                                                    +create_uri_popover(this_uri, lbl,"style='color:#313131'") +
                                                    "<a id='" + type + "'> [ " + fix_type(jsonresponse.Objects) /*type*/ + " <img style='padding-bottom: 3px;' src='img/" +  type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\" /> ]</a>" + "</span></li>");
                                    } else {    
                                        htmltrob = ("<li class=''  uri=" + uri_i + " id='" + this_uri + "'><span oncontextmenu='rightClickMenu(this)' style=' cursor:pointer; margin-right:8px; padding-left:10px;' class='folder subject " + type + "'  onclick='objectToSubject(\"" + this_uri + "\"," + depth + "," + true + "," + current_depth + ",this)'>"+     
                                                    create_uri_popover(this_uri, lbl,"style='color:#313131'") 
                                                    +"<a id='" + type + "'> [ " + fix_type(jsonresponse.Objects) /*type*/ + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\" /> ]</a>" + /*expand_icon*/"<i style=' cursor:pointer; padding-top: 5px; padding-right: 8px; margin-left: 5px;' class='fa fa-plus pull-right' id='add'></i>" + "</span></li>");
                                    }
                                    
                                    //  If the Object has only one child "prefLabel" then don't show expand button
                                    if (prefLabel_is_unique_child($(jsonresponse.Objects))){
                                         htmltrob = ("<li class=''  uri=" + uri_i + " id='" + this_uri + "'><span oncontextmenu='rightClickMenu(this)' style=' color:#656666; margin-right:8px; padding-left:10px;' class='folder subject " + type + "'>"
                                                        +create_uri_popover(this_uri, lbl)                                                                                      
                                                        + "<a id='" + type + "'> [ " + fix_type(jsonresponse.Objects) /*type*/ + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\" /> ]</a>" + "</span></li>");
                                    }
                                                                                                           
                                    ////////// Dimension Fix                                                           
                                    /* if (type == "E54_Dimension") {
                                        fix_dimension_label(jsonresponse, uri_i, type);
                                    }*/
                                    /////////// If current depth greater than six replace expand button with open in new tab
                                    if (current_depth > 39) {
                                        htmltrob = ("<li class=''  uri=" + uri_i + " id='" + this_uri + "'><span  style='margin-right:8px; padding-left:10px;' class='folder subject " + type + "'>"                                                                 
                                                    +create_uri_popover(this_uri, lbl,"style='color:#313131'")                                                   
                                                    +"<a id='" + type + "'> [ " + type + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\" /> ]</a>" + "<a style='cursor:pointer; padding-top: 5px; padding-right: 8px; margin-left: 5px;'  class='fa fa-crosshairs pull-right grey-tooltip'  href='?resource=" + this_uri + "&prev_resource=" + resource + "&filename="+folderpath+"' target='_blank' data-toggle='tooltip' title='Open in new tab'  ></a>" + "</span></li>");
                                    }
                                    
                                }
                                else {                                   
                                    if (obj_type == "NOTYPE") {                                        
                                        htmltrob = ("<li  uri=" + uri_i + " class='' id='" + literal + "'><span  oncontextmenu='rightClickMenu(this)'  style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject'>" +              
                                            ((lbl.replace(prefix, "*/")).replace("http://qudt.org/vocab/unit#", "*/"))+ "</span></li>");
                                        ///////////////////////////////////////// TEXTS///////////////////////////////
                                        if ((lbl.length > 660) && (lbl.length < 1000)) {
                                            htmltrob = ("<li uri=" + uri_i + " class='' id='" + literal.replace(/'/g, "\"") + "'><span   style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject " + "'>" +
                                                    lbl.substr(0, 300) + "...</span><button id='show_text' onclick='text_Expand(this);'  btn-id='' style='margin: 3px 3px 3px 30px;' class='oioi btn btn-default btn-xs'>Expand text<i style='padding-left:5px;' class='fa fa-caret-down'/></button>" +
                                                    "<button id='hide_text' style='margin: 3px 3px 3px 30px; display:none;' onclick='text_Collapse(this);' class=' btn btn-default btn-xs'>Collapse text <i style='padding-left:5px;' class='fa fa-caret-up'/></button></li>");
                                        }
                                        else if ((lbl.length > 1001)) {
                                            htmltrob = ("<li uri=" + uri_i + " class='' id='" + literal.replace(/'/g, "\"") + "'><span   style='color:#656666; height:inherit; margin-right:8px; padding-left:10px' class='folder subject " + "'>" +
                                                    lbl.substr(0, 700) + "...</span><button onclick='text_popup_Modal(this,\"" + Id + "\");'  btn-id='' style='margin: 3px 3px 3px 30px;' class='oioi btn btn-default btn-xs'>View full text<span style='padding-left:5px;' class='glyphicon'></span></button></li>");
                                        }
                                        ///////////////////////////////////////// TEXTS/////////////////////////////// 
                                    }
                                    else {                                        
                                            htmltrob = ("<li class=''  uri=" + uri_i + " id='" + this_uri + "'><span style=' height:inherit; color:#656666; margin-right:8px; padding-left:10px;' class='folder subject " + type + "'>"+                                                                                     
                                            (lbl.replace(prefix, "*/")) + "<a id='" + type + "'> [ " + type + " <img style='padding-bottom: 3px;' src='img/" + type.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\" /> ]</a></span></li>");
                                    }                                                                                                          
                                }
                                  
                            }
                            /***************************** circle handling ******/
                            if (($('[uri=' + uri_i + ']').length) > 0) {
                                //  console.log('loop')                                                                                                                                  
                                htmltrob = ("<li class=''  uri=" + uri_i + " id='" + this_uri + "'><span oncontextmenu='rightClickMenu(this)' onclick='highlight(\"" + uri_i + "\")' style=' cursor:pointer; margin-right:8px; padding-left:10px; color:#656666;' class='folder subject " + type + "'>"
                                + ((lbl.replace("http://qudt.org/vocab/unit#","*/")).replace(prefix, "*/")) + "<a id='" + type + "'></span></li>");                                                                                 
                            }
                            /***************************** circle handling ******/
                           
                            ($(branches).find("#" + Id)).append(htmltrob);
                            
                           
                            var html_object = $(branches).find("#" + Id).find('[uri=' + uri_i + ']');
                            ///// Removes duplicate Objects
                            if (html_object.length > 1) {
                                $(html_object).last().remove();
                            }//else{}
                            //clean_type(html_object,branches);                           
                            
/********************************* INVERSE PROPERTIES *************************************/                           
                            if (invert == true) {
                                var pred_id = prd_uri.split('/').pop();
                                var inverse_html = $(html_object).parent().parent().find('[pred_uri=' + pred_id + ']');

                                //if($(html_object).parent().parent().find('[pred_uri='+pred_id+']').find('.fa-long-arrow-left').length<1){
                                if ($(inverse_html).find('.fa-long-arrow-left').length < 1) {
                                    ($(inverse_html).append((" <i class='fa fa-long-arrow-left rotate-45-right' aria-hidden='true'></i> <a>(reverse property, is referred from the below)<a/>")));
                                }
                            }
/*****************************************************************************************/
                        
                            $(branches).css("margin-right", "8px");
                            $(branches).find('[id=inner_predicate]').css("filter", "brightness(96%)");
                            showHide();
                            showflag = false;

                            //open in predefined depth
                            //alert(depth-curdepth)
                            if (depth - curdepth > 1) {
                                //  var pp = $(htmltrob).children('span')[0];
                                objectToSubject(this_uri, depth, true, curdepth + 1);
                            }
//objectToSubject(this_uri); //the whole tree
                        });
                    });
                }
                $(expand_position).remove();                
                $("#browser").treeview({add: branches});
            });                     
        } else {
            return;
        }    
    }, "html");
}

/******************* Create and show expand buttons **************************/

function showHide() {
            
    var pop_btn_id = (new Date()).getTime();
   
    var preds = $('.preds_ul');
    /******************* Sort by size of list **************************/
            
    $(preds).each(function () {    
                
        if(($(this).children('.show_list').attr('flag'))==='notshow'){            
            return;
        }
        
        if(($(this).children('.show_pop_list').attr('flag'))==='notshow'){            
            return;
        }
                
        var size = $(this).children('li').length;      
        var expand_btnlength = ($(this).find('.show_list').length);
        var collapse_btnlength = ($(this).find('.show_list').length);
        var poplength = ($(this).find('.show_pop_list').length);
        

        var show_list_btn = '<button flag="show" style="margin: 3px 3px 3px 46px;"  class="show_list btn btn-default btn-xs">expand list (' + size + ' entries)<i style="padding-left:5px;" class="fa fa-caret-down"/></button>';
        var hide_list_btn = '<button style="margin: 3px 3px 3px 46px; display:none; "  class="hide_list btn btn-default btn-xs">collapse list (' + size + ' entries)<i style="padding-left:5px;" class="fa fa-caret-up"/></button>';
        var show_pop_btn  = '<button flag="show" btn-id="' + pop_btn_id + '" style="margin: 3px 3px 3px 46px;" class=" show_pop_list btn btn-default btn-xs">View all (' + size + ' entries)<span style="padding-left:5px;" class="glyphicon">&#xe164;</span></button>';

        if ((size > 3) && (size < 10)) {
            $(this).append(show_list_btn);
            $(this).append(hide_list_btn);
            var max = 0;

            $($(this).children('li')).each(function () {
                if (max > 2) {
                    $(this).hide();
                }
                max = max + 1;
            });

            if (expand_btnlength > 0) {
                $(this).find('.show_list, .hide_list').remove();
                $(this).append(show_list_btn);
                $(this).append(hide_list_btn);
            }
            if (collapse_btnlength > 1) {
                $(this).find('.hide_list').remove();
              //  $(this).append(show_list_btn);
              //  $(this).append(hide_list_btn);
            }

        } else if ((size > 9)) {
            $(this).append(show_pop_btn);             
            var pop_max = 0;            
            $($(this).children('li')).each(function () {
                if (pop_max > 2) {               
                    $(this).hide();                                     
                }
                pop_max = pop_max + 1;
            });

            if (poplength > 0) {
                $(this).find('.show_pop_list').remove();
                $(this).append(show_pop_btn);
            }
            
            $(this).find('.show_list').remove();
            //pop_btn_id = pop_btn_id + 1;
            pop_btn_id++;
                       
        }
    });

    /**************************** Expand 3 to 9***********************************/
    $('.show_list').click(function () {

        $(this).parent().each(function () {            
            $(this).find('li').show();            
        });

        $(this).parent().find('.show_list').hide();
        $(this).parent().parent().find('.hide_list').show();
        
        $(this).attr("flag","notshow");
        //console.log($(this).attr('flag'));
    });
    /**************************** Collapse 3 to 9***********************************/
    $('.hide_list').click(function () {
        var max = 0;
        $($(this).parent().find('li')).each(function () {
            max = max + 1;
            if (max < 4) {
            } else {               
                $(this).hide();
            }
        });
        $(this).parent().find('.hide_list').hide();
        $(this).parent().parent().find('.show_list').show();
    });

    /**************************Create modal over 10 entries**********************/
    $('.show_pop_list').click(function () {
        var all = "";
        var btn_id = $(this).attr("btn-id");
        $('#Insert_entries').remove();
        $('#expand_list_footer').append('<button id="Insert_entries" onclick="insertEntries(' + btn_id + ')" type="button" class="btn btn-default">Insert selected</button>');

       $("#to_Add").find('li').remove();

        $(this).parent().each(function () {           
            all = all + $(this).html();
        });

        $('#to_Add').append(all);
       // console.log( $('#to_Add').children().find('ul').length)
        
        $('#to_Add').children().find('ul').each(function () {            
           $(this).children().remove();
        });

                
        $("#to_Add").find('li').each(function () {
            if ($(this).css('display') !== 'none') {
                $(this).children('span').prop('onclick',null).off('click');
                $(this).children('span').css({'cursor' :"default"});
                if($(this).hasClass('collapsable')){
                    $(this).children('span').children('a').children('.hover_zoom').css({'margin-left' :"-28px"});
                }
                $(this).children('span').prepend('<input checked style="margin-right:10px" type="checkbox">');
            } else {
                $(this).children('span').prop('onclick',null).off('click');
                $(this).children('span').css({'cursor' :"default"});
                if($(this).hasClass('collapsable')){
                    $(this).children('span').children('a').children('.hover_zoom').css({'margin-left' :"-28px"});                    
                }
                $(this).children('span').prepend('<input style="margin-right:10px" type="checkbox">');
                
                $(this).show();
            }
        });

        $("#to_Add").each(function () {
            
            $(this).find('li').find('span').css('display', 'block');
            $(this).find('li').find('span').css('padding', '0px 0px 0px 15px');
            $(this).find('li').find('span').css('margin-bottom', '5px');
            $(this).find('li').find('i').css({'cursor' :"default"});
            $(this).find('li').find('i').css({'color' :"grey"});
            
            $(this).find('.collapsable').find('span').children('a').css({'padding' :"0px"});
            $(this).find('.collapsable').find('span').children('a').css({'margin-left' :"0px"});
            $(this).find('.collapsable').find('span').find('#myImg').css({'margin-left' :"-68px"});
            
            $(this).find('.expandable').find('span').children('a').css({'padding' :"0px"});
            $(this).find('.expandable').find('span').children('a').css({'margin-left' :"0px"});
            $(this).find('.expandable').find('span').find('#myImg').css({'margin-left' :"-68px"});
            $(this).find('li').find('i').addClass('fa-plus').removeClass('fa-minus');
        });
        //console.log($("#to_Add"))

        $("#list_showHide").find('#show_pop_list').remove();
        $('#modtitle').text($(this).parent().parent().find('.predicate').children('a').html());
        $('#to_Add').find('.show_pop_list').remove();
        $("#list_showHide").modal('show');
        
        $(this).attr("flag","notshow");
        
    });
}

/****************************** MODAL FUNCTIONS ********************************/

/**************** Insert entries from modal to main tree **********************/

/**
 * @summary Insert entries from modal to main tree
 * @param {string} btn_id
 */
function insertEntries(btn_id) {
 
    var selected = new Array();
    console.log(btn_id);
    var parent = $('[btn-id=' + btn_id + ']').parent(); // parent node

    $("#list_showHide").find('li').find("input:checked").each(function () {
        var node = $(this).closest("li");      
        var val = ($(node).attr('uri'));   
        
        if(val===null){
           var ee = $(node).first('span');
           val = ($(ee).children('span').attr('uri'));
        }
        selected.push(val);               
    });
    
    
    $('#to_Add').children().remove();    
            
    $(parent).find('li').hide();

    for (var i = 0; i < selected.length; i++) {        
        var toShow = $(parent).find('[uri=' + selected[i] + ']');       
        $(toShow).show();                           
        var showParent = $(parent).find('span[uri=' + selected[i] + ']').parent();
        $(showParent).show();
        $(showParent).find('.collapsable').show();       
        $(showParent).find('.collapsable').find('.preds_ul').children('li').show();                     
    }
    
    $('#Insert_entries').remove();
    $("#list_showHide").modal('hide');
    
}

/********************* Search box in Modal ***********************************/

$('#box').keyup(function () {
    var valThis = $(this).val().toLowerCase();
    if (valThis === "") {
        $('.navList > li').show();
    } else {
        $('.navList > li').each(function () {
            var text = $(this).text().toLowerCase();
            (text.indexOf(valThis) >= 0) ? $(this).show() : $(this).hide();
        });
    }
    ;
});

/******************************************************************************/

$("#checkAll").click(function () {
    $('input:checkbox').not(this).prop('checked', this.checked);
});

/******************************************************************************/

function highlight(uri) {
    $('[uri=' + uri + ']').fadeOut();
    $('[uri=' + uri + ']').fadeIn();
}
;  
    
/*******************************************************************************/

/**************************Right click Functionality***************************/
/**
 * @summary Right click Functionality
 * @param {object} $
 * @param {window} window
 */
(function ($, window) {

    $.fn.contextMenu = function (settings) {

        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                // return native menu if pressing control
                if (e.ctrlKey) return;
                
                //open menu
                var $menu = $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getMenuPosition(e.clientX, 'width', 'scrollLeft')-60,
                        top: getMenuPosition(e.clientY, 'height', 'scrollTop')-180
                    })
                    .off('click')
                    .on('click', 'a', function (e) {
                        $menu.hide();
                
                        var $invokedOn = $menu.data("invokedOn");
                        var $selectedMenu = $(e.target);
                        
                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });
                
//                return false;
            });

            //make sure menu closes on any click
            $('body').click(function () {
                $(settings.menuSelector).hide();
            });
        });
        
        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;
                        
            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse) 
                position -= menu;            
            return position;
        }    

    };
})(jQuery, window);

/******************************************************************************/

/********************Get path of selected item*********************************/
/**
 * @summary Get path of selected item
 * @param {string} a
 */
    
function getPath(a) {
    var path = $(a).text();
    var $parent = $(a).parents("li").eq(1).find("span:first");

    if ($parent.length === 1) {
        path = getPath($parent) + "^_^" + path;
    }
    return path;
}   
    
/*****************************Right click Menu*********************************/    
 
 /**
 * @summary Right click Menu
 * @param {string} value
 */
function rightClickMenu(value) { 

   $(value).parent().bind("contextmenu",function(e){
    return false;
});
    
    $(value).parent().contextMenu({
        menuSelector: "#contextMenu",
        menuSelected: function (invokedOn, selectedMenu) {                    
                       
            var id = $(value).attr('id');
           
            if (id === undefined) {
                id = $(value).parent('li').attr('id');
            }

            if (selectedMenu.text() === "Open Uri in new tab") {
                var url_string = window.location.href;
                var url = new URL(url_string);
                window.open(url.origin + url.pathname +"?resource="+ id);
            }
            else if (selectedMenu.text() === "Copy Uri") {
                var aux = document.createElement("input");
                aux.setAttribute("value", id);
                document.body.appendChild(aux);
                aux.select();
                document.execCommand("copy");
                document.body.removeChild(aux);
                document.execCommand("copy");
               // $('#copy_to_clipboard').modal('show');                
                setTimeout(function () {
                 //   $('#copy_to_clipboard').modal('hide');
                }, 800);
                                
            }
            else if (selectedMenu.text() === "Get path of selected item") {

                $("#path_of_selection").find('#selected_path').text('');
                var path = getPath($(value));
                var res = path.split("^_^");
                var html = "<li style='background-color: #f7f7f7;'><ul style='border: 1px solid #e5e5e5; padding:20px;'>";

                for (var i = 0; i < res.length; i++) {                    
                    var left = 0;
                    var right = 530;
                    for (var em = 0; em < i; em++) {
                        left = left + 20;
                        right = right - 20;
                    }
                    var String = res[i].substring(res[i].lastIndexOf("[") + 1, res[i].lastIndexOf("]"));
                    var color = String.replace(/\s/g, "").replace(/,/g, " , ");

                    if (i % 2 === 0) {
                        var lbl= res[i] ;
                        if((res[i].substring(res[i].length - 1, res[i].length ))===']'){
                            lbl = res[i].substring(0, res[i].length - 1) + "<img alt='' src='img/" + color.replace(/#/g,"_") + ".png' onerror=\"this.src='img/Other-Entities.png';\"> ]";                           
                        }
                        html = html + "<li class='folder subject " + color + "' style='height:inherit; padding:0px 0px 2px 10px; margin-left: " + left + "px; width:" + right + "px; '><span>" + lbl +"</span></li>";
                    } else {
                        html = html + "<li style='height:inherit; padding:2px 0px 2px 10px; margin-left: " + left + "px; width:" + right + "px;'>" + res[i] + "</li>";
                    }
                }
                html = html + "</ul></li>";

                $("#path_of_selection").find('#selected_path').append($(html).treeview());
                $("#path_of_selection").modal();
            }
        }
    });                
};
