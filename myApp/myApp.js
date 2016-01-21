var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider',
  function ($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl:'myApp/templates/home.html',
        controller:'homeController'
      }).
      when('/login', {
        templateUrl:'myApp/templates/login.html',
        controller:'loginController'
      }).
      when('/registration', {
        templateUrl:'myApp/templates/registration.html',
        controller:'registrationController'
      }).
      when('/logout', {
        templateUrl:'myApp/templates/logout.html',
        controller:'logoutController'
      }).
      otherwise({
        redirectTo:'/'
      });
  }
]);