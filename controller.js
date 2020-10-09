app.controller("CalendarController", function($scope, $location, CalendarData, EventSourceFactory) {
  $scope.eventSources = [];
  $scope.authNeeded = false;

  // load calendars from google and pass them as event sources to fullcalendar
  $scope.loadSources = function() {
    EventSourceFactory.getEventSources().then(function(result) {
      $scope.$log.debug("event sources %O", result);
      $scope.eventSources = result;
      angular.forEach(result, function(source) {
        $scope.calendar.fullCalendar('addEventSource', source);
      });
    });
  };

  // request Google authorization from the user
  $scope.requestAuth = function() {
    gapi_helper.requestAuth();
  };
  
  // configure gapi-helper
  // (you'll have to change these values for your own app)
  gapi_helper.configure({
    clientId: '721457523650-pjoaci65s9ob0241fbb151i3u7sjvv3r.apps.googleusercontent.com',
    apiKey: 'AIzaSyDY4uF058d78YHd7SPaF8bH0aoJqPGKXFU',
    scopes: 'https://www.googleapis.com/auth/calendar',
    services: {
      calendar: 'v3'
    }
  });

  // set authNeeded to appropriate value on auth events
  gapi_helper.when('authorized', function() {
    $scope.$apply(function() {
      $scope.authNeeded = false;
    });
  });
  gapi_helper.when('authFailed', function() {
    $scope.$apply(function() {
      $scope.authNeeded = true;
    });
  });

  // load the event sources when the calendar api is loaded
  gapi_helper.when('calendarLoaded', $scope.loadSources);

});
