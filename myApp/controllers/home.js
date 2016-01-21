angular.module('myApp').controller('homeController', ['$scope', '$http', '$location', 'userService', 'socket', function($scope, $http, $location, userService, socket){

	var vm = this;

	// Redirige l'user sur login si il n'est pas connecté
	userService.userExist();

	vm.getNameUser = function() {
		userService.returnUserName(function(username) {
			$scope.username = username;
		});
	};

	vm.getNameUser();

	//var socket = io();
	//socket.on('test', function(value) {
	//	$scope.socketiotest = value;
	//});

	//EN AJAX RECUPERER TOUT LES UTILISATEURS
	$http.get('/users').success(function(data){
		$scope.users = data;
		//console.log(data);
	}).error(function(){

	});

	$scope.killSession = function() {
		console.log('click sur logout');
		$location.path('/logout');
		$location.replace();
	};


}]);