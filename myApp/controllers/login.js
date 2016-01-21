angular.module('myApp').controller('loginController', ['$scope', '$http', '$location', 'userService', 'socket', function($scope, $http, $location, userService, socket){

    userService.userConnect();

    var vm = this;

    $scope.submit = function() {
        if ($scope.formLogin && $scope.name && $scope.password) {
            loginUser();
        }
    };

    function loginUser() {

        var logUser = {
            login: $scope.name,
            pass: $scope.password
        };

        $http({
            method: 'POST',
            url: '/login',
            data: logUser
        }).then(function successCallback() {
            $location.path('/home');
            $location.replace();
        }, function errorCallback() {

        });
    }

    //var logged = [];
    //socket.on('socketConnection', function(user){
    //    var test = user.login;
    //    logged.push(test);
    //    //    TEST
    //});

}]);

