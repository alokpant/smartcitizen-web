(function() {
  'use strict';

  angular.module('app.components')
    .factory('AuthUser', ['User', function(User) {

      function AuthUser(userData) {
        User.call(this, userData);

        this.email = userData.email;
        this.role = userData.role;
        this.key = '23243532423524234';//userData.key;
        this.macAddress = userData.macAddress; 
      }
      AuthUser.prototype = Object.create(User.prototype);
      AuthUser.prototype.constructor = User;

      return AuthUser;
    }]);
})();
