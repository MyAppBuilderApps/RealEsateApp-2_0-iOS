var control = angular.module('starter.controllers', ['ngTagsInput','checklist-model']);
localStorage.clear();
var v = 0;
var barcolor = 'bar-assertive';
var buttoncolor;
var defaultkey;
var image;

var app = angular.module('app', ['ngTagsInput'])
.config(function(tagsInputConfigProvider) {
        tagsInputConfigProvider
        .setDefaults('tagsInput', {
                     placeholder: 'New tag',
                     addOnEnter: false
                     })
        .setDefaults('autoComplete', {
                     maxResultsToShow: 20,
                     debounceDelay: 1000
                     })
        .setActiveInterpolation('tagsInput', {
                                placeholder: true,
                                addOnEnter: true,
                                removeTagSymbol: true
                                });
        });
openFB.init('1436547346579776');

var options = {
    customSpinner : false,
    position : "middle",
    label : "Please Wait..",
bgColor: "#000",
opacity:0.5,
color: "#fff"
};

var googleapi = {
setToken: function(data) {
    localStorage.access_token = data.access_token;
    localStorage.refresh_token = data.refresh_token || localStorage.refresh_token;
    var expiresAt = new Date().getTime() + parseInt(data.expires_in, 10) * 1000 - 60000;
    localStorage.expires_at = expiresAt;
},
authorize: function(options) {
    var deferred = $.Deferred();
    var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
                                                                         client_id: options.client_id,
                                                                         redirect_uri: options.redirect_uri,
                                                                         response_type: 'code',
                                                                         scope: options.scope
                                                                         });
    var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=yes');
    $(authWindow).on('loadstart', function(e) {
                     
                     var url = e.originalEvent.url;
                     var code = /\?code=(.+)$/.exec(url);
                     var error = /\?error=(.+)$/.exec(url);
                     
                     if (code || error) {
                     authWindow.close();
                     }
                     
                     if (code) {
                     $.post('https://accounts.google.com/o/oauth2/token', {
                            code: code[1],
                            client_id: options.client_id,
                            client_secret: options.client_secret,
                            redirect_uri: options.redirect_uri,
                            grant_type: 'authorization_code'
                            }).done(function(data) {
                                    googleapi.setToken(data);
                                    deferred.resolve(data);
                                    }).fail(function(response) {
                                            deferred.reject(response.responseJSON);
                                            });
                     } else if (error) {
                     deferred.reject({
                                     error: error[1]
                                     });
                     }
                     });
    return deferred.promise();
},
getToken: function(options) {
    var deferred = $.Deferred();
    if (new Date().getTime() < localStorage.expires_at) {
        deferred.resolve({
                         access_token: localStorage.access_token
                         });
    } else if (localStorage.refresh_token) {
        $.post('https://accounts.google.com/o/oauth2/token', {
               refresh_token: localStorage.refresh_token,
               client_id: options.client_id,
               client_secret: options.client_secret,
               grant_type: 'refresh_token'
               }).done(function(data) {
                       googleapi.setToken(data);
                       deferred.resolve(data);
                       }).fail(function(response) {
                               deferred.reject(response.responseJSON);
                               });
    } else {
        deferred.reject();
    }
    
    return deferred.promise();
},
userInfo: function(options) {
    return $.getJSON('https://www.googleapis.com/oauth2/v1/userinfo', options);
}
};

var data;
var appkeyResult = '';
var appList = [];
var twitterKey = '';
var buttonArray = '';
var elementArray = '';
var buttonId = '';
var elementId = '';
var contentData = '';
var appKey = '';
var appTitle = '';
var appImg = '';
var appDesc = '';
var listGrid = '';
var reskey=[];
var chapterArray = [];

control.controller('editContentCtrl',function($scope,$state,$ionicLoading,$http,$ionicActionSheet){
                   $scope.key='';
                   $scope.bar_color=barcolor;
                   
                   document.addEventListener("deviceready", onConnectionCheck, false);
                   function onConnectionCheck(){
                   
                   var networkState = navigator.network.connection.type;
                   var states = {};
                   states[Connection.UNKNOWN]  = 'Unknown connection';
                   states[Connection.ETHERNET] = 'Ethernet connection';
                   states[Connection.WIFI]     = 'WiFi connection';
                   states[Connection.CELL_2G]  = 'Cell 2G connection';
                   states[Connection.CELL_3G]  = 'Cell 3G connection';
                   states[Connection.CELL_4G]  = 'Cell 4G connection';
                   states[Connection.NONE]     = 'No network connection';
                   if (states[networkState] == 'No network connection') {
                   offline();
                   }
                   else{
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                $http({method: "GET", url:'key.txt', cache: false, params:{}})
                .success(function(data){
                         defaultkey = data.trim();
                         appList=[];
                         $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                         .success(function(data, status){
//                                  alert(data.title);
                                  appId=defaultkey;
                                  appTit=data.title;
                                  appList.push(data);
                                  
                                  $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                  .success(function(reskey){
                                          
                                           for(var j=0;j<reskey.length;j++){
                                           if(reskey[j].key=="keys"){
                                           $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                           .success(function(data, status){
                                                    
                                                    appList.push(data);
                                                    
                                                    })
                                           .error(function(data, status) {
                                                  alert(JSON.stringify(data));
                                                  $ionicLoading.hide();
                                                  });
                                           }
                                           }
                                           $ionicLoading.hide();
                                           
//                                           $state.go('listView1');
                                           
                                           $scope.listViewClickFtn(appList[0].api_key,appList[0].title,appList[0].description,appList[0].app_image);
                                           
                                           })
                                  .error(function(data, status) {
                                         $ionicLoading.hide();
                                         navigator.notification.alert(JSON.stringify(data));
                                         
                                         }); 
                                 
                                  })
                         .error(function(data, status) {
                                alert(JSON.stringify(data));
                                $ionicLoading.hide();
                                });

                         
                })
                .error(function(data, status) {
                    $ionicLoading.hide();
                    navigator.notification.alert(JSON.stringify(data));
                                   
                });
                            
                   
                   }
                   }
                   
                   
                   function goOnline(){
                   $state.go('login');
                   }
                   
                   function offline(){
                   navigator.notification.alert("Please Connect Your 3G or Wifi Connection");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit,desc,img){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   appDesc = desc;
                   appImg = img;
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   console.log('**************1234567890*************');
                   console.log('**************123456*************'+appId);
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 buttoncolor = 'button-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                        success:function(response){
                                        bookAppwall = response;
                                        $ionicLoading.hide();
                                        $state.go('previewChapter1');
                                        },
                                        error:function(){
                                        $ionicLoading.hide();
                                        navigator.notification.alert("Failure");
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   }
                   
                   });

/* -----------------------------------------------------Login Page---------------------------------------------*/

control.controller('loginCtrl',function($scope,$state,$ionicLoading,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   
                  $('#userId').val('sai');
                  $('#password').val('password');
                   $scope.count = function(val){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if(v < val){
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':data.apps[v].api_key},
                          cache: false,
                          success:function(response1){
                          console.log(response1.length);
                          console.log(JSON.stringify(response1));
                          console.log(v);
                          for(var j=0;j<response1.length;j++){
                          
                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
                          
                          appList.push(data.apps[v]);
                          }
                          
                          }
                          v++;
                          $scope.count(data.apps.length);
                          console.log(JSON.stringify(appList));
                          
                          },
                          error:function(error,status){
                          
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   }
                   else{
                   $ionicLoading.hide();
                   v = 0;
                   localStorage["login"] = JSON.stringify(appkeyResult);
                   if(listGrid == ''){
                   $state.go('listView');
                   }else if(listGrid == 'list'){
                   $state.go('listView');
                   }else{
                   $state.go('listView');
                   }
                   }
                   };
                   
                   if(localStorage["login"]){
                   appkeyResult = JSON.parse(localStorage["login"]);
                   //alert(appkeyResult.api_key+" : "+appkeyResult.id);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/users.json",
                          data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                          cache: false,
                          success:function(response){
                          data = response;
                          $ionicLoading.hide();
                          localStorage.sender_id = appkeyResult.id;
                          if(appkeyResult.username){
                          localStorage.appwallLoginData = appkeyResult.username;
                          }else{
                          localStorage.appwallLoginData = appkeyResult.name;
                          }
                          appList=[];
                          //                for(var i=0;i<response.apps.length;i++){
                          //                 if(response.apps[i].description=="News"){
                          //                 appList.push(response.apps[i]);
                          //                 }
                          //
                          //                 }
                          //                    $state.go('listView');
                          $scope.count(response.apps.length);
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   }
                   
                   
                   
                   
                   $scope.loginFtn = function(){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   var userId = $('#userId').val();
                   var password = $('#password').val();
                   
                   $.ajax({
                          type: "POST",
                          url: "http://build.myappbuilder.com/api/login.json",
                          data:{'login':userId,'password':password},
                          success:function(response){
                          
                          appkeyResult = response;
                          localStorage.sender_id = appkeyResult.id;
                          if(appkeyResult.username){
                          localStorage.appwallLoginData = appkeyResult.username;
                          }else{
                          localStorage.appwallLoginData = appkeyResult.name;
                          }
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 $ionicLoading.hide();
                                 appList=[];
                                 //                   for(var i=0;i<response.apps.length;i++){
                                 //                   if(response.apps[i].description=="News"){
                                 //                   appList.push(response.apps[i]);
                                 //                   }
                                 //
                                 //                   }
                                 localStorage["login"] = JSON.stringify(appkeyResult);
                                 $scope.count(response.apps.length);
                                 //                    $state.go('listView');
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Check Your UserId or Password!")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   };
                   
                   
                   $scope.registerPageCallFtn =function(){
                   $state.go('register');
                   };
                   
                   
                   $scope.fbLogin = function(){
                   
                   openFB.login('email',
                                function() {
                                openFB.api({
                                           path: '/me',
                                           success: function(responcedata) {
                                           console.log(JSON.stringify(responcedata));
                                           $ionicLoading.show({
                                                              content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                              animation: 'fade-in',
                                                              showBackdrop: true,
                                                              maxWidth: 200,
                                                              showDelay: 0
                                                              });
                                           $.ajax({
                                                  type: "POST",
                                                  url: "http://build.myappbuilder.com/api/login.json",
                                                  data:{'uid':responcedata.id,'provider':"facebook"},
                                                  success:function(response){
                                                  console.log(JSON.stringify(response));
                                                  appkeyResult = response;
                                                  localStorage.sender_id = appkeyResult.id;
                                                  
                                                  if(appkeyResult.username){
                                                  localStorage.appwallLoginData = appkeyResult.username;
                                                  }else{
                                                  localStorage.appwallLoginData = appkeyResult.name;
                                                  }
                                                  
                                                  $.ajax({
                                                         type: "GET",
                                                         url: "http://build.myappbuilder.com/api/users.json",
                                                         data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                         cache: false,
                                                         success:function(response){
                                                         $ionicLoading.hide();
                                                         data = response;
                                                         console.log(JSON.stringify(response));
                                                         //                                  console.log(response.apps.length);
                                                         appList=[];
                                                         
                                                         //                                 for(var i=0;i<response.apps.length;i++){
                                                         $scope.count(response.apps.length);
                                                         //                                 }
                                                         //                                 console.log(appList.length);
                                                         
                                                         },
                                                         error:function(error,status){
                                                         $ionicLoading.hide();
                                                         navigator.notification.alert(error.responseText)
                                                         }
                                                         });
                                                  
                                                  },
                                                  error:function(error,status){
                                                  $ionicLoading.show({
                                                                     content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                                     animation: 'fade-in',
                                                                     showBackdrop: true,
                                                                     maxWidth: 200,
                                                                     showDelay: 0
                                                                     });
                                                  
                                                  var error = JSON.parse(error.responseText);
                                                  if(error.error == "Unauthorized"){
                                                  //navigator.notification.alert("Please Check Your UserId or Password!")
                                                  $.ajax({
                                                         type: "POST",
                                                         url: "http://build.myappbuilder.com/api/users.json",
                                                         data:{'name':responcedata.name,'username':responcedata.username,'identity[uid]':responcedata.id,'identity[provider]':'facebook'},
                                                         cache:false,
                                                         success:function(response){
                                                         appkeyResult = response;
                                                         localStorage.sender_id = appkeyResult.id;
                                                         if(appkeyResult.username){
                                                         localStorage.appwallLoginData = appkeyResult.username;
                                                         }else{
                                                         localStorage.appwallLoginData = appkeyResult.name;
                                                         }
                                                         
                                                         $.ajax({
                                                                type: "GET",
                                                                url: "http://build.myappbuilder.com/api/users.json",
                                                                data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                                cache: false,
                                                                success:function(response){
                                                                data = response;
                                                                $ionicLoading.hide();
                                                                appList=[];
                                                                
                                                                //                                 for(var i=0;i<response.apps.length;i++){
                                                                //                                       if(response.apps[i].description=="News"){
                                                                //                                       appList.push(response.apps[i]);
                                                                //                                       }
                                                                //
                                                                //                                       }
                                                                localStorage["login"] = JSON.stringify(appkeyResult);
                                                                $scope.count(response.apps.length);
                                                                //                                        $state.go('listView');
                                                                },
                                                                error:function(error,status){
                                                                $ionicLoading.hide();
                                                                navigator.notification.alert(error.responseText)
                                                                }
                                                                });
                                                         },
                                                         error:function(error){
                                                         $ionicLoading.hide();
                                                         navigator.notification.alert(error.responseText)
                                                         }
                                                         });
                                                  }else {
                                                  $ionicLoading.hide();
                                                  navigator.notification.alert("Login Error!");
                                                  }
                                                  }
                                                  });
                                           
                                           },
                                           error: function(error) {
                                           console.log(error.message);
                                           }
                                           });
                                },
                                function(error) {
                                console.log('Facebook login failed: ' + error.error_description);
                                });
                   }
                   
                   $scope.twitterLogin = function(){
                   var oauth; // It Holds the oAuth data request
                   var requestParams; // Specific param related to request
                   var options = {
                   consumerKey: 'UBjIy8qbq3JRrpBuZdhRhQ', // YOUR Twitter CONSUMER_KEY
                   consumerSecret: '4SOJDZvvnLA1iybfK884YUGier1XEUKEYHTb1OUF4', // YOUR Twitter CONSUMER_SECRET
                   callbackUrl: "http://nuatransmedia.com/" }; // YOU have to replace it on one more Place
                   twitterKey = "tTWnGny5Oydp0Zo3BVYg03BDl"; // This key is used for storing Information related
                   var ref;
                   
                   var Twitter = {
                   init:function(){
                   var storedAccessData, rawData = localStorage.getItem(twitterKey);
                   if(localStorage.getItem(twitterKey) !== null){
                   storedAccessData = JSON.parse(rawData); //JSON parsing
                   options.accessTokenKey = storedAccessData.accessTokenKey; // data will be saved when user first time signin
                   options.accessTokenSecret = storedAccessData.accessTokenSecret; // data will be saved when user first first signin
                   oauth = OAuth(options);
                   oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                             function(data) {
                             var entry = JSON.parse(data.text);
                             //console.log("USERNAME: " + JSON.stringify(entry));
                             
                             $ionicLoading.show({
                                                content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                animation: 'fade-in',
                                                showBackdrop: true,
                                                maxWidth: 200,
                                                showDelay: 0
                                                });
                             $.ajax({
                                    type: "POST",
                                    url: "http://build.myappbuilder.com/api/login.json",
                                    data:{'uid':entry.id,'provider':"twitter"},
                                    success:function(response){
                                    appkeyResult = response;
                                    localStorage.sender_id = appkeyResult.id;
                                    
                                    if(appkeyResult.username){
                                    localStorage.appwallLoginData = appkeyResult.username;
                                    }else{
                                    localStorage.appwallLoginData = appkeyResult.name;
                                    }
                                    
                                    $.ajax({
                                           type: "GET",
                                           url: "http://build.myappbuilder.com/api/users.json",
                                           data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                           cache: false,
                                           success:function(response){
                                           data = response;
                                           $ionicLoading.hide();
                                           appList=[];
                                           //                                 for(var i=0;i<response.apps.length;i++){
                                           //                                             if(response.apps[i].description=="News"){
                                           //                                             appList.push(response.apps[i]);
                                           //                                             }
                                           //
                                           //                                             }
                                           localStorage["login"] = JSON.stringify(appkeyResult);
                                           $scope.count(response.apps.length);
                                           },
                                           error:function(error,status){
                                           $ionicLoading.hide();
                                           navigator.notification.alert(error.responseText)
                                           }
                                           });
                                    },
                                    error:function(error){
                                    var error = JSON.parse(error.responseText);
                                    if(error.error == "Unauthorized"){
                                    //navigator.notification.alert("Please Check Your UserId or Password!")
                                    $.ajax({
                                           type: "POST",
                                           url: "http://build.myappbuilder.com/api/users.json",
                                           data:{'name':entry.name,'username':entry.screen_name,'identity[uid]':entry.id,'identity[provider]':'twitter'},
                                           cache:false,
                                           success:function(response){
                                           appkeyResult = response;
                                           localStorage.sender_id = appkeyResult.id;
                                           if(appkeyResult.username){
                                           localStorage.appwallLoginData = appkeyResult.username;
                                           }else{
                                           localStorage.appwallLoginData = appkeyResult.name;
                                           }
                                           
                                           $.ajax({
                                                  type: "GET",
                                                  url: "http://build.myappbuilder.com/api/users.json",
                                                  data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                  cache: false,
                                                  success:function(response){
                                                  data = response;
                                                  $ionicLoading.hide();
                                                  appList=[];
                                                  //                                 for(var i=0;i<response.apps.length;i++){
                                                  //                                                     if(response.apps[i].description=="News"){
                                                  //                                                     appList.push(response.apps[i]);
                                                  //                                                     }
                                                  //
                                                  //                                                     }
                                                  localStorage["login"] = JSON.stringify(appkeyResult);
                                                  $scope.count(response.apps.length);
                                                  },
                                                  error:function(error,status){
                                                  $ionicLoading.hide();
                                                  navigator.notification.alert(error.responseText)
                                                  }
                                                  });
                                           },
                                           error:function(error){
                                           $ionicLoading.hide();
                                           navigator.notification.alert(error.responseText)
                                           }
                                           });
                                    }else {
                                    $ionicLoading.hide();
                                    navigator.notification.alert("Login Error!");
                                    }
                                    }
                                    });
                             
                             },function(data){
                             $ionicLoading.hide();
                             console.log("ERROR: "+JSON.stringify(data));
                             }
                             
                             );
                   }
                   else {
                   oauth = OAuth(options);
                   oauth.get('https://api.twitter.com/oauth/request_token',
                             function(data) {
                             requestParams = data.text;
                             ref = window.open('https://api.twitter.com/oauth/authorize?'+data.text, '_blank', 'location=no,toolbar=no');
                             ref.addEventListener('loadstop', function(event) { Twitter.success(event.url);});
                             },
                             function(data) {
                             console.log("ERROR: "+data);
                             }
                             
                             );
                   }
                   },
                   success:function(loc){
                   if (loc.indexOf("http://nuatransmedia.com/?") >= 0) {
                   var index, verifier = '';
                   var params = loc.substr(loc.indexOf('?') + 1);
                   
                   params = params.split('&');
                   for (var i = 0; i < params.length; i++) {
                   var y = params[i].split('=');
                   if(y[0] === 'oauth_verifier') {
                   verifier = y[1];
                   }
                   }
                   oauth.get('https://api.twitter.com/oauth/access_token?oauth_verifier='+verifier+'&'+requestParams,
                             function(data) {
                             var accessParams = {};
                             var qvars_tmp = data.text.split('&');
                             for (var i = 0; i < qvars_tmp.length; i++) {
                             var y = qvars_tmp[i].split('=');
                             accessParams[y[0]] = decodeURIComponent(y[1]);
                             }
                             
                             
                             oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
                             var accessData = {};
                             accessData.accessTokenKey = accessParams.oauth_token;
                             accessData.accessTokenSecret = accessParams.oauth_token_secret;
                             console.log("TWITTER: Storing token key/secret in localStorage");
                             localStorage.setItem(twitterKey, JSON.stringify(accessData));
                             
                             oauth.get('https://api.twitter.com/1.1/account/verify_credentials.json?skip_status=true',
                                       function(data) {
                                       var entry = JSON.parse(data.text);
                                       //console.log("TWITTER USER: "+JSON.stringify(entry));
                                       $ionicLoading.show({
                                                          content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                          animation: 'fade-in',
                                                          showBackdrop: true,
                                                          maxWidth: 200,
                                                          showDelay: 0
                                                          });
                                       $.ajax({
                                              type: "POST",
                                              url: "http://build.myappbuilder.com/api/login.json",
                                              data:{'uid':entry.id,'provider':"twitter"},
                                              success:function(response){
                                              appkeyResult = response;
                                              localStorage.sender_id = appkeyResult.id;
                                              
                                              if(appkeyResult.username){
                                              localStorage.appwallLoginData = appkeyResult.username;
                                              }else{
                                              localStorage.appwallLoginData = appkeyResult.name;
                                              }
                                              
                                              $.ajax({
                                                     type: "GET",
                                                     url: "http://build.myappbuilder.com/api/users.json",
                                                     data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                     cache: false,
                                                     success:function(response){
                                                     data = response;
                                                     $ionicLoading.hide();
                                                     appList=[];
                                                     //                                 for(var i=0;i<response.apps.length;i++){
                                                     //                                                                 if(response.apps[i].description=="News"){
                                                     //                                                                 appList.push(response.apps[i]);
                                                     //                                                                 }
                                                     //
                                                     //                                                                 }
                                                     localStorage["login"] = JSON.stringify(appkeyResult);
                                                     $scope.count(response.apps.length);
                                                     },
                                                     error:function(error,status){
                                                     $ionicLoading.hide();
                                                     navigator.notification.alert(error.responseText)
                                                     }
                                                     });
                                              },
                                              error:function(error){
                                              var error = JSON.parse(error.responseText);
                                              if(error.error == "Unauthorized"){
                                              //navigator.notification.alert("Please Check Your UserId or Password!")
                                              $.ajax({
                                                     type: "POST",
                                                     url: "http://build.myappbuilder.com/api/users.json",
                                                     data:{'name':entry.name,'username':entry.screen_name,'identity[uid]':entry.id,'identity[provider]':'twitter'},
                                                     cache:false,
                                                     success:function(response){
                                                     appkeyResult = response;
                                                     localStorage.sender_id = appkeyResult.id;
                                                     
                                                     if(appkeyResult.username){
                                                     localStorage.appwallLoginData = appkeyResult.username;
                                                     }else{
                                                     localStorage.appwallLoginData = appkeyResult.name;
                                                     }
                                                     
                                                     $.ajax({
                                                            type: "GET",
                                                            url: "http://build.myappbuilder.com/api/users.json",
                                                            data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                            cache: false,
                                                            success:function(response){
                                                            data = response;
                                                            $ionicLoading.hide();
                                                            appList=[];
                                                            //                                 for(var i=0;i<response.apps.length;i++){
                                                            //                                                                         if(response.apps[i].description=="News"){
                                                            //                                                                         appList.push(response.apps[i]);
                                                            //                                                                         }
                                                            //
                                                            //                                                                         }
                                                            localStorage["login"] = JSON.stringify(appkeyResult);
                                                            $scope.count(response.apps.length);
                                                            },
                                                            error:function(error,status){
                                                            $ionicLoading.hide();
                                                            navigator.notification.alert(error.responseText)
                                                            }
                                                            });
                                                     },
                                                     error:function(error){
                                                     $ionicLoading.hide();
                                                     navigator.notification.alert(error.responseText)
                                                     }
                                                     });
                                              }else {
                                              $ionicLoading.hide();
                                              navigator.notification.alert("Login Error!");
                                              }
                                              }
                                              });
                                       
                                       },
                                       function(data) {
                                       $ionicLoading.hide();
                                       console.log("ERROR: " + data);
                                       }
                                       );
                             ref.close();
                             },
                             function(data) {
                             //console.log("Hello: :-"+data);
                             ref.close();
                             }
                             );
                   }
                   else {
                   //ref.close();
                   }
                   }
                   
                   }
                   
                   Twitter.init();
                   }
                   
                   $scope.googleLogin = function(){
                   var googleapp = {
                   client_id: "912532492266-10ivhj0e821bs1g3vm7egqv4unubt364.apps.googleusercontent.com",
                   client_secret: "dljPcfIJVxpU1Tnb4GhaWBYp",
                   redirect_uri: "http://localhost",
                   scope: 'https://www.googleapis.com/auth/userinfo.profile',
                   init: function() {
                   
                   googleapi.getToken({
                                      client_id: this.client_id,
                                      client_secret: this.client_secret
                                      }).done(function() {
                                              googleapp.showGreetView();
                                              
                                              }).fail(function() {
                                                      googleapp.showLoginView();
                                                      });
                   },
                   showLoginView: function() {
                   
                   },
                   showGreetView: function() {
                   googleapi.getToken({
                                      client_id: this.client_id,
                                      client_secret: this.client_secret
                                      }).then(function(data) {
                                              return googleapi.userInfo({ access_token: data.access_token });
                                              }).done(function(user) {
                                                      var res = JSON.stringify(user);
                                                      console.log(res);
                                                      $ionicLoading.show({
                                                                         content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                                         animation: 'fade-in',
                                                                         showBackdrop: true,
                                                                         maxWidth: 200,
                                                                         showDelay: 0
                                                                         });
                                                      $.ajax({
                                                             type: "POST",
                                                             url: "http://build.myappbuilder.com/api/login.json",
                                                             data:{'uid':user.id,'provider':"google_oauth2"},
                                                             success:function(response){
                                                             appkeyResult = response;
                                                             localStorage.sender_id = appkeyResult.id;
                                                             
                                                             if(appkeyResult.username){
                                                             localStorage.appwallLoginData = appkeyResult.username;
                                                             }else{
                                                             localStorage.appwallLoginData = appkeyResult.name;
                                                             }
                                                             
                                                             $.ajax({
                                                                    type: "GET",
                                                                    url: "http://build.myappbuilder.com/api/users.json",
                                                                    data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                                    cache: false,
                                                                    success:function(response){
                                                                    data = response;
                                                                    $ionicLoading.hide();
                                                                    appList=[];
                                                                    //                                 for(var i=0;i<response.apps.length;i++){
                                                                    //                                                                 if(response.apps[i].description=="News"){
                                                                    //                                                                 appList.push(response.apps[i]);
                                                                    //                                                                 }
                                                                    //
                                                                    //                                                                 }
                                                                    localStorage["login"] = JSON.stringify(appkeyResult);
                                                                    $scope.count(response.apps.length);
                                                                    
                                                                    },
                                                                    error:function(error,status){
                                                                    $ionicLoading.hide();
                                                                    navigator.notification.alert(error.responseText)
                                                                    }
                                                                    });
                                                             },
                                                             error:function(error){
                                                             var error = JSON.parse(error.responseText);
                                                             if(error.error == "Unauthorized"){
                                                             $.ajax({
                                                                    type: "POST",
                                                                    url: "http://build.myappbuilder.com/api/users.json",
                                                                    data:{'name':user.name,'username':user.name,'identity[uid]':user.id,'identity[provider]':'google_oauth2'},
                                                                    cache:false,
                                                                    success:function(response){
                                                                    appkeyResult = response;
                                                                    localStorage.sender_id = appkeyResult.id;
                                                                    
                                                                    if(appkeyResult.username){
                                                                    localStorage.appwallLoginData = appkeyResult.username;
                                                                    }else{
                                                                    localStorage.appwallLoginData = appkeyResult.name;
                                                                    }
                                                                    
                                                                    $.ajax({
                                                                           type: "GET",
                                                                           url: "http://build.myappbuilder.com/api/users.json",
                                                                           data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                                           cache: false,
                                                                           success:function(response){
                                                                           data = response;
                                                                           $ionicLoading.hide();
                                                                           appList=[];
                                                                           //                                 for(var i=0;i<response.apps.length;i++){
                                                                           //                                                                         if(response.apps[i].description=="News"){
                                                                           //                                                                         appList.push(response.apps[i]);
                                                                           //                                                                         }
                                                                           //
                                                                           //                                                                         }
                                                                           localStorage["login"] = JSON.stringify(appkeyResult);
                                                                           $scope.count(response.apps.length);
                                                                           },
                                                                           error:function(error,status){
                                                                           $ionicLoading.hide();
                                                                           navigator.notification.alert(error.responseText)
                                                                           }
                                                                           });
                                                                    },
                                                                    error:function(error){
                                                                    $ionicLoading.hide();
                                                                    navigator.notification.alert(error.responseText)
                                                                    }
                                                                    });
                                                             }else {
                                                             $ionicLoading.hide();
                                                             navigator.notification.alert("Login Error!");
                                                             }
                                                             }
                                                             });
                                                      
                                                      }).fail(function() {
                                                              googleapp.showLoginView();
                                                              });
                   },
                   
                   };
                   googleapp.init();
                   googleapi.authorize({
                                       client_id: "912532492266-10ivhj0e821bs1g3vm7egqv4unubt364.apps.googleusercontent.com",
                                       client_secret: "dljPcfIJVxpU1Tnb4GhaWBYp",
                                       redirect_uri: "http://localhost",
                                       scope: 'https://www.googleapis.com/auth/userinfo.profile'
                                       }).done(function() {
                                               //Show the greet view if access is granted
                                               googleapp.showGreetView();
                                               
                                               }).fail(function(data) {
                                                       //Show an error message if access was denied
                                                       console.log(data.error);
                                                       });
                   }
                   });

control.controller('loginCtrl1',function($scope,$state,$ionicLoading,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   localStorage.clear();
                   $('#userId').val('sai');
                   $('#password').val('password');
                   $scope.count = function(){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          navigator.notification.alert(JSON.stringify(data));
                          
                          });
                   };
                   

                   
                   
                   
                   
                   $scope.loginFtn = function(){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   var userId = $('#userId').val();
                   var password = $('#password').val();
                   
                   
                   $http({method: "POST", url:'http://build.myappbuilder.com/api/login.json', cache: false, params:{'login':userId,'password':password}})
                   .success(function(response){
                            
                            appkeyResult = response;
//                            appkeyResult = response;
                            localStorage.sender_id = appkeyResult.id;
                            if(appkeyResult.username){
                            localStorage.appwallLoginData = appkeyResult.username;
                            }else{
                            localStorage.appwallLoginData = appkeyResult.name;
                            }
//                            appKey = response.api_key;
                            
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps.json', cache: false, params:{'api_key':response.api_key}})
                            .success(function(data, status){
                                     var logkey;
                                     for(var j=0;j<data.length;j++){
                                     if(data[j].api_key==defaultkey){
                                     logkey=data[j].api_key;
                                     }
                                     }
                                     if(logkey==defaultkey){
                                     $scope.count();
                                     $ionicLoading.hide();
                                     }
                                     else{
                                     $ionicLoading.hide();
                                      navigator.notification.alert("You are not authorised for this app!");
                                     }
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                           
                            
                            })
                   .error(function(error, status) {
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Check Your UserId or Password!")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          });
                   
                   
                   };
                   
                   $scope.cancelFtn =function(){
                   $state.go('editContent');
                   };
                   

                   });


control.controller('menuCtrl', function($scope, $state, $ionicModal,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appcreate = {};
                   
                   
                   
                   
                   $scope.createAppFtn = function(val){
                   $state.go('addBook');
                   
                   };
                   
                   $scope.addAppFtn = function(){
                   //                   navigator.notification.alert($scope.appcreate.appkeys);
                   
                   var data = $scope.appcreate.appkeys;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   $http({method: "POST", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey,'title':'keys','value':$scope.appcreate.appkeys}})
                   .success(function(data, status){
                           
                            appList=[];
                            
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          alert(JSON.stringify(data));
                          $ionicLoading.hide();
                          });
                   
                   
                   };
                   
                  
                   
                   $scope.listViewBack = function(){
                  
                   $state.go('listView');
                   //window.history.back();
                   };
                   
                   });


/* ------------------------------------------------------------------------------------Register Page ----------------------------*/


control.controller('registerCtrl',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.count = function(val){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if(v < val){
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
                          data:{'api_key':data.apps[v].api_key},
                          cache: false,
                          success:function(response1){
                          console.log(response1.length);
                          console.log(JSON.stringify(response1));
                          console.log(v);
                          for(var j=0;j<response1.length;j++){
                          
                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
                          
                          appList.push(data.apps[v]);
                          }
                          
                          }
                          v++;
                          $scope.count(data.apps.length);
                          console.log(JSON.stringify(appList));
                          
                          },
                          error:function(error,status){
                          
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   }
                   else{
                   $ionicLoading.hide();
                   v = 0;
                   localStorage["login"] = JSON.stringify(appkeyResult);
                   if(listGrid == ''){
                   $state.go('listView');
                   }else if(listGrid == 'list'){
                   $state.go('listView');
                   }else{
                   $state.go('listView');
                   }
                   }
                   };
                   
                   $scope.registerPageSubmitFtn = function(){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   var Name = $('#regName').val();
                   var regUserId = $('#regUserId').val();
                   var regEmail = $('#regEmail').val();
                   var regPassword = $('#regPassword').val();
                   var regConfirmPassword = $('#regConfirmPassword').val();
                   
                   $.ajax({
                          type: "POST",
                          url: "http://build.myappbuilder.com/api/users.json",
                          data:{'name':Name,'username':regUserId,'email':regEmail,'password':regPassword,'password_confirmation':regConfirmPassword},
                          cache:false,
                          success:function(response){
                          //alert("sucee: "+JSON.stringify(response));
                          appkeyResult = response;
                          localStorage.sender_id = appkeyResult.id;
                          
                          if(appkeyResult.username){
                          localStorage.appwallLoginData = appkeyResult.username;
                          }else{
                          localStorage.appwallLoginData = appkeyResult.name;
                          }
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 $ionicLoading.hide();
                                 appList=[];
                                 //                                 for(var i=0;i<response.apps.length;i++){
                                 //                 if(response.apps[i].description=="News"){
                                 //                 appList.push(response.apps[i]);
                                 //                 }
                                 //
                                 //                 }
                                 localStorage["login"] = JSON.stringify(appkeyResult);
                                 $scope.count(response.apps.length);
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   }
                   
                   $scope.registerBack = function(){
                   $state.go('login');
                   }
                   });



/* -------------------------------------------------------------------- ListView ----------------------------------------*/



var bookTitle = '';
var bookDesc = '';
var bookImg = '';
var bookAppwall = '';

control.controller('listViewCtrl', function($scope, $state, $ionicModal,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.count = function(){
                   //                          appKey = response.api_key;
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              $scope.appKey = appList;
                                              $state.reload();
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          navigator.notification.alert(JSON.stringify(data));
                          
                          });
                   
                   };
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].app_image == null){
                   appList[i].app_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
                   $scope.createBook = function(){
                   listGrid = 'list';
//                   $state.go("addBook");
                   $state.go("menu");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                 success:function(response){
                                 bookAppwall = response;
                                 $ionicLoading.hide();
                                 $ionicScrollDelegate.scrollTop();
                                 chapterArray = [];
                                 for (var i = 0; i < buttonArray.length; i++) {
                                 if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                 chapterArray.push(buttonArray[i]);
                                 //alert("Hi : "+buttonArray[i].title)
                                 }else{
                                 //alert("Hello : "+buttonArray[i].title)
                                 }
                                 
                                 }
                                 
//                                 $scope.items = chapterArray;
                                 //alert(JSON.stringify($scope.items));
//                                 $scope.appTitle = appTitle;
//                                 $scope.AppEditor = false;
                                 $state.go('previewChapter');
                                 },
                                 error:function(){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("Failure");
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   };
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                   
                   openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
                   window.localStorage.removeItem(twitterKey);
                   $state.go('login1');
                   //window.history.back();
                   }
                   
                   /*$scope.gridCallFtn = function(){
                    listGrid = 'grid';
                    $state.go('bookShelf');
                    }*/
                   
                   $scope.editApp = function(appId,title,desc,appImg){
                   
                   appKey = appId;
                   bookTitle = title;
                   bookDesc = desc;
                   bookImg = appImg;
                   $state.go('editBook');
                   }
                   
                   
                   $scope.EditBook = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.deleteApp = function(appId,item){
                   if(appId==defaultkey){
                   navigator.notification.alert('You cannot delete this root App!',function(){},item,'OK');
                   }
                   else{
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: item,
                                                          template: 'Are you sure you want to delete this Listing?'
                                                          });
                   confirmPopup.then(function(res) {
                                     if(res) {
//                                     alert(appId);
                                     $ionicLoading.show({
                                                        content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                        animation: 'fade-in',
                                                        showBackdrop: true,
                                                        maxWidth: 200,
                                                        showDelay: 0
                                                        });
                                     
                                     
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/apps.json",
                                            data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
                                            cache: false,
                                            success:function(response){
                                            
                                            $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                            .success(function(reskey){
                                                     $ionicLoading.hide();
                                                     for(var j=0;j<reskey.length;j++){
                                                     if(reskey[j].value==appId){
//                                                     alert(reskey[j].id);
                                                     
                                                     $http({method: "DELETE", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey,'id':reskey[j].id}})
                                                     .success(function(data){
                                                             $scope.count();
                                                              
                                                              
                                                              })
                                                     .error(function(data, status) {
                                                            $ionicLoading.hide();
                                                            navigator.notification.alert(JSON.stringify(data));
                                                            
                                                            });
                                                     
                                                     }
                                                     }
                                                     
                                                     
                                                     })
                                            .error(function(data, status) {
                                                   $ionicLoading.hide();
                                                   navigator.notification.alert(JSON.stringify(data));
                                                   
                                                   });
                                            
                                            
                                            },
                                            error:function(error,status){
                                            $ionicLoading.hide();
                                            navigator.notification.alert("status")
                                            }
                                            });
                                     
                                     } else {
                                     console.log('You are not sure');
                                     }
                                     });
                   }
                   };
                   
                   
                   });


control.controller('listViewCtrl1', function($scope, $state, $ionicModal,$ionicScrollDelegate,$ionicLoading,$ionicPopup,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;
//                   $scope.count = function(val){
//                   //    navigator.notification.alert(val);
//                   
//                   window.wizSpinner.show(options);
//                   if(v < val){
//                   $.ajax({
//                          type: "GET",
//                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
//                          data:{'api_key':data.apps[v].api_key},
//                          cache: false,
//                          success:function(response1){
//                          console.log(response1.length);
//                          console.log(JSON.stringify(response1));
//                          console.log(v);
//                          for(var j=0;j<response1.length;j++){
//                          
//                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
//                          
//                          appList.push(data.apps[v]);
//                          }
//                          
//                          }
//                          v++;
//                          $scope.count(data.apps.length);
//                          console.log(JSON.stringify(appList));
//                          
//                          },
//                          error:function(error,status){
//                          
//                          navigator.notification.alert(error.responseText)
//                          }
//                          });
//                   }
//                   else{
//                   window.wizSpinner.hide();
//                   v = 0;
//                   
//                   $state.reload();
//                   }
//                   };
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].app_image == null){
                   appList[i].app_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
                   $scope.createBook = function(){
                   listGrid = 'list';
                   $state.go("addBook");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit,desc,img){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   appDesc = desc;
                   appImg = img;
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   console.log('**************1234567890*************');
                   console.log('**************123456*************'+appId);
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 buttoncolor = 'button-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                        success:function(response){
                                        bookAppwall = response;
                                        $ionicLoading.hide();
                                        $state.go('previewChapter1');
                                        },
                                        error:function(){
                                        $ionicLoading.hide();
                                        navigator.notification.alert("Failure");
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   }
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                   
                   openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
                   window.localStorage.removeItem(twitterKey);
                   $state.go('login1');
                   //window.history.back();
                   }
                   
                   /*$scope.gridCallFtn = function(){
                    listGrid = 'grid';
                    $state.go('bookShelf');
                    }*/
                   
//                   $scope.editApp = function(appId,title,desc,appImg){
//                   
//                   appKey = appId;
//                   bookTitle = title;
//                   bookDesc = desc;
//                   bookImg = appImg;
//                   $state.go('editBook');
//                   }
                   
                   
//                   $scope.EditBook = function(){
//                   if($scope.AppEditor == false){
//                   $scope.AppEditor = true;
//                   }else{
//                   $scope.AppEditor =false;
//                   }
//                   }
                   
//                   $scope.deleteApp = function(appId,item){
//                   var confirmPopup = $ionicPopup.confirm({
//                                                          title: 'Real Estate Delete!',
//                                                          template: 'Are you sure you want to delete this Real Estate?'
//                                                          });
//                   confirmPopup.then(function(res) {
//                                     if(res) {
//                                     $ionicLoading.show({
//                                                        content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
//                                                        animation: 'fade-in',
//                                                        showBackdrop: true,
//                                                        maxWidth: 200,
//                                                        showDelay: 0
//                                                        });
//                                     
//                                     $.ajax({
//                                            type: "DELETE",
//                                            url: "http://build.myappbuilder.com/api/apps.json",
//                                            data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
//                                            cache: false,
//                                            success:function(response){
//                                            
//                                            //console.log(JSON.stringify(response));
//                                            $.ajax({
//                                                   type: "GET",
//                                                   url: "http://build.myappbuilder.com/api/users.json",
//                                                   data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
//                                                   cache: false,
//                                                   success:function(response){
//                                                   data = response;
//                                                   // console.log(JSON.stringify(response));
//                                                   $ionicLoading.hide();
//                                                   appList=[];
//                                                   //                                 for(var i=0;i<response.apps.length;i++){
//                                                   //                            if(response.apps[i].description=="News"){
//                                                   //                            appList.push(response.apps[i]);
//                                                   //                            }
//                                                   //
//                                                   //                            }
//                                                   $scope.appKey.splice($scope.appKey.indexOf(item), 1);
//                                                   $scope.count(response.apps.length);
//                                                   
//                                                   },
//                                                   error:function(error,status){
//                                                   $ionicLoading.hide();
//                                                   navigator.notification.alert(error.responseText);
//                                                   }
//                                                   });
//                                            },
//                                            error:function(error,status){
//                                            $ionicLoading.hide();
//                                            navigator.notification.alert("status")
//                                            }
//                                            });
//                                     
//                                     } else {
//                                     console.log('You are not sure');
//                                     }
//                                     });
//                   }
                   
                   
                   
                   });

/*--------------------------------------------------------------Add Book -----------------------------------------*/

control.controller('addBookCtrl',function($scope, $state,$ionicPopup,$ionicLoading,$ionicScrollDelegate,$http, $ionicActionSheet){
                   image = undefined;
                   
                   $ionicScrollDelegate.scrollTop();
                   //tinymce.init({selector:'textarea'});
                   $scope.appcreate = {}
                   $scope.book = {}
                   
                   $scope.count = function(){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          navigator.notification.alert(JSON.stringify(data));
                          
                          });
                   };
                   
                   $scope.showActionsheet = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose Bar Color',
                                          buttons: [
                                                    { text: '<p><img src="img/light.png" style="align:left;"/>&nbsp;Light&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/stable.png" style=""/>&nbsp;Stable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/positive.png" style=""/>&nbsp;Positive&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/calm.png" style=""/>&nbsp;Calm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/balanced.png" style=""/>&nbsp;Balanced&nbsp;</p>' },
                                                    { text: '<p><img src="img/energized.png" style=""/>&nbsp;Energized</p>' },
                                                    { text: '<p><img src="img/assertive.png" style=""/>&nbsp;Assertive&nbsp;</p>' },
                                                    { text: '<p><img src="img/royal.png" style=""/>&nbsp;Royal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/dark.png" style=""/>&nbsp;Dark&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          barcolor = 'bar-light';
                                          $scope.book.bar_color = 'light';
                                          $scope.button_color='button-light';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==1){
                                          barcolor = 'bar-stable';
                                          $scope.book.bar_color = 'stable';
                                          $scope.button_color='button-stable';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==2){
                                          barcolor = 'bar-positive';
                                          $scope.book.bar_color = 'positive';
                                          $scope.button_color='button-positive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==3){
                                          barcolor = 'bar-calm';
                                          $scope.book.bar_color = 'calm';
                                          $scope.button_color='button-calm';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==4){
                                          barcolor = 'bar-balanced';
                                          $scope.book.bar_color = 'balanced';
                                          $scope.button_color='button-balanced';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==5){
                                          barcolor = 'bar-energized';
                                          $scope.book.bar_color = 'energized';
                                          $scope.button_color='button-energized';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==6){
                                          barcolor = 'bar-assertive';
                                          $scope.book.bar_color = 'assertive';
                                          $scope.button_color='button-assertive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==7){
                                          barcolor = 'bar-royal';
                                          $scope.book.bar_color = 'royal';
                                          $scope.button_color='button-royal';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==8){
                                          barcolor = 'bar-dark';
                                          $scope.book.bar_color = 'dark';
                                          $scope.button_color='button-dark';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else{
                                          $state.reload();
                                          }
                                          
                                          return true;
                                          },
                                          destructiveButtonClicked: function() {
                                          console.log('DESTRUCT');
                                          return true;
                                          }
                                          });
                   };
                   
                   $scope.book.bar_color="assertive";
                   $scope.bar_color='bar-'+$scope.book.bar_color;
                   $scope.colors = ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'];
                   $scope.change_bar_color = function(){
                   barcolor = 'bar-'+$scope.book.bar_color;
                   $scope.bar_color=barcolor;
                   $state.reload();
                   }
                   $scope.change_button_color = function(){
                   $scope.button_color = 'button-'+$scope.book.button_color;
                   $state.reload();
                   }
                   
                   $scope.change_bar_button_color = function(){
                   if($scope.book.bar_button_color == ""){
                   $scope.bar_button_color = 'button-clear';
                   $state.reload();
                   }
                   else{
                   $scope.bar_button_color = 'button-'+$scope.book.bar_button_color;
                   $state.reload();
                   }
                   }
                   
                   $scope.addBookBack = function(){
                   $state.go('listView');
                   //                   $.ajax({
                   //                          type: "GET",
                   //                          url: "http://build.myappbuilder.com/api/users.json",
                   //                          data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                   //                          cache: false,
                   //                          success:function(response){
                   //                          data = response;
                   //                          // console.log(JSON.stringify(response));
                   //                          $ionicLoading.hide();
                   //                          appList=[];
                   //
                   //                          $scope.count(response.apps.length);
                   //
                   //                          },
                   //                          error:function(error,status){
                   //                          $ionicLoading.hide();
                   //                          navigator.notification.alert(error.responseText);
                   //                          }
                   //                          });
                   
                   }
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   
                   function readURL(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   }
                   }
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                         
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
//                   $("#bookImage").click(function(){
//                                         $scope.showActionsheet();
//                                         cordova.exec(function(e){
//                                                      //                                                      alert(e);
//                                                      }, function(e){alert(e);}, "ImageCompress", "imageCompress", [""]);
                                         
                   
                   
                   
                   
//                                         });
                   
//                   $("#bookImage").change(function(){
//                                          readURL(this);
//                                          });
                   
                   $scope.createAppFtn = function(){
                   if(($scope.appcreate.gridBookTitle) && image){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if($scope.appcreate.gridBookDesc==undefined){
                   $scope.appcreate.gridBookDesc='';
                   }
                   
                   $.ajax({
                          type: "POST",
                          url: "http://build.myappbuilder.com/api/apps.json",
                          data:{'api_key':appkeyResult.api_key,'title':$scope.appcreate.gridBookTitle,'description':$scope.appcreate.gridBookDesc},
                          success:function(response){
                          //window.wizSpinner.hide();
                          appKey = response.api_key;
                          appTitle = response.title;
                          
                          var booktype = new FormData();
                          booktype.append('api_key',appKey);
                          booktype.append('title',"AppType");
                          booktype.append('value','Real Estate');
                          $http.post('http://build.myappbuilder.com/api/book_custom_fields.json', booktype, {
                                     transformRequest: angular.identity,
                                     headers: {'Content-Type': undefined}
                                     }).
                          success(function(data, status, headers, config) {
                                  
                                  }).
                          error(function(data, status, headers, config) {
                                
                                });
                          
                          var booktype1 = new FormData();
                          booktype1.append('api_key',defaultkey);
                          booktype1.append('title',"keys");
                          booktype1.append('value',appKey);
                          $http.post('http://build.myappbuilder.com/api/book_custom_fields.json', booktype1, {
                                     transformRequest: angular.identity,
                                     headers: {'Content-Type': undefined}
                                     }).
                          success(function(data, status, headers, config) {
                                  
                                  }).
                          error(function(data, status, headers, config) {
                                
                                });
                          
                          
                          cordova.exec(function(response){
                                       //                          alert(e);
                                       console.log("*********123456789*********"+JSON.stringify(response))
                                       $ionicLoading.hide();
                                       image = undefined;
                                       $scope.checkBox ={}
                                       if(localStorage.checkedData == "checkedData"){
                                       
                                       $state.go('addChapter');
                                       
                                       
                                       }else{
                                       var myPopup = $ionicPopup.alert({
                                                                       template: '<div class="card"><div class="item item-text-wrap">Please Add New Listing and Contents.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                                                                       title: appTitle,
                                                                       subTitle: 'Successfully created Real Estate Title! ',
                                                                       scope: $scope,
                                                                       
                                                                       });
                                       myPopup.then(function(res) {
                                                    console.log('Tapped!', $scope.checkBox.data);
                                                    if($scope.checkBox.data == true){
                                                    localStorage.checkedData = "checkedData";
                                                    }
                                                    myPopup.close();
                                                    $state.go('addChapter');
                                                    
                                                    });
                                       }
                                       
                                       }, function(error){
                                       $ionicLoading.hide();
//                                       image = undefined;
                                       navigator.notification.alert(JSON.stringify(error));
                                       
                                       }, "ImageCompress", "imageCompress", ["114", "114", "app_image", image, "http://build.myappbuilder.com/api/apps/settings/general.json?", "put", { api_key: appKey,title:$scope.appcreate.gridBookTitle,bar_color:$scope.book.bar_color}])
                          
                          
                          
                          },
                          error:function(error){
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   }else{
                   navigator.notification.alert("Select Real Estate Image & Enter Real Estate Title");
                   }
                   }
                   
                   });


var appChapter = '';
function readURL1(input) {
    
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+e.target.result+')');
        }
        
        reader.readAsDataURL(input.files[0]);
    }
}





control.controller('addChapterCtrl',function($state,$scope,$ionicPopup,$ionicNavBarDelegate,$ionicLoading,$ionicScrollDelegate,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $ionicScrollDelegate.scrollTop();
                   $scope.Title = appTitle;
                   $scope.chaptercreate ={}
                   function addChapterConfirm(){
                   $state.go('addContent');
                   
                   
                   }
                   
                   $scope.addchapterBack = function(){
                   $state.go('addBook');
                   }
                   
//                   $("#buttonImage").click(function(){
//                                           
//                                           cordova.exec(function(e){},function(e){alert(e);}, "ImageCompress","imageCompress", [""]);
//                                           });
//                   
//                   $("#buttonImage").change(function(){
//                                            
//                                            readURL1(this);
//                                            });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $scope.buttonSubmitFtn = function(){
                   if(($scope.chaptercreate.title) && image){
                   
                   //        var formData = new FormData();
                   //        formData.append('api_key',appKey);
                   //        formData.append('title',$scope.chaptercreate.title);
                   //        formData.append('image', $("#buttonImage").get(0).files[0]);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   cordova.exec(function(response){
                                console.log("*****************"+response.id);
                                image = undefined;
                                $ionicLoading.hide();
                                buttonId = response.id;
                                appChapter = response.title;
                                $scope.checkBox = {};
                                if(localStorage.checkedData == "checkedData"){
                                addChapterConfirm();
                                }else{
                                
                                var myPopup = $ionicPopup.alert({
                                                                template: '<div class="card"><div class="item item-text-wrap">Please Add App Contents and Images.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                                                                title: $scope.chaptercreate.title,
                                                                subTitle: 'Successfully created New Listing!',
                                                                scope: $scope,
                                                                
                                                                });
                                myPopup.then(function(res) {
                                             console.log('Tapped!', $scope.checkBox.data);
                                             if($scope.checkBox.data == true){
                                             localStorage.checkedData = "checkedData";
                                             }
                                             
                                             myPopup.close();
                                             addChapterConfirm();
                                             });
                                }
                                
                                },
                                function(error){
                                $ionicLoading.hide();
//                                image = undefined;
                                //alert("Successfully")
                                navigator.notification.alert("error: "+error.responseText);
                                }, "ImageCompress", "imageCompress", ["57", "57", "image", image, "http://build.myappbuilder.com/api/buttons.json?", "POST", { api_key: appKey,title:$scope.chaptercreate.title}])
                   
                   //            $.ajax({
                   //                type: "POST",
                   //                url: "http://build.myappbuilder.com/api/buttons.json",
                   //                data: formData,
                   //                cache: false,
                   //                contentType: false,
                   //                processData: false,
                   //                success:function(response){
                   //                    $ionicLoading.hide();
                   //                    buttonId = response.id;
                   //                    appChapter = response.title;
                   //                    $scope.checkBox = {};
                   //                    if(localStorage.checkedData == "checkedData"){
                   //                      addChapterConfirm();
                   //                    }else{
                   //
                   //                      var myPopup = $ionicPopup.alert({
                   //                         template: '<div class="card"><div class="item item-text-wrap">Please Add App Contents and Images.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                   //                         title: $scope.chaptercreate.title,
                   //                         subTitle: 'Successfully created App Category!',
                   //                         scope: $scope,
                   //
                   //                      });
                   //                       myPopup.then(function(res) {
                   //                         console.log('Tapped!', $scope.checkBox.data);
                   //                         if($scope.checkBox.data == true){
                   //                          localStorage.checkedData = "checkedData";
                   //                         }
                   //
                   //                         myPopup.close();
                   //                         addChapterConfirm();
                   //                      });
                   //                    }
                   //                },
                   //                error:function(error,status){
                   //                    $ionicLoading.hide();
                   //                    //alert("Successfully")
                   //                    navigator.notification.alert("error: "+error.responseText);
                   //                }
                   //            });
                   
                   }else{
                   $ionicLoading.hide();
                   navigator.notification.alert("Enter New Listing Title ");
                   }
                   }
                   });




control.controller('addContentCtrl',function($scope,$state,$ionicPopup,$sce,$ionicLoading,$ionicScrollDelegate,$http,$ionicModal,$ionicActionSheet){
                   image = undefined;
                   $scope.bar_color=barcolor;
                   $scope.addAgent = {
                   id : []
                   };
                   $scope.addagent={};
                   $scope.count = function(val){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              myPopup = $ionicPopup.show({
                                                                         template: '<div class="list"><div class="item item-icon-right" ng-click="editContent();">'+$scope.appChapter+'<i class="icon ion-compose"></i></div><div class="item item-icon-right" ng-click="createContent();">Create New Content<i class="icon ion-ios7-plus"></i></div><div class="item item-icon-right" ng-click="createChapter();">Create New Listing<i class="icon ion-ios7-plus"></i></div><div class="item item-icon-left" ng-click="goToHome();"><i class="icon ion-home"></i>Realtors Home</div></div>',
                                                                         title: $scope.appChapter,
                                                                         subTitle: 'Successfully added Realtors Listing Content!',
                                                                         scope: $scope,
                                                                         
                                                                         });
                                              $scope.goToHome = function(){
                                              
                                              myPopup.close();
                                              $state.go('listView');
                                              
                                              }
                                              
                                              $scope.editContent = function(){
                                              editData = 'Edit';
                                              myPopup.close();
                                              }
                                              
                                              $scope.createChapter = function(){
                                              myPopup.close();
                                              chapterEdit = '';
                                              $state.go('addButton');
                                              }
                                              
                                              $scope.createContent = function(){
                                              myPopup.close();
                                              editData = 'notEdit';
                                              $scope.contentCreate.elementTitle = '';
                                              $scope.contentCreate.elementText = '';
                                              $scope.contentCreate.elementPrice = '';
                                              $scope.contentCreate.elementAdditional_field = '';
                                              elementId ='';
                                              contentTitle = '';
                                              $state.go('addElement');
                                              // $state.go('addContent');
                                              }
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          navigator.notification.alert(JSON.stringify(data));
                          
                          });
                   };
                   
                   
                   var imageField_name;
                   
                   $ionicScrollDelegate.scrollTop();
                   var chapterTitletxt = appTitle+":"+appChapter;
                   
                   $scope.appChapter = chapterTitletxt;
                   $scope.contentCreate = {};
                   $scope.contentCreate.elementText = '';
                   //  buttonDeleteArray = [];
                   
                   
                   
                   if($('#elementTitle').val()){
                   $scope.videoChecked = false;
                   }else{
                   $scope.videoChecked = true;
                   }
                   
                   $scope.change = function(){
                   //alert($scope.contentCreate.elementTitle)
                   if($scope.contentCreate.elementTitle){
                   $scope.videoChecked = false;
                   }else{
                   $scope.videoChecked = true;
                   }
                   }
                   
                   $scope.deliberatelyTrustDangerousSnippet = function(url) {
                   return $sce.trustAsHtml(url);
                   };
                   
                   $scope.buttonDeletevideo = function(btnId){
                   window.wizSpinner.show(options);
                   $.ajax({
                          type: "DELETE",
                          url: "http://build.myappbuilder.com/api/elements/images.json",
                          data: {"api_key":appKey,"element_id":elementId,"id":btnId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $scope.imagelist();
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   }
                   
                   $scope.tinymceOptions = {
                   
                   
                   menubar: false,
                   theme: "modern",
                   plugins: [
                             "advlist autolink lists link image charmap print preview anchor",
                             "searchreplace wordcount visualblocks visualchars code fullscreen",
                             "insertdatetime table contextmenu ",
                             "emoticons textcolor"
                             ],
                   toolbar1: "insertfile undo redo | styleselect | bold italic | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify forecolor backcolor",
                   file_browser_callback: function(field_name, url, type, win) {
                   
                   $('#imageSelect1').click();
                   
                   imageField_name = field_name;
                   //alert($('input[name="width"]').val());
                   $('#width').blur(function(){
                                    if($('#width').val() == ''){
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }else if($('#width').val() <= 300){
                                    }else{
                                    
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }
                                    });
                   
                   
                   },
                   
                   image_advtab: true,
                   height: "200px",
                   width: "100%",
                   resize: false
                   };
                   
                   
                   $("#imageSelect1").change(function(){
                                             
                                             window.wizSpinner.show(options);
                                             
                                             var formDataKey ;
                                             var formDataId ;
                                             formDataKey = 'd4b2e8f5473bd5023797436ce9556620';
                                             formDataId = '2188';
                                             
                                             cordova.exec(function(e){
                                                          // alert(e)
                                                          $('#'+imageField_name).val(e);
                                                          $('#width').val("150");
                                                          window.wizSpinner.hide();
                                                          },function(e){navigator.notification.alert(e);window.wizSpinner.hide();},"EchoimageUploads" , "echoimageUploads",[formDataKey,formDataId,"Image"]);
                                             
                                             
                                             });
                   
                   
                   
                   
                   $ionicModal.fromTemplateUrl('new_video.html',{
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.videoModal = modal;
                                                       });
                   $ionicModal.fromTemplateUrl('addnew_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.addagentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.agentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_audio.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.audioModal = modal;
                                                       });
                   
                   //$scope.audioText.title = contentTitle;
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $scope.showActionsheet2 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess2(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail2(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $scope.editagent = function(val1,val2,val3,val4,val5){
                   $scope.addagentModal.show();
                   agentmethod="PUT";
                   agentid = val1;
                   
                   if(val2==null){
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url("img/avatar.png")');
                   }
                   else{
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+val2+')');
                   }
                   
                   var name = val3.split("   ");
                   
                   $('#fname').val(name[0]);
                   $('#lname').val(name[1].trim());
                   $('#email').val(val4);
                   $('#phone').val(val5);
                   
                   };
                   
                   $scope.addnewagentshowFtn = function(){
                   
                   $scope.addagentModal.show();
                   agentmethod="POST";
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url("img/avatar.png")');
                   $('#fname').val('');
                   $('#lname').val('');
                   $('#email').val('');
                   $('#phone').val('');

                   };

                   function readURL5(input) {
                                    if (input.files && input.files[0]) {
                   
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (e) {
                                    $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+e.target.result+')');
                   
                                    }
                                    
                                    reader.readAsDataURL(input.files[0]);
                  
                                    }
                                    }
                   
                   $scope.agentUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                   $scope.agentModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.agentModal.show();
                   }
                   
                   }else{
                   navigator.notification.alert('Please Enter Your Content Title!',alertDismissed,'Realtors','done');
                   }
                   
                   };
                   
                   $scope.addagentFtn = function(){
                   console.log($scope.addAgent.id.length);
                   //                   $scope.addAgent.id = '';
                   if($scope.addAgent.id.length){
                   $scope.addAgentid = '';
                   window.wizSpinner.show(options);
                   for (var i = 0; i < $scope.addAgent.id.length; i++) {
                   if(i==0){
                   $scope.addAgentid = $scope.addAgent.id[i];
                   }
                   else{
                   $scope.addAgentid = $scope.addAgentid+","+$scope.addAgent.id[i];
                   }
                   }
                   console.log($scope.addAgentid);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                          data: {"api_key":appKey,"id":elementId,"meta_keywords":$scope.addAgentid},
                          cache: false,
                          success:function(response){
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 //                          window.wizSpinner.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 
                                 console.log("1122445566sduh"+$scope.agents.length);
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                        data: {"api_key":appKey,"id":elementId},
                                        cache: false,
                                        success:function(response){
                                        agentlist=[];
                                        
                                        var res = response.meta_keywords.split(",");
                                        console.log("1122445566337*******"+res);
                                        console.log("1122445566337*******"+res.length);
                                        for (var i = 0; i < res.length; i++) {
                                        //                                 navigator.notification.alert(JSON.stringify(agentdata.length));
                                        for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                        //                                 navigator.notification.alert(JSON.stringify($scope.agents[j]));
                                        if(res[i]==$scope.agents[j].id){
                                        
                                        agentlist.push($scope.agents[j]);
                                        }
                                        }
                                        }
                                        $scope.agentslists=agentlist;
                                        $state.reload();
                                        window.wizSpinner.hide();
                                        console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                        console.log("1122445566337#########"+agentlist);
                                        navigator.notification.alert('Selected agent(s) has been added succesfully!',function(){$scope.agentModal.hide();},chapterTitle,'Done');
                                        },
                                        error:function(error,status){
                                        window.wizSpinner.hide();
                                        navigator.notification.alert(error.responseText)
                                        }
                                        });
                                 
                                 
                                 },
                                 error:function(error,status){
                                 window.wizSpinner.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   }
                   else{
                   navigator.notification.alert("Please select an Agent");
                   }
                   
                   //                   alert($scope.addAgent.id);
                   };
                   

                   
                   
                   $scope.addnewagentFtn = function(){
                   console.log($scope.addagent.fname);
                   console.log(appKey);
                   //                   navigator.notification.alert($scope.addagent.fname);
                   window.wizSpinner.show(options);

                   if(agentmethod=="POST"){
                   if(image){
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   formData11.append('subscriber[firstname]',$('#fname').val());
                   formData11.append('subscriber[lastname]',$('#lname').val());
                   formData11.append('subscriber[username]',$('#email').val());
                   formData11.append('subscriber[email]',$('#email').val());
                   formData11.append('subscriber[phone]',$('#phone').val());
//                   formData11.append('subscriber[avatar]',image);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                            cordova.exec(function(response){
                                         
                                         $.ajax({
                                                type: "GET",
                                                url: "http://build.myappbuilder.com/api/subscribers.json",
                                                data: {"api_key":appKey},
                                                cache: false,
                                                success:function(response){
                                                window.wizSpinner.hide();
                                                //                          $scope.imagelist();
                                                agentdata=response;
                                                $scope.agents=response;
                                                image = undefined;
                                                $state.reload();
                                                $scope.addagentModal.hide();
                                                
                                                },
                                                error:function(error,status){
                                                window.wizSpinner.hide();
                                                navigator.notification.alert("error1"+error.responseText);
                                                }
                                                });
                                         
                                         }, function(error){
                                         window.wizSpinner.hide();
//                                         image = undefined;
                                         navigator.notification.alert("error2"+error.responseText);
                                         
                                         }, "ImageCompress", "imageCompress", ["90", "90", "avatar", image, "http://build.myappbuilder.com/api/subscribers.json?", "put", { api_key: appKey,id:agentid,firstname:$('#fname').val(),lastname:$('#lname').val(),username:$('#email').val(),email:$('#email').val(),phone:$('#phone').val()}])
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          window.wizSpinner.hide();
                          console.log("error2**************"+error);
                          navigator.notification.alert("error2"+JSON.stringify(error));
                          });
                   


                   }
                   else{
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   formData11.append('subscriber[firstname]',$('#fname').val());
                   formData11.append('subscriber[lastname]',$('#lname').val());
                   formData11.append('subscriber[username]',$('#email').val());
                   formData11.append('subscriber[email]',$('#email').val());
                   formData11.append('subscriber[phone]',$('#phone').val());
                   //                   formData11.append('subscriber[avatar]',image);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                            $.ajax({
                                   type: "GET",
                                   url: "http://build.myappbuilder.com/api/subscribers.json",
                                   data: {"api_key":appKey},
                                   cache: false,
                                   success:function(response){
                                   window.wizSpinner.hide();
                                   //                          $scope.imagelist();
                                   agentdata=response;
                                   $scope.agents=response;
                                   image = undefined;
                                   $state.reload();
                                   $scope.addagentModal.hide();
                                   
                                   },
                                   error:function(error,status){
                                   window.wizSpinner.hide();
                                   navigator.notification.alert("error1"+error.responseText);
                                   }
                                   });
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          window.wizSpinner.hide();
                          console.log("error2**************"+error);
                          navigator.notification.alert("error2"+JSON.stringify(error));
                          });
                   
                   
                   
                   }
                   }
                   else if(agentmethod=="PUT"){
//                   navigator.notification.alert($('#tst').get(0).files[0]);
//                   console.log($('#tst').get(0).files[0]);
                   if(image){
                   
                   cordova.exec(function(response){
                                $.ajax({
                                       type: "GET",
                                       url: "http://build.myappbuilder.com/api/subscribers.json",
                                       data: {"api_key":appKey},
                                       cache: false,
                                       success:function(response){
                                       window.wizSpinner.hide();
                                       //                          $scope.imagelist();
                                       agentdata=response;
                                       $scope.agents=response;
                                       image = undefined;
                                       $state.reload();
                                       $scope.addagentModal.hide();
                                       
                                       },
                                       error:function(error,status){
                                       window.wizSpinner.hide();
//                                       image = undefined;
                                       navigator.notification.alert("error1"+error.responseText);
                                       }
                                       });
                                
                                }, function(error){
                                window.wizSpinner.hide();
                                navigator.notification.alert("error1"+error.responseText);
                                
                                }, "ImageCompress", "imageCompress", ["90", "90", "avatar", image, "http://build.myappbuilder.com/api/subscribers.json?", "put", { api_key: appKey,id:agentid,firstname:$('#fname').val(),lastname:$('#lname').val(),username:$('#email').val(),email:$('#email').val(),phone:$('#phone').val()}])
                   }
                   else{
//                   navigator.notification.alert($('#email').val());
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey,"firstname":$('#fname').val(),"id":agentid,"lastname":$('#lname').val(),"username":$('#email').val(),"email":$('#email').val(),"phone":$('#phone').val()},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 window.wizSpinner.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 $state.reload();
                                 $scope.addagentModal.hide();
                                 
                                 },
                                 error:function(error,status){
                                 window.wizSpinner.hide();
                                 navigator.notification.alert("error1"+error.responseText)
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert("error2"+error.responseText)
                          }
                          });
                   }
    

                   
                   }
                   
//                                      $.ajax({
//                                             type: "POST",
//                                             url: "http://build.myappbuilder.com/api/subscribers.json",
//                                            data: {"api_key":appKey,"subscriber[firstname]":$('#fname').val(),"subscriber[lastname]":$('#lname').val(),"subscriber[username]":$('#email').val(),"subscriber[email]":$('#email').val(),"subscriber[phone]":$('#phone').val(),"subscriber[avatar]":$('#avatar').val()},
//                                             cache: false,
//                                             success:function(response){
//                                             $.ajax({
//                                                    type: "GET",
//                                                    url: "http://build.myappbuilder.com/api/subscribers.json",
//                                                    data: {"api_key":appKey},
//                                                    cache: false,
//                                                    success:function(response){
//                                                    window.wizSpinner.hide();
//                                                    //                          $scope.imagelist();
//                                                    agentdata=response;
//                                                    $scope.agents=response;
//                                                    $state.reload();
//                                                    $scope.addagentModal.hide();
//                   
//                                                    },
//                                                    error:function(error,status){
//                                                    window.wizSpinner.hide();
//                                                    navigator.notification.alert("error1"+error.responseText)
//                                                    }
//                                                    });
//                                             
//                                             
//                                             },
//                                            error:function(error,status){
//                                             window.wizSpinner.hide();
//                                             navigator.notification.alert("error2"+error.responseText)
//                                             }
//                                             });
                   
                   };
                   
                   //$scope.audioText.title = appChapter;
                   
                   
                   
                   $scope.videoUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                   $scope.videoModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.videoModal.show();
                   }
                   
                   }else{
                   navigator.notification.alert('Please Enter Your Content Title!',alertDismissed,'Realtors','done');
                   }
                   }
                   
                   
                   
                   $scope.imagelist = function(){
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          console.log("*************"+JSON.stringify(response));
                          buttonArray = response;
                          contentVideo = '';
                          buttonDeleteArray = [];
                          //                          navigator.notification.alert(chapterTitle+','+contentTitle);
                          for (var i = 0; i < buttonArray.length; i++) {
                          for (var j = 0; j < buttonArray[i].elements.length; j++) {
                          
                          if(elementId == buttonArray[i].elements[j].id){
                          if(buttonArray[i].first_paragraph_type == "default"){
                          console.log("*************"+JSON.stringify(buttonArray[i].elements[j].images));
                          $scope.buttonDeleteArray = buttonArray[i].elements[j].images;
                          
                          
                          }
                          }
                          }
                          }
                          navigator.notification.alert($scope.buttonDeleteArray);
                          //                              $scope.buttonDeleteArray = buttonDeleteArray;
                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   };
                   
                   
                   $('#video').click(function(){
                                     
                                     cordova.exec(function(e){
                                                  alert(e);
                                                  }, function(e){alert(e);}, "ImageCompress", "imageCompress", [""])
                                     
                                     });
                   
                   $scope.create_video = function(){
//                   navigator.notification.alert("error11: "+$('input[name="video"]').get(0).files[0]);
                   
                   if(image){
                   
                   for(var i=0;i<buttonArray.length;i++){
                   
                   if(buttonArray[i].id == buttonId ){
                   
                   var formData1 = new FormData();
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   var letter = (chapterTitle).charAt(0).toUpperCase();
                   
                   formData1.append('image', image);
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                                      });
                   
                   cordova.exec(function(response){
                                console.log(JSON.stringify(response));
//                                $('#video').val('');
                                $ionicModal.fromTemplateUrl('new_video.html',{
                                                            scope: $scope,
                                                            animation: 'slide-in-up'
                                                            }).then(function(modal) {
                                                                    $scope.videoModal = modal;
                                                                    });
                                $scope.videoModal.hide();
                                $ionicLoading.hide();
                                image = undefined;
                                $scope.imagelist();
                                }, function(error){
                                $ionicLoading.hide();
//                                image = undefined;
                                navigator.notification.alert("error: "+error.responseText);
                                }, "ImageCompress", "imageCompress", ["300", "280", "image", image, "http://build.myappbuilder.com/api/elements/images.json?", "POST", { api_key: appKey,id:elementId}]);
                   
                   
                   }
                   }
                   }else{
                   
                   
                   var alertPopup = $ionicPopup.alert({
                                                      title: 'Realtors',
                                                      template: 'Please Choose Images!'
                                                      });
                   alertPopup.then(function(res) {
                                   //console.log('Thank you for not eating my delicious ice cream cone');
                                   });
                   
                   }
                   }
                   
                   $scope.addcontentBack = function(){
                   if(editData == "Edit"){
                   editData = "";
                   $state.go('previewContent');
                   }else{
                   $state.go('previewSubTitle');
                   }
                   }
                   
                   $scope.elementCreateSubmitFtn1 = function(){
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   var datatag=$scope.contentCreate.elementTag;
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = '';
                   var myPopup
                   console.log("**************************"+$scope.contentCreate.elementAdditional_field);
                   
                   if(editData == 'Edit'){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   editData = "";
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   }
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          console.log(JSON.stringify(response))
                          elementId = response.id;
                          
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error123: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1233: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 //                                 $state.go('previewSubTitle');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error123: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1233: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 //                                 $state.go('previewSubTitle');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          }
                          
                          //                          $.ajax({
                          //                                 type: "GET",
                          //                                 url: "http://build.myappbuilder.com/api/users.json",
                          //                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                          //                                 cache: false,
                          //                                 success:function(response){
                          //                                 data = response;
                          //                                 $ionicLoading.hide();
                          //                                 appList=[];
                          //                                 //                                 for(var i=0;i<response.apps.length;i++){
                          //                                 //                 if(response.apps[i].description=="News"){
                          //                                 //                 appList.push(response.apps[i]);
                          //                                 //                 }
                          //                                 //
                          //                                 //                 }
                          //                                 $scope.count(response.apps.length);
                          //
                          //
                          //                                 },
                          //                                 error:function(error,status){
                          //                                 $ionicLoading.hide();
                          //                                 navigator.notification.alert(error.responseText);
                          //                                 }
                          //                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert("error: "+error.responseText);
                          }
                          });
                   };
                   
                   var editData = "notEdit";
                   $scope.elementCreateSubmitFtn = function(){
//                   alert($scope.contentCreate.elementText);
                   if($scope.contentCreate.elementTitle==undefined){
                   $scope.contentCreate.elementTitle = '';
                   }
                   var datatag=$scope.contentCreate.elementTag;
                   console.log($scope.contentCreate.elementTag);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait...',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   console.log("**************************"+amenities);
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = ''
                   var myPopup;
                   console.log(elementId);
                   console.log($scope.contentCreate.tags);
                   
                   if(editData == "Edit"){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }
                   console.log(Square_Feetid);
                   console.log(JSON.stringify(formData2));
                   
                   
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          //console.log(JSON.stringify(response));
                          elementId = response.id;
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error123: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1233: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          }
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "";
                                 buttonArray = response;
                                 
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 $ionicLoading.hide();
                                 appList=[];
                                 $scope.count();
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText);
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert("error: "+error.responseText);
                          }
                          });
                   }
                   
                   });




var chapterTitle = '';
var chapterImage = '';
var chapterEdit = '';
control.controller('previewChapterCtrl', function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicSideMenuDelegate,$ionicActionSheet){
                   image = undefined;

                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   $scope.items = chapterArray;
                   $scope.appTitle = appTitle;
                   $scope.AppEditor = false;
                   $scope.bar_color=barcolor;
                   
                   $ionicLoading.hide();
                   
                   $scope.chapterClickFtn = function(id,title){
                   
                   buttonId = id;
                   chapterTitle = title;
                   $state.go('previewSubTitle');
                   };
                   
                   $scope.toggleLeft = function() {
                   $ionicSideMenuDelegate.toggleLeft();
                   };
                   
                   
                   $scope.count = function(){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert(JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.reload();
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert(JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert(JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          navigator.notification.alert(JSON.stringify(data));
                          
                          });
                   };
                   
                   
//                   $ionicScrollDelegate.scrollTop();
//                   var chapterArray = [];
//                   for (var i = 0; i < buttonArray.length; i++) {
//                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
//                   chapterArray.push(buttonArray[i]);
//                   //alert("Hi : "+buttonArray[i].title)
//                   }else{
//                   //alert("Hello : "+buttonArray[i].title)
//                   }
//                   
//                   }
                   
                   
//                   
//                   $scope.preChapterBack = function(){
//                   
//                   $.ajax({
//                          type: "GET",
//                          url: "http://build.myappbuilder.com/api/users.json",
//                          data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
//                          cache: false,
//                          success:function(response){
//                          data = response;
//                          // console.log(JSON.stringify(response));
//                          window.wizSpinner.hide();
//                          appList=[];
//                          
//                          $scope.count();
//                          
//                          },
//                          error:function(error,status){
//                          window.wizSpinner.hide();
//                          navigator.notification.alert(error.responseText);
//                          }
//                          });
//                   
//                   };
                   
                   
                   
                   $scope.appwallgoFun = function(){
                   $state.go('appWall');
                   };
                   
                   
                   
                   $scope.moveItem = function(item, fromIndex, toIndex) {
                   //Move the item in the array
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..'
                                      });
                   $scope.items.splice(fromIndex, 1);
                   $scope.items.splice(toIndex, 0, item);
                   var ids = $scope.items.map(function(btn){return btn.id});
                   
                   $http.post('http://build.myappbuilder.com/api/buttons/reorder.json', {api_key: appKey, ids: ids})
                   .success(function(data,status,headers,config){
                            $.ajax({
                                   type: "GET",
                                   url: "http://build.myappbuilder.com/api/buttons.json",
                                   data:{'api_key':appKey},
                                   cache: false,
                                   success:function(response){
                                   $ionicLoading.hide();
                                   console.log(JSON.stringify(response))
                                   buttonArray = response;
                                   
                                   },
                                   error:function(error,status){
                                   $ionicLoading.hide();
                                   navigator.notification.alert(error.responseText);
                                   }
                                   });
                            //        $ionicLoading.hide();
                            })
                   .error(function(data,status,headers,config){
                          navigator.notification.alert(data)
                          $ionicLoading.hide();
                          })
                   //console.log(item, fromIndex, toIndex)
                   };
                   
                   $scope.newChapterGo = function(){
                   chapterEdit = '';
                   $state.go('addButton');
                   };
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   };
                   
                   $scope.goHome = function(){
                   $state.go('listView');
                   };
                   
                   
                   
                   
                   $scope.deleteButton = function(id){
                   
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: 'Chapter Delete!',
                                                          template: 'Are you sure you want to delete this Chapter?'
                                                          });
                   
                   confirmPopup.then(function(res,event) {
                                     
                                     if(res==true) {
                                     
                                     window.wizSpinner.show(options);
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/buttons.json",
                                            data: {"api_key":appKey,"id":id},
                                            cache: false,
                                            success:function(response){
                                            $.ajax({
                                                   type: "GET",
                                                   url: "http://build.myappbuilder.com/api/buttons.json",
                                                   data:{'api_key':appKey},
                                                   cache: false,
                                                   success:function(response){
                                                   buttonArray= response;
                                                   chapterArray = [];
                                                   for (var i = 0; i < buttonArray.length; i++) {
                                                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                                   chapterArray.push(buttonArray[i]);
                                                   //alert("Hi : "+buttonArray[i].title)
                                                   }else{
                                                   //alert("Hello : "+buttonArray[i].title)
                                                   }
                                                   
                                                   }
                                                   $scope.items = chapterArray;
                                                   $state.reload();
                                                   setTimeout(function(){window.wizSpinner.hide();}, 1000);
                                                   
                                                   },
                                                   error:function(error,status){
                                                   window.wizSpinner.hide();
                                                   navigator.notification.alert(error.responseText);
                                                   }
                                                   });
                                            },
                                            error:function(error,status){
                                            window.wizSpinner.hide();
                                            navigator.notification.alert(error.responseText)
                                            }
                                            });
                                     } else {
                                     
                                     }
                                     });
                   
                   
                   };
                   
                   $scope.editButton = function(id,title,image){
                   chapterEdit = 'Edit';
                   buttonId = id;
                   chapterTitle = title;
                   chapterImage = image;
                   $state.go('addButton');
                   };
                   
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].app_image == null){
                   appList[i].app_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
                   $scope.createBook = function(){
                   listGrid = 'list';
                   $state.go("addBook");
                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit){
                   $ionicSideMenuDelegate.toggleLeft();
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                 success:function(response){
                                 bookAppwall = response;
                                 $ionicLoading.hide();
                                 $ionicScrollDelegate.scrollTop();
                                 chapterArray = [];
                                 for (var i = 0; i < buttonArray.length; i++) {
                                 if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                 chapterArray.push(buttonArray[i]);
                                 //alert("Hi : "+buttonArray[i].title)
                                 }else{
                                 //alert("Hello : "+buttonArray[i].title)
                                 }
                                 
                                 }
                                 
                                 $scope.items = chapterArray;
                                 //alert(JSON.stringify($scope.items));
                                 $scope.appTitle = appTitle;
                                 $scope.AppEditor = false;
                                 $state.go('previewChapter');
                                 },
                                 error:function(){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("Failure");
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   };
                   
                   $scope.listViewBack = function(){
                   $ionicSideMenuDelegate.toggleLeft();
//                   localStorage["login"] = [];
//                   
//                   openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
//                   window.localStorage.removeItem(twitterKey);
                   $state.go('login1');
                   //window.history.back();
                   }
                   
                   /*$scope.gridCallFtn = function(){
                    listGrid = 'grid';
                    $state.go('bookShelf');
                    }*/
                   
                   $scope.editApp = function(appId,title,desc,appImg){
                   
                   appKey = appId;
                   bookTitle = title;
                   bookDesc = desc;
                   bookImg = appImg;
                   $state.go('editBook');
                   }
                   
                   
                   $scope.EditBook = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.deleteApp = function(appId,item){
                   if(appId==defaultkey){
                   navigator.notification.alert('You cannot delete this root App!',function(){},item,'OK');
                   }
                   else{
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: item,
                                                          template: 'Are you sure you want to delete this Listing?'
                                                          });
                   confirmPopup.then(function(res) {
                                     if(res) {
                                     $ionicLoading.show({
                                                        content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                                        animation: 'fade-in',
                                                        showBackdrop: true,
                                                        maxWidth: 200,
                                                        showDelay: 0
                                                        });
                                     
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/apps.json",
                                            data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
                                            cache: false,
                                            success:function(response){
                                            
                                            //console.log(JSON.stringify(response));
                                            $.ajax({
                                                   type: "GET",
                                                   url: "http://build.myappbuilder.com/api/users.json",
                                                   data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                                   cache: false,
                                                   success:function(response){
                                                   data = response;
                                                   // console.log(JSON.stringify(response));
                                                   $ionicLoading.hide();
                                                   appList=[];
                                                   //                                 for(var i=0;i<response.apps.length;i++){
                                                   //                            if(response.apps[i].description=="News"){
                                                   //                            appList.push(response.apps[i]);
                                                   //                            }
                                                   //
                                                   //                            }
                                                   $scope.appKey.splice($scope.appKey.indexOf(item), 1);
                                                   $scope.count();
                                                   
                                                   },
                                                   error:function(error,status){
                                                   $ionicLoading.hide();
                                                   navigator.notification.alert(error.responseText);
                                                   }
                                                   });
                                            },
                                            error:function(error,status){
                                            $ionicLoading.hide();
                                            navigator.notification.alert("status")
                                            }
                                            });
                                     
                                     } else {
                                     console.log('You are not sure');
                                     }
                                     });
                   }
                   };
                 $state.reload();  
                   
                   });

control.controller('agentsCtrl', function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicSideMenuDelegate,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;
                   $ionicModal.fromTemplateUrl('agentdetail.html',{
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.agentdetailModal = modal;
                                                       });


                   
                   $scope.AgentBack = function() {
                   $state.go('previewChapter1');
                   };
                   
                   $scope.showdetails = function(val1,val2,val3,val4) {
//                   alert(val1);
                   $scope.avatar=val1;
                   $scope.name=val2;
                   $scope.email=val3;
                   $scope.phone=val4;
                   $scope.agentdetailModal.show();
                   };
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          window.wizSpinner.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          $state.reload();
                          console.log("1122445566sduh"+$scope.agents.length);
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   });

control.controller('previewChapterCtrl1', function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicSideMenuDelegate,$ionicActionSheet){
                   
                   $scope.bar_color=barcolor;
                   $scope.button_color=buttoncolor;
                   
                   $scope.toggleLeft = function() {
                   $ionicSideMenuDelegate.toggleLeft();
                   };
                   
                   $scope.toggleRight = function() {
                   $ionicSideMenuDelegate.toggleRight();
                   };
                   
                   
                   $scope.agentgo = function() {
                   $state.go('agents');
                   };
                   
                   
                   $ionicScrollDelegate.scrollTop();
                   var chapterArray = [];
                   for (var i = 0; i < buttonArray.length; i++) {
                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                   chapterArray.push(buttonArray[i]);
                   //alert("Hi : "+buttonArray[i].title)
                   }else{
                   //alert("Hello : "+buttonArray[i].title)
                   }
                   
                   }
                   
                   $scope.items = chapterArray;
                   //alert(JSON.stringify($scope.items));
                   $scope.appTitle = appTitle;
                   $scope.appImg = appImg;
                   $scope.appDesc = appDesc;
                   $scope.AppEditor = false;
                   $scope.bar_color=barcolor;
//                   $scope.count = function(val){
//                   //    navigator.notification.alert(val);
//                   window.wizSpinner.show(options);
//                   if(v < val){
//                   $.ajax({
//                          type: "GET",
//                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
//                          data:{'api_key':data.apps[v].api_key},
//                          cache: false,
//                          success:function(response1){
//                          console.log(response1.length);
//                          console.log(JSON.stringify(response1));
//                          console.log(v);
//                          for(var j=0;j<response1.length;j++){
//                          
//                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
//                          
//                          appList.push(data.apps[v]);
//                          }
//                          
//                          }
//                          v++;
//                          $scope.count(data.apps.length);
//                          console.log(JSON.stringify(appList));
//                          
//                          },
//                          error:function(error,status){
//                          
//                          navigator.notification.alert(error.responseText)
//                          }
//                          });
//                   }
//                   else{
//                   window.wizSpinner.hide();
//                   v = 0;
//                   localStorage["login"] = JSON.stringify(appkeyResult);
//                   if(listGrid == ''){
//                   $state.go('listView');
//                   }else if(listGrid == 'list'){
//                   $state.go('listView');
//                   }else{
//                   $state.go('listView');
//                   }
//                   }
//                   };
//                   $scope.preChapterBack = function(){
//                   
//                   $.ajax({
//                          type: "GET",
//                          url: "http://build.myappbuilder.com/api/users.json",
//                          data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
//                          cache: false,
//                          success:function(response){
//                          data = response;
//                          // console.log(JSON.stringify(response));
//                          window.wizSpinner.hide();
//                          appList=[];
//                          
//                          $scope.count();
//                          
//                          },
//                          error:function(error,status){
//                          window.wizSpinner.hide();
//                          navigator.notification.alert(error.responseText);
//                          }
//                          });
//                   
//                   }
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          window.wizSpinner.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          $state.reload();
                          console.log("1122445566sduh"+$scope.agents.length);

                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   
                   
                   $scope.appwallgoFun = function(){
                   $state.go('appWall1');
                   }
                   
                   
                   
//                   $scope.moveItem = function(item, fromIndex, toIndex) {
//                   //Move the item in the array
//                   $ionicLoading.show({
//                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..'
//                                      });
//                   $scope.items.splice(fromIndex, 1);
//                   $scope.items.splice(toIndex, 0, item);
//                   var ids = $scope.items.map(function(btn){return btn.id});
//                   
//                   $http.post('http://build.myappbuilder.com/api/buttons/reorder.json', {api_key: appKey, ids: ids})
//                   .success(function(data,status,headers,config){
//                            $.ajax({
//                                   type: "GET",
//                                   url: "http://build.myappbuilder.com/api/buttons.json",
//                                   data:{'api_key':appKey},
//                                   cache: false,
//                                   success:function(response){
//                                   $ionicLoading.hide();
//                                   console.log(JSON.stringify(response))
//                                   buttonArray = response;
//                                   
//                                   },
//                                   error:function(error,status){
//                                   $ionicLoading.hide();
//                                   navigator.notification.alert(error.responseText);
//                                   }
//                                   });
//                            //        $ionicLoading.hide();
//                            })
//                   .error(function(data,status,headers,config){
//                          navigator.notification.alert(data)
//                          $ionicLoading.hide();
//                          })
//                   //console.log(item, fromIndex, toIndex)
//                   };
                   
//                   $scope.newChapterGo = function(){
//                   chapterEdit = '';
//                   $state.go('addButton');
//                   }
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.goHome = function(){
                   $state.go('listView1');
                   }
                   
                   $scope.chapterClickFtn = function(id,title){
                   buttonId = id;
                   chapterTitle = title;
                   for (var i = 0; i < buttonArray.length; i++) {
                   if(buttonId == buttonArray[i].id){
                   elementArray = buttonArray[i].elements;
                   console.log(JSON.stringify(buttonArray[i].elements));
                   }
                   }
                   if(elementArray.length==1){
                   $scope.subTitClickFtn(elementArray[0].id,elementArray[0].title);
                   }
                   else{
                   $state.go('previewSubTitle1');
                   }
                   
                   }
                   
                   $scope.subTitClickFtn = function(id,title){
                   amenities=[];
                   elementId = id;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data:{'api_key':appKey,'id':elementId},
                          cache: false,
                          success:function(response){
                          for(var i=0;i<response.length;i++){
                          amenities.push(response[i].name);
                          //                          if(i==0){
                          //                          amenities = response[i].name;
                          //                          }
                          //                          else{
                          //                          amenities = amenities+','+response[i].name;
                          //                          }
                          }
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   for (var i = 0; i < elementArray.length; i++) {
                   if(id == elementArray[i].id){
                   
                   contentText = elementArray[i].text;
                   contentTitle = elementArray[i].title;
                   //        contentPrice = elementArray[i].price;
                   imagelist = elementArray[i].images;
                   
                   
                   contentAdditional_field = elementArray[i].additional_field;
                   if(elementArray[i].custom_values[0].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[0].value;
                   House_Conditionid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[0].value;
                   Square_Feetid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Address"){
                   Address = elementArray[i].custom_values[0].value;
                   Addressid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Price"){
                   contentPrice = elementArray[i].custom_values[0].value;
                   contentPriceid = elementArray[i].custom_values[0].id;
                   }
                   
                   if(elementArray[i].custom_values[1].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[1].value;
                   House_Conditionid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[1].value;
                   Square_Feetid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Address"){
                   Address = elementArray[i].custom_values[1].value;
                   Addressid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Price"){
                   contentPrice = elementArray[i].custom_values[1].value;
                   contentPriceid = elementArray[i].custom_values[1].id;
                   }
                   
                   if(elementArray[i].custom_values[2].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[2].value;
                   House_Conditionid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[2].value;
                   Square_Feetid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Address"){
                   Address = elementArray[i].custom_values[2].value;
                   Addressid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Price"){
                   contentPrice = elementArray[i].custom_values[2].value;
                   contentPriceid = elementArray[i].custom_values[2].id;
                   }
                   
                   if(elementArray[i].custom_values[3].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[3].value;
                   House_Conditionid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[3].value;
                   Square_Feetid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Address"){
                   Address = elementArray[i].custom_values[3].value;
                   Addressid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Price"){
                   contentPrice = elementArray[i].custom_values[3].value;
                   contentPriceid = elementArray[i].custom_values[3].id;
                   }
                   
                   
                   }
                   }
                   console.log(Square_Feet);
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   for (var j = 0; j < buttonArray[i].elements.length; j++) {
                   
                   if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                   if(buttonArray[i].first_paragraph_type == "video"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].video.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].video.thumbnail+');background-size:100% 100%;"><div align="center"><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<video src="'+buttonArray[i].elements[0].video.url+'" controls="" style="cursor: default; "></video><br />' ;
                   }else if(buttonArray[i].first_paragraph_type == "audio"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].audio.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].audio.thumbnail+');background-size:100% 100%;"><div align="center" ><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<audio src="'+buttonArray[i].elements[0].audio.url+'" controls="" style="cursor: default; "></audio><br />' ;
                   }
                   }
                   }
                   }
                   //alert(contentVideo)
                   $state.go('previewContent1');
                   }
                   
                   
//                   $scope.deleteButton = function(id){
//                   
//                   var confirmPopup = $ionicPopup.confirm({
//                                                          title: 'Chapter Delete!',
//                                                          template: 'Are you sure you want to delete this Chapter?'
//                                                          });
//                   
//                   confirmPopup.then(function(res,event) {
//                                     
//                                     if(res) {
//                                     
//                                     window.wizSpinner.show(options);
//                                     $.ajax({
//                                            type: "DELETE",
//                                            url: "http://build.myappbuilder.com/api/buttons.json",
//                                            data: {"api_key":appKey,"id":id},
//                                            cache: false,
//                                            success:function(response){
//                                            $.ajax({
//                                                   type: "GET",
//                                                   url: "http://build.myappbuilder.com/api/buttons.json",
//                                                   data:{'api_key':appKey},
//                                                   cache: false,
//                                                   success:function(response){
//                                                   buttonArray= response;
//                                                   chapterArray = [];
//                                                   for (var i = 0; i < buttonArray.length; i++) {
//                                                   if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
//                                                   chapterArray.push(buttonArray[i]);
//                                                   //alert("Hi : "+buttonArray[i].title)
//                                                   }else{
//                                                   //alert("Hello : "+buttonArray[i].title)
//                                                   }
//                                                   
//                                                   }
//                                                   $scope.items = chapterArray;
//                                                   $state.reload();
//                                                   setTimeout(function(){window.wizSpinner.hide();}, 1000);
//                                                   
//                                                   },
//                                                   error:function(error,status){
//                                                   window.wizSpinner.hide();
//                                                   navigator.notification.alert(error.responseText);
//                                                   }
//                                                   });
//                                            },
//                                            error:function(error,status){
//                                            window.wizSpinner.hide();
//                                            navigator.notification.alert(error.responseText)
//                                            }
//                                            });
//                                     } else {
//                                     
//                                     }
//                                     });
//                   
//                   
//                   }
                   
//                   $scope.editButton = function(id,title,image){
//                   chapterEdit = 'Edit';
//                   buttonId = id;
//                   chapterTitle = title;
//                   chapterImage = image;
//                   $state.go('addButton');
//                   }
                   
                   
                   
                   
                   
//                   $scope.count = function(val){
//                   //    navigator.notification.alert(val);
//                   window.wizSpinner.show(options);
//                   if(v < val){
//                   $.ajax({
//                          type: "GET",
//                          url: "http://build.myappbuilder.com/api/book_custom_fields.json",
//                          data:{'api_key':data.apps[v].api_key},
//                          cache: false,
//                          success:function(response1){
//                          console.log(response1.length);
//                          console.log(JSON.stringify(response1));
//                          console.log(v);
//                          for(var j=0;j<response1.length;j++){
//                          
//                          if(response1[j].key=="AppType" && response1[j].value=="Real Estate"){
//                          
//                          appList.push(data.apps[v]);
//                          }
//                          
//                          }
//                          v++;
//                          $scope.count(data.apps.length);
//                          console.log(JSON.stringify(appList));
//                          
//                          },
//                          error:function(error,status){
//                          
//                          navigator.notification.alert(error.responseText)
//                          }
//                          });
//                   }
//                   else{
//                   window.wizSpinner.hide();
//                   v = 0;
//                   
//                   $state.reload();
//                   }
//                   };
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.AppEditor =false;
                   for(var i =0;i<appList.length;i++){
                   if(appList[i].app_image == null){
                   appList[i].app_image = "img/book.png";
                   }
                   }
                   //console.log(JSON.stringify(appList))
                   
                   $scope.appKey = appList;
                   console.log(appList);
                   
//                   $scope.createBook = function(){
//                   listGrid = 'list';
//                   $state.go("addBook");
//                   }
                   
                   $scope.listViewClickFtn = function(appId,appTit,desc,img){
                   
                   buttonArray = [];
                   bookAppwall = [];
                   appKey = appId;
                   appTitle = appTit;
                   appDesc = desc;
                   appImg = img;
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appId},
                          cache: false,
                          success:function(response){
                          
                          console.log(JSON.stringify(response))
                          buttonArray = response;
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/apps/general.json",
                                 data:{'api_key':appId},
                                 cache: false,
                                 success:function(response1){
                                 console.log('**************123456*************'+response1.bar_color);
                                 console.log(JSON.stringify(response1));
                                 
                                 barcolor = 'bar-'+response1.bar_color;
                                 buttoncolor = 'button-'+response1.bar_color;
                                 $scope.bar_color=barcolor;
                                 $scope.button_color=buttoncolor;
                                 
                                 $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json', type:"GET",data:{'api_key':appKey},
                                        success:function(response){
                                        bookAppwall = response;
                                        $ionicLoading.hide();
                                        $ionicScrollDelegate.scrollTop();
                                        var chapterArray = [];
                                        for (var i = 0; i < buttonArray.length; i++) {
                                        if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                        chapterArray.push(buttonArray[i]);
                                        //alert("Hi : "+buttonArray[i].title)
                                        }else{
                                        //alert("Hello : "+buttonArray[i].title)
                                        }
                                        
                                        }
                                        
                                        $scope.items = chapterArray;
                                        //alert(JSON.stringify($scope.items));
                                        $scope.appTitle = appTitle;
                                        $scope.appImg = appImg;
                                        $scope.appDesc = appDesc;
                                        $scope.AppEditor = false;
                                        $.ajax({
                                               type: "GET",
                                               url: "http://build.myappbuilder.com/api/subscribers.json",
                                               data: {"api_key":appKey},
                                               cache: false,
                                               success:function(response){
                                               //                          window.wizSpinner.hide();
                                               //                          $scope.imagelist();
                                               agentdata=response;
                                               $scope.agents=response;
                                               $state.go('previewChapter1');
                                               console.log("1122445566sduh"+$scope.agents.length);
                                               
                                               
                                               },
                                               error:function(error,status){
                                               window.wizSpinner.hide();
                                               navigator.notification.alert(error.responseText)
                                               }
                                               });
                                        
                                        },
                                        error:function(){
                                        $ionicLoading.hide();
                                        navigator.notification.alert("Failure");
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   }
                   
                   $scope.listViewBack = function(){
                   localStorage["login"] = [];
                   
                   openFB.revokePermissions(function() {console.log('Permissions revoked');},function(error){console.log(error.message);});
                   window.localStorage.removeItem(twitterKey);
                   $state.go('login1');
                   //window.history.back();
                   }
                   
                   /*$scope.gridCallFtn = function(){
                    listGrid = 'grid';
                    $state.go('bookShelf');
                    }*/
                   
//                   $scope.editApp = function(appId,title,desc,appImg){
//                   
//                   appKey = appId;
//                   bookTitle = title;
//                   bookDesc = desc;
//                   bookImg = appImg;
//                   $state.go('editBook');
//                   }
                   
                   
//                   $scope.EditBook = function(){
//                   if($scope.AppEditor == false){
//                   $scope.AppEditor = true;
//                   }else{
//                   $scope.AppEditor =false;
//                   }
//                   }
                   
//                   $scope.deleteApp = function(appId,item){
//                   var confirmPopup = $ionicPopup.confirm({
//                                                          title: 'Real Estate Delete!',
//                                                          template: 'Are you sure you want to delete this Real Estate?'
//                                                          });
//                   confirmPopup.then(function(res) {
//                                     if(res) {
//                                     $ionicLoading.show({
//                                                        content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
//                                                        animation: 'fade-in',
//                                                        showBackdrop: true,
//                                                        maxWidth: 200,
//                                                        showDelay: 0
//                                                        });
//                                     
//                                     $.ajax({
//                                            type: "DELETE",
//                                            url: "http://build.myappbuilder.com/api/apps.json",
//                                            data:{'api_key':appkeyResult.api_key,'book_api_key':appId},
//                                            cache: false,
//                                            success:function(response){
//                                            
//                                            //console.log(JSON.stringify(response));
//                                            $.ajax({
//                                                   type: "GET",
//                                                   url: "http://build.myappbuilder.com/api/users.json",
//                                                   data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
//                                                   cache: false,
//                                                   success:function(response){
//                                                   data = response;
//                                                   // console.log(JSON.stringify(response));
//                                                   $ionicLoading.hide();
//                                                   appList=[];
//                                                   //                                 for(var i=0;i<response.apps.length;i++){
//                                                   //                            if(response.apps[i].description=="News"){
//                                                   //                            appList.push(response.apps[i]);
//                                                   //                            }
//                                                   //
//                                                   //                            }
//                                                   $scope.appKey.splice($scope.appKey.indexOf(item), 1);
//                                                   $scope.count(response.apps.length);
//                                                   
//                                                   },
//                                                   error:function(error,status){
//                                                   $ionicLoading.hide();
//                                                   navigator.notification.alert(error.responseText);
//                                                   }
//                                                   });
//                                            },
//                                            error:function(error,status){
//                                            $ionicLoading.hide();
//                                            navigator.notification.alert("status")
//                                            }
//                                            });
//                                     
//                                     } else {
//                                     console.log('You are not sure');
//                                     }
//                                     });
//                   }
                   
                   
                   });


var contentTitle = '';
var contentText = '';
var contentImages = '';
var contentPrice = '';
var contentAdditional_field = '';
var amenities=[];
var House_Conditionid = '';
var Addressid = '';
var Square_Feetid = '';
var contentPriceid = '';
var House_Condition = '';
var Address = '';
var Square_Feet = '';
var contentVideo = "";
var imagelist=[];
control.controller('previewSubTitleCtrl',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   contentVideo = "";
                   if(bookAppwall.button_wall == '0'){
                   $scope.buttonAppWall = false;
                   }else if(bookAppwall.button_wall == '1'){
                   $scope.buttonAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   if(buttonId == buttonArray[i].id){
                   elementArray = buttonArray[i].elements;
                   console.log(JSON.stringify(buttonArray[i].elements));
                   }
                   }
                   //console.log(contentVideo.length);
                   
                   
                   $scope.elementArray = elementArray;
                   $scope.appTitle = appTitle;
                   $scope.chapterTitle = chapterTitle;
                   $scope.AppEditor = false;
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
                   $scope.newContentGo = function(){
                   elementId ='';
                   contentTitle = '';
                   $state.go('addElement');
                   }
                   
                   $scope.subTitileBack = function(){
                   $state.go('previewChapter');
                   }
                   
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.subTitClickFtn = function(id,title){
                   amenities=[];
                   elementId = id;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data:{'api_key':appKey,'id':elementId},
                          cache: false,
                          success:function(response){
                          for(var i=0;i<response.length;i++){
                          amenities.push(response[i].name);
                          //                          if(i==0){
                          //                          amenities = response[i].name;
                          //                          }
                          //                          else{
                          //                          amenities = amenities+','+response[i].name;
                          //                          }
                          }
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   for (var i = 0; i < elementArray.length; i++) {
                   if(id == elementArray[i].id){
                   
                   contentText = elementArray[i].text;
                   contentTitle = elementArray[i].title;
                   //        contentPrice = elementArray[i].price;
                   imagelist = elementArray[i].images;
                   
                   
                   contentAdditional_field = elementArray[i].additional_field;
                   if(elementArray[i].custom_values[0].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[0].value;
                   House_Conditionid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[0].value;
                   Square_Feetid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Address"){
                   Address = elementArray[i].custom_values[0].value;
                   Addressid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Price"){
                   contentPrice = elementArray[i].custom_values[0].value;
                   contentPriceid = elementArray[i].custom_values[0].id;
                   }
                   
                   if(elementArray[i].custom_values[1].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[1].value;
                   House_Conditionid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[1].value;
                   Square_Feetid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Address"){
                   Address = elementArray[i].custom_values[1].value;
                   Addressid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Price"){
                   contentPrice = elementArray[i].custom_values[1].value;
                   contentPriceid = elementArray[i].custom_values[1].id;
                   }
                   
                   if(elementArray[i].custom_values[2].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[2].value;
                   House_Conditionid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[2].value;
                   Square_Feetid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Address"){
                   Address = elementArray[i].custom_values[2].value;
                   Addressid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Price"){
                   contentPrice = elementArray[i].custom_values[2].value;
                   contentPriceid = elementArray[i].custom_values[2].id;
                   }
                   
                   if(elementArray[i].custom_values[3].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[3].value;
                   House_Conditionid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[3].value;
                   Square_Feetid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Address"){
                   Address = elementArray[i].custom_values[3].value;
                   Addressid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Price"){
                   contentPrice = elementArray[i].custom_values[3].value;
                   contentPriceid = elementArray[i].custom_values[3].id;
                   }
                   
                   
                   }
                   }
                   console.log(Square_Feet);
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   for (var j = 0; j < buttonArray[i].elements.length; j++) {
                   
                   if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                   if(buttonArray[i].first_paragraph_type == "video"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].video.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].video.thumbnail+');background-size:100% 100%;"><div align="center"><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<video src="'+buttonArray[i].elements[0].video.url+'" controls="" style="cursor: default; "></video><br />' ;
                   }else if(buttonArray[i].first_paragraph_type == "audio"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].audio.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].audio.thumbnail+');background-size:100% 100%;"><div align="center" ><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<audio src="'+buttonArray[i].elements[0].audio.url+'" controls="" style="cursor: default; "></audio><br />' ;
                   }
                   }
                   }
                   }
                   //alert(contentVideo)
                   $state.go('previewContent');
                   }
                   
                   
                   $scope.deleteContent = function(id){
                   
                   elementId = id;
                   var confirmPopup = $ionicPopup.confirm({
                                                          title: 'Real Estate Content Delete!',
                                                          template: 'Are you sure you want to delete this Real Estate Content?'
                                                          });
                   confirmPopup.then(function(res) {
                                     if(res) {
                                     window.wizSpinner.show(options);
                                     $.ajax({
                                            type: "DELETE",
                                            url: "http://build.myappbuilder.com/api/elements.json",
                                            data: {"api_key":appKey,"id":elementId},
                                            cache: false,
                                            success:function(response){
                                            $.ajax({
                                                   type: "GET",
                                                   url: "http://build.myappbuilder.com/api/buttons.json",
                                                   data:{'api_key':appKey},
                                                   cache: false,
                                                   success:function(response){
                                                   buttonArray = response;
                                                   window.wizSpinner.hide();
                                                   $state.go('previewChapter');
                                                   
                                                   },
                                                   error:function(error,status){
                                                   window.wizSpinner.hide();
                                                   navigator.notification.alert(error.responseText);
                                                   }
                                                   });
                                            },
                                            error:function(error,status){
                                            window.wizSpinner.hide();
                                            navigator.notification.alert(error.responseText)
                                            }
                                            });
                                     } else {
                                     console.log('You are not sure');
                                     }
                                     });
                   
                   
                   }
                   
                   $scope.buttonAppwallgoFun = function(){
                   $state.go('buttonAppWall');
                   }
                   
                   
                   });

control.controller('previewSubTitleCtrl1',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   contentVideo = "";
                   if(bookAppwall.button_wall == '0'){
                   $scope.buttonAppWall = false;
                   }else if(bookAppwall.button_wall == '1'){
                   $scope.buttonAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   if(buttonId == buttonArray[i].id){
                   elementArray = buttonArray[i].elements;
                   console.log(JSON.stringify(buttonArray[i].elements));
                   }
                   }
                   //console.log(contentVideo.length);
                   
                   
                   $scope.elementArray = elementArray;
                   $scope.appTitle = appTitle;
                   $scope.chapterTitle = chapterTitle;
                   $scope.AppEditor = false;
                   
                   $scope.switchAppEditor = function(){
                   if($scope.AppEditor == false){
                   $scope.AppEditor = true;
                   }else{
                   $scope.AppEditor =false;
                   }
                   }
                   
//                   $scope.newContentGo = function(){
//                   contentTitle = '';
//                   $state.go('addElement');
//                   }
                   
                   $scope.subTitileBack = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.goHome = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.subTitClickFtn = function(id,title){
                   amenities=[];
                   elementId = id;
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data:{'api_key':appKey,'id':elementId},
                          cache: false,
                          success:function(response){
                          for(var i=0;i<response.length;i++){
                          amenities.push(response[i].name);
                          //                          if(i==0){
                          //                          amenities = response[i].name;
                          //                          }
                          //                          else{
                          //                          amenities = amenities+','+response[i].name;
                          //                          }
                          }
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText);
                          }
                          });
                   for (var i = 0; i < elementArray.length; i++) {
                   if(id == elementArray[i].id){
                   
                   contentText = elementArray[i].text;
                   contentTitle = elementArray[i].title;
                   //        contentPrice = elementArray[i].price;
                   imagelist = elementArray[i].images;
                   
                   
                   contentAdditional_field = elementArray[i].additional_field;
                   if(elementArray[i].custom_values[0].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[0].value;
                   House_Conditionid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[0].value;
                   Square_Feetid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Address"){
                   Address = elementArray[i].custom_values[0].value;
                   Addressid = elementArray[i].custom_values[0].id;
                   }
                   else if(elementArray[i].custom_values[0].title == "Price"){
                   contentPrice = elementArray[i].custom_values[0].value;
                   contentPriceid = elementArray[i].custom_values[0].id;
                   }
                   
                   if(elementArray[i].custom_values[1].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[1].value;
                   House_Conditionid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[1].value;
                   Square_Feetid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Address"){
                   Address = elementArray[i].custom_values[1].value;
                   Addressid = elementArray[i].custom_values[1].id;
                   }
                   else if(elementArray[i].custom_values[1].title == "Price"){
                   contentPrice = elementArray[i].custom_values[1].value;
                   contentPriceid = elementArray[i].custom_values[1].id;
                   }
                   
                   if(elementArray[i].custom_values[2].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[2].value;
                   House_Conditionid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[2].value;
                   Square_Feetid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Address"){
                   Address = elementArray[i].custom_values[2].value;
                   Addressid = elementArray[i].custom_values[2].id;
                   }
                   else if(elementArray[i].custom_values[2].title == "Price"){
                   contentPrice = elementArray[i].custom_values[2].value;
                   contentPriceid = elementArray[i].custom_values[2].id;
                   }
                   
                   if(elementArray[i].custom_values[3].title == "House Condition"){
                   House_Condition = elementArray[i].custom_values[3].value;
                   House_Conditionid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Square Feet"){
                   Square_Feet = elementArray[i].custom_values[3].value;
                   Square_Feetid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Address"){
                   Address = elementArray[i].custom_values[3].value;
                   Addressid = elementArray[i].custom_values[3].id;
                   }
                   else if(elementArray[i].custom_values[3].title == "Price"){
                   contentPrice = elementArray[i].custom_values[3].value;
                   contentPriceid = elementArray[i].custom_values[3].id;
                   }
                   
                   
                   }
                   }
                   console.log(Square_Feet);
                   
                   for (var i = 0; i < buttonArray.length; i++) {
                   for (var j = 0; j < buttonArray[i].elements.length; j++) {
                   
                   if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                   if(buttonArray[i].first_paragraph_type == "video"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].video.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].video.thumbnail+');background-size:100% 100%;"><div align="center"><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<video src="'+buttonArray[i].elements[0].video.url+'" controls="" style="cursor: default; "></video><br />' ;
                   }else if(buttonArray[i].first_paragraph_type == "audio"){
                   contentVideo += '<div onclick="videoPaly(this.id)" id="'+buttonArray[i].elements[0].audio.url+'" style="width:120px;background-image:url('+buttonArray[i].elements[0].audio.thumbnail+');background-size:100% 100%;"><div align="center" ><br /><br /><img src="img/playbtn.png" /><br /><br /></div></div><br />';
                   //contentVideo += '<audio src="'+buttonArray[i].elements[0].audio.url+'" controls="" style="cursor: default; "></audio><br />' ;
                   }
                   }
                   }
                   }
                   //alert(contentVideo)
                   $state.go('previewContent1');
                   }
                   
                   
//                   $scope.deleteContent = function(id){
//                   
//                   elementId = id;
//                   var confirmPopup = $ionicPopup.confirm({
//                                                          title: 'Real Estate Content Delete!',
//                                                          template: 'Are you sure you want to delete this Real Estate Content?'
//                                                          });
//                   confirmPopup.then(function(res) {
//                                     if(res) {
//                                     window.wizSpinner.show(options);
//                                     $.ajax({
//                                            type: "DELETE",
//                                            url: "http://build.myappbuilder.com/api/elements.json",
//                                            data: {"api_key":appKey,"id":elementId},
//                                            cache: false,
//                                            success:function(response){
//                                            $.ajax({
//                                                   type: "GET",
//                                                   url: "http://build.myappbuilder.com/api/buttons.json",
//                                                   data:{'api_key':appKey},
//                                                   cache: false,
//                                                   success:function(response){
//                                                   buttonArray = response;
//                                                   window.wizSpinner.hide();
//                                                   $state.go('previewChapter');
//                                                   
//                                                   },
//                                                   error:function(error,status){
//                                                   window.wizSpinner.hide();
//                                                   navigator.notification.alert(error.responseText);
//                                                   }
//                                                   });
//                                            },
//                                            error:function(error,status){
//                                            window.wizSpinner.hide();
//                                            navigator.notification.alert(error.responseText)
//                                            }
//                                            });
//                                     } else {
//                                     console.log('You are not sure');
//                                     }
//                                     });
//                   
//                   
//                   }
                   
                   $scope.buttonAppwallgoFun = function(){
                   $state.go('buttonAppWall1');
                   }
                   
                   
                   });

var editData = '';
function videoPaly(videoId){
    cordova.exec(null, null, "Echo", "echo", [videoId,"YES"]);
}

control.controller('previewContentCtrl',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$sce,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   
                   console.log('953697***'+appKey);
                   console.log('953697***'+contentPrice);
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data: {"api_key":appKey,"id":elementId},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          
                          $scope.contentTags = response;
                          $state.reload();
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert("error123: "+error.responseText);
                          }
                          });
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          window.wizSpinner.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                 data: {"api_key":appKey,"id":elementId},
                                 cache: false,
                                 success:function(response){
                                 agentlist=[];
                                 
                                 var res = response.meta_keywords.split(",");
                                 console.log("1122445566337*******"+res);
                                 console.log("1122445566337*******"+res.length);
                                 for (var i = 0; i < res.length; i++) {
                                 //                                 navigator.notification.alert(JSON.stringify(agentdata.length));
                                 for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                 //                                 navigator.notification.alert(JSON.stringify($scope.agents[j]));
                                 if(res[i]==$scope.agents[j].id){
                                 
                                 agentlist.push($scope.agents[j]);
                                 }
                                 }
                                 }
                                 $scope.agentslists=agentlist;
                                 $state.reload();
                                 console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                 console.log("1122445566337#########"+agentlist);
                                 },
                                 error:function(error,status){
                                 
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          //                          $state.reload();
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   
                   if(bookAppwall.element_wall == '0'){
                   $scope.elementAppWall = false;
                   }else if(bookAppwall.element_wall == '1'){
                   $scope.elementAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.appTitle = appTitle;
                   $scope.contentTitle = contentTitle;
                   $scope.contentText = contentText;
                   $scope.contentPrice = contentPrice;
                   $scope.contentSquarefeet = Square_Feet;
                   $scope.contentAddress = Address;
                   $scope.contentHousecondition = House_Condition;
                   $scope.contentAdditional_field = contentAdditional_field;
                   //  $scope.contentTags = amenities;
                   $scope.contentVideo = contentVideo;
                   $scope.buttonDeleteArray = imagelist;
                   $scope.deliberatelyTrustDangerousSnippet = function() {
                   return $sce.trustAsHtml($scope.contentText);
                   };
                   
                   $scope.deliberatelyTrustDangerousSnippet1 = function() {
                   return $sce.trustAsHtml($scope.contentVideo);
                   };
                   
                   $scope.goHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.preContentBack = function(){
                   $state.go('previewSubTitle');
                   }
                   
                   $scope.switchAppEditor = function(){
                   editData = 'Edit';
                   $state.go('addElement');
                   }
                   
                   $scope.addcontentBack = function(){
                   $state.go('previewContent');
                   }
                   
                   
                   $scope.elementAppwallgoFun = function(){
                   $state.go('elementAppWall');
                   }
                   
                   
                   });


control.controller('previewContentCtrl1',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$sce,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   
                   console.log('953697***'+appKey);
                   console.log('953697***'+contentPrice);
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/elements/tags.json",
                          data: {"api_key":appKey,"id":elementId},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          
                          $scope.contentTags = response;
                          $state.reload();
                          console.log(JSON.stringify(amenities));
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert("error123: "+error.responseText);
                          }
                          });
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          window.wizSpinner.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                 data: {"api_key":appKey,"id":elementId},
                                 cache: false,
                                 success:function(response){
                                 agentlist=[];
                                 
                                 var res = response.meta_keywords.split(",");
                                 console.log("1122445566337*******"+res);
                                 console.log("1122445566337*******"+res.length);
                                 for (var i = 0; i < res.length; i++) {
                                 //                                 navigator.notification.alert(JSON.stringify(agentdata.length));
                                 for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                 //                                 navigator.notification.alert(JSON.stringify($scope.agents[j]));
                                 if(res[i]==$scope.agents[j].id){
                                 
                                 agentlist.push($scope.agents[j]);
                                 }
                                 }
                                 }
                                 $scope.agentslists=agentlist;
                                 $state.reload();
                                 console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                 console.log("1122445566337#########"+agentlist);
                                 },
                                 error:function(error,status){
                                 
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          //                          $state.reload();
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   
                   if(bookAppwall.element_wall == '0'){
                   $scope.elementAppWall = false;
                   }else if(bookAppwall.element_wall == '1'){
                   $scope.elementAppWall = true;
                   }
                   
                   $ionicScrollDelegate.scrollTop();
                   $scope.appTitle = appTitle;
                   $scope.contentTitle = contentTitle;
                   $scope.contentText = contentText;
                   $scope.contentPrice = contentPrice;
                   $scope.contentSquarefeet = Square_Feet;
                   $scope.contentAddress = Address;
                   $scope.contentHousecondition = House_Condition;
                   $scope.contentAdditional_field = contentAdditional_field;
                   //  $scope.contentTags = amenities;
                   $scope.contentVideo = contentVideo;
                   $scope.buttonDeleteArray = imagelist;
                   $scope.deliberatelyTrustDangerousSnippet = function() {
                   return $sce.trustAsHtml($scope.contentText);
                   };
                   
                   $scope.deliberatelyTrustDangerousSnippet1 = function() {
                   return $sce.trustAsHtml($scope.contentVideo);
                   };
                   
                   $scope.goHome = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.preContentBack = function(){
                   if(elementArray.length==1){
                   $state.go('previewChapter1');
                   }
                   else{
                   $state.go('previewSubTitle1');
                   }
                   
                   }
                   
                   $scope.switchAppEditor = function(){
                   editData = 'Edit';
                   $state.go('addElement');
                   }
                   
                   $scope.addcontentBack = function(){
                   $state.go('previewContent1');
                   }
                   
                   
                   $scope.elementAppwallgoFun = function(){
                   $state.go('elementAppWall1');
                   }
                   
                   
                   });





/*---------------Add Button -----------*/

control.controller('addButtonCtrl',function($scope,$state,$ionicModal,$ionicLoading,$ionicScrollDelegate,$ionicPopup,$http,$ionicActionSheet){
                   image = undefined;
                   $scope.bar_color=barcolor;
                   $ionicScrollDelegate.scrollTop();
                   $scope.Title = appTitle;
                   $scope.chaptercreate ={}
                   
                   
                   $scope.chaptercreate.title = '';
                   $scope.chaptercreate.image = '';
                   $scope.appImageShow = false;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url(img/img_add.png)');
                   
                   $scope.addchapterBack = function(){
                   $state.go('previewChapter');
                   }
                   
                   function addChapterConfirm(){
                   $state.go('addContent');
                   
                   
                   }
                   
                   $scope.addchapterBack = function(){
                   $state.go('addBook');
                   }
                   
//                   $("#buttonImage").click(function(){
//                                           
//                                           cordova.exec(function(e){},function(e){alert(e);}, "ImageCompress","imageCompress", [""]);
//                                           });
//                   
//                   $("#buttonImage").change(function(){
//                                            
//                                            readURL1(this);
//                                            });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $scope.buttonSubmitFtn = function(){
                   if(($scope.chaptercreate.title) && image){
                   
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   cordova.exec(function(response){
                                
                                $ionicLoading.hide();
                                image = undefined;
                                buttonId = response.id;
                                appChapter = response.title;
                                chapterEdit = ''
                                buttonArray = response;
                                $scope.checkBox = {};
                                if(localStorage.checkedData == "checkedData"){
                                addChapterConfirm();
                                }else{
                                
                                var myPopup = $ionicPopup.alert({
                                                                template: '<div class="card"><div class="item item-text-wrap">Please Add Listing Contents and Images.</div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.data" value=""></label>Don\'t show Again</div></div>',
                                                                title: $scope.chaptercreate.title,
                                                                subTitle: 'Successfully created New Listing!',
                                                                scope: $scope,
                                                                
                                                                });
                                myPopup.then(function(res) {
                                             console.log('Tapped!', $scope.checkBox.data);
                                             if($scope.checkBox.data == true){
                                             localStorage.checkedData = "checkedData";
                                             }
                                             
                                             myPopup.close();
                                             addChapterConfirm();
                                             });
                                }
                                
                                },
                                function(error){
                                $ionicLoading.hide();
//                                image = undefined;
                                //alert("Successfully")
                                navigator.notification.alert("error: "+error.responseText);
                                }, "ImageCompress", "imageCompress", ["57", "57", "image", image, "http://build.myappbuilder.com/api/buttons.json?", "POST", { api_key: appKey,title:$scope.chaptercreate.title}])
                   
                   
                   
                   }else{
                   $ionicLoading.hide();
                   navigator.notification.alert("Enter New Listing Title and Image");
                   }
                   }
                   });





var agentdata=[];
var agentlist=[];

control.controller('editButtonCtrl',function($scope,$state,$ionicModal,$ionicPopup,$ionicLoading,$ionicScrollDelegate,$stateParams,$http,$ionicActionSheet){
                   image = undefined;
//                   alert("hi");
                   $scope.bar_color=barcolor;
                   $ionicScrollDelegate.scrollTop();
                   $scope.Title = appTitle;
                   $scope.chaptercreate ={}
                   buttonId = $stateParams.buttonId;
                   for(var i =0; i<buttonArray.length;i++){
                   if(buttonId == buttonArray[i].id){
                   $scope.chaptercreate.title = buttonArray[i].title;
                   $('#imageShow').attr({'src':buttonArray[i].image});
                   }
                   }
                   
                   // $scope.appImageShow = true;
                   
                   $scope.addchapterBack = function(){
                   $state.go('previewChapter');
                   }
                   
//                   $("#buttonImage").click(function(){
//                                           
//                                           cordova.exec(function(e){},function(e){alert(e);}, "ImageCompress","imageCompress", [""]);
//                                           });
//                   
//                   $("#buttonImage").change(function(){
//                                            
//                                            readURL1(this);
//                                            });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper1 > .btn-file-input1').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $scope.buttonSubmitFtn = function(){
                   if(($scope.chaptercreate.title) && image){
                   
                   
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   
                   cordova.exec(function(response){
                                $.ajax({
                                       type: "GET",
                                       url: "http://build.myappbuilder.com/api/buttons.json",
                                       data:{'api_key':appKey},
                                       cache: false,
                                       success:function(response){
                                       $ionicLoading.hide();
                                       chapterEdit = '';
                                       buttonArray = response;
                                       chapterArray = [];
                                       for (var i = 0; i < buttonArray.length; i++) {
                                       if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                       chapterArray.push(buttonArray[i]);
                                       //alert("Hi : "+buttonArray[i].title)
                                       }else{
                                       //alert("Hello : "+buttonArray[i].title)
                                       }
                                       
                                       }
                                       image = undefined;
                                       $state.go('previewChapter');
                                       
                                       },
                                       error:function(error,status){
                                       $ionicLoading.hide();
                                       navigator.notification.alert(error.responseText)
                                       }
                                       });
                                
                                },
                                function(error){
                                $ionicLoading.hide();
//                                image = undefined;
                                //alert("Successfully")
                                navigator.notification.alert("error: "+error.responseText);
                                }, "ImageCompress", "imageCompress", ["57", "57", "image", image, "http://build.myappbuilder.com/api/buttons.json?", "PUT", { api_key:appKey,id:buttonId,title:$scope.chaptercreate.title}])
                   
                   
                   
                   }
                   else if(($scope.chaptercreate.title) || ($scope.chaptercreate.title!='')){
                   
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data: {"api_key":appKey,"id":buttonId,"title":$scope.chaptercreate.title},
                          cache: false,
                          success:function(response){
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 chapterEdit = '';
                                 buttonArray = response;
                                 chapterArray = [];
                                 for (var i = 0; i < buttonArray.length; i++) {
                                 if((buttonArray[i].first_paragraph_type == "default")||(buttonArray[i].first_paragraph_type == null)){
                                 chapterArray.push(buttonArray[i]);
                                 //alert("Hi : "+buttonArray[i].title)
                                 }else{
                                 //alert("Hello : "+buttonArray[i].title)
                                 }
                                 
                                 }
                                 image = undefined;
                                 $state.go('previewChapter');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   }
                   else{
                   $ionicLoading.hide();
                   navigator.notification.alert("Enter New Listing Title");
                   }
                   }
                   
                   
                   });




function alertDismissed(){
}
var buttonDeleteArray = [];
var createButtonId;
var agentmethod;
var agentid;
var avatar=[];
control.controller('addElementCtrl',function($scope,$state,$ionicModal,$ionicPopup,$ionicLoading,$ionicScrollDelegate,$sce,$http,$ionicActionSheet){
                   image = undefined;
                   if(elementId==''){
                   editData = "";
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          window.wizSpinner.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   }
                   else{
                   editData = "Edit";
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey},
                          cache: false,
                          success:function(response){
                          //                          window.wizSpinner.hide();
                          //                          $scope.imagelist();
                          agentdata=response;
                          $scope.agents=response;
                          
                          console.log("1122445566sduh"+$scope.agents.length);
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                 data: {"api_key":appKey,"id":elementId},
                                 cache: false,
                                 success:function(response){
                                 agentlist=[];
                                 agentid=[];
                                 
                                 var res = response.meta_keywords.split(",");
                                 
                                 console.log("1122445566337*******"+res);
                                 console.log("1122445566337*******"+res.length);
                                 for (var i = 0; i < res.length; i++) {
                                 //                                 navigator.notification.alert(JSON.stringify(agentdata.length));
                                 for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                 //                                 navigator.notification.alert(JSON.stringify($scope.agents[j]));
                                 if(res[i]==$scope.agents[j].id){
                                 
                                 agentlist.push($scope.agents[j]);
                                 agentid.push($scope.agents[j].id);
                                 }
                                 }
                                 }
                                 $scope.addAgent.id = agentid;
                                 $scope.agentslists=agentlist;
                                 $state.reload();
                                 console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                 console.log("1122445566337#########"+agentlist);
                                 },
                                 error:function(error,status){
                                 
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          //                          $state.reload();
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   }
                   
                   $scope.bar_color=barcolor;
                   $scope.addAgent = {
                   id : []
                   };
                   $scope.addagent={};
                   var imageField_name;
                   $ionicScrollDelegate.scrollTop();
                   var chapterTitletxt = appTitle+":"+chapterTitle;
                   $scope.appChapter = chapterTitletxt;
                   $scope.contentCreate = {};
                   $scope.contentCreate.elementText = '';
                   $scope.contentVideo = contentVideo;
                   //alert(chapterTitle+" : "+contentTitle)
                   buttonDeleteArray = [];
                   
                   
                   
                   $scope.buttonDeleteArray = imagelist;
                   
                   $scope.deliberatelyTrustDangerousSnippet = function(url) {
                   return $sce.trustAsHtml(url);
                   };
                   
                   $scope.buttonDeletevideo = function(btnId){
                   window.wizSpinner.show(options);
                   $.ajax({
                          type: "DELETE",
                          url: "http://build.myappbuilder.com/api/elements/images.json",
                          data: {"api_key":appKey,"element_id":elementId,"id":btnId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $scope.imagelist();
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   }
                   
                   $scope.tinymceOptions = {
                   
                   menubar: false,
                   theme: "modern",
                   plugins: [
                             "advlist autolink lists link image  charmap print preview anchor",
                             "searchreplace wordcount visualblocks visualchars code fullscreen",
                             "emoticons textcolor",
                             ],
                   
                   toolbar1: "insertfile undo redo | styleselect | bold italic | bullist numlist outdent indent | alignleft aligncenter alignright alignjustify forecolor backcolor",
                   
                   file_browser_callback: function(field_name, url, type, win) {
                   
                   $('#width').attr("type","number");
                   $('#height').attr("type","number");
                   $('#imageSelect').click();
                   imageField_name = field_name;
                   //alert($('input[name="width"]').val());
                   $('#width').blur(function(){
                                    
                                    if($('#width').val() == ''){
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }else if($('#width').val() <= 320){
                                    }else{
                                    
                                    $('#width').val("150");
                                    $('#height').val('');
                                    }
                                    });
                   $('#height').blur(function(){
                                     if($('#height').val() <= 320){
                                     $('#height').val('150');
                                     }
                                     });
                   },
                   image_advtab: true,
                   height: "200px",
                   width: "100%",
                   resize: true,
                   };
                   
                   
                   
                   $("#imageSelect").change(function(event){
                                            
                                            $('#imageSelect').off('click');
                                            event.preventDefault();
                                            window.wizSpinner.show(options);
                                            
                                            var formDataKey ;
                                            var formDataId ;
                                            if(elementId){
                                            formDataKey = appKey;
                                            formDataId = elementId;
                                            }else{
                                            formDataKey = 'd4b2e8f5473bd5023797436ce9556620';
                                            formDataId = '2188';
                                            }
                                            cordova.exec(function(e){
                                                         // alert(e)
                                                         $('#'+imageField_name).val(e);
                                                         $('#width').val("150");
                                                         window.wizSpinner.hide();
                                                         },function(e){navigator.notification.alert(e);window.wizSpinner.hide();},"EchoimageUploads" , "echoimageUploads",[formDataKey,formDataId,"Image"]);
                                            
                                            
                                            
                                            
                                            });
                   
                   
                   
                   
                   
                   $ionicModal.fromTemplateUrl('new_video.html',{
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.videoModal = modal;
                                                       });
                   $ionicModal.fromTemplateUrl('addnew_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.addagentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_agent.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.agentModal = modal;
                                                       });
                   
                   $ionicModal.fromTemplateUrl('new_audio.html', {
                                               scope: $scope,
                                               animation: 'slide-in-up'
                                               }).then(function(modal) {
                                                       $scope.audioModal = modal;
                                                       });
                   
                   //$scope.audioText.title = contentTitle;
                   
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   
                   
                   $scope.showActionsheet2 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess2, onFail2, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess2(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper6 > .btn-file-input6').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail2(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $scope.editagent = function(val1,val2,val3,val4,val5){
                   $scope.addagentModal.show();
                   agentmethod="PUT";
                   agentid = val1;
                   if(val2==null){
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url("img/avatar.png")');
                   }
                   else{
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+val2+')');
                   }
                   
                   
                   var name = val3.split("   ");
                  
                   $('#fname').val(name[0]);
                   $('#lname').val(name[1].trim());
                   $('#email').val(val4);
                   $('#phone').val(val5);
                   
                   };
                   
                   
                   $scope.addnewagentshowFtn = function(){
                   $scope.addagentModal.show();
                   agentmethod="POST";
                   
                   $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url(img/avatar.png)');
                   $('#fname').val('');
                   $('#lname').val('');
                   $('#email').val('');
                   $('#phone').val('');
                   
                  

                   };
                   
                                    function readURL5(input) {
                                    if (input.files && input.files[0]) {
                   
                                    var reader = new FileReader();
                                    
                                    reader.onload = function (e) {
                                    $('.file-input-wrapper5 > .btn-file-input5').css('background-image', 'url('+e.target.result+')');
                   
                                    }
                                    
                                    reader.readAsDataURL(input.files[0]);
                  
                                    }
                                    }
                   
                   $scope.agentUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                   $scope.agentModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.agentModal.show();
                   }
                   
                   }else{
                   navigator.notification.alert('Please Enter Your Content Title!',alertDismissed,'Realtors','done');
                   }
                   };
                   
                   $scope.addagentFtn = function(){
//                   navigator.notification.alert($scope.addAgent.id);
                   console.log($scope.addAgent.id.length);
                   if($scope.addAgent.id!=''){
//                   $scope.addAgent.id = '';
                   $scope.addAgentid = '';
                   window.wizSpinner.show(options);
                   for (var i = 0; i < $scope.addAgent.id.length; i++) {
                   if(i==0){
                   $scope.addAgentid = $scope.addAgent.id[i];
                   }
                   else{
                   $scope.addAgentid = $scope.addAgentid+","+$scope.addAgent.id[i];
                   }
                   }
                   console.log($scope.addAgentid);
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                          data: {"api_key":appKey,"id":elementId,"meta_keywords":$scope.addAgentid},
                          cache: false,
                          success:function(response){
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 //                          window.wizSpinner.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 
                                 console.log("1122445566sduh"+$scope.agents.length);
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/elements/meta-tags.json",
                                        data: {"api_key":appKey,"id":elementId},
                                        cache: false,
                                        success:function(response){
                                        agentlist=[];
                                        
                                        var res = response.meta_keywords.split(",");
                                        console.log("1122445566337*******"+res);
                                        console.log("1122445566337*******"+res.length);
                                        for (var i = 0; i < res.length; i++) {
                                        //                                 navigator.notification.alert(JSON.stringify(agentdata.length));
                                        for (var j = 0; j < JSON.stringify(agentdata.length); j++) {
                                        //                                 navigator.notification.alert(JSON.stringify($scope.agents[j]));
                                        if(res[i]==$scope.agents[j].id){
                                        
                                        agentlist.push($scope.agents[j]);
                                        }
                                        }
                                        }
                                        $scope.agentslists=agentlist;
                                        $state.reload();
                                        window.wizSpinner.hide();
                                        console.log("1122445566337#####****"+JSON.stringify(agentdata));
                                        console.log("1122445566337#########"+agentlist);
                                        navigator.notification.alert('Selected agent(s) has been added succesfully!',function(){$scope.agentModal.hide();},chapterTitle,'Done');
                                        },
                                        error:function(error){
                                        window.wizSpinner.hide();
                                        navigator.notification.alert(JSON.stringify(error))
                                        }
                                        });
                                 
                                 
                                 },
                                 error:function(error){
                                 window.wizSpinner.hide();
                                 navigator.notification.alert(JSON.stringify(error))
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   }
                   else{
                   navigator.notification.alert("Please select an Agent");
                   }
                  
//                   alert($scope.addAgent.id);
                   };
                   
                   
                   
                   
                   $scope.addnewagentFtn = function(){
                   console.log($scope.addagent.fname);
                   console.log(appKey);
                   //                   navigator.notification.alert($scope.addagent.fname);
                   window.wizSpinner.show(options);

                   if(agentmethod=="POST"){
                   console.log(image);
                   if(image){
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   formData11.append('subscriber[firstname]',$('#fname').val());
                   formData11.append('subscriber[lastname]',$('#lname').val());
                   formData11.append('subscriber[username]',$('#email').val());
                   formData11.append('subscriber[email]',$('#email').val());
                   formData11.append('subscriber[phone]',$('#phone').val());
//                   formData11.append('subscriber[avatar]',image);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                            console.log(agentid);
                            cordova.exec(function(response){
                                         
                                         $.ajax({
                                                type: "GET",
                                                url: "http://build.myappbuilder.com/api/subscribers.json",
                                                data: {"api_key":appKey},
                                                cache: false,
                                                success:function(response){
                                                window.wizSpinner.hide();
                                                //                          $scope.imagelist();
                                                agentdata=response;
                                                $scope.agents=response;
                                                image = undefined;
                                                $state.reload();
                                                $scope.addagentModal.hide();
                                                
                                                },
                                                error:function(error,status){
                                                window.wizSpinner.hide();
                                                navigator.notification.alert("error1"+error.responseText);
                                                }
                                                });
                                         
                                         }, function(error){
                                         window.wizSpinner.hide();
                                         navigator.notification.alert("error2"+error.responseText);
                                         
                                         }, "ImageCompress", "imageCompress", ["90", "90", "avatar", image, "http://build.myappbuilder.com/api/subscribers.json?", "put", { api_key: appKey,id:agentid,firstname:$('#fname').val(),lastname:$('#lname').val(),username:$('#email').val(),email:$('#email').val(),phone:$('#phone').val()}])
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          window.wizSpinner.hide();
                          console.log("error2**************"+error);
                          navigator.notification.alert("error2"+JSON.stringify(error));
                          });
                   


                   }
                   else{
                   var formData11 = new FormData();
                   formData11.append('api_key',appKey);
                   formData11.append('subscriber[firstname]',$('#fname').val());
                   formData11.append('subscriber[lastname]',$('#lname').val());
                   formData11.append('subscriber[username]',$('#email').val());
                   formData11.append('subscriber[email]',$('#email').val());
                   formData11.append('subscriber[phone]',$('#phone').val());
                   //                   formData11.append('subscriber[avatar]',image);
                   
                   
                   $http.post('http://build.myappbuilder.com/api/subscribers.json',formData11,{
                              transformRequest:angular.identity,
                              headers:{'Content-Type':undefined}
                              })
                   .success(function(response,status,headers,config){
                            agentid=response.id;
                            console.log(agentid);
                            $.ajax({
                                   type: "GET",
                                   url: "http://build.myappbuilder.com/api/subscribers.json",
                                   data: {"api_key":appKey},
                                   cache: false,
                                   success:function(response){
                                   window.wizSpinner.hide();
                                   //                          $scope.imagelist();
                                   agentdata=response;
                                   $scope.agents=response;
                                   image = undefined;
                                   $state.reload();
                                   $scope.addagentModal.hide();
                                   
                                   },
                                   error:function(error,status){
                                   window.wizSpinner.hide();
                                   navigator.notification.alert("error1"+error.responseText);
                                   }
                                   });
                            
                            
                            })
                   .error(function(error,status,headers,config){
                          window.wizSpinner.hide();
                          console.log("error2**************"+error);
                          navigator.notification.alert("error2"+JSON.stringify(error));
                          });
                   
                   
                   
                   }
                   }
                   else if(agentmethod=="PUT"){
//                   navigator.notification.alert($('#tst').get(0).files[0]);
//                   console.log($('#tst').get(0).files[0]);
                   if(image){
                   
                   cordova.exec(function(response){
                                $.ajax({
                                       type: "GET",
                                       url: "http://build.myappbuilder.com/api/subscribers.json",
                                       data: {"api_key":appKey},
                                       cache: false,
                                       success:function(response){
                                       window.wizSpinner.hide();
                                       //                          $scope.imagelist();
                                       agentdata=response;
                                       $scope.agents=response;
                                       image = undefined;
                                       $state.reload();
                                       $scope.addagentModal.hide();
                                       
                                       },
                                       error:function(error,status){
                                       window.wizSpinner.hide();
                                       navigator.notification.alert("error1"+error.responseText);
                                       }
                                       });
                                
                                }, function(error){
                                window.wizSpinner.hide();
//                                image = undefined;
                                navigator.notification.alert("error2"+error.responseText);
                                
                                }, "ImageCompress", "imageCompress", ["90", "90", "avatar", image, "http://build.myappbuilder.com/api/subscribers.json?", "put", { api_key: appKey,id:agentid,firstname:$('#fname').val(),lastname:$('#lname').val(),username:$('#email').val(),email:$('#email').val(),phone:$('#phone').val()}])
                   }
                   else{
//                   navigator.notification.alert($('#email').val());
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/subscribers.json",
                          data: {"api_key":appKey,"firstname":$('#fname').val(),"id":agentid,"lastname":$('#lname').val(),"username":$('#email').val(),"email":$('#email').val(),"phone":$('#phone').val()},
                          cache: false,
                          success:function(response){
                          console.log(JSON.stringify(response));
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/subscribers.json",
                                 data: {"api_key":appKey},
                                 cache: false,
                                 success:function(response){
                                 window.wizSpinner.hide();
                                 //                          $scope.imagelist();
                                 agentdata=response;
                                 $scope.agents=response;
                                 $state.reload();
                                 $scope.addagentModal.hide();
                                 
                                 },
                                 error:function(error,status){
                                 window.wizSpinner.hide();
                                 navigator.notification.alert("error1"+error.responseText)
                                 }
                                 });
                          
                          
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          navigator.notification.alert("error2"+error.responseText)
                          }
                          });
                   }
    

                   
                   }
                   

                   
                   };
                   
                   
                   $scope.videoUploadFtn = function(){
                   if($scope.contentCreate.elementTitle){
                   if(contentTitle){
                   $scope.videoModal.show();
                   }else{
                   
                   contentTitle = $scope.contentCreate.elementTitle;
                   $scope.elementCreateSubmitFtn1();
                   $scope.videoModal.show();
                   }
                   
                   }else{
                   navigator.notification.alert('Please Enter Your Content Title!',alertDismissed,'Realtors','done');
                   }
                   }
                   
                   
                   
                   $scope.imagelist = function(){
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/buttons.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          //                          $ionicLoading.hide();
                          console.log("*************"+JSON.stringify(response));
                          buttonArray = response;
                          contentVideo = '';
                          buttonDeleteArray = [];
                          for (var i = 0; i < buttonArray.length; i++) {
                          for (var j = 0; j < buttonArray[i].elements.length; j++) {
                          
                          if((chapterTitle == buttonArray[i].title) && (contentTitle == buttonArray[i].elements[j].title)){
                          if(buttonArray[i].first_paragraph_type == "default"){
                          console.log("*************"+JSON.stringify(buttonArray[i].elements[j].images));
                          $scope.buttonDeleteArray = buttonArray[i].elements[j].images;
                          
                          
                          }
                          }
                          }
                          }
                          
                          //                              $scope.buttonDeleteArray = buttonDeleteArray;
                          $state.reload();
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   };
                   
                   
                   $('#video').click(function(){
                                     
                                     cordova.exec(function(e){
                                                  alert(e);
                                                  }, function(e){alert(e);}, "ImageCompress", "imageCompress", [""])
                                     
                                     });
                   
                   $scope.create_video = function(){
                   
//                   navigator.notification.alert("error12: "+$('input[name="video"]').get(0).files[0]);
                   if(image){
                   
                   for(var i=0;i<buttonArray.length;i++){
                   
                   if(buttonArray[i].id == buttonId ){
                   
                   var formData1 = new FormData();
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   var letter = (chapterTitle).charAt(0).toUpperCase();
                   
                   formData1.append('image', image);
                   $ionicLoading.show({
                                      template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'
                                      });
                   
                   cordova.exec(function(response){
                                console.log(JSON.stringify(response));
//                                $('#video').val('');
                                $ionicModal.fromTemplateUrl('new_video.html',{
                                                            scope: $scope,
                                                            animation: 'slide-in-up'
                                                            }).then(function(modal) {
                                                                    $scope.videoModal = modal;
                                                                    });
                                $scope.videoModal.hide();
                                image = undefined;
                                $ionicLoading.hide();
                                $scope.imagelist();
                                }, function(error){
                                $ionicLoading.hide();
//                                image = undefined;
                                navigator.notification.alert("error: "+error.responseText);
                                }, "ImageCompress", "imageCompress", ["300", "280", "image", image, "http://build.myappbuilder.com/api/elements/images.json?", "POST", { api_key: appKey,id:elementId}]);
                   
                   
                   }
                   }
                   }else{
                   
                   
                   var alertPopup = $ionicPopup.alert({
                                                      title: 'Realtors',
                                                      template: 'Please Choose Images!'
                                                      });
                   alertPopup.then(function(res) {
                                   //console.log('Thank you for not eating my delicious ice cream cone');
                                   });
                   
                   }
                   }
                   
                   $scope.addcontentBack = function(){
                   if(editData == "Edit"){
                   editData = "";
                   $state.go('previewContent');
                   }else{
                   $state.go('previewSubTitle');
                   }
                   }
                   
                   if(editData == "Edit"){
                   console.log(editData);
                   $scope.contentCreate.elementTitle = contentTitle;
                   $scope.contentCreate.elementText = contentText;
                   $scope.contentCreate.elementPrice = contentPrice;
                   $scope.contentCreate.elementSquarefeet = Square_Feet;
                   $scope.contentCreate.elementAddress = Address;
                   $scope.contentCreate.elementHousecondition = House_Condition;
                   $scope.contentCreate.elementAdditional_field = contentAdditional_field;
                   $scope.contentCreate.elementSquarefeet = Square_Feet;
                   $scope.contentCreate.elementAddress = Address;
                   $scope.contentCreate.elementHousecondition = House_Condition;
                   $scope.contentCreate.elementTag = amenities;
                   $scope.buttonDeleteArray = imagelist;
                   
                   
                   }else{
                   console.log(editData);
                   $scope.contentCreate.elementTitle = '';
                   $scope.contentCreate.elementText = '';
                   $scope.contentCreate.elementPrice = '';
                   $scope.contentCreate.elementSquarefeet = '';
                   $scope.contentCreate.elementAddress = '';
                   $scope.contentCreate.elementHousecondition = '';
                   $scope.contentCreate.elementAdditional_field = '';
                   $scope.contentCreate.elementSquarefeet = '';
                   $scope.contentCreate.elementAddress = '';
                   $scope.contentCreate.elementHousecondition = '';
                   $scope.contentCreate.elementTag = '';
                   $scope.buttonDeleteArray = '';
                   }
                   
                   
                   
                   $scope.elementCreateSubmitFtn1 = function(){
                   
                   var datatag=$scope.contentCreate.elementTag;
                   console.log($scope.contentCreate.elementTag);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait...',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   console.log("**************************"+amenities);
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = ''
                   var myPopup;
                   console.log(elementId);
                   console.log($scope.contentCreate.tags);
                   
                   if(editData == "Edit"){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
                   //                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
                   //                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }
                   console.log(Square_Feetid);
                   console.log(JSON.stringify(formData2));
                   
                   
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          //console.log(JSON.stringify(response));
                          elementId = response.id;
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error123: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1233: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/buttons.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        $ionicLoading.hide();
                                        editData = "Edit";
                                        buttonArray = response;
                                        
                                        
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        navigator.notification.alert(error.responseText)
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText);
                                 }
                                 });
                          
                          
                          
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          }
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/buttons.json",
                                 data:{'api_key':appKey},
                                 cache: false,
                                 success:function(response){
                                 $ionicLoading.hide();
                                 editData = "Edit";
                                 buttonArray = response;
                                 //                                 $state.go('previewSubTitle');
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText)
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert("error: "+error.responseText);
                          }
                          });
                   };
                   
                   
                   console.log(elementId);
                   $scope.elementCreateSubmitFtn = function(){
//                   alert($scope.contentCreate.elementText);
                   var datatag=$scope.contentCreate.elementTag;
                   console.log($scope.contentCreate.elementTag);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait...',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   for(var i=0;i<datatag.length;i++){
                   //                   amenities.push(response[i].name);
                   if(i==0){
                   amenities = datatag[i].text;
                   }
                   else{
                   amenities = amenities+','+datatag[i].text;
                   }
                   }
                   console.log("**************************"+amenities);
                   var formData1 = new FormData();
                   var formData2 = new FormData();
                   var formData3 = new FormData();
                   var formData4 = new FormData();
                   var formData5 = new FormData();
                   var formData6 = new FormData();
                   var methodData ='';
                   var urlData = ''
                   var myPopup;
                   console.log(elementId);
                   console.log($scope.contentCreate.tags);
                   
                   if(editData == "Edit"){
                   urlData ='http://build.myappbuilder.com/api/elements/update_default.json'
                   methodData = "PUT"
                   formData1.append('api_key',appKey);
                   formData1.append('id',elementId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }else{
                   urlData ='http://build.myappbuilder.com/api/elements/create_default.json'
                   methodData = "POST"
                   formData1.append('api_key',appKey);
                   formData1.append('button_id',buttonId);
                   formData1.append('title',$scope.contentCreate.elementTitle);
                   formData1.append('text',$scope.contentCreate.elementText);
//                   formData1.append('price',$scope.contentCreate.elementPrice);
                   formData1.append('additional_field',$scope.contentCreate.elementAdditional_field);
                   
                   }
                   console.log(Square_Feetid);
                   console.log(JSON.stringify(formData2));
                   
                   
                   
                   $.ajax({
                          type: methodData,
                          url: urlData,
                          data: formData1,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          //console.log(JSON.stringify(response));
                          elementId = response.id;
                          if(methodData == "POST"){
                          
                          formData2.append('api_key',appKey);
                          formData2.append('element_id',elementId);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('element_id',elementId);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('element_id',elementId);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('id',elementId);
                          formData5.append('tags',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('element_id',elementId);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/buttons.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        $ionicLoading.hide();
                                        editData = "Edit";
                                        buttonArray = response;
                                        $state.go('previewSubTitle');
                                        
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        navigator.notification.alert(error.responseText)
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText);
                                 }
                                 });
                          
                          
                          
                          }
                          else{
                          
                          formData2.append('api_key',appKey);
                          formData2.append('id',Square_Feetid);
                          formData2.append('title','Square Feet');
                          formData2.append('value',$scope.contentCreate.elementSquarefeet);
                          formData3.append('api_key',appKey);
                          formData3.append('id',Addressid);
                          formData3.append('title','Address');
                          formData3.append('value',$scope.contentCreate.elementAddress);
                          formData4.append('api_key',appKey);
                          formData4.append('id',House_Conditionid);
                          formData4.append('title','House Condition');
                          formData4.append('value',$scope.contentCreate.elementHousecondition);
                          formData5.append('api_key',appKey);
                          formData5.append('element_id',elementId);
                          formData5.append('value',amenities);
                          formData6.append('api_key',appKey);
                          formData6.append('id',contentPriceid);
                          formData6.append('title','Price');
                          formData6.append('value',$scope.contentCreate.elementPrice);
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/elements/tags.json',
                                 data: formData5,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error: "+error.responseText);
                                 }
                                 });
                          
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData2,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 Square_Feet = response.value;
                                 Square_Feetid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error123: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData3,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 Address = response.value;
                                 Addressid = response.id;
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1233: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData4,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 House_Condition = response.value;
                                 House_Conditionid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          $.ajax({
                                 type: methodData,
                                 url: 'http://build.myappbuilder.com/api/custom_values.json',
                                 data: formData6,
                                 cache: false,
                                 contentType: false,
                                 processData: false,
                                 success:function(response){
                                 console.log(JSON.stringify(response));
                                 
                                 contentPrice = response.value;
                                 contentPriceid = response.id;
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert("error1223: "+error.responseText);
                                 }
                                 });
                          }
                          
                          $.ajax({
                                 type: "GET",
                                 url: "http://build.myappbuilder.com/api/users.json",
                                 data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                 cache: false,
                                 success:function(response){
                                 data = response;
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/buttons.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        $ionicLoading.hide();
                                        editData = "Edit";
                                        buttonArray = response;
                                        $state.go('previewSubTitle');
                                        
                                        },
                                        error:function(error,status){
                                        $ionicLoading.hide();
                                        navigator.notification.alert(error.responseText)
                                        }
                                        });
                                 
                                 },
                                 error:function(error,status){
                                 $ionicLoading.hide();
                                 navigator.notification.alert(error.responseText);
                                 }
                                 });
                          
                          },
                          error:function(error,status){
                          $ionicLoading.hide();
                          navigator.notification.alert("error: "+error.responseText);
                          }
                          });
                   }
                   
                   });



control.controller('editBookCtrl',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate, $ionicActionSheet,$http){
                   image = undefined;
                   $ionicScrollDelegate.scrollTop();
                   $scope.appcreate = {};
                   $scope.book= {};
                   $scope.count = function(){
                   //    navigator.notification.alert(val);
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   $http({method: "GET", url:'key.txt', cache: false, params:{}})
                   .success(function(data){
                            defaultkey = data.trim();
                            appList=[];
                            $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':defaultkey}})
                            .success(function(data, status){
                                     //                                  alert(data.title);
                                     appId=defaultkey;
                                     appTit=data.title;
                                     appList.push(data);
                                     
                                     $http({method: "GET", url:'http://build.myappbuilder.com/api/book_custom_fields.json', cache: false, params:{'api_key':defaultkey}})
                                     .success(function(reskey){
                                              
                                              for(var j=0;j<reskey.length;j++){
                                              if(reskey[j].key=="keys"){
                                              $http({method: "GET", url:'http://build.myappbuilder.com/api/apps/general.json', cache: false, params:{'api_key':reskey[j].value}})
                                              .success(function(data, status){
                                                       
                                                       appList.push(data);
                                                       
                                                       })
                                              .error(function(data, status) {
                                                     alert("3"+JSON.stringify(data));
                                                     $ionicLoading.hide();
                                                     });
                                              }
                                              }
                                              $ionicLoading.hide();
                                              
                                              $state.go('listView');
                                              
                                              
                                              
                                              })
                                     .error(function(data, status) {
                                            $ionicLoading.hide();
                                            navigator.notification.alert("2"+JSON.stringify(data));
                                            
                                            });
                                     
                                     })
                            .error(function(data, status) {
                                   alert("1"+JSON.stringify(data));
                                   $ionicLoading.hide();
                                   });
                            
                            
                            })
                   .error(function(data, status) {
                          $ionicLoading.hide();
                          navigator.notification.alert(JSON.stringify(data));
                          
                          });
                   };
                   
                   
                   $scope.showActionsheet = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose Bar Color',
                                          buttons: [
                                                    { text: '<p><img src="img/light.png" style="align:left;"/>&nbsp;Light&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/stable.png" style=""/>&nbsp;Stable&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/positive.png" style=""/>&nbsp;Positive&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/calm.png" style=""/>&nbsp;Calm&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/balanced.png" style=""/>&nbsp;Balanced&nbsp;</p>' },
                                                    { text: '<p><img src="img/energized.png" style=""/>&nbsp;Energized</p>' },
                                                    { text: '<p><img src="img/assertive.png" style=""/>&nbsp;Assertive&nbsp;</p>' },
                                                    { text: '<p><img src="img/royal.png" style=""/>&nbsp;Royal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    { text: '<p><img src="img/dark.png" style=""/>&nbsp;Dark&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          barcolor = 'bar-light';
                                          $scope.book.bar_color = 'light';
                                          $scope.button_color='button-light';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==1){
                                          barcolor = 'bar-stable';
                                          $scope.book.bar_color = 'stable';
                                          $scope.button_color='button-stable';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==2){
                                          barcolor = 'bar-positive';
                                          $scope.book.bar_color = 'positive';
                                          $scope.button_color='button-positive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==3){
                                          barcolor = 'bar-calm';
                                          $scope.book.bar_color = 'calm';
                                          $scope.button_color='button-calm';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==4){
                                          barcolor = 'bar-balanced';
                                          $scope.book.bar_color = 'balanced';
                                          $scope.button_color='button-balanced';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==5){
                                          barcolor = 'bar-energized';
                                          $scope.book.bar_color = 'energized';
                                          $scope.button_color='button-energized';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==6){
                                          barcolor = 'bar-assertive';
                                          $scope.book.bar_color = 'assertive';
                                          $scope.button_color='button-assertive';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==7){
                                          barcolor = 'bar-royal';
                                          $scope.book.bar_color = 'royal';
                                          $scope.button_color='button-royal';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else if(index==8){
                                          barcolor = 'bar-dark';
                                          $scope.book.bar_color = 'dark';
                                          $scope.button_color='button-dark';
                                          $scope.bar_color=barcolor;
                                          $state.reload();
                                          }
                                          else{
                                          $state.reload();
                                          }
                                          
                                          return true;
                                          },
                                          destructiveButtonClicked: function() {
                                          console.log('DESTRUCT');
                                          return true;
                                          }
                                          });
                   };
                   
                   
                   $scope.addBookBack = function(){
                   $state.go('listView');
                   }
                   
                   $scope.appcreate.gridBookTitle = bookTitle;
                   $scope.appcreate.gridBookDesc = bookDesc;
                   if(bookImg){
                   $('#imageShow1').attr({'src':bookImg});
                   }
                   
                   function readURL(input) {
                   if (input.files && input.files[0]) {
                   var reader = new FileReader();
                   
                   reader.onload = function (e) {
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+e.target.result+')');
                   }
                   
                   reader.readAsDataURL(input.files[0]);
                   }
                   }
//                   $("#bookImage").click(function(){
//                                         cordova.exec(function(e){
//                                                      //                                                      alert(e);
//                                                      }, function(e){alert(e);}, "ImageCompress", "imageCompress", [""]);
//                                         });
//                   $("#bookImage").change(function(){
//                                          readURL(this);
//                                          });
                   
                   $scope.showActionsheet1 = function() {
                   
                   $ionicActionSheet.show({
                                          titleText: 'Choose',
                                          buttons: [
                                                    { text: 'Camera' },
                                                    { text: 'PhotoAlbum' },
                                                    ],
                                          
                                          cancelText: 'Cancel',
                                          cancel: function() {
                                          console.log('CANCELLED');
                                          },
                                          buttonClicked: function(index) {
                                          console.log('BUTTON CLICKED', index);
                                          if(index==0){
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.CAMERA,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          else{
                                          navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                                                                      destinationType: Camera.DestinationType.FILE_URI,sourceType : Camera.PictureSourceType.PHOTOLIBRARY,saveToPhotoAlbum: false,correctOrientation:true});
                                          return true;
                                          }
                                          
                                          }
                                          
                                          });
                   };
                   
                   function onSuccess(imageURI) {
                   image = imageURI;
                   $('.file-input-wrapper > .btn-file-input').css('background-image', 'url('+imageURI+')');
                   }
                   
                   function onFail(message) {
                   navigator.notification.alert('Failed because: ' + message);
                   }
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/apps/general.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response1){
                          console.log('**************123456*************'+response1.bar_color);
                          console.log(JSON.stringify(response1));
                          
                          barcolor = 'bar-'+response1.bar_color;
                          $scope.bar_color=barcolor;
                          $scope.book.bar_color=response1.bar_color;
                          $state.reload();
                          },
                          error:function(error,status){
                          
                          navigator.notification.alert(error.responseText)
                          }
                          });
                   
                   
                   $scope.colors = ['light', 'stable', 'positive', 'calm', 'balanced', 'energized', 'assertive', 'royal', 'dark'];
                   $scope.change_bar_color = function(){
                   barcolor = 'bar-'+$scope.book.bar_color;
                   $scope.bar_color=barcolor;
                   $state.reload();
                   }
                   $scope.change_button_color = function(){
                   $scope.button_color = 'button-'+$scope.book.button_color;
                   $state.reload();
                   }
                   
                   $scope.change_bar_button_color = function(){
                   if($scope.book.bar_button_color == ""){
                   $scope.bar_button_color = 'button-clear';
                   $state.reload();
                   }
                   else{
                   $scope.bar_button_color = 'button-'+$scope.book.bar_button_color;
                   $state.reload();
                   }
                   }
                   
                   $scope.createAppFtn = function(){
                   if(($scope.appcreate.gridBookTitle) && image){
                   $ionicLoading.show({
                                      content: '<i class="icon ion-loading-a"></i>&nbsp;Please Wait..',
                                      animation: 'fade-in',
                                      showBackdrop: true,
                                      maxWidth: 200,
                                      showDelay: 0
                                      });
                   if($scope.appcreate.gridBookDesc==undefined){
                   $scope.appcreate.gridBookDesc='';
                   }
                   
                   var formData = new FormData();
                   formData.append('api_key',appKey);
                   formData.append('title',$scope.appcreate.gridBookTitle);
                   formData.append('description',$scope.appcreate.gridBookDesc);
                   formData.append('bar_color',$scope.book.bar_color);
                   
                   console.log(JSON.stringify(formData));
                   
                   $.ajax({
                          type: "PUT",
                          url: "http://build.myappbuilder.com/api/apps/settings/general.json",
                          data:formData,
                          cache: false,
                          contentType: false,
                          processData: false,
                          success:function(response){
                          
                          cordova.exec(function(e){
                                       //                                alert(e);
                                       $ionicLoading.hide();
                                       $.ajax({
                                              type: "GET",
                                              url: "http://build.myappbuilder.com/api/users.json",
                                              data:{'api_key':appkeyResult.api_key,'id':appkeyResult.id},
                                              cache: false,
                                              success:function(response){
                                              data = response;
                                              $ionicLoading.hide();
                                              appList=[];
                                              image = undefined;
                                              $scope.count();
                                              
                                              },
                                              error:function(error,status){
                                              $ionicLoading.hide();
                                              //                                       image = undefined;
                                              navigator.notification.alert(error.responseText)
                                              }
                                              });
                                       
                                       }, function(error){
                                       
                                       $ionicLoading.hide();
                                       navigator.notification.alert(error.responseText);
                                       }, "ImageCompress", "imageCompress", ["114", "114", "app_image", image, "http://build.myappbuilder.com/api/apps/settings/general.json?", "put", { api_key: appKey,title:$scope.appcreate.gridBookTitle,bar_color:$scope.book.bar_color}]);
                          
                          },error:function(error){
                          $ionicLoading.hide();
                          navigator.notification.alert('error2'+error.responseText);
                          }
                          });
                   
                   
                   }
                   
                   else if($scope.appcreate.gridBookTitle!=''){
                   var formData = new FormData();
                   formData.append('api_key',appKey);
                   formData.append('title',$scope.appcreate.gridBookTitle);
                   formData.append('description',$scope.appcreate.gridBookDesc);
                   formData.append('bar_color',$scope.book.bar_color);

                   console.log(JSON.stringify(formData));

                               $.ajax({
                                     type: "PUT",
                                     url: "http://build.myappbuilder.com/api/apps/settings/general.json",
                                data:formData,
                                     cache: false,
                                     contentType: false,
                                     processData: false,
                                     success:function(response){
                                         $.ajax({
                                                 type: "GET",
                                                 url: "http://build.myappbuilder.com/api/users.json",
                                                 data:{"api_key":appkeyResult.api_key,"id":appkeyResult.id},
                                                 cache: false,
                                                 success:function(response){
                                                 data = response;
                                                     $ionicLoading.hide();
                                                appList=[];
                  
                                                $scope.count();
                   
                                                   },
                                                   error:function(error,status){
                                                     $ionicLoading.hide();
                                                     navigator.notification.alert('error1'+error.responseText)
                                                   }
                                         });
                   
                                   },error:function(error){
                                     $ionicLoading.hide();
                                     navigator.notification.alert('error2'+error.responseText);
                                   }
                               });
                   
                   }
                   
                   else{
                   navigator.notification.alert("Select Real Estate Image & Enter Real Estate Title");
                   }
                   }
                   });


var messages = "";

control.controller("appWallCtrl",function($scope,$state,$ionicLoading,$http,$ionicPopup){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   var button_wall = '';
                   var element_wall = '';
                   
                   $scope.appWallHome = function(){
                   $state.go('listView');
                   }
                   
                   $scope.appwallBack = function(){
                   $state.go('previewChapter');
                   }
                   
                   $scope.checkBox = [];
                   if((bookAppwall.button_wall == "0")&&(bookAppwall.element_wall == "0")){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = false;
                   }else if(bookAppwall.button_wall == "0"){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = true;
                   }else if(bookAppwall.element_wall == "0"){
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = false;
                   }else{
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = true;
                   }
                   
                   $scope.appwallSettings = function(){
                   var myPopup = $ionicPopup.show({
                                                  template: '<div class="card"><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.button" value=""></label>Each Chapter Can Have a Unique Wall </div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.element" value=""></label>Each Content Can Have a Unique Wall  </div></div><div style="width:100%;"><div style="width:50%;float:left;"><div style="width:50%;" class="button button-clear" ng-click="popupClose();"><img src="img/btn_cancel.png" style="width:100%;height:auto;"/></div></div><div style="width:50%;float:left;" ><div style="width:50%;float:right;" class="button button-clear " ng-click="popoupSave();"><img src="img/save.png" style="width:100%;height:auto;"/></div></div></div>',
                                                  title: 'AppWall Setting',
                                                  subTitle: $scope.appTitle,
                                                  scope: $scope,
                                                  
                                                  });
                   
                   $scope.popupClose=function() {
                   console.log('Tapped!', $scope.checkBox.element+" : "+$scope.checkBox.button);
                   myPopup.close();
                   }
                   
                   $scope.popoupSave = function(){
                   if(($scope.checkBox.button != false) && ($scope.checkBox.element != false)){
                   button_wall = "1";
                   element_wall = "1";
                   }else if($scope.checkBox.button != false){
                   button_wall = "1";
                   element_wall = "0";
                   }else if($scope.checkBox.element != false){
                   button_wall = "0";
                   element_wall = "1";
                   }else{
                   button_wall = "0";
                   element_wall = "0";
                   }
                   
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   $http.post('http://build.myappbuilder.com/api/app_wall_settings.json',{api_key: appKey,button_wall:button_wall,element_wall:element_wall})
                   .success(function(data,status,headers,config){
                            $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json',type:"GET",data:{'api_key':appKey},
                                   success:function(response){
                                   console.log(JSON.stringify(response));
                                   bookAppwall = response;
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   },
                                   error:function(){
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   }
                                   });
                            
                            })
                   .error(function(data,status,headers,config){
                          $ionicLoading.hide();
                          console.log(JSON.stringify(data));
                          myPopup.close();
                          })
                   
                   
                   }
                   
                   
                   }
                   
                   
                   $scope.messages = "";
                   $scope.messages.data="";
                   window.wizSpinner.show(options);
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          messages = response;
                          appWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login");
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   
                   
                   
                   });

control.controller("appWallCtrl1",function($scope,$state,$ionicLoading,$http,$ionicPopup,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   var button_wall = '';
                   var element_wall = '';
                   
                   $scope.appWallHome = function(){
                   $state.go('listView1');
                   }
                   
                   $scope.appwallBack = function(){
                   $state.go('previewChapter1');
                   }
                   
                   $scope.checkBox = [];
                   if((bookAppwall.button_wall == "0")&&(bookAppwall.element_wall == "0")){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = false;
                   }else if(bookAppwall.button_wall == "0"){
                   $scope.checkBox.button = false;
                   $scope.checkBox.element = true;
                   }else if(bookAppwall.element_wall == "0"){
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = false;
                   }else{
                   $scope.checkBox.button = true;
                   $scope.checkBox.element = true;
                   }
                   
                   $scope.appwallSettings = function(){
                   var myPopup = $ionicPopup.show({
                                                  template: '<div class="card"><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.button" value=""></label>Each Chapter Can Have a Unique Wall </div><div class="item item-checkbox"><label class="checkbox" ><input type="checkbox" ng-model="checkBox.element" value=""></label>Each Content Can Have a Unique Wall  </div></div><div style="width:100%;"><div style="width:50%;float:left;"><div style="width:50%;" class="button button-clear" ng-click="popupClose();"><img src="img/btn_cancel.png" style="width:100%;height:auto;"/></div></div><div style="width:50%;float:left;" ><div style="width:50%;float:right;" class="button button-clear " ng-click="popoupSave();"><img src="img/save.png" style="width:100%;height:auto;"/></div></div></div>',
                                                  title: 'AppWall Setting',
                                                  subTitle: $scope.appTitle,
                                                  scope: $scope,
                                                  
                                                  });
                   
                   $scope.popupClose=function() {
                   console.log('Tapped!', $scope.checkBox.element+" : "+$scope.checkBox.button);
                   myPopup.close();
                   }
                   
                   $scope.popoupSave = function(){
                   if(($scope.checkBox.button != false) && ($scope.checkBox.element != false)){
                   button_wall = "1";
                   element_wall = "1";
                   }else if($scope.checkBox.button != false){
                   button_wall = "1";
                   element_wall = "0";
                   }else if($scope.checkBox.element != false){
                   button_wall = "0";
                   element_wall = "1";
                   }else{
                   button_wall = "0";
                   element_wall = "0";
                   }
                   
                   $ionicLoading.show({template: '<i class="icon ion-loading-a"></i>&nbsp;Please wait...'});
                   $http.post('http://build.myappbuilder.com/api/app_wall_settings.json',{api_key: appKey,button_wall:button_wall,element_wall:element_wall})
                   .success(function(data,status,headers,config){
                            $.ajax({url:'http://build.myappbuilder.com/api/app_wall_settings.json',type:"GET",data:{'api_key':appKey},
                                   success:function(response){
                                   console.log(JSON.stringify(response));
                                   bookAppwall = response;
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   },
                                   error:function(){
                                   $ionicLoading.hide();
                                   myPopup.close();
                                   }
                                   });
                            
                            })
                   .error(function(data,status,headers,config){
                          $ionicLoading.hide();
                          console.log(JSON.stringify(data));
                          myPopup.close();
                          })
                   
                   
                   }
                   
                   
                   }
                   
                   
                   $scope.messages = "";
                   $scope.messages.data="";
                   window.wizSpinner.show(options);
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          messages = response;
                          appWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login");
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   
                   
                   
                   });



function appWallPostFun(){
    
    var bodyMgs = '';
    var mgs_id = [];
    var body = [];
    var created_at = [];
    var parent_id = [];
    var element_name = [];
    var button_name = [];
    var sender_name = [];
    var sender_id = [];
    var sender_avatar_url = [];
    var replyappend = '';
    var z = 0;
    var p = 0;
    //alert("msgLen:"+messages.length);
    if(messages.length > 0){
        $.each( messages, function( key, value ) {
               $.each( value, function( k, v ) {
                      if(k == "id"){
                      mgs_id.push(v);
                      }else if(k == "created_at"){
                      created_at.push(v);
                      }else if(k == "parent_id"){
                      parent_id.push(v);
                      }else if(k == "body"){
                      body.push(v);
                      }else if(k == "element_name"){
                      element_name.push(v);
                      }else if(k == "button_name"){
                      button_name.push(v);
                      }else if(k == "sender_name"){
                      sender_name.push(v);
                      }else if(k == "sender_id"){
                      sender_id.push(v);
                      }else if(k == 'sender_avatar_url'){
                      if(v == null){
                      v = 'img/face.png';
                      }
                      sender_avatar_url.push(v);
                      }
                      });
               });
    }else{
        bodyMgs = '<a><p align="justify" class="divback2"><font color="black" size="2">No Result Found</font></p></a>';
    }
    
    for(var i=0;i<body.length;i++){
        
        if(parent_id[i] == null){
            p=0;
            for(var j=0;j<body.length;j++){
                p = p+1;
                if(mgs_id[i] == parent_id[j]){
                    z= -1;
                    var k = parseInt(p)+z;
                    if(localStorage.sender_id == sender_id[k]){
                        if(element_name[k] != null && button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else if(button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else{
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }
                    }else{
                        if(element_name[k] != null && button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else if(button_name[k] != null){
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }else{
                            replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                        }
                    }
                }else{
                    
                }
                
            }
            
            if(localStorage.sender_id == sender_id[i]){
                if(element_name[i] != null && button_name[i] != null){
                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                    
                }
                
                else if(button_name[i] != null){
                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                    
                }else{
                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="deleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                    
                }
            }
//            else{
//                if(element_name[i] != null && button_name[i] != null){
//                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"><div style="width:100%"><div style="width:50%;float:left;"><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
//                    
//                }else if(button_name[i] != null){
//                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"><div style="width:100%"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
//                    
//                }
//                else{
//                    bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"><div style="width:100%"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="replyMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="replyHide bar bar-header item-input-inset" id="replyHide'+i+'" ><label class="item-input-wrapper"><input id="replymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:replymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
//                    
//                }
//                
//                
//            }
            
            else{
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><hr><div><p align="justify">'+body[i]+'</p><hr></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                
            }
            
            replyappend ='';
            
        }else{
        }
    }
    
    $('#appwallListview').append(bodyMgs).trigger('create');
    
    if($('.replyHide').is(':visible')){
        $('.replyHide').toggle();
    }else{
        
    }
    
    $(".replyMgs").click(function(){
                         replyMgsNo1 = (this.id).split('-');
                         replyMgsNo = mgs_id[replyMgsNo1[1]];
                         var replyHide = "replyHide"+replyMgsNo1[1];
                         $('#'+replyHide).toggle();
                         });
    
    $(".deleteMgs").click(function(){
                          window.wizSpinner.show(options);
                          var deleteMgsNo = (this.id).split('-');
                          //alert(appKey);
                          //alert(mgs_id[deleteMgsNo[1]]);
                          if(localStorage.appwallLoginData){
                          $.ajax({url:'http://build.myappbuilder.com/api/messages.json?api_key='+appKey+'&message_id='+mgs_id[deleteMgsNo[1]], 
                                 type:"DELETE",
                                 success:function(response){
                                 
                                 
                                 $.ajax({
                                        type: "GET",
                                        url: "http://build.myappbuilder.com/api/messages.json",
                                        data:{'api_key':appKey},
                                        cache: false,
                                        success:function(response){
                                        window.wizSpinner.hide();
                                        messages = response;
                                        $('#appwallListview').empty();
                                        appWallPostFun();
                                        },
                                        error:function(error,status){
                                        window.wizSpinner.hide();
                                        $ionicLoading.hide();
                                        var error = JSON.parse(error.responseText);
                                        if(error.error == "Unauthorized"){
                                        navigator.notification.alert("Please Login")
                                        }else {
                                        navigator.notification.alert("Login Error!");
                                        }
                                        }
                                        });
                                 },
                                 error:function(msg){ window.wizSpinner.hide(); navigator.notification.alert(JSON.stringify(msg));}
                                 });
                          }else{
                          // login();
                          }
                          });
    
    /*$("#textReplyMgs").click(function(event){
     event.preventDefault();
     replymessageFun();
     });*/
    
}

function replymessageFun(){
    if(localStorage.appwallLoginData){
        var replyarray = "replymessage"+replyMgsNo1[1];
        var replymessage = $('#'+replyarray).val();
        if(replymessage == ''){
            navigator.notification.alert("Please Enter Your Reply...");
        }else{
            window.wizSpinner.show(options);
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{'message[body]':replymessage,'message[parent_id]':replyMgsNo,'message[sender_id]':localStorage.sender_id,'api_key':appKey},
                   success:function(response){
                   
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $('#'+replyarray).val('');
                          messages = response;
                          $('#appwallListview').empty();
                          appWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ window.wizSpinner.hide(); alert("Failure");}
                   });
        }
    }else{
        // login();
    }
    
}



function postmessageFun(){
    if(localStorage.appwallLoginData){
        
        var postmessage = $('#postmessage').val();
        if(postmessage == ''){
            navigator.notification.alert("Please Enter Your Comments...");
        }else{
            window.wizSpinner.show(options);
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{'message[body]':postmessage,'message[sender_id]':localStorage.sender_id,'api_key':appKey},
                   success:function(response){
                   
                   $('#appwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey},
                          cache: false,
                          success:function(response){
                          $('#postmessage').val('');
                          window.wizSpinner.hide();
                          messages = response;
                          appWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          $ionicLoading.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ window.wizSpinner.hide(); alert("Failure");}
                   });
        }
    }else{
        //login();
    }
    
}


function relative_time(date_str) {
    if (!date_str) {return;}
    date_str = $.trim(date_str);
    date_str = date_str.replace(/\.\d\d\d+/,""); // remove the milliseconds
    date_str = date_str.replace(/-/,"/").replace(/-/,"/"); //substitute - with /
    date_str = date_str.replace(/T/," ").replace(/Z/," UTC"); //remove T and substitute Z with UTC
    date_str = date_str.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // +08:00 -> +0800
    var parsed_date = new Date(date_str);
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date(); //defines relative to what ..default is now
    var delta = parseInt((relative_to.getTime()-parsed_date)/1000);
    delta=(delta<2)?2:delta;
    var r = '';
    if (delta < 60) {
        r = delta + ' secs ago';
    } else if(delta < 120) {
        r = 'a min ago';
    } else if(delta < (45*60)) {
        r = (parseInt(delta / 60, 10)).toString() + ' mins ago';
    } else if(delta < (2*60*60)) {
        r = 'an hr ago';
    } else if(delta < (24*60*60)) {
        r = '' + (parseInt(delta / 3600, 10)).toString() + ' hrs ago';
    } else if(delta < (48*60*60)) {
        r = 'a day ago';
    } else {
        r = (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
    return '' + r;
}



control.controller("buttonAppWallCtrl",function($scope,$state,$ionicLoading,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   
                   $scope.appwallBack = function(){
                   $state.go('previewSubTitle');
                   }
                   
                   messages = '';
                   window.wizSpinner.show(options);
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   
                   
                   
                   });

control.controller("buttonAppWallCtrl1",function($scope,$state,$ionicLoading,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   
                   $scope.appwallBack = function(){
                   $state.go('previewSubTitle1');
                   }
                   
                   messages = '';
                   window.wizSpinner.show(options);
                   
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   
                   
                   
                   });


function ButtonAppWallPostFun(){
    
    var bodyMgs = '';
    var mgs_id = []; 
    var body = [];
    var created_at = [];
    var parent_id = []; 
    var element_name = [];
    var button_name =[];
    var sender_name = [];
    var sender_id = [];
    var sender_avatar_url = [];
    var replyappend ='';
    var z = 0;
    var p = 0;
    //alert("msgLen:"+messages.length);
    if(messages.length > 0){
        $.each( messages, function( key, value ) {
               $.each( value, function( k, v ) {
                      if(k == "id"){
                      mgs_id.push(v);
                      }else if(k == "created_at"){
                      created_at.push(v);
                      }else if(k == "parent_id"){
                      parent_id.push(v);
                      }else if(k == "body"){
                      body.push(v);
                      }else if(k == "element_name"){
                      element_name.push(v);
                      }else if(k == "button_name"){
                      button_name.push(v);
                      }else if(k == "sender_name"){
                      sender_name.push(v);
                      }else if(k == "sender_id"){
                      sender_id.push(v);
                      }else if(k == 'sender_avatar_url'){
                      if(v == null){
                      v = 'img/face.png';
                      }
                      sender_avatar_url.push(v);
                      }
                      });
               });
    }else{
        bodyMgs = '<a><p align="justify" class="divback2" ><font color="black" size="2">No Result Found</font></p></a>';
    }
    
    for(var i=0;i<body.length;i++){
        
        if(parent_id[i] == null){
            p=0;
            for(var j=0;j<body.length;j++){
                p = p+1;
                if(mgs_id[i] == parent_id[j]){
                    z = -1;
                    var k = parseInt(p)+z;
                    if(localStorage.sender_id == sender_id[k]){
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="ButtondeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }else{
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }
                }else{
                    
                }
            }
            
            if(localStorage.sender_id == sender_id[i]){
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="ButtonreplyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="ButtondeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="ButtonreplyHide bar bar-header item-input-inset" id="ButtonreplyHide'+i+'" ><label class="item-input-wrapper"><input id="Buttonreplymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:ButtonreplymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
            }
//            else{
//                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"><div style="width:100%"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="ButtonreplyMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="ButtonreplyHide bar bar-header item-input-inset" id="ButtonreplyHide'+i+'" ><label class="item-input-wrapper"><input id="Buttonreplymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:ButtonreplymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
//            }
            else{
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
            }
            replyappend ='';
            
        }else{
            
        }
    }
    
    $('#ButtonappwallListview').append(bodyMgs).trigger("create");
    
    if($('.ButtonreplyHide').is(':visible')){
        $('.ButtonreplyHide').toggle();
    }else{
        
    }
    
    $(".ButtonreplyMgs").click(function(){
                               replyMgsNo1 = (this.id).split('-');
                               replyMgsNo = mgs_id[replyMgsNo1[1]];
                               var replyHide = "ButtonreplyHide"+replyMgsNo1[1];
                               $('#'+replyHide).toggle();
                               });
    
    $(".ButtondeleteMgs").click(function(){
                                var deleteMgsNo = (this.id).split('-');
                                window.wizSpinner.show(options);
                                if(localStorage.appwallLoginData){
                                $.ajax({url:'http://build.myappbuilder.com/api/messages.json?api_key='+appKey+'&message_id='+mgs_id[deleteMgsNo[1]], type:"DELETE",data:{},
                                       success:function(response){
                                       $('#ButtonappwallListview').empty();
                                       $.ajax({
                                              type: "GET",
                                              url: "http://build.myappbuilder.com/api/messages.json",
                                              data:{'api_key':appKey,'button_id':buttonId},
                                              cache: false,
                                              success:function(response){
                                              window.wizSpinner.hide();
                                              messages = response;
                                              ButtonAppWallPostFun();
                                              },
                                              error:function(error,status){
                                              window.wizSpinner.hide();
                                              
                                              var error = JSON.parse(error.responseText);
                                              if(error.error == "Unauthorized"){
                                              navigator.notification.alert("Please Login")
                                              }else {
                                              navigator.notification.alert("Login Error!");
                                              }
                                              }
                                              });
                                       },
                                       error:function(){ window.wizSpinner.hide(); alert("Failure");}
                                       });
                                }else{
                                
                                }
                                });
    
}

function ButtonreplymessageFun(){
    if(localStorage.appwallLoginData){
        var replyarray = "Buttonreplymessage"+replyMgsNo1[1];
        var replymessage = $('#'+replyarray).val();
        if(replymessage == ''){
            navigator.notification.alert("Please Enter Your Reply...");
        }else{
            window.wizSpinner.show(options);
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":replymessage,"message[parent_id]":replyMgsNo,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"button_id":buttonId},
                   success:function(response){
                   $('#ButtonappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $('#'+replyarray).val('');
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ window.wizSpinner.hide(); alert("Failure");}
                   });
        }
    }else{
        
    }
    
}



function ButtonpostmessageFun(){
    if(localStorage.appwallLoginData){
        var postmessage = $('#Buttonpostmessage').val();
        if(postmessage == ''){
            navigator.notification.alert("Please Enter Your Comments...");
        }else{
            window.wizSpinner.show(options);
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":postmessage,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"button_id":buttonId},
                   success:function(response){
                   $('#ButtonappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'button_id':buttonId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $('#Buttonpostmessage').val('');
                          messages = response;
                          ButtonAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ window.wizSpinner.hide(); alert(" Network Failure ");}
                   });
        }
    }else{
        
    }
}



/* ----------------------------------------------------------- Element AppWall ----------------------------------------------------------------------- */


control.controller('elementAppWallCtrl',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   $scope.appwallBack = function(){
                   $state.go('previewContent');
                   }
                   
                   messages = '';
                   window.wizSpinner.show(options);
                   $.ajax({url:'http://build.myappbuilder.com/api/messages.json',type:"GET",data:{"api_key":appKey,"element_id":elementId},
                          success:function(response){
                          window.wizSpinner.hide();
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   
                   });

control.controller('elementAppWallCtrl1',function($scope,$state,$ionicLoading,$ionicPopup,$ionicModal,$ionicScrollDelegate,$http,$ionicActionSheet){
                   $scope.bar_color=barcolor;
                   $scope.appTitle = appTitle;
                   $scope.appwallBack = function(){
                   $state.go('previewContent1');
                   }
                   
                   messages = '';
                   window.wizSpinner.show(options);
                   $.ajax({url:'http://build.myappbuilder.com/api/messages.json',type:"GET",data:{"api_key":appKey,"element_id":elementId},
                          success:function(response){
                          window.wizSpinner.hide();
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   
                   });


function ElementAppWallPostFun(){
    
    var bodyMgs = '';
    var mgs_id = []; 
    var body = [];
    var created_at = [];
    var parent_id = []; 
    var element_name = [];
    var button_name =[];
    var sender_name = [];
    var sender_id = [];
    var sender_avatar_url = [];
    var replyappend ='';
    var z = 0;
    var p = 0;
    //alert("msgLen:"+messages.length);
    if(messages.length > 0){
        $.each( messages, function( key, value ) {
               $.each( value, function( k, v ) {
                      if(k == "id"){
                      mgs_id.push(v);
                      }else if(k == "created_at"){
                      created_at.push(v);
                      }else if(k == "parent_id"){
                      parent_id.push(v);
                      }else if(k == "body"){
                      body.push(v);
                      }else if(k == "element_name"){
                      element_name.push(v);
                      }else if(k == "button_name"){
                      button_name.push(v);
                      }else if(k == "sender_name"){
                      sender_name.push(v);
                      }else if(k == "sender_id"){
                      sender_id.push(v);
                      }else if(k == 'sender_avatar_url'){
                      if(v == null){
                      v = 'img/face.png';
                      }
                      sender_avatar_url.push(v);
                      }
                      });
               });
    }else{
        bodyMgs = '<a><p align="justify" class="divback2" ><font color="black" size="2">No Result Found</font></p></a>';
    }
    
    for(var i=0;i<body.length;i++){
        
        if(parent_id[i] == null){
            p=0;
            for(var j=0;j<body.length;j++){
                p = p+1;
                if(mgs_id[i] == parent_id[j]){
                    z = -1;
                    var k = parseInt(p)+z;
                    if(localStorage.sender_id == sender_id[k]){
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;"><img src="img/delete.png" id="delete-'+k+'" class="ElementdeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }else{
                        replyappend +='<div class="row"><div class="col col-80 divback1"><div class="row"><div class="col col-50" align="left">'+sender_name[k]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[k])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[k]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[k]+'&nbsp;</font></div><hr><div><p align="justify">'+body[k]+'</p></div><div class="row"></div></div><div class="col col-20"><img src="'+sender_avatar_url[k]+'" style="width:100%;height:auto;"/></div></div><br/>';
                    }
                }else{
                    
                }
                
            }
            if(localStorage.sender_id == sender_id[i]){
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%;"><div style="width:50%;"><div style="width:100%;"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="ElementreplyMgs" style="width:100%;height:auto;"/></div><div style="width:50%;float:left;" ><img src="img/delete.png" id="delete-'+i+'" class="ElementdeleteMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="ElementreplyHide bar bar-header item-input-inset" id="ElementreplyHide'+i+'" ><label class="item-input-wrapper"><input id="Elementreplymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:ElementreplymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
            }
//            else if(localStorage.sender_id != sender_id[i]){
//                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"><div style="width:100%"><div style="width:50%;float:left;" ><img src="img/reply.png" id="reply-'+i+'" class="ElementreplyMgs" style="width:100%;height:auto;"/></div></div></div></div></div></div><div style="width:100%;"><div style="width:20%;float:left;opacity:0">Hello</div><div style="width:80%;float:left;"><div class="ElementreplyHide bar bar-header item-input-inset" id="ElementreplyHide'+i+'" ><label class="item-input-wrapper"><input id="Elementreplymessage'+i+'" type="text" id="postmessage" placeholder="Enter Your Reply...."></label><button id="textReplyMgs" onclick="javascript:ElementreplymessageFun();" class="button button-clear button-positive"><img src="img/btn_reply.png" style="width:70px;height:auto;"/></button></div></div></div><br /><div class="appendreplydata">'+replyappend+'</div>';
//            }
            else{
                
                bodyMgs +='<div class="row"><div class="col col-20"><img src="'+sender_avatar_url[i]+'" style="width:100%;height:auto;"/></div><div class="col col-80 divback"><div class="row"><div class="col col-50" align="left">'+sender_name[i]+'</div><div class="col col-50" align="right"><i class="icon ion-clock"></i>  '+relative_time(created_at[i])+'</div></div><div align="center"><font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+button_name[i]+'&nbsp;</font>&nbsp;>&nbsp;<font color="white" size="2" style="background-color:#33CCFF">&nbsp;'+element_name[i]+'&nbsp;</font></div><hr><div><p align="justify">'+body[i]+'</p><hr></div><div style="width:100%"><div style="width:50%;float:left;"></div></div></div></div><div style="width:100%;"></div><br /><div class="appendreplydata">'+replyappend+'</div>';
                
            }
            replyappend ='';
            
        }else{
            
        }
    }
    
    $('#ElementappwallListview').append(bodyMgs).trigger("create");
    
    if($('.ElementreplyHide').is(':visible')){
        $('.ElementreplyHide').toggle();
    }else{
        
    }
    
    $(".ElementreplyMgs").click(function(){
                                replyMgsNo1 = (this.id).split('-');
                                replyMgsNo = mgs_id[replyMgsNo1[1]];
                                var replyHide = "ElementreplyHide"+replyMgsNo1[1];
                                $('#'+replyHide).toggle();
                                });
    
    $(".ElementdeleteMgs").click(function(){
                                 var deleteMgsNo = (this.id).split('-');
                                 //alert(mgs_id[deleteMgsNo[1]])
                                 window.wizSpinner.show(options);
                                 if(localStorage.appwallLoginData){
                                 $.ajax({url:'http://build.myappbuilder.com/api/messages.json?api_key='+appKey+'&message_id='+mgs_id[deleteMgsNo[1]], type:"DELETE",data:{},
                                        success:function(response){
                                        $('#ElementappwallListview').empty();
                                        $.ajax({
                                               type: "GET",
                                               url: "http://build.myappbuilder.com/api/messages.json",
                                               data:{'api_key':appKey,'element_id':elementId},
                                               cache: false,
                                               success:function(response){
                                               window.wizSpinner.hide();
                                               messages = response;
                                               ElementAppWallPostFun();
                                               },
                                               error:function(error,status){
                                               window.wizSpinner.hide();
                                               
                                               var error = JSON.parse(error.responseText);
                                               if(error.error == "Unauthorized"){
                                               navigator.notification.alert("Please Login")
                                               }else {
                                               navigator.notification.alert("Login Error!");
                                               }
                                               }
                                               });
                                        },
                                        error:function(){ window.wizSpinner.hide(); alert("Failure");}
                                        });
                                 }else{
                                 
                                 }
                                 });
    
}

function ElementreplymessageFun(){
    if(localStorage.appwallLoginData){
        var replyarray = "Elementreplymessage"+replyMgsNo1[1];
        var replymessage = $('#'+replyarray).val();
        if(replymessage == ''){
            navigator.notification.alert("Please Enter Your Reply...");
        }else{
            window.wizSpinner.show(options);
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":replymessage,"message[parent_id]":replyMgsNo,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"element_id":elementId},
                   success:function(response){
                   $('#ElementappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'element_id':elementId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $('#'+replyarray).val('');
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login")
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ window.wizSpinner.hide(); alert("Failure");}
                   });
        }
    }else{
        
    }
    
}



function ElementpostmessageFun(){
    if(localStorage.appwallLoginData){
        var postmessage = $('#Elementpostmessage').val();
        if(postmessage == ''){
            navigator.notification.alert("Please Enter Your Comments...");
        }else{
            window.wizSpinner.show(options);
            $.ajax({url:'http://build.myappbuilder.com/api/messages.json', type:"POST",data:{"message[body]":postmessage,"message[sender_id]":localStorage.sender_id,"api_key":appKey,"element_id":elementId},
                   success:function(response){
                   $('#ElementappwallListview').empty();
                   $.ajax({
                          type: "GET",
                          url: "http://build.myappbuilder.com/api/messages.json",
                          data:{'api_key':appKey,'element_id':elementId},
                          cache: false,
                          success:function(response){
                          window.wizSpinner.hide();
                          $('#Elementpostmessage').val('');
                          messages = response;
                          ElementAppWallPostFun();
                          },
                          error:function(error,status){
                          window.wizSpinner.hide();
                          
                          var error = JSON.parse(error.responseText);
                          if(error.error == "Unauthorized"){
                          navigator.notification.alert("Please Login");
                          }else {
                          navigator.notification.alert("Login Error!");
                          }
                          }
                          });
                   },
                   error:function(){ window.wizSpinner.hide(); alert(" Network Failure ");}
                   });
        }
    }else{
        
    }
}





