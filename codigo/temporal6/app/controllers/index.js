var fotoBi = null;
var ImageFactory = require('ti.imagefactory');


$.winTest.open();
function clickImgCamara(){
  var dialog = Ti.UI.createOptionDialog({
    cancel: 2,
     options: ['Cámara','Galería','Cancel'],
     title: 'Seleccione Opción:'
  });
  dialog.show();
  dialog.addEventListener('click',function(e){
    Ti.API.info(e.index);
    if (e.index ==0){
      if (OS_IOS){camara();}
      else{
        if (Ti.Media.hasCameraPermissions()){camara();}else{
          Ti.Media.requestCameraPermissions(function(e){
              if (e.success) {camara();} else {alert('Se negaron los permisos.');}
          });}
      }
    }
      if(e.index===1){

        if (OS_IOS){album();}
        else{
          if (Ti.Media.hasCameraPermissions()){album();}else{
            Ti.Media.requestCameraPermissions(function(e){
                if (e.success) {album();} else {alert('Se negaron los permisos.');}
            });}
        }
      }
  });
}



function camara(){
  Titanium.Media.showCamera({
      success:function(event)
      {
        var w = event.media.width;
        var h = event.media.height;
        Ti.API.info('ancho: ');Ti.API.info(w);
        Ti.API.info('alto: ');Ti.API.info(h);
        fotoBi=event.media;
        newW = 512;
        newH = parseInt((h*512)/w);
        Ti.API.info('ancho: ');Ti.API.info(newW);
        Ti.API.info('alto: ');Ti.API.info(newH);
        fotoBi = fotoBi.imageAsResized(newW,newH);
        fotoBi = ImageFactory.compress(fotoBi, 0.75);
        //$.imgenTomada.image = event.media;
        $.imgenTomada.image = fotoBi;
      },
      cancel:function()
      {
      },
      error:function(error){
        Ti.UI.createAlertDialog({ok:'Ok',title:'Error',message:'ERROR!!'}).show();},
        allowEditing:false,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
  });
}




function album(){
  Titanium.Media.openPhotoGallery({
      success:function(event)
      {
        var w = event.media.width;
        var h = event.media.height;
        Ti.API.info('ancho: ');Ti.API.info(w);
        Ti.API.info('alto: ');Ti.API.info(h);
        fotoBi=event.media;
        newW = 512;
        newH = parseInt((h*512)/w);
        Ti.API.info('ancho: ');Ti.API.info(newW);
        Ti.API.info('alto: ');Ti.API.info(newH);
        fotoBi = fotoBi.imageAsResized(newW,newH);
        fotoBi = ImageFactory.compress(fotoBi, 0.75);
        //$.imgenTomada.image = event.media;
        $.imgenTomada.image = fotoBi;
      },
      cancel:function(){},
      error:function(error){
        Ti.UI.createAlertDialog({ok:'Ok',title:'Error',message:'ERROR!!'}).show();},
        allowEditing:false,
        mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
      });
}


function enviaImg(){
  var url = "http://www.appcelerator.com";
 var client = Ti.Network.createHTTPClient({
     // function called when the response data is available
     onload : function(e) {
         Ti.API.info("Received text: " + this.responseText);
     },
     // function called when an error occurs, including a timeout
     onerror : function(e) {
         Ti.API.debug(e.error);
     },
     timeout : 25000
 });
 client.open("POST", 'http://staging.system.jlicapital.com/api/seller/prospectstracing/4/testimage');
 client.send({image:fotoBi});
}


function clickImage(e){


  if (OS_ANDROID){
    var scrollView = Titanium.UI.createView({
        backgroundColor:'black',
        width:'100%',
        top: 0,
        bottom: 0,
    });
  }
  else{
    var scrollView = Titanium.UI.createScrollView({
        contentWidth: 'auto',
        contentHeight: 'auto',
        backgroundColor:'black',
        top: 0,
        bottom: 0,
        showVerticalScrollIndicator: true,
        showHorizontalScrollIndicator: true,
        //Here you can determine the max and min zoom scale
        maxZoomScale: 50,
        minZoomScale: 0.1,
        zoomScale: 1
    });
  }
  var viewBas = Ti.UI.createView({backgroundColor:'black',width:Ti.UI.FILL});
  var imgTemp = Ti.UI.createImageView({image:fotoBi,enableZoomControls:true,width:Ti.UI.FILL});
  var BackIco = Ti.UI.createImageView({
    top:10,
    left:10,height:40,width:40,
    borderRadius:20,
    borderWidth:1,
    backgroundColor:'blue'
  });
  BackIco.addEventListener('click',function(e){
    viewBas.remove(imgTemp);
    scrollView.remove(viewBas);
    scrollView.remove(BackIco);
    $.winTest.remove(scrollView);
  });
  viewBas.add(imgTemp);
  scrollView.add(viewBas);
  scrollView.add(BackIco);
  $.winTest.add(scrollView);
}
