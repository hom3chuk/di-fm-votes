var app = angular.module('votedApp', []);

app.factory('votesService', function($http) {
    return {
        getData: function(){
            var page = this.page,
                url = this.url,
                api_key = this.api_key;
            this.page++;
            return $http.get(url+"&page="+page+"&api_key="+api_key)
                .then(function (votesResponse) {
                    return votesResponse.data;
                });
        },
        api_key: '',
        page: 1,
        url: 'http://api.audioaddict.com/v1/di/members/1/track_votes?vote_type=up'
    }
});

app.filter('imageUrl', function() {
    return function(input) {
        var re = /(\{.*\})/;
        return input.replace(re, '');
    };
});

app.controller('di', function($scope, votesService, $http) {
    $scope.votes = [];
    $scope.loadMore = function() {
        votesService.getData().then(function(data){
            $scope.votes = $scope.votes.concat(data);
            if ( 0 !== data.length ){
                $scope.loadMore();
            }
        });

    };
    $scope.login = function(user) {
        if ( user && user.hasOwnProperty("username") && user.hasOwnProperty("password") ){
            $http.post('https://api.audioaddict.com/v1/di/members/authenticate', user)
                .then(function(response) {
                    votesService.api_key = response.data.api_key;
                    $scope.loadMore();
                });
        }
    }

});

