angular.module('messageQA.controllers', ['messageQA.services'])

.controller('LoginCtrl', function ($rootScope, $scope, API, $window) {
    // if the user is already logged in, take him to his bucketlist
    if ($rootScope.isSessionActive()) {
        $window.location.href = ('#/tab/questions');
    }

    $scope.user = {
        email: "",
        password: ""
    };

    $scope.validateUser = function () {
        var email = this.user.email;
        var password = this.user.password
        if(!email || !password) {
        	$rootScope.notify("Please enter valid credentials")
        	return false
        }
        $rootScope.show('Please wait.. Authenticating');
        API.signin({
            email: email,
            password: password
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/tab/questions');
            $rootScope.$broadcast('fetchAll');
            $rootScope.$broadcast('fetchAllQs');
        }).error(function (error) {
            $rootScope.hide();
            $rootScope.notify("Invalid Username or password");
        });
    }

})

.controller('FindCtrl', function ($rootScope, $scope, $ionicModal, Professionals) {
    // if the user is already logged in, take him to his bucketlist
    $scope.professionals = Professionals.all();
    $scope.gotoDetail=function(professionalId){
      $scope.professional = Professionals.get(professionalId);
        $ionicModal.fromTemplateUrl('templates/professional-detail.html', function (modal) {
          $rootScope.show("Loading");
          $scope.newProfessionalTemplate = modal;
          $scope.newProfessionalTemplate.show().then(function(){
            $rootScope.hide();
          });
        },{
          scope: $scope
        });


    }

})

.controller('ProfessionalDetailCtrl', function($rootScope, $scope, StripeCharge, $stateParams, API) {
  $scope.questionData = {
    item: ""
  };
  $scope.close = function (){
    $scope.newProfessionalTemplate.hide();
  }
  $scope.payAndAsk = function (){
    if (!$scope.questionData.item){
      $rootScope.notify("Please enter a valid message");
      return;
    }
    // first get the Stripe token
    var form = {
        item: this.questionData.item,
        user: $rootScope.getToken(),
        professional: $scope.professional,
        toID: $scope.professional.id.toString(),
        created: Date.now(),
        updated: Date.now()
    };
    $scope.newProfessionalTemplate.hide();
    StripeCharge.getStripeToken($scope.professional).then(
      function(stripeToken){
        // -->
        proceedCharge(stripeToken);
      },
      function(error){
        console.log(error)

        if(error != "ERROR_CANCEL") {
          $rootScope.notify("Oops... something went wrong");
        } else {
          $scope.newProfessionalTemplate.show();
        }
      }
    ); // ./ getStripeToken

    function proceedCharge(stripeToken) {
      // then charge the user through your custom node.js server (server-side)
      StripeCharge.chargeUser(stripeToken, $scope.professional).then(
        function(StripeInvoiceData){
          if(StripeInvoiceData.hasOwnProperty('id')) {

            API.saveItem(form, form.user)
                .success(function (data, status, headers, config) {
                    $rootScope.hide();
                    $rootScope.doRefresh(1);
                    $rootScope.notify("Question Added");
                })
                .error(function (data, status, headers, config) {
                    $rootScope.hide();
                    console.log(JSON.stringify(config, null, 4));
                });

          } else {
          };
        },
        function(error){
          $rootScope.notify("Charge Failed");

        }
      );

    }; // ./ proceedCharge


  }
})



.controller('SignUpCtrl', function ($rootScope, $scope, API, $window) {
    $scope.user = {
        email: "",
        password: "",
        name: ""
    };
    $scope.createUser = function () {
    	var email = this.user.email;
        var password = this.user.password;
        var uName = this.user.name;
        if(!email || !password || !uName) {
        	$rootScope.notify("Please enter valid data");
        	return false;
        }
        $rootScope.show('Please wait.. Registering');
        API.signup({
            email: email,
            password: password,
            name: uName
        }).success(function (data) {
            $rootScope.setToken(email); // create a session kind of thing on the client side
            $rootScope.hide();
            $window.location.href = ('#/tab/questions');
        }).error(function (error) {
            $rootScope.hide();
        	if(error.error && error.error.code == 11000)
        	{
        		$rootScope.notify("A user with this email already exists");
        	}
        	else
        	{
        		$rootScope.notify("Oops something went wrong, Please try again!");
        	}

        });
    }
})

.controller('MyQuestionsCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window, Professionals) {
    $rootScope.$on('fetchAll', function(){
      if ($rootScope.getToken()){
        API.getAll($rootScope.getToken()).success(function (data, status, headers, config) {
        $rootScope.show("Please wait... Processing");
        $scope.list = [];
        var professionals = Professionals.all();
        for (var i = 0; i < data.length; i++) {
          if (data[i].responseData) {
            data[i].hasAnswered = true;
          } else {
            data[i].hasAnswered = false;
        }
          $scope.list.push(data[i]);
          };
          if($scope.list.length == 0)
          {
              $scope.noData = true;
          }
          else
          {
              $scope.noData = false;
          }
          $scope.list.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return b.created - a.created;
          });
          $ionicModal.fromTemplateUrl('templates/newItem.html', function (modal) {
              $scope.newTemplate = modal;
          });

          $scope.newQuestion = function () {
              $scope.newTemplate.show();
          };
          $rootScope.hide();
          }).error(function (data, status, headers, config) {
              $rootScope.hide();
              $rootScope.notify("Oops something went wrong!! Please try again later");
          });
      }

    });

    $rootScope.$broadcast('fetchAll');

    $scope.remove = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
    // $ionicModal.fromTemplateUrl('templates/question-detail.html', function(modal) {
    //   $scope.modalCtrl = modal;
    // }, {
    //   scope: $scope,  /// GIVE THE MODAL ACCESS TO PARENT SCOPE
    //   animation: 'slide-in-left'//'slide-left-right', 'slide-in-up', 'slide-right-left'
    // });

    $scope.gotoDetail=function(questionId){
      $rootScope.show("Loading...");
      API.getOne(questionId, $rootScope.getToken())
      .success(function (data, status, headers, config) {
          $scope.question = data;
          $ionicModal.fromTemplateUrl('templates/question-detail.html', function (modal) {
            $scope.newDetailTemplate = modal;
            $scope.newDetailTemplate.show().then(function(){
              $rootScope.hide();
            })
          },{
            scope: $scope
          });
      });



    }
})

.controller('PopularQuestionsCtrl', function ($rootScope, $scope, API, $timeout, $ionicModal, $window, Professionals) {
    $rootScope.$on('fetchAllQs', function(){
      if ($rootScope.getToken()){
        API.findAll($rootScope.getToken()).success(function (data, status, headers, config) {
        $rootScope.show("Please wait... Processing");
        $scope.list = [];
        var professionals = Professionals.all();
        for (var i = 0; i < data.length; i++) {
          if (data[i].responseData) {
            data[i].hasAnswered = true;
          } else {
            data[i].hasAnswered = false;
          }
          $scope.list.push(data[i]);
          };
          if($scope.list.length == 0)
          {
              $scope.noData = true;
          }
          else
          {
              $scope.noData = false;
          }
          $scope.list.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return b.created - a.created;
          });
          $rootScope.hide();
          }).error(function (data, status, headers, config) {
              $rootScope.hide();
              $rootScope.notify("Oops something went wrong!! Please try again later");
          });
      }

    });

    $rootScope.$broadcast('fetchAllQs');

    $scope.remove = function (id) {
        $rootScope.show("Please wait... Deleting from List");
        API.deleteItem(id, $rootScope.getToken())
            .success(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.doRefresh(1);
            }).error(function (data, status, headers, config) {
                $rootScope.hide();
                $rootScope.notify("Oops something went wrong!! Please try again later");
            });
    };
    // $ionicModal.fromTemplateUrl('templates/question-detail.html', function(modal) {
    //   $scope.modalCtrl = modal;
    // }, {
    //   scope: $scope,  /// GIVE THE MODAL ACCESS TO PARENT SCOPE
    //   animation: 'slide-in-left'//'slide-left-right', 'slide-in-up', 'slide-right-left'
    // });

    $scope.gotoDetail=function(questionId){
      $rootScope.show("Loading...");
      API.getOne(questionId, $rootScope.getToken())
      .success(function (data, status, headers, config) {
          $scope.question = data;
          $ionicModal.fromTemplateUrl('templates/question-detail.html', function (modal) {
            $scope.newDetailTemplate = modal;
            $scope.newDetailTemplate.show().then(function(){
              $rootScope.hide()
            });
          },{
            scope: $scope
          });
      });



    }
})

// .controller('QuestionsCtrl', function($scope, Questions) {
//   // With the new view caching in Ionic, Controllers are only called
//   // when they are recreated or on app start, instead of every page change.
//   // To listen for when this page is active (for example, to refresh data),
//   // listen for the $ionicView.enter event:
//   //
//   //$scope.$on('$ionicView.enter', function(e) {
//   //});
//
//   $scope.questions = Questions.all();
//   $scope.remove = function(question) {
//     Questions.remove(question);
//   };
// })

.controller('QuestionDetailCtrl', function($scope, $element, $stateParams, $rootScope, StripeCharge, $ionicModal) {
  var soundPath;
  var audioElement = $element.find('audio')[0];

  function createFile(dirEntry, fileName, data) {
    // Creates a new file or returns the file if it already exists.
    dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

        writeFile(fileEntry, data);

    }, function(err){

    });

  }
  function writeFile(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
            console.log(JSON.stringify(fileEntry, null, 4));
            soundPath = fileEntry.nativeURL;
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['some file data'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);
    });
  }
  $scope.close = function (){
    $scope.newDetailTemplate.hide();
  }
  //check if the question is mine
  if ($scope.question[0].user == $rootScope.getToken()){
    $scope.isMyQuestion = true;
  } else {
    $scope.isMyQuestion = false;
  }
  if ($scope.question[0].responseData){
    $scope.hasAnswered = true;
    var superAudioBuffer = b64toBlob($scope.question[0].responseData);
    window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

        console.log('file system open: ' + fs.name);
        var uniq = 'id' + (new Date()).getTime();
        createFile(fs.root, uniq + ".caf", superAudioBuffer);

    }, function(err){

    });
  } else {
    $scope.hasAnswered = false;
  }
  function encode_utf8( s ) {
    return unescape( encodeURIComponent( s ) );
  }
  function decode_utf8(str)
  {
   return decodeURIComponent( escape(str) );
  }

  function decodeBase64(encoded)
  {
   var iPlus5;
   var currEncoded;
   var decoded;
   var res = "";
   for (i = 0; i < encoded.length; i += 4)
   {
    iPlus5 = i + 4;
    currEncoded = encoded.substring(i, iPlus5);
    currEncoded = currEncoded.replace(/\s/g, "");
    decoded = window.atob( decode_utf8(currEncoded) );
    res += decoded;
   }
   return res;
  }
  function b64toBlob(dataURI) {
    var byteString = decodeBase64(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: '*/*' });
  }
  $scope.play = function (){
    console.log(soundPath);
    var my_media = new Media(soundPath.replace("file://", ""));
    my_media.play();
  }

  $scope.payAndWhisper = function () {
    $scope.newDetailTemplate.hide();
    var questionObject = $scope.question[0];
    questionObject.name = "Whisper it to me";
    questionObject.price = 3;
    questionObject.intro = questionObject.item;
    StripeCharge.getStripeToken(questionObject).then(
      function(stripeToken){
        // -->
        proceedCharge(stripeToken);
      },
      function(error){
        if(error != "ERROR_CANCEL") {
          $rootScope.notify("Oops... something went wrong");
        } else {
          $rootScope.notify("Canceled");
          $scope.newDetailTemplate.show();
        }
      }
    ); // ./ getStripeToken

    function proceedCharge(stripeToken) {
      // then charge the user through your custom node.js server (server-side)
      StripeCharge.chargeUser(stripeToken, questionObject).then(
        function(StripeInvoiceData){
          if(StripeInvoiceData.hasOwnProperty('id')) {
            $rootScope.notify("Purchased Successful!")
            $ionicModal.fromTemplateUrl('templates/question-answer.html', function (modal) {
              $scope.newAnswerTemplate = modal;
              $scope.newAnswerTemplate.show();
            },{
              scope: $scope
            });

          } else {
            $rootScope.notify("Error, please try again");
          }
        },
        function(error){
          $rootScope.notify("Charge Failed");

        }
      )

    }; // ./ proceedCharge
  }
});
