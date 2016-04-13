/**
 * @created 13.04.16
 *
 * @author Popov Nikolay <cejixo3dr@gmail.com>
 * @copyright Beeplans 2016
 */
angular.module('FSUAClient.dashboard.application')

    .controller('FSUAClient.dashboard.list.controller', [
        '$scope',
        '$http',
        function ($scope, $http) {
            $scope.results = null;
            $scope.query = null;


            $scope.$watch('query', function (newValue, oldValue) {
                $http({
                    method: 'GET',
                    url: 'http://fs.to/search.aspx?f=quick_search&search=' + newValue + '&limit=10&section=&subsection=&mod=main'
                })
                    .then(function successCallback(response) {
                        $scope.results = response.data;
                    });
            });
        }
    ])

;