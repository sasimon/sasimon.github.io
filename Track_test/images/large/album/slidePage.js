var extraTextlines = 0;
var shadowWidthSlide= 0;
slidePadding = 0;
var orgFontsize= 16;
var orgh1Fontsize= 22;
var orgbuttonFontsize= 28;

var buttonOpacity= '1';
var ClickF11 = "Press F11 to use full screen";
var fsMAC = "Press Command+Control+F to view this album in Full screen";

var hideIndexPage = false;


var links_under_thumbs = false;


var enableTaps = false;


var limitLongDescriptions = false;

var useBrowserVideo = false;
var stopAfterLastSlide = false;
var commentType = 6;
var borderWidth = 2;

var videoWidth = 0;
var imgThemeMinScreenHeight = '400';
var folderItemMinScreenHeight = '400';
var swipesMinScreenHeight = '400';
var swipesArea = 0;

var imageBorderColor = '#ffffffff';
var thumbmovieBorderColor = 'rgba(254,0,55,1.0)';
viewtime = 1000;
transeffect = 3;
transtime = 500;
hidenav = 0;

var allowSharing = false;
hideshare = 1;
enableOversizedImage = 0;
pause = true;

var albumImageName = '151016_016_WalterWolfmanWashington.jpg';
var albumImageIndex = 0;

var srcImg = [
'slides/151016_016_WalterWolfmanWashington.jpg',
'slides/151016_027_WalterWolfmanWashington.jpg',
'slides/151016_054_MarciaBall.jpg',
'slides/151017_030_MasonRuffner.jpg',
'slides/151017_040_LittleFreddieKing.jpg',
'slides/151017_074_LurrieBell.jpg',
'slides/151017_092_KennyNeal.jpg',
'slides/151017_137_TheFunkyMeters.jpg',
'slides/151017_151_TheFunkyMeters.jpg',
'slides/151017_170_TheFunkyMeters.jpg',
'slides/151018_029_MrSipp.jpg',
'slides/151018_046_JarekusSingleton.jpg',
'slides/151018_068_ExcelloRecordsReunion.jpg',
'slides/151018_080_ExcelloRecordsReunion.jpg',
'slides/151018_081_ExcelloRecordsReunion.jpg',
'slides/151018_084_ExcelloRecordsReunion.jpg',
'slides/151018_101_ExcelloRecordsReunion.jpg',
'slides/151018_122_DeniseLaSalle.jpg',
'slides/151018_139_RuthieFoster.jpg',
'slides/151018_146_RuthieFoster.jpg',
'slides/151018_147_RuthieFoster.jpg',
'slides/151018_151_RuthieFoster.jpg',
'slides/151018_178_RuthieFoster.jpg',
];

var srcHiResImg = [
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
];

var wImg = [
727,
748,
765,
720,
720,
755,
768,
1200,
968,
870,
1199,
816,
720,
758,
720,
720,
758,
921,
880,
1200,
963,
906,
959,
];
var hImg = [
1080,
1080,
1080,
1080,
1080,
1080,
1080,
948,
1080,
1080,
952,
1080,
1080,
1080,
1080,
1080,
1080,
1080,
1080,
1078,
1080,
1080,
1080,
];
var strCap = [
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
'',
];



 var strTitle = [
 '151016_016_WalterWolfmanWashington',
 '151016_027_WalterWolfmanWashington',
 '151016_054_MarciaBall',
 '151017_030_MasonRuffner',
 '151017_040_LittleFreddieKing',
 '151017_074_LurrieBell',
 '151017_092_KennyNeal',
 '151017_137_TheFunkyMeters',
 '151017_151_TheFunkyMeters',
 '151017_170_TheFunkyMeters',
 '151018_029_MrSipp',
 '151018_046_JarekusSingleton',
 '151018_068_ExcelloRecordsReunion',
 '151018_080_ExcelloRecordsReunion',
 '151018_081_ExcelloRecordsReunion',
 '151018_084_ExcelloRecordsReunion',
 '151018_101_ExcelloRecordsReunion',
 '151018_122_DeniseLaSalle',
 '151018_139_RuthieFoster',
 '151018_146_RuthieFoster',
 '151018_147_RuthieFoster',
 '151018_151_RuthieFoster',
 '151018_178_RuthieFoster',
 ];







