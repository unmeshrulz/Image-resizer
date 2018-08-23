let fs = require('fs');
let Q = require('q');
let ifFileExists = 0;

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

let loopToResize = (ogFilePath, fileName, getDataToResizeContent, fileExtention) => {
    for (let i = 0; i < getDataToResizeContent.length; i++) {
        let setParams = getDataToResizeContent[i];
        createResizedImage(ogFilePath, fileName + setParams.name, fileExtention, setParams.width, setParams.height).then(function () {
            console.log("Image Saved");
        });
    }
}

let letsResize = () => {
    $('#resizeIt').click(function(e){
        e.preventDefault();
        let imgHeight       = imgWidth = 0;
        imgHeight           = parseInt($('#imgHeight').val());
        imgWidth            = parseInt($('#imgWidth').val());
        let checkBox        = $('.form-check-input')[0].checked;
        let androidNoti     = $('.form-check-input')[1].checked;
        let androidAppIcon  = $('.form-check-input')[2].checked;
        let custom          = $('.form-check-input')[3].checked;
         if (ifFileExists) {
            let { dialog } = require('electron').remote;
            dialog.showSaveDialog((fileName) => {
                if (fileName === undefined) {
                    console.log("You didn't save the file");
                    return;
                }
                let radioVal = $('input[name=optradio]:checked').val();
                if (!fs.existsSync(fileName)) {
                    fs.mkdirSync(fileName);
                }
                let ogFilePath = ifFileExists.path;
                let fileExtention = ogFilePath.split('.').pop();
                let getDataToResize;
                switch(radioVal){
                    case "IOS":
                        getDataToResize = JSON.parse(fs.readFileSync(__dirname + "/sizes.json")).IOS;
                        loopToResize(ogFilePath, fileName, getDataToResize, fileExtention);
                        createResizedImage(ogFilePath, fileName + '/itunesConnect', 'jpg', 1024, 1024).then(function () {
                            console.log("Image Saved");
                        });
                        break;
                    case "ANI":
                        getDataToResize = JSON.parse(fs.readFileSync(__dirname + "/sizes.json")).ANI;
                        loopToResize(ogFilePath, fileName, getDataToResize, fileExtention);
                        break;
                    case "AAI":
                        getDataToResize = JSON.parse(fs.readFileSync(__dirname + "/sizes.json")).AAI;
                        loopToResize(ogFilePath, fileName, getDataToResize, fileExtention);
                        break;
                    case "CUS":
                    if (imgHeight > 0 && imgWidth > 0) 
                        createResizedImage(ogFilePath, fileName, fileExtention, imgWidth, imgHeight).then(function () {
                            console.log("Successfully Saved The Image");
                        });
                    else 
                        alert("Height Width entered are not valid.");
                    break;
                }


                    
                    if (checkBox == 1) {                       
                    }
                
                // else
                else if(imgHeight > 0 && imgWidth > 0){
                    let ogFilePath = ifFileExists.path;
                    let fileExtention = ogFilePath.split('.').pop();

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

$('input[type=radio]').click(function () {
    let chkInput = $('.form-check-input');
    if (chkInput[0].checked || chkInput[1].checked || chkInput[2].checked)
        $('input[type=number]').prop('disabled', true);
    else if(chkInput[3].checked)
        $('input[type=number]').prop('disabled', false);
});

$(document).ready(function () {
    rmImgSelNew();
    $('.form-check-input')[3].checked = true;
});