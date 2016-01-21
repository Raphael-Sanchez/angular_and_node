angular.module('myApp').controller('registrationController', ['$scope', '$http', '$location', 'userService', function($scope, $http, $location, userService){

    userService.userConnect();

    $scope.submit = function() {
        if ($scope.formRegistration && $scope.name && $scope.password) {
             registerUser();
        }
    };

    function registerUser() {

        var newUser = {
            login: $scope.name,
            pass: $scope.password
        };

        $http({
            method: 'POST',
            url: '/users',
            data: newUser
        }).then(function successCallback() {
            $location.path("/home");
        }, function errorCallback() {

        });
    }

}]);
