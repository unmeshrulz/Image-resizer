let fs = require('fs');
let Q = require('q');
let ifFileExists = 0;
let testArray = [];

let readURL = (input) => {
    if (input.files && input.files[0]) {
        ifFileExists = input.files[0];
        console.log(ifFileExists);
        let reader = new FileReader();
        reader.onload = function (e) {
            $('#blah')
                .attr('src', e.target.result)
                .width('50%')
                .height("50%");
        };
        reader.readAsDataURL(input.files[0]);
        $('.disp-image').slideDown();
        $('.file-selector').slideUp();
        letsResize();
    }
}

let createResizedImage = (ogFilePath, fileName, fileExtention, imgWidth, imgHeight) => {
    var deferred = Q.defer();
    let ImageResize = require('resize-img');
    ImageResize(fs.readFileSync(ogFilePath),
        { width: imgWidth, height: imgHeight }).
        then(buf => {
            fs.writeFileSync(fileName + "." + fileExtention, buf);
            deferred.resolve();
        });
    return deferred.promise;
}

let letsResize = () => {
    $('#resizeIt').click(function(e){
        e.preventDefault();
        let imgHeight = imgWidth = 0;
        imgHeight = parseInt($('#imgHeight').val());
        imgWidth = parseInt($('#imgWidth').val());
        let checkBox = $('.form-check-input')[0].checked;
        if (ifFileExists && checkBox == 1) {
            let { dialog } = require('electron').remote;
            dialog.showSaveDialog((fileName) => {
                if (fileName === undefined) {
                    console.log("You didn't save the file");
                    return;
                }
                else {
                    if (!fs.existsSync(fileName)) {
                        fs.mkdirSync(fileName);
                    }
                    let ogFilePath = ifFileExists.path;
                    let fileExtention = ogFilePath.split('.').pop();
                    let jsonData = fs.readFileSync('res.json');
                    jsonData = JSON.parse(jsonData);
                    for (let i = 0; i < jsonData.IOS.length; i++) {
                        let setParams = jsonData.IOS[i];
                        createResizedImage(ogFilePath, fileName + setParams.name, fileExtention,setParams.width, setParams.height).then(function () {
                            console.log("Image Saved");
                        });
                    }
                    createResizedImage(ogFilePath, fileName + '/itunesConnect','jpg',1024,1024).then(function () {
                        console.log("Image Saved");
                    });
                }
            });
        }
        else if (ifFileExists && imgHeight > 0 && imgWidth > 0) {
            let { dialog } = require('electron').remote;
            dialog.showSaveDialog((fileName) => {
                if (fileName === undefined) {
                    console.log("You didn't save the file");
                    return;
                }
                else {
                    let ogFilePath = ifFileExists.path;
                    let fileExtention = ogFilePath.split('.').pop();
                    createResizedImage(ogFilePath, fileName, fileExtention, imgWidth, imgHeight).then(function () {
                        alert("Successfully Saved The Image");
                    });
                }
            });
        }
    });
}

let rmImgSelNew = () => {
    $('.sel-otr-file').click(function () {
        $('.disp-image').slideUp();
        $('.file-selector').slideDown();
        setTimeout(function () { $('#blah').attr('src', ""); }, 750);
    });
}

$('input[type=checkbox]').click(function () {
    if ($('.form-check-input')[0].checked)
        $('input[type=number]').prop('disabled', true);
    else
        $('input[type=number]').prop('disabled', false);
}); 

$(document).ready(function () {
    rmImgSelNew();
});