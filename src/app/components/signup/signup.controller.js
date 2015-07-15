(function() {
  'use strict';

  angular.module('app.components')
    .controller('SignupController', SignupController);
    
    SignupController.$inject = ['$scope', '$mdDialog', 'user', 'animation', 'alert'];
    function SignupController($scope, $mdDialog, user, animation, alert) {
      var vm = this;

      vm.showSignup = showSignup;
      // vm.signup = signup;
      vm.errors = {};

      $scope.$on('showSignup', function() {
        showSignup();
      });
      ////////////////////////


      function showSignup() { //1st arg: ev

        //animation.blur();
        
        $mdDialog.show({
          hasBackdrop: true,
          controller: 'SignupDialogController',
          templateUrl: 'app/components/signup/signupModal.html',
          //targetEvent: ev,
          clickOutsideToClose: true
        })
        .then(function() {
          //signup(signupData);
        })
        .finally(function() {
          //animation.unblur();
        });
      }

      // function signup(signupData) {
      //   user.createUser(signupData)
      //     .then(function() {
      //       alert.success('Signup was successful');
      //     })
      //     .catch(function(err) {
      //       //alert.error('Signup failed');
      //       console.log('err', err.data.errors);
      //     });
      // }
    }
})();
