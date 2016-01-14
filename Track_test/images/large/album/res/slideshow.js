// File slideshow.js for the Slide Show 4 skin version 3.2.6 last change: 2015-12-29 21:31
var embedded = false;	
var pause = false;
var closing = false;
var random_effect = false;
var tWidth = 0;
var tHeight = 0;
var winH = 0;
var winW = 0;
var cTop = 0;
var cWidth = 0;
var slmPos = 0;
var this_commentType = 0;
var timeout = 0;
var viewtime = 0;
var transeffect = 0;
var transtime = 0;
var hidenav = 0; 
var enableOversizedImage = 0;
var hideshare = 0; // if (hideshare==0) autoPlay allowed
var slidepage = false;
var WindowsOS = false;
var MacOS = false;
var PC = false;
var iOS = false;
var Android = false;
var iPhone = false;
var iPad = false;
var loadedImage = -2;
var fromMap = false;
var settingsVisible = false;
var stripVisible = false;
var WdivH =1;
var showMessage = false;
var autoExpand = false;
var AutoPanoramaShown = false;
var expandPossible = false;
var description = '';
var pageVisible = false;
var pageURL = '';
var initIndexDone = false;
var albumTitle = '';
var mainIndexPageURL = "";
var albumFolder =  "";
var IE = false;
var FF = false;
var Edge = false;
var screenHeight=0;
var mouseSupport=false;
var movie=false;
var loadedImageURL= '';
var onServer= false;
var roundButtonHeight= 35;
var fontSizeFactor= 1.0;
var fontSize= 0;
var currentButtonHeight = 0;
var stripBottom = 60 + currentButtonHeight;
var swipeThreshold = 75; // was 200;
var deadZone = 40;
var showExifData = false;
var stripHeight = '60px';
var musicPage = false;
var showScrollbar = true;  // Test the slide description heigth
var toggleScrollbar = false;  // Allow toggle scrollbox contents
var captionDivHeight = 0;
var playing = false;
var slide_index=-1;
var slidePadding = 0;

$(document).ready(function(){
if (((window.location.hash.length) > 0)) { 
   str= window.location.hash.substring(1);
   slide_index = parseInt(str);
   fromMap = true;
   slidepage = true;
}
else if ((window.location.search.length) > 0) { 
	str= window.location.search.substring(1);
 	if (str.substring(0,1)=="M") {
		str = str.substring(1);
		fromMap = true;
	}
	if ((str.substring(0,1)!="f") && (str.substring(0,1)!="_")) {
	    slide_index = parseInt(str);
	    if (slide_index==-1) closeSlide();
	    else   { 
	  	  slidepage = true;
	    }
	}
}
else if (hideIndexPage) { 
   slide_index = 0;
   slidepage = true;
}
else {	
	if (pause==false) { // embedded Slide Show
		slide_index = 0;
		slidepage = true;
		embedded = true;	
	}
}

	
  albumTitle = document.title;
  mainIndexPageURL = location.href;
  var lastQM = mainIndexPageURL.lastIndexOf('?');
  if (lastQM > 0) { mainIndexPageURL = mainIndexPageURL.slice(0,lastQM) };
  lastQM = mainIndexPageURL.lastIndexOf('#');
  if (lastQM > 0) { mainIndexPageURL = mainIndexPageURL.slice(0,lastQM) };
  lastQM = mainIndexPageURL.lastIndexOf('/');
  albumFolder = mainIndexPageURL.slice(0,lastQM+1);
  getDeviceInfo();
  if (IE||FF) {
	   $('body').css({'overflow-x': 'auto'})
  }
  if (screen.width<500) {
	$('#msg').css({ 'font-size': '24px', 'line-height': '25px'});  
  }
  //if (iPhone) { $('#theViewport').attr('content','width=device-width,initial-scale=0.5') }  
  if (iPhone) { 
    $('#theViewport').attr('content','width=device-width,initial-scale=1.0, user-scalable=no');
	$('html').css({ 'padding-bottom': '80px'});
  } 
  else if (iPad) { 
    $('#theViewport').attr('content','width=device-width,initial-scale=1.0, user-scalable=no') // if you set it to yes you can zoom by pinching, but with strange effects
  }
  if (iOS || FF || IE || Edge) $('#linkBack').hide();
  $('html').keydown(function(evt) {
	keycommand(evt.which);
  });
  $(window).on('resize', resizeWindow);
//  $(window).on('orientationchange', resizeWindow);
  getSavedData();
  setViewerSettings();
  if (slidepage) {
	//getSavedData();  // ss4
    initSlide();
	refreshSlide();	
  }
  else {				
    index_ready_function();
	refreshIndex();
  }
});

function getSavedData() {
	try {  
	  // alert("we are on the first main page");
      if (window.localStorage !== null) {
	    var storage = window.localStorage;
        if (storage.fontSizeFactor == null) {saveSettings();}  // latest added new parameter
	    else {
          getSettings();
	    }
      }
    }
    catch(err) {
		 setViewerSettings(); 
		 //alert(" IE local error"); 
	} 
}

function setViewerSettings() {
  showExifData = (typeof(strExif) != "undefined");
  fontSize = fontSizeFactor*orgFontsize;
  var newSizepx= fontSize.toString() + 'px';
  $('body').css('font-size',newSizepx);
  var newSize= fontSizeFactor*orgh1Fontsize;
  newSizepx= newSize.toString() + 'px';
  $('h1').css('font-size',newSizepx); 
  newSize= fontSizeFactor*orgbuttonFontsize;
  newSizepx= newSize.toString() + 'px';
  $('button').css('font-size',newSizepx);    
  if (commentType == 4) {
	  var newlargeFontsize = fontSize*2;
      var newlargeFontsizepx= newlargeFontsize.toString() + 'px'; 
	  $('#bottomcomment_shadow').css('font-size',newlargeFontsizepx); 
  }
  if (roundButtonHeight < 20) roundButtonHeight= 35;  // To prevent that there are no buttons at all
  currentButtonHeight = roundButtonHeight;
  if (extraTextlines > 3) { 
    stripBottom = parseInt(currentButtonHeight) + 175 + borderWidth;
	stripHeight = '175px';
  }
  else if (extraTextlines > 1) {
    stripBottom = parseInt(currentButtonHeight) + 86 + borderWidth;
	stripHeight = '86px';
  }	  
  else {
	stripBottom = parseInt(currentButtonHeight) + 60 + borderWidth;
	stripHeight = '60px';
  }
  if (iPhone) stripBottom = stripBottom + deadZone;
  if (stripVisible) {openStrip()};
  var roundButtonpx= currentButtonHeight.toString() + 'px';
  $('img.roundbutton').css('height',roundButtonpx).css('width',roundButtonpx);
  if (!iOS && (buttonOpacity != '1.0'))  {	
    $('.roundbutton').hover(function() {	
  	$(this).css({'opacity' : '1.0' }); 
    }, function() { 
      $(this).css({'opacity' : buttonOpacity }); 
    });
  }
  $('#nav').css('height',roundButtonpx);    
  newSize= fontSizeFactor*30;
  if (newSize < currentButtonHeight) newSize=  parseInt(currentButtonHeight) + 15;
  newSizepx= newSize.toString() + 'px';
  $('.HorNav').css('line-height',newSizepx);
  newSize= fontSizeFactor*30;
  newSizepx= newSize.toString() + 'px';
  $('.top-nav > ul > li > a').css('line-height',newSizepx);
  $('.top-nav > ul > li > ul > li a').css('line-height',newSizepx);
  if (PC && ($('audio').length>0) ) { 
    if (hideshare==0)  {
  	  $('audio').attr('autoplay','');
    }	
    else {
	  $('audio').removeAttr('autoplay');
    }	
  }
};

function toggleFullScreen() {
 if (FF||Edge) {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
 } else {
	if (MacOS) {
		alert(fsMAC)
	}
	else {
		alert(ClickF11)
	}
 }
}

function resizeWindow() {
	var resizeTimer;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {		 
	  if (slidepage) { refreshSlide() } else refreshIndex();
	  // if (slidepage) { if (iPhone) { refreshSlide() } else window.location.reload() } else refreshIndex();
	  window.scrollTo(0, 0);	  
    }, 200);   // was 100
}

function refreshIndex() {

  if (iPhone) {
	  if ((window.orientation==90)||(window.orientation==-90)) {// if landscape
	  	$('#indexDiv').css({ 'width': screen.height})  // was 2* screen
	  } else {
         $('#indexDiv').css({ 'width': screen.width})
	  }
  }

};

function refreshSlide() {
	if (AutoPanoramaShown) {
		/*  expand p[anorama button has been clicked */
	    sizePanImg(borderWidth);
//		if (iPad) correctWindowPos();
	    $('#slideimage').css({ 'left':tLeft, 'top':tTop, 'width':tWidth, 'height':tHeight, 'border-width':borderWidth});
	}
	else {		
      displaySlide();
	}
};

function toggleScrollbox() {
if (toggleScrollbar) {
	showScrollbar = !showScrollbar;
	displaySlide();
	}
};
 
function displaySlide() {
  if (typeof(strTitle) != "undefined") {
    document.title = strTitle[slide_index];
  }
  if (iPhone==false) {
	location.hash= slide_index.toString();
  }
  if (movie) {
	sizeMovie(wImg[slide_index], hImg[slide_index]);
	$('#movie').css({ 'left':tLeft, 'top':tTop, 'width':tWidth, 'height':tHeight });
	//alert('left: ' + tLeft + ' top: ' + tTop + ' width: ' +tWidth + ' height: ' + tHeight);
  }
  else {
	captionDivHeight = $('.caption').outerHeight( true );
	if ((this_commentType==2) || (this_commentType==7)) {
		$('.caption').css({height: ''}).css("overflow-y", "hidden");	
		var fs = parseInt($(".caption").css("font-size"));
		if (($('.caption').height() > 4*fs) && (showScrollbar)) {
			$('.caption').css({ height: 3.4*fs }).css("overflow-y", "scroll").show();
			captionDivHeight=  4*fs; // + Diff;
			toggleScrollbar = true;	
			if (!PC) $('.caption').css('font-style','italic');
		} else {
			captionDivHeight = $('.caption').height() + 10;
			$('.caption').css('font-style','normal').show();
		}
	}
	if (captionDivHeight > window.innerHeight) captionDivHeight= 0.5*window.innerHeight;
	sizeImg(wImg[slide_index], hImg[slide_index], borderWidth, this_commentType, captionDivHeight);
	//alert( 'left: ' + tLeft + ' top: ' + tTop + ' width: ' + tWidth +  ' height: ' + tHeight + " captionDivHeight: " + captionDivHeight);
	$('#slideimage').css({ 'left':tLeft, 'top':tTop, 'width':tWidth, 'height':tHeight, 'border-width':borderWidth });
  }
  if (this_commentType>0) {	  
    switch(this_commentType) {
	  case 1: { $('#topcomment').css({height: ''}).css("overflow-y", "hidden");
                 var fs = parseInt($("#topcomment").css("font-size"));
				 if (($('#topcomment').height() > 50 )  && (showScrollbar)) {
					 $('#topcomment').css({ height: 48 }).css("overflow-y", "scroll");	
					 toggleScrollbar = true;
					 if (!PC) $('#topcomment').css('font-style','italic');
                 } else $('#topcomment').css('font-style','normal');
               }
			   break;		
	  case 2 : { $('#slideimage').css('border-bottom-width', captionDivHeight);  // below
	           cTop = tTop + tHeight + borderWidth + 2*slidePadding;
               cWidth = tWidth + 2*borderWidth + 2*slidePadding;
	           $('.caption').css({ 'position': 'absolute','left':tLeft, 'top':cTop, 'width':cWidth})
	           } 
	           break;
	  case 3:  { $('#bottomcomment').css({height: ''}).css("overflow-y", "hidden");
                 var fs = parseInt($("#bottomcomment").css("font-size"));
				 if (($('#bottomcomment').height() > 3*fs) && (showScrollbar)) {
					 $('#bottomcomment').css({ height: 3.6*fs }).css("overflow-y", "scroll");
					 toggleScrollbar = true;
					 if (!PC) $('#bottomcomment').css('font-style','italic');	
                 } else $('#bottomcomment').css('font-style','normal');
               }
			   break;
	  case 4:  
	  case 5:  { $('#bottomcomment_shadow').css({height: ''}).css("overflow-y", "hidden");
                 var fs = parseInt($("#bottomcomment_shadow").css("font-size"));
				 if (($('#bottomcomment_shadow').height() > 3*fs)  && (showScrollbar))  {
					 $('#bottomcomment_shadow').css({ height: 3.55*fs }).css("overflow-y", "scroll");
					 toggleScrollbar = true;
					 if (!PC) $('#bottomcomment_shadow').css('font-style','italic');		
                 }  else $('#bottomcomment_shadow').css('font-style','normal');
               }
			   break;
	  case 6:  { $('#commentbox').css({left: '', width: '', height: ''}).css("overflow-y", "hidden"); // reset to default to remove last special css setting
                 var fs = parseInt($("#commentbox").css("font-size"));
				 if ($('#commentbox').height() > 2*fs) { 
  	                $('#commentbox').css({left: tLeft+10 + borderWidth + slidePadding, width: tWidth-40}); 
				   if (($('#commentbox').height() > 3*fs) && (showScrollbar))  {  // was 60
						$('#commentbox').css({left: tLeft+12, width: tWidth-40, height: 3.15*fs }).css("overflow-y", "scroll");
						toggleScrollbar = true;
						if (!PC) $('#commentbox').css('font-style','italic');		
					}  else $('#commentbox').css('font-style','normal');		
                 }
               }
			   break;
	  case 7 : { $('#slideimage').css('border-top-width', captionDivHeight);   // above
			   cTop = tTop + slidePadding + borderWidth;
               cWidth = tWidth + 2*borderWidth + 2*slidePadding;
	           $('.caption').css({ 'position': 'absolute','left':tLeft, 'top':cTop, 'width':cWidth})
	           } 
    }
  }
  if (iPhone) {
        slmPos = deadZone; //tTop-2*currentButtonHeight;
        if ((slmPos<deadZone)||(movie)) slmPos = deadZone; 
          $("#slidemaplinks").css({'top':slmPos });
          $("#slidenavigation").css({'top':slmPos });
   }
};

function testStripClick(event) {
  var id=event.target.id;//getting the clicked element id.
  if ((id=="stripText")||(id=="stripExif")||(id=="slideStripDiv")) opencloseStrip();
} 

function opencloseStrip() {
  if (stripVisible) {closeStrip(); } else {openStrip()};
}

function openStrip() {
  var stripTop = 0;
  if (!embedded) {
	if (!pause) {	playpause(); }
	stripVisible = true
	if (AutoPanoramaShown) {
      redisplayPanorama();
    } else {
	displaySlide();	
	}
	if (iPhone) { stripTop = parseInt(currentButtonHeight) + parseInt(deadZone) }
    else { stripTop = parseInt(currentButtonHeight) }
    $('#slideStripDiv').css({'top':stripTop.toString() + 'px', 'height':stripHeight});	
	$('.container').css({'height':stripHeight});
//	$('#stripText').css({'height':stripHeight});
	$('.stripbuttonDiv').css({'line-height':stripHeight});
	var fileName = getfilename(srcImg[slide_index]);
	if (typeof(strExif) != "undefined") {
	  //strExif[slide_index] = $.trim(strExif[slide_index]); 
	  var n = strExif[slide_index].lastIndexOf("|");
	  var m = strExif[slide_index].length;
	  var CameraData =  strExif[slide_index].substring(0, n); 
	  CameraData = CameraData.replace('.0', '');
	  CameraData = CameraData.replace('.0', '');
	  var ExpDate =  strExif[slide_index].substring(n+1, m); 
	  $('#stripText').html(fileName + '<br>' + ExpDate);
	  if (CameraData.length < 25) { 
	    $('#stripExif').hide();
	  }	  
	  else { 
	    $('#stripExif').html(CameraData);
		$('#stripExif').show();
	  }
	} else {
	 $('#stripText').text(fileName);
	 $('#stripExif').hide();
	}
    $('#slideStripDiv').show();
  }
}

function closeStrip() {
	stripVisible = false;
    $('#slideStripDiv').hide(); 
	if (AutoPanoramaShown) {
      redisplayPanorama();
    }
    else {
  	  displaySlide();	
    }
}

function openSettings() { 
  loadSettingsInForm();
  if (PC) { 
    $('#shareCombo').show(); 
  }
  else {
	  $('#shareCombo').hide();
  };
  $('#settingsDiv').show(); 
}

function closeSettings() {
	saveSettings();  // Settings from form to local storage
	getSettings();  // get settings variables from local storage
    $('#settingsDiv').hide();
}
 
function testSettingsClick(event) {
  var id=event.target.id;//getting the clicked element id.
  if (id=="settings") closeWindows();
} 

function closeWindows() {
  if (settingsVisible) {
	closeSettings(); 
	settingsVisible = false;
  } 
  if (pageVisible) {
		closePage();
		pageVisible= false;
  }
  if (showMessage) {
	showMessage = false;
	$('#msg').hide(); 
  }
}

function getDeviceInfo() {
  var deviceAgent = navigator.userAgent.toLowerCase();
  iOS = (deviceAgent.match(/(iphone|ipod|ipad)/)!=null);
  Android = (deviceAgent.match(/(android)/)!=null);
  iPhone = (deviceAgent.match(/(iphone|ipod)/)!=null);
  iPad = (deviceAgent.match(/ipad/)!=null);
  WindowsOS = (navigator.platform.indexOf("Win")!=-1);
  MacOS = (navigator.platform.indexOf("Mac")!=-1);
  PC = (WindowsOS||MacOS);
  IE = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0);
  FF = (navigator.userAgent.indexOf("Firefox")!=-1);
  Edge = (navigator.userAgent.indexOf("Edge")!=-1)
  if ('ontouchstart' in window) { mouseSupport=false }  else  {  mouseSupport=true };
  if (iPhone && iPad) iPhone = false;
  screenHeight = screen.height;
  if (screen.width < screen.height) screenHeight = screen.width;
}

function getfilename(url) {
  index = url.lastIndexOf('/');
  filename = url.substring(index+1,256);
  return filename;
}

function previous() {
	        if (stripVisible) closeStrip();
			clearTimeout(timeout);
			timeout = 0;
			slide_index-=1;
			if (slide_index == -1) {
				 closeSlide();
				 }
			else {
			if (movie) stopVideo();
			$('#slideimage').hide();	
			loadImage();
			if (playing) {
			    $('#slideimage').hide();	
		        startdisplay();
			}
			else {
				$('#slideimage').show();  
			}			
			loadNextImage();
			}
}

function isFolder(index) {
	if (index >= srcImg.length) { return false;}
	else {
	  var IsFolder = (typeof(srcFolder) != "undefined");
	  if (IsFolder) {IsFolder = (srcFolder[index].length != 0) };
	  return IsFolder;
	}
}

function next() {
			if (stripVisible) closeStrip();
			clearTimeout(timeout);
			timeout = 0;
			slide_index +=1;
//			while ((isFolder(slide_index)) && (slide_index < srcImg.length)) {
			while (isFolder(slide_index)) {
				  slide_index +=1;
			}
			if (slide_index == srcImg.length) slide_index = 0;
			if (srcImg[slide_index] == undefined) slide_index = 0;  // To solve problem with ",]"in IE
			if ((stopAfterLastSlide)&&(slide_index == 0)) {
			  closeSlide();
			  if (links_under_thumbs) {
			    window.scrollTo(0,document.body.scrollHeight);  // scroll to end indexpage
			  }
			  else {
			    window.scrollTo(0,0);  // scroll to top of indexpage				  
			  }
			}
			else {
			  if (movie) stopVideo();
			  $('#slideimage').hide();	
			  loadImage();
			  if (playing) {
			    $('#slideimage').hide();	
		        startdisplay();
			  }
			  else {
				$('#slideimage').show();  
			  }
			  loadNextImage();
			}
}

function stopVideo() {
	if (!useBrowserVideo) {
		jwplayer().stop()
	}
	else {
		$('#movie').html("");
	}
}

function sizeMovie(imgW, imgH) {
	winW = window.innerWidth;
    winH = window.innerHeight;
	if (commentType==1) winH = winH - 58;
	if (stripVisible) winH = winH - stripBottom;
	imgRatio = imgW / imgH;
	if ( videoWidth > 200 ) {
		imgW = videoWidth;
		imgH = videoWidth / imgRatio;
	}
    function scaleWB() { tWidth = winW; tHeight = tWidth / imgRatio; }
    function scaleBW() { tHeight = winH; tWidth = tHeight * imgRatio; }
	if (imgRatio >= 1) {
      scaleWB();
      if (tHeight > winH) { scaleBW(); }
	  if (tWidth > imgW) { tWidth = imgW;  tHeight = imgH; }  
    }
    else {
      scaleBW();
      if (tWidth > winW) { scaleWB(); }
	  if (tHeight > imgH) { tWidth = imgW;  tHeight = imgH; }
    }
	tLeft = (winW-tWidth)/2; 
	tTop = (winH-tHeight)/2;	
}

function playMovie(moviefile, imgfile) {
	if (iPhone==false) {
	  location.hash= slide_index.toString();
	}
	var ContinueSlideShow= !pause;
	if (!pause) playpause();
	sizeMovie(wImg[slide_index],  hImg[slide_index]); 
	if (useBrowserVideo) {
		$('#movie').html("<video width='"+ tWidth + "' height='" + tHeight + "'controls autoplay poster='" + srcImg[slide_index] + 
		"'><source src='" + srcMov[slide_index]  +
		 "' type='video/mp4'></video>"); 		 
		$("video").get(0).addEventListener('ended', function () {
			if (ContinueSlideShow) playpause();
		}, false);		 
	}
	else {
       	jwplayer('movie').setup({
       	file: moviefile,
     	image: imgfile,
		autostart: 'true',
		events: {
       		onComplete: function(event) { if (ContinueSlideShow) playpause();} 
	     },
       	width: tWidth,
		height: tHeight }); 
	}
	$('#movie').css({ 'left':tLeft, 'top':tTop, 'width':tWidth, 'height':tHeight })
};

function loadImage() {
if (AutoPanoramaShown) {	
//	$('body').css({'overflow-x': 'hidden' }); 
	$("#slideDiv").swipe("destroy"); 
	$("#slideDiv").swipe( {
	tap:playpause, longTap:playpause, swipeLeft:next, swipeRight:previous,  swipeDown:closeSlide, swipeUp:slideSwipeUpFunction,
	fingers: 1,
	threshold:swipeThreshold
   });
   autoExpand = false;
   AutoPanoramaShown=false;
}
expandPossible = false;
if (loadedImage !=slide_index) {
  this_commentType = commentType;

if (typeof(strCap) != "undefined") {
	strCap[slide_index] = $.trim(strCap[slide_index]); }

if (commentType>1)	{
	if (typeof(strCap) == "undefined") { this_commentType = 0 }
	else { if (strCap[slide_index].length == 0) { this_commentType = 0 }}
}

movie = (typeof(srcMov) != "undefined");
if (movie) { 
  movie =  (srcMov[slide_index].length > 0)
};

$('#commentbox').hide();
$('#topcomment').hide();
$('.caption').hide();
$('#bottomcomment').hide();
$('#bottomcomment_shadow').hide();
$('#expand').hide(); 
$('#info').hide();
$('#slideButton').hide();
$('#expandIn360Cities').hide(); 
$('#gmaps').hide();
$('#downloadHiRes').hide();
showScrollbar = limitLongDescriptions;
toggleScrollbar = false; 
var CaptionInBorder = false;
if (typeof(strCap) != "undefined") {
if (strCap[slide_index].length > 0) {
  description = strCap[slide_index];
  switch(commentType) {
	case 1 : $('#topcomment').html(strCap[slide_index]).show(); 
	         break;
	case 2 :
	case 7 : 
			 sizeImg(wImg[slide_index], hImg[slide_index], borderWidth, commentType, 2*fontSize);
			 $('.caption').css({'width': tWidth});	// kanweg	
	         $('.caption').html(strCap[slide_index]).show();
			 CaptionInBorder= true;
	         break;
	case 3 : $('#bottomcomment').html(strCap[slide_index]).show(); 
	         break;
	case 4 : 
	case 5 : $('#bottomcomment_shadow').html(strCap[slide_index]).show();
	         break;
	case 6 : $('#commentbox').html(strCap[slide_index]).show(); 
  }
}
else {
	description = '';
	switch(commentType) {
	case 1 : $('#topcomment').text(''); 
	         break;
	case 2 : $('.caption').text('')     
	         break;
	case 3 : $('#bottomcomment').text(''); 
	         break;
	case 4 : 
	case 5 : $('#bottomcomment_shadow').text(''); 
	         break;
	case 6 : $('#commentbox').text('').hide(); 
	         break;
	case 7 : $('.caption').text('')     
	         break;

             }
    }
}

if (movie) { 
  $('#image').hide();
  $('#movie').show();
  playMovie(srcMov[slide_index],srcImg[slide_index]);
}
else {
  $('#movie').hide();
  $('#image').show();
  $('#slideimage').attr('src',srcImg[slide_index]);
  displaySlide();
  if (CaptionInBorder && (captionDivHeight > 2*fontSize)) {
    displaySlide();
  }
  autoExpand = (wImg[slide_index]> 2.4*hImg[slide_index]);
}

if (typeof(gMap) != "undefined") {
    if (gMap[slide_index].length > 0) $('#gmaps').show()
  }
  
if ((typeof(srcHiResImg) != "undefined") &&  (movie == false) ) {
    if (srcHiResImg[slide_index].length > 0) {
	  $('#downloadHiRes').attr("href", srcHiResImg[slide_index]);
	  $('#downloadHiRes').show();
	}
}

if (!embedded) {
  if (movie == false)  { 
    if (typeof(panFiles) != "undefined") {
      if (panFiles[slide_index].length > 0) {
    	  autoExpand = false;
    	  if (panFiles[slide_index].indexOf('360cities.net') > 0) { ShowExpandButton(true) }
        else ShowExpandButton(false); 
	    expandPossible = true;
        }
      }

    if ((autoExpand)&&(enableOversizedImage == 0)) {
     autoExpand = ((hImg[slide_index]/tHeight)>1.4);
    };	
    if (autoExpand)  { 
      expandPossible = true;
      ShowExpandButton(false);
    }
  }
}

if (typeof(linkURL) != "undefined") {
    if (linkURL[slide_index].length > 0) {
		if (typeof(linkText) != "undefined") {
		  ShowInfoButton(linkText[slide_index]); 
		}
		else {
		  ShowInfoButton(''); 
		}
     }
}

loadedImage= slide_index;
loadedImageURL= encodeURIComponent(albumFolder + srcImg[slide_index]);	 
}
};

function ShowInfoButton(text) {
	 if (text.length>0) {
	 	 $('#slideButton').text(text);
		 $('#slideButton').show();
	 }
	 else {
		 $('#info').show();		
	 }
};

function ShowExpandButton(In360Cities) {
	 if (In360Cities) {
		$('#expandIn360Cities').show()
	 }
	 else 
	   $('#expand').show()
};

function OpenGoogleMaps() {
if (typeof(gMap) != "undefined") {
  if (gMap[slide_index].length > 0) {
    if (!pause) playpause(); 
    window.open("http://maps.google.com/maps?q=" + gMap[slide_index] + ""); 
    }
  }
};

function OpenShareDialog() {
    if (!pause) playpause(); 
	if (slidepage) {
	   var url = encodeURIComponent(albumFolder + '/?' + slide_index.toString());  // M removed slide show starts now automatically
	   var image = encodeURIComponent(albumFolder + srcImg[slide_index]);
	   var title =  $('title').html();
	}
	else {
	   var url = encodeURIComponent(albumFolder);
	   if (albumImageIndex > -1) {
	     var image = encodeURIComponent(albumFolder + srcImg[albumImageIndex]);
	   }
	   else {		   
	     var image = encodeURIComponent(albumFolder + srcImg[0]);// var image = '' shows aux image, sometimes icon
	   }
	   var title =  '';
	};
	var redirect_url = 'http://andrewolff.jalbum.net/Help_SS4/self.close.htm';
	var appid = '283785241788194';

	var arg =  'http://www.facebook.com/dialog/feed?app_id=' + appid +
    '&link=' + url +
    '&picture=' + image +
    '&caption=' + title + 
    '&name=' + albumTitle + 
    '&redirect_uri=' + redirect_url + 
	 '&PopupClose.html' + 
    '&display=popup'; 
	 window.open(arg,'feedDialog','toolbar=0,status=0,width=626,height=436');
};


function sizePanImg(borderWidth)
{
    winH = window.innerHeight;
	var imgHeight= hImg[slide_index];
	var imgWidth= wImg[slide_index];
    imgRatio = imgWidth / imgHeight;
	if (enableOversizedImage == 0) {  tHeight = imgHeight } else { tHeight = winH };  
	tWidth = tHeight * imgRatio; 
	if (tHeight>winH-4) {
		tHeight= winH-4;
    	tWidth = tHeight * imgRatio; 
	}
	if (enableOversizedImage == 0) {
	  // Prevent that the displayed picture is wider or higher as the  jpeg file
	  if (tWidth > imgWidth) { tWidth = imgWidth;  tHeight = imgHeight; }  
	  if (tHeight > imgHeight) { tWidth = imgWidth;  tHeight = imgHeight; }  
	}
    tWidth = tWidth - 2*borderWidth; // - 4;
    tHeight = tHeight - 2*borderWidth;
    if (navigator.platform!='Win32') {
	tHeight = tHeight - 4;  // for iOS
    }
    tTop = (winH-tHeight)/2 - borderWidth;
}
function ProcLink() {
	if (!pause) playpause(); 
    if (linkURL[slide_index].indexOf('http') == 0) {;
		window.open(linkURL[slide_index]);
	}
	else {
		window.location=linkURL[slide_index]; 
	}
};

function ExpandPanorama() {
if (!pause) playpause(); 
//alert(autoExpand);
if (autoExpand) ExpandAutoPanorama()
else {
	if (panFiles[slide_index].indexOf('360cities.net') > 0) {
		 window.open(panFiles[slide_index]);
	}
	else if (panFiles[slide_index].indexOf('http') == 0) {;
		window.open(panFiles[slide_index]);
	}
	else {
		window.location=panFiles[slide_index]; 
	}
 }
 expandPossible = false;
}; 

function ExpandAutoPanorama() {
 $('#expand').hide(); 
 if (stripVisible) closeStrip();
 if (iPhone) {
	  slmPos = deadZone;
	  $("#slidemaplinks").css({'top':slmPos });
	  $("#slidenavigation").css({'top':slmPos });
	 };
 $('#commentbox').hide();
 $('.caption').hide();
 $('.caption').text('');
 $('#topcomment').text(''); 
 $('#bottomcomment').text('');
 $('#bottomcomment_shadow').text(''); 
 $('#comment').text(''); 
 AutoPanoramaShown=true;
// $('body').css({'overflow-x': 'auto' });
 $("#slideDiv").swipe("destroy");
 $("#slideDiv").swipe( {
//	tap:playpause, longTap:playpause, swipeDown:closeSlide, swipeUp:OpenGoogleMaps, allowPageScroll:"horizontal",
    longTap:playpause, swipeDown:closeSlide, swipeUp:slideSwipeUpFunction, allowPageScroll:"horizontal",
	fingers: 1,
	threshold: 200  // was swipeThreshold
 });
 sizePanImg(borderWidth);
 $('#slideimage').css({ 'left':tLeft, 'top':tTop, 'width':tWidth, 'height':tHeight, 'border-width':borderWidth})
 $('#slideimage').attr('src',srcImg[slide_index]);
 if (mouseSupport) initMouseCapture(); 
}; 

function loadNextImage() {	  
var nextslide = slide_index+1;	 
if (nextslide == srcImg.length) nextslide = 0;
if (srcImg[nextslide] == undefined) nextslide = 0;  // To solve problem with ",]" in IE
var next_commentType = commentType;
if (commentType>1)	{
	if (typeof(strCap) == "undefined") { next_commentType = 0 }
	else { if (strCap[nextslide].length == 0) { next_commentType = 0 }}
}
sizeImg(wImg[nextslide], hImg[nextslide], borderWidth, next_commentType,24);  // 24 is height of 1 description line
$('#nextslideimage').css({ 'position': 'absolute', 'display':'none' ,'left':tLeft, 'top':tTop, 'width':tWidth, 'height':tHeight, 'border-width':borderWidth})
if (next_commentType==2) $('#nextslideimage').css('border-bottom-width','24px');
$('#nextslideimage').attr('src',srcImg[nextslide]);
};

function randomEffect() {
  transeffect = 1 +  Math.floor(Math.random()*6); 
}

function sizeImg(imgW, imgH, borderWidth, commentType, captionHeight)
//  commentType: 0=none; 1 = Above; 2 = in border  3-6: below in immage
{
    winW = window.innerWidth;
    winH = window.innerHeight;
    if (commentType==1) winH = winH - 58;
	if (stripVisible) winH = winH - stripBottom;
//    if ((commentType==2)||(commentType==7)) winH = winH - captionHeight;

   imgRatio = imgW / imgH;

   function scaleWB() { tWidth = winW; tHeight = tWidth / imgRatio; }
   function scaleBW() { tHeight = winH; tWidth = tHeight * imgRatio; }

   if (imgRatio >= 1)  
   {
      scaleWB();
      if (tHeight > winH) { scaleBW(); }
	  if (enableOversizedImage == 0) {
        // Prevent that the displayed picture is wider as the  jpeg file
        if (tWidth > imgW) { tWidth = imgW;  tHeight = imgH; }  
	  }
   }
   else
   {
      scaleBW();
      if (tWidth > winW) { scaleWB(); }
	  if (enableOversizedImage == 0) {
        // Prevent that the displayed picture is higher as the  jpeg file
        if (tHeight > imgH) { tWidth = imgW;  tHeight = imgH; }
	  }
   }
    if ((commentType==2)||(commentType==7)){
		if ((tHeight + captionHeight) > winH) {
		 imgRatio = tWidth / tHeight;
		 tHeight = tHeight - captionHeight;
		 tWidth = tHeight * imgRatio; 
		}
	}
    tWidth = tWidth - 2*borderWidth - 2*slidePadding - 4;
    tHeight = tHeight - 2*borderWidth - 2*slidePadding;
    if (navigator.platform!='Win32') {
	tHeight = tHeight - 4;  // for iOS
    }
    tLeft = (winW-tWidth)/2 - borderWidth - slidePadding;
	if ((commentType==2)||(commentType==7)){
		tTop = (winH-(tHeight+captionHeight))/2 - borderWidth - slidePadding;
	}
	else {
		tTop = (winH-tHeight)/2 - borderWidth- slidePadding;
	}
    if (commentType==1) {
    if (tTop<54) tTop = 54; 
	};
	if (stripVisible) {
		if (tTop<stripBottom) tTop = stripBottom; 
	}
	if (typeof(fixedTop) != "undefined") {
	  if (fixedTop >= 0) tTop = fixedTop
	}
	if (shadowWidthSlide>0) {
		tWidth= tWidth - shadowWidthSlide;
		tHeight= tHeight - shadowWidthSlide;
	}
}

function startdisplay() {
  timeout = setTimeout(preparenext,viewtime+transtime);	
  if (random_effect) { randomEffect(); };  
  WdivH=imgRatio;
  if (transeffect == 0) { $('#slideimage').show(); }
   else if (transeffect == 1) { $('#slideimage').fadeIn(transtime); }
    else if (transeffect == 2) { $('#slideimage').show("blind", { direction: "horizontal" },transtime); }
     else if (transeffect == 3) { $('#slideimage').show("slide", { direction: "right" },transtime); }
      else if (transeffect == 4) { $('#slideimage').show("scale", { },transtime); }
	   else if (transeffect == 5) { $('#slideimage').show("puff", { },transtime); }
	     else if (transeffect == 6)  { if (WdivH<1) {$('#slideimage').show("clip", { },transtime);} else  $('#slideimage').show("clip", { direction: "horizontal" },transtime); }
};

function preparenext() {
  closing = true;
  if (!pause) {
    if (random_effect) { randomEffect(); };
    if (transeffect == 0) { $('#slideimage').hide(); next(); }
	else if (transeffect == 1) { $('#slideimage').fadeOut(transtime,function(){next();}); }
	 else if (transeffect == 2) { $('#slideimage').hide("blind", { direction: "horizontal"},transtime,function(){next();}); }
	  else if (transeffect == 3) { $('#slideimage').hide("slide", { direction: "left" },transtime,function(){next();}); }
	   else if (transeffect == 4) { $('#slideimage').hide("scale", { },transtime,function(){next();}); }
	    else if (transeffect == 5) { $('#slideimage').hide("puff", { },transtime,function(){next();}); }
          else if (transeffect == 6) { if (WdivH<1) { $('#slideimage').hide("clip", { },transtime,function(){next();}); } else  $('#slideimage').hide("clip", {direction: "horizontal" },transtime,function(){next();}); }
   }
}

function playpause() {
  if (slidepage==true) 
  	  playing= !playing;{
	  if (!pause) {
	    pause = true;
	    if (hidenav == 2)  {
	      $('#slidenavigation').show();
	      $('#slidemaplinks').show();
		  $('#opencloseStrip').show();
        }	
	    if (closing) { $('.slideimage').stop(); }
	    clearTimeout(timeout);
	    timeout = 0;
	    document.images['$playpause'].src = play_img.src;
	  } else {
		if (stripVisible) closeStrip();
		pause = false;
	    if (hidenav == 2)  {
	        $('#slidenavigation').hide();
	        //$('#slidemaplinks').hide();
		    $('#slidemaplinks').show();
		    $('#opencloseStrip').hide();
        }
		document.images['$playpause'].src = pause_img.src;
		next();
	  }
  }  
}

function getHelpURL() {
  var language = (window.navigator.userLanguage || window.navigator.language).slice(0,2).toUpperCase();
  var helpURL = 'http://andrewolff.jalbum.net/Help_SS4/SS4_help';
  if (PC) {
    helpURL = helpURL + '_PC_';
  }
  else {
	helpURL = helpURL + '_iPad_';

  };
  if ((language == 'NL') || (language == 'EN')||(language == 'FR')||(language == 'DE')||(language == 'ES')||(language == 'SV')) {
	  return helpURL + language + '.html'
  }
  else {
       return helpURL + 'EN' + '.html'
  };
}

function showHelp() {
	window.open(getHelpURL());
}

function keycommand(keynum) {
	if ( $("*:focus").is("textarea, input") ) return;
	if (slidepage==true) {
		switch(keynum) {
		case 32: { playpause();} break; // space
		case 37: { previous();} break;  // <==
		case 39: { next();} break;	  // ==>
		case 38: { closeSlide();} break;	  //  ^ arrow up
		case 40: { OpenGoogleMaps();} break;	  //  arrow down 
		case 80: { ExpandPanorama(); } break;  // P
		case 73: { ProcLink();} break;    // I
		case 76: { OpenGoogleMaps();} break;   // L  
		case 77: { opencloseStrip();} break;   // M  
		case 68: { $('#downloadBtn').trigger('click'); } break;  // D
		case 70: { OpenShareDialog();} break;  // F
		}
	}
	else {
		switch(keynum) {
		case 72: { showHelp(); } break; // H
		case 83: { opencloseSettings(); } break; // S
		case 13: { closeIndex(-1);} break; // Enter, start Slide Show
		case 38: {	//  arrow up
	         try { up() }
             catch(err) { window.close(); } 
		  } break; 
		case 39: {   // ==>
			 try { nextindex() }
             catch(err) { nextalbum() } 
		  } break; 
		case 37: {  // <==
			 try { previousindex() }
             catch(err) { previousalbum() } 
		  } break; 
		case 40: { OpenGoogleMapsRoute();} break;	//  arrow down 
		case 73: { MoreInfo();} break;    // I
		case 77: { OpenGoogleMapsRoute();} break;    // M  
		case 69: { OpenGoogleEarthRoute();} break;   // E
		case 84: { Track();} break; // T
		case 36: { Home();} break;  // Home
		}	
	}
}

function redisplayPanorama() {
        loadedImage = -1;  // to execute reload
		loadImage();       // for the current img
		displaySlide();	
}

function closeSlide() {
  if (AutoPanoramaShown) {
     redisplayPanorama();
  }
  else
  {
	if (stripVisible) closeStrip();
	$('#indexDiv').show();
	$('#slideDiv').hide();
    $('.slideimage').stop(); 
	if (movie) stopVideo();
	clearTimeout(timeout);
	timeout = 0;
	slidepage= false;
	if (hideIndexPage) {
	  up();  // skip current index page
	}
	else if (fromMap) {
		window.close();
	}
	else {
	  if (!initIndexDone) {
	    index_ready_function();  // 2014-03-24 required if normal album is used embedded 
	  }
	  document.title = albumTitle; 
	  //location.href = mainIndexPageURL; // 2014-09-15 erases all variable
	   if (iPhone) {
			resizeWindow();
	   }
	   else { 
	   		location.hash= ''; 
		}
	}
  }
}

function closeIndex(ind) {
	if (ind==-1) {
		ind=0;
		pause = false;
		document.images['$playpause'].src = pause_img.src; 
		playing = true;
	}
	else {
		pause = true; 
		playing = false;
		document.images['$playpause'].src = play_img.src;
	}
	closeWindows();
	if (pageVisible) {
		closePage();
		pageVisible= false;
	}
	if(settingsVisible)  $('#opencloseSettings').trigger('click');  // saves settings ? replace by saveSettings?
	if (isFolder(ind)==false) {
	  $('#indexDiv').hide();
//      if (pause) { document.images['$playpause'].src = pause_img.src;
//	             pause = false; 
//	           };
	  $('#slideDiv').show();
	  slide_index = ind;
	  initSlide();
	  resizeWindow();  // for long text in border of 1st slide and Phone in LS mode  
	}
	else {
      //window.location.assign(srcFolder[ind]);
	  document.location.href=srcFolder[ind];
	}
}

//function correctbkg() {
//  $('#slideimage').css({ 'position': 'absolute','left':0, 'top':0, 'width':'100%', 'height':'100%' });
//  $('#slideimage').show();
//};

function initSlide() {
	$('#indexDiv').hide();
	$('#slideDiv').show();
	//if (iOS) correctbkg();
	slidepage = true;
	closing = false;
	random_effect = false;
	timeout = 0;  
	if (fromMap||hideIndexPage||embedded) {
		if (fromMap){
			 $('#audioplayer').remove(); // otherwise you here the sound twice
			 pause= false;
		}
		else if(embedded) {
			 pause= true;
		}
		else {
  		  pause=true;
		}
  		playpause(); // will reverse pause
	}
	if (transeffect==7) { random_effect = true };
	slide_ready_function();
	if (playing) {	
      startdisplay();
	}
	else {
	  $('#slideimage').show();  
	}	
	loadNextImage()
}

function saveSettings(){
  if (window.localStorage !== null) {
    var storage = window.localStorage;
    try {
		storage.showbuttons = document.getElementById('hidenav').value;
		storage.showsharebutton = document.getElementById('hideshare').value;	
		storage.enableOversize = document.getElementById('enableOversizedImage').value;
		storage.viewtime = document.getElementById('viewtime').value;
		storage.transtime = document.getElementById('transtime').value;
		storage.transeffect = document.getElementById('transeffect').value;
		storage.roundButtonHeight = document.getElementById('roundButtonHeight').value;
		storage.fontSizeFactor = document.getElementById('fontSizeFactor').value;
      }catch(e) {  // error with IE in local mode
	              //alert("[7] saveSettings() catch(e)"); 
	              var form = window.document.forms.settings;
                  roundButtonHeight =  form.roundButtonHeight.value;	   
                  fontSizeFactor =  form.fontSizeFactor.value;	  
	            }
   }
   else
   {
	// alert("[4] saveSettings() window.localStorage == null");
     var form = window.document.forms.settings;
     roundButtonHeight =  form.roundButtonHeight.value;
	 fontSizeFactor =  form.fontSizeFactor.value;		   
   }
   setViewerSettings();
   //alert("[3] saveSettings() normally variables not changed yet, old viewtime: " + viewtime + " old roundButtonHeight: " + roundButtonHeight);
}

function getSettings() {
	 if (window.localStorage !== null) {
	    var storage = window.localStorage;
		try {
		  hidenav = storage.showbuttons;
		  hideshare = storage.showsharebutton;
		  enableOversizedImage = storage.enableOversize;
		  viewtime = 1000*storage.viewtime;
		  transtime = 500*storage.transtime;
		  transeffect = storage.transeffect;
		  roundButtonHeight = storage.roundButtonHeight;
		  fontSizeFactor = storage.fontSizeFactor;
		  setViewerSettings();
	      //alert("[1] Variables loaded from localStorage,  viewtime: " + viewtime + " roundButtonHeight: " + roundButtonHeight);
		}catch(e) {  // error with IE in local mode 
		          //alert("[8] getSettings() catch(e)"); 
	              var form = window.document.forms.settings;
                  roundButtonHeight =  form.roundButtonHeight.value;
				  fontSizeFactor =  form.fontSizeFactor.value;	   
			}
		  
	 }
	 else {
		 	 //alert("[5] saveSettings() window.localStorage == null");
	 }
}

function loadSettingsInForm() {
	if (window.localStorage !== null) {
		  var storage = window.localStorage;
		  		try {
		  document.getElementById('hidenav').value = storage.showbuttons;
		  document.getElementById('hideshare').value = storage.showsharebutton;
		  document.getElementById('enableOversizedImage').value = storage.enableOversize;
		  document.getElementById('viewtime').value = storage.viewtime;
		  document.getElementById('transtime').value = storage.transtime;
		  document.getElementById('transeffect').value = storage.transeffect;
		  document.getElementById('roundButtonHeight').value = storage.roundButtonHeight;
		  document.getElementById('fontSizeFactor').value = storage.fontSizeFactor;
	      //alert("[2] Variables loaded from localStorage into form");
		  		}catch(e) {  // error with IE in local mode 
		           //alert("[9] loadSettingsInForm() catch(e)"); 
				}
		  	 }
	 else {
		 	 //alert("[6] loadSettingsInForm() window.localStorage == null");
	 }
}

function tryNext() {
	try { nextindex() }
    catch(err) { nextalbum() } 
}
function tryPrev() {
	try { previousindex() }
    catch(err) { previousalbum() } 
}
function tryDown() {
	try { up() }
    catch(err) { window.close(); } 
}

function showTitle(Thumbnail) {
	if (!PC) {
		var title = Thumbnail.attr('title').replace("\n","<br>");
		var position = Thumbnail.offset();
		var wThumb = Thumbnail.width()/2;
		var msg = $('#msg');
		msg.html(title);
		var wMsg = msg.width()/2;
		var leftPos = position.left + wThumb - wMsg
		if (leftPos < 0) leftPos=0;
		var distanceToWindowBorder = window.innerWidth - (leftPos + 2*wMsg);
		if (distanceToWindowBorder < 0) leftPos= leftPos + distanceToWindowBorder;
		msg.css({"left": leftPos, "top": position.top-60});
		showMessage = true;
		setTimeout(function() {
		  if ( showMessage ) msg.show();
         }, 1000); // 400
	}
}

function showPage() {
  $('#page').show();
}

function closePage() {
  $('#page').hide();
};

function opencloseSettings() {
  if (settingsVisible) {closeSettings(); } else {openSettings()};
  settingsVisible = !settingsVisible;
  if (pageVisible) {
		closePage();
		pageVisible= false;
  }
};

function ShowExtraPage() { 
 pageVisible = false;
 showPage();
  setTimeout(function() {
	pageVisible = true; // otherwise action cancelled in CloseWindows
  }, 200); 
};

function index_ready_function() {
/*
 window.addEventListener("load",function() {
   setTimeout(function(){
    window.scrollTo(0, 0);
    }, 0);
 });
*/
  initIndexDone = true;
  pageVisible = false;
  settingsVisible = false;
  $('#slideDiv').hide();
  $('#indexDiv').show();
  if ($('.themeImage').length>0)  { 
    if (typeof(imgThemeMinScreenHeight) != "undefined") {
      if (screenHeight < parseInt(imgThemeMinScreenHeight)) {
        $("#title_out_image").show();	
	  } else $(".themeImage").show();
    } else $(".themeImage").show();
  }
  if (typeof(folderItemMinScreenHeight) != "undefined") {
    if (screenHeight < parseInt(folderItemMinScreenHeight)) {
      $(".folderItem").remove();
	  if ($("#topMenu ul > li").length==0) $("#topMenu").remove();
	}
  }
  $("#navigation").show();
  if (PC) {
    $('#fs').show();
  } 
 // $('#commentbox').hide();
//  $('#nextslideimage').hide();
  if (iPhone) {
     $("#indexDiv").css({'top':deadZone, 'position': 'absolute'}); 
	 $("#audioplayer audio").css({'height':64});
  }

 var swipeEveryWhere = true;
 if (typeof(swipesMinScreenHeight) != "undefined") {
    if (screenHeight < parseInt(swipesMinScreenHeight)) {
	  switch(swipesArea) {
	    case 0:  swipeEveryWhere = false;
			     break;		
	    case 1:  $(".themeImage").swipe( {
    			  swipeLeft:tryNext, swipeRight:tryPrev,  swipeDown: tryDown, // swipeUp:OpenGoogleMapsRoute,
    			  maxTimeThreshold:1000,
  	    		  fingers: 1,
  	   			  threshold:swipeThreshold
    			 });
				 swipeEveryWhere = false;
 				 break;	
         case 2:
	  }
	}
  } 
  if (swipeEveryWhere) {  
    if(!IE) {
	  $("#swipeMe").swipe( {
    	swipeLeft:tryNext, swipeRight:tryPrev,  swipeDown: tryDown, // swipeUp:OpenGoogleMapsRoute,
    	maxTimeThreshold:1000,
  	    fingers: 1,
  	    threshold:swipeThreshold
      });
    };
  }
  var thumbnr = 0;
  if (enableTaps) {
    $(".thumbs img").swipe({
	 tap:function(event, target) {
		showMessage = false;
		$('#msg').hide();
//		thumbnr = parseInt($(this).attr('id'));
//		closeIndex(thumbnr);
	},
	longTap:function(event, target) {
		showMessage = false;
		$('#msg').hide();
	},
	swipeStatus:function(event, phase, direction, distance, duration, fingerCount)
    {
	  if( phase=="start" ) {showTitle($(this));}
	  else if ( phase=="end" ) {
		  showMessage = false;
		  $('#msg').hide();
		  }
    }	  
    });
  }
  if (typeof(srcMov) != "undefined") {
	$('.thumbs img').each(function() {
		var moviefile = $(this).attr('alt') + ".mp4";
		for (var i = 0; i < srcMov.length; i++) {
			if (getfilename(srcMov[i]) == moviefile) {
				$(this).css({'border-color':thumbmovieBorderColor})
				}
		};		
	});
  }
  //getSavedData();  // ss4
  loadNextImage();  // preload first image
  // preload(srcImg);  Moved to </body> tag
}

function preload(arrayOfImages) {
    $(arrayOfImages).each(function () {
        $('<img />').attr('src',this).appendTo('body').css('display','none');
    });
}

function slideSwipeUpFunction() {	
  if (expandPossible) { ExpandPanorama() } 
  else if (!stripVisible) { openStrip() }
  else {OpenGoogleMaps() }
}

function slide_ready_function() {
  $('#slideDiv').show();
  $('#slidemaplinks').show();
  if ((hidenav==0) || (fromMap) ||((hidenav==2)&&(pause))) {
	$('#slidenavigation').show();
	$('#opencloseStrip').show();	
  }	
  else if (hidenav==2) {
	$('#slidenavigation').hide();
	$('#opencloseStrip').hide();	
  }	
  else {
	$('#slidenavigation').hide();
	$('#opencloseStrip').hide();	
  }
/*
  if ((hideshare==0) && (allowSharing)) {
	$('#slideFB').show();
  }	
  else {
	$('#slideFB').hide();
  }
  */
  if (pause) { document.images['$playpause'].src = play_img.src; };

    $("#slideDiv").swipe( {  // was  $("#image").swipe( { 
	tap:playpause, longTap:playpause, swipeLeft:next, swipeRight:previous,  swipeDown:closeSlide, swipeUp:slideSwipeUpFunction,
	fingers: 1,
	threshold:swipeThreshold
   });
   loadImage();
}

	var ix=1;
	var xSpd=0;
	
function scroll() {
	if (AutoPanoramaShown) {
		ix += xSpd;			
		if (ix > 0) ix = 0;
		if (ix < -tWidth + winW) ix = -tWidth  + winW;
		document.getElementById('slideimage').style.left= ix + 'px';
		setTimeout("scroll()",15);
	}
}

function move(e) {
	if (AutoPanoramaShown) {
		var mx=e.pageX;
		var my=e.pageY;
		if (mx > 0 && my > 50 && mx < winW) {
	    	xSpd=parseInt((winW-2*mx)/30);
		} else xSpd = 0;
	}
}

function initMouseCapture() {
	document.onmousemove=move;
	scroll();
}

function back() { window.close();  window.opener.focus(); }

function openAuxWindow(url, windowName){
    if ( typeof openAuxWindow.winrefs == 'undefined' ) {
      openAuxWindow.winrefs = {};
    }
    if ( typeof openAuxWindow.winrefs[windowName] == 'undefined' || openAuxWindow.winrefs[windowName].closed ) {
      openAuxWindow.winrefs[windowName] = window.open(url, windowName);
    } else {
      openAuxWindow.winrefs[windowName].focus();
	}
 }


