import angular from 'angular';
import template from './loadingBackdrop.html';
    /**
     * Backdrop for app initialization and between states
     *
     */
    loadingBackdrop.$inject = [];
    export default function loadingBackdrop() {
      return {
        template,
        controller: ['$scope', function($scope) {
          var vm = this;
          vm.isViewLoading = true;
          vm.mapStateLoading = false;

          // listen for app loading event
          $scope.$on('viewLoading', function() {
            vm.isViewLoading = true;
            angular.element('#doorbell-button').hide();
          });

          $scope.$on('viewLoaded', function() {
            vm.isViewLoading = false;
            angular.element('#doorbell-button').show();
          });

          // listen for map state loading event
          $scope.$on('mapStateLoading', function() {
            if(vm.isViewLoading) {
              return;
            }
            vm.mapStateLoading = true;
          });

          $scope.$on('mapStateLoaded', function() {
            vm.mapStateLoading = false;
          });
        }],
        controllerAs: 'vm'
      };
    }
