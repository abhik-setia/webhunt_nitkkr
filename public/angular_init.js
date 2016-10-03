
var app=angular.module('app',[]);
app.controller('MainCtrl',MainCtrl);

    function MainCtrl ($scope,$http) {
        $scope.items = [{
            name: 'Scuba Diving Kit',
            id: 7297510
        },{
            name: 'Snorkel',
            id: 0278916
        },{
            name: 'Wet Suit',
            id: 2389017
        },{
            name: 'Beach Towel',
            id: 1000983
        }];
        $scope.Event='Webhunt';
        this.val="";
        this.showMessage=function(ms){
            this.val=ms
        }

        this.event_date="";
        this.start_time="";
        this.end_time="";
        this.passcode="";
        this.society="";

        $scope.show_event_details=1;

        $scope.loadEvent=function(event){
          $http.get('http://localhost:3000/events/'+event)
          .then(function(response){

            var data_received=response.data;
            $scope.show_event_details=!$scope.show_event_details;
            $scope.event_date=data_received.event_date;
            $scope.start_time=data_received.start_time;
            $scope.end_time=data_received.end_time;
            $scope.passcode=data_received.passcode;
            $scope.society=data_received.society;

            $scope.questions=[];
            $scope.users=[];

            add_questions(data_received);

            add_users(data_received);

          });
          };

          function add_questions(data) {
            for (var i = 0; i < data.questions.length; i++) {
                $scope.questions.push(data.questions[i]);
            }
          }
          function add_users(data) {
            for (var i = 0; i < data.user_registered.length; i++) {
                $scope.users.push(data.user_registered[i]);
                add_answer_of_this_user(i,data.user_registered[i].user_email,data.user_registered[i].event_name);
            }
          }
          function add_answer_of_this_user(index,email,event_name) {
            var dataObj = {
				                  user_email :email,
				                  event_name : event_name,
				                  };
            var res = $http.post('http://localhost:3000/events/getAnswers', dataObj);

            res.success(function(data, status, headers, config) {

               $scope.users[index].answers=0;
               $scope.users[index].answers=data.answers;
              //  for (var i = 0; i < $scope.users[index].answers.length; i++) {
              //    $scope.users[index].answers[data.answers[i].answer_no]=data.answers[i].answer;
              //  }
            //   $scope.users[index]
              });

            res.error(function(data, status, headers, config) {
          			alert( "failure message: " + JSON.stringify({data: data}));
          		});
                    }

          $scope.loadEvent();

    }
