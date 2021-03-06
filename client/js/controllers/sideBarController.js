featureToggleFrontend.controller('SideBarController', ['$scope', 'toggleService', 'authorisationService', '$location', 'focus', 'CurrentUser', function($scope, toggleService, authorisationService, $location, focus, CurrentUser) {

    $scope.applications = [];
    $scope.newApplicationName = '';
    $scope.adding = false;

    $scope.CurrentUser = CurrentUser;

    var loadApplications = function(){
        toggleService.getApplications(
            function(data){
                $scope.applications = data;
            },
            function(data){
                $scope.$emit('error', "Failed to load applications", new Error(data));
            });
    };

    $scope.setAddingApplicationState = function(state){
        $scope.adding = state;
        if (state){
            focus('newApplicationName');
        }
        else{
            $scope.newApplicationName = '';
        }
    };

    var validateNewApplication = function(applicationName){
        if (!applicationName){
            return "Must enter an application name";
        }
        if (_.any($scope.applications, function(application) { return application.toLowerCase() == applicationName.toLowerCase(); })) {
            return "Application already exists";
        }
        if (!/^[a-z0-9]+$/i.test(applicationName)){
            return "Application name must be alphanumeric with no spaces";
        }
    };

    $scope.addApplication = function(){
        var applicationName = $scope.newApplicationName;

        var validationError = validateNewApplication(applicationName);
        if (validationError){
            console.log(validationError);
            $scope.$emit('error', validationError);
            return;
        }

        toggleService.addApplication(applicationName,
            function(status){
                if (status === 201) { // created
                    $scope.applications.push(applicationName);
                    $location.path('/applications/' + applicationName);
                }
                $scope.setAddingApplicationState(false);
            },
            function(data){
                $scope.$emit('error', "Failed to add application", new Error(data));
            });
    };


    $scope.isActive = function(applicationName) {
        var appUrlPart = '/applications/' + applicationName;
        return $location.path() === appUrlPart || $location.path().indexOf(appUrlPart + '/') > -1;
    };

    loadApplications();
}]);