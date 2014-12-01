'use strict';
angular.module('courses').controller('outcomeAssessmentController', ['$scope', '$http','$stateParams','$q', 'Authentication','Courses', 'Users', 'Outcomes',
	function($scope, $http, $stateParams,$q, Authentication,Courses,Users,Outcomes) {
		$scope.authentication = Authentication;
		$scope.user = new Users(Authentication.user);
		$scope.userCourses;
		$scope.outcomes;
		$scope.outcome=$stateParams.outcomeID;
		$scope.description;
		$scope.courseNumber=$stateParams.courseID;
		$scope.courseTitle;
		$scope.instructor = user.firstName +" " +user.lastName;
		$scope.date = new Date();
		$scope.parsedCSV;

		$scope.submit = function() {			
			var reader = new FileReader();
			var d = $q.defer();
            reader.addEventListener("loadend", function(evt) {
            	parseCSV(d,reader);
            });
            reader.readAsText($scope.files[0]);
		}

		function parseCSV(d,reader) {
			$http.post('csv_parsing/', { 
            	name: $scope.files[0].name, 
            	data: reader.result,
            	likert: $scope.likert,
            	courseNumber: $scope.courseNumber,
            	courseTitle: $scope.courseTitle
            }).success(function(res) {
            	$scope.parsedCSV = res;
            	d.resolve();
            }).err(function(res) {
            	$scope.error = res.message;
            });
            return d.promise;
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
				if($stateParams.courseID == courses[i].courseID){
					$scope.courseTitle = courses[i].courseName;
				}
				for(var j = 0; j < courses[i].outcomes.length; j++) {
					courses[i].outcomes[j] = outcomeById(courses[i].outcomes[j]);
					if(courses[i].outcomes[j].outcomeID==$stateParams.outcomeID){
						$scope.description =courses[i].outcomes[j].outcomeName;
					}

				}
			}
		}
		$scope.init = function() {
			$q.all([
				$scope.getOutcomes(),
				$scope.getUserCourses()
			]).then(function(data) {
				resolveOutcomes($scope.userCourses);
			})
		};

	
}])
.directive('fileInput', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attributes) {
			element.bind('change', function() {
				$parse(attributes.fileInput)
				.assign(scope, element[0].files);
				scope.$apply();
			})
		}
	}
}]);