'use strict';
angular.module('courses').controller('committeeEvalController', ['$scope', '$http','$stateParams','$q', 'Authentication','Courses', 'Users', 'Outcomes',
	function($scope, $http, $stateParams,$q, Authentication,Courses,Users,Outcomes) {

		$scope.authentication = Authentication;
		$scope.user = new Users(Authentication.user);
		$scope.form = {};

		$scope.form.instructor = user.firstName + " " +user.lastName;
		$scope.form.date = new Date();

		$scope.submit = function(form) {
			var course = $scope.course;
			course.form = $scope.form;
			course.outcomes = $scope.outcomes;

			course.$update(function() {
				console.log("updaaet");
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		}

		function setFormFields(course) {
			$scope.course = course;
			$scope.form.courseNumber = course.courseID;
			$scope.form.courseTitle = course.courseName;
			$scope.outcomes = course.outcomes;
		}

		$scope.getUserCourses = function() {
			var d = $q.defer();
		 	$http.get('users/courses').success(function(response) {
				$scope.userCourses = response;
				d.resolve();
			}).error(function(response) {
				$scope.error = response.message;
			});
			return d.promise;
		};

		$scope.getOutcomes = function() {
			var d = $q.defer();
			$scope.outcomes = Outcomes.query(function() {
				d.resolve();
			});
			return d.promise;
		}

		function outcomeById(id) {
			for(var i = 0; i < $scope.outcomes.length; i++) {
				if($scope.outcomes[i]._id === id)
					return $scope.outcomes[i];
			}
		}

		function resolveOutcomes(courses) {
			for(var i = 0; i < courses.length; i++) {
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = outcomeById(courses[i].outcomes[j]);
				}
			}
		}

		function courseByNumber(courseNum) {
			for(var i = 0; i < $scope.userCourses.length; i++) {
				if($scope.userCourses[i].courseID == courseNum)
					return $scope.userCourses[i];
			}
		}

		$scope.init = function() {
			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				var course = courseByNumber($stateParams.courseID);
				resolveOutcomes([course]);
				setFormFields(course);
			})
		};

	
}]);