angular.module('myApp').service('userService', ['$http', '$location', function($http, $location){

    // SI USER N'EXISTE PAS L'USER EST REDIRIGÉ VERS LOGIN
    this.userExist = function(){
        $http({
            method: 'GET',
            url: '/user'
        }).then(function successCallback() {

        }, function errorCallback() {
            $location.path('/login');
        });
    };

    // SI USER EST CONNECTÉ L'USER EST REDIRIGÉ VERS HOME
    this.userConnect = function(){
        $http({
            method: 'GET',
            url: '/user'
        }).then(function successCallback() {
            $location.path('/home');
        }, function errorCallback() {

        });
    };

    // RETOURNE NOM DE L'USER CONNECTÉ
    this.returnUserName = function(callback){
        $http({
            method: 'GET',
            url: '/user'
        }).then(function successCallback(response) {
            callback(response.data.login);
        }, function errorCallback() {

        });
    };

}]);