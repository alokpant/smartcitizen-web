(function() {
  'use strict';

  angular.module('app.components')
    .controller('MapTagDialogController', MapTagDialogController);

  MapTagDialogController.$inject = ['$mdDialog', 'tag', 'selectedTags'];

  function MapTagDialogController($mdDialog, tag, selectedTags) {

    var vm = this;

    vm.checks = {};

    vm.answer = answer;
    vm.hide = hide;
    vm.clear = clear;
    vm.cancel = cancel;
    vm.tags = [];

    init();

    ////////////////////////////////////////////////////////

    function init() {
      tag.getTags()
        .then(function(tags) {
          vm.tags = tags;

          _.forEach(selectedTags, select);

        });
    }

    function answer() {

      var selectedTags = _(vm.tags)
        .filter(isTagSelected)
        .value();
      $mdDialog.hide(selectedTags);
    }

    function hide() {
      answer();
    }

    function clear() {
      $mdDialog.hide();
    }

    function cancel() {
      answer();
    }

    function isTagSelected(tag) {
      return vm.checks[tag.name];
    }

    function select(tag){
      vm.checks[tag] = true;
    }
  }
})();