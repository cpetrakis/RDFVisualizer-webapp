/*
 * jQuery File Upload Demo
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global $ */



$(function () {
    'use strict';

    var uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
    };

    var uploadedBytes = 0;
     //console.log($.blueimp.fileupload.prototype.options);
    // Initialize the jQuery File Upload widget:
    $('#fileupload').fileupload({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: 'FileUploadServlet',
        maxChunkSize: 10000000, // 10 MB
        formData: {'uploadId': uuid()},
        uploadedBytes: uploadedBytes,
        

        add: function (e, data) {
            var that = this;
            
            var filetype = data.files[0].name.substr( (data.files[0].name.lastIndexOf('.') +1));

            if(filetype!== 'ttl'){
                  $('#unsupported_filetype').modal('show');
                console.log(data.files[0].name.substr( (data.files[0].name.lastIndexOf('.') +1)))
            }else{
                
            console.log('ttl mre ->'+data.files[0].name.substr( (data.files[0].name.lastIndexOf('.') +1)))
         
            $.getJSON('FileUploadServlet', {file: data.files[0].name}, function (result) {
                console.log(result);
                
                var file = result.file;
                console.log(file);
                data.uploadedBytes = result.uploadedBytes;
                console.log(data);
                uploadedBytes = data.uploadedBytes;
                console.log($.blueimp);
                $.blueimp.fileupload.prototype.options.add.call(that, e, data);
                console.log("-----------------");
                console.log($.blueimp.fileupload.prototype.options);
                
                
              /*  $('input[type="checkbox"]').on('change', function () {
                    console.log($(this).parent().parent().find('.name').html());
                    var selectedFilename = new Object();
                    selectedFilename['filename']  = $(this).parent().parent().find('.name').html();    
                    localStorage.setItem('selected_filename', JSON.stringify(selectedFilename));
                    $('input[type="checkbox"]').not(this).prop('checked', false);
                });*/

            });
        }
        }

    });
                

    // Load existing files:
    $('#fileupload').addClass('fileupload-processing');
    $.ajax({
        // Uncomment the following to send cross-domain cookies:
        //xhrFields: {withCredentials: true},
        url: $('#fileupload').fileupload('option', 'url'),
        dataType: 'json',
        context: $('#fileupload')[0],
        formData: [{'uploadId': uuid()}]
    })
            .always(function () {
                $(this).removeClass('fileupload-processing');
            })
            .done(function (result) {
                
                $(this).fileupload('option', 'done')
                        // eslint-disable-next-line new-cap
                        .call(this, $.Event('done'), {result: result});
                
            });

});


