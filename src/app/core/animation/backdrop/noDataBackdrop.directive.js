import template from './loadingBackdrop.html';

  /**
   * Backdrop for chart section when kit has no data
   *
   */
  noDataBackdrop.$inject = [];

  export default function noDataBackdrop() {
    return {
      restrict: 'A',
      scope: {},
      template,
      controller: ['$scope', '$timeout', function($scope, $timeout) {
        var vm = this;

        vm.kitWithoutData = false;
        vm.scrollToComments = scrollToComments;

        $scope.$on('kitWithoutData', function(ev, data) {

          $timeout(function() {
            vm.kit = data.kit;
            vm.kitWithoutData = true;

            if (data.belongsToUser) {
              vm.user = 'owner';
            } else {
              vm.user = 'visitor';
            }
          }, 0);

        });

        function scrollToComments(){
          location.hash = '';
          location.hash = '#disqus_thread';
        }
      }],
      controllerAs: 'vm'
    };
  }
