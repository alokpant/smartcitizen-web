(function() {
  'use strict';

  angular.module('app.components')
    .controller('tagsController', tagsController);

  tagsController.$inject = ['tag', '$scope', 'device', '$state', '$q',
    'PreviewKit', 'animation'
  ];

  function tagsController(tag, $scope, device, $state, $q, PreviewKit,
    animation) {

    var vm = this;

    vm.selectedTags = tag.getSelectedTags();
    vm.markers = [];
    vm.kits = [];
    vm.percActive = 0;

    initialize();

    /////////////////////////////////////////////////////////

    function initialize() {
      if(vm.selectedTags.length === 0){
        $state.go('layout.home.kit');
      }

      animation.viewLoaded();

    	if (vm.selectedTags.length === 0){
    		return;
    	}
      if (!device.getWorldMarkers()) {
        return;
      }
      vm.markers = tag.filterMarkersByTag(device.getWorldMarkers());

      var onlineMarkers = _.filter(vm.markers, isOnline);
      if (vm.markers.length === 0) {
        vm.percActive = 0;
      } else {
        vm.percActive = Math.floor(onlineMarkers.length / vm.markers.length *
          100);
      }

      getTaggedKits()
      	.then(function(res){
      		vm.kits = res;
      	});
    }

    function isOnline(marker) {
      return _.include(marker.myData.labels, 'online');
    }

    function getTaggedKits() {

      var deviceProm = _.map(vm.markers, getMarkerDevice);

      return $q.all(deviceProm)
        .then(function(devices) {
          return _.map(devices, toPreviewKit);
        });
    }

    function toPreviewKit(dev) {
      return new PreviewKit(dev);
    }

    function getMarkerDevice(marker) {
      return device.getDevice(marker.myData.id);
    }
  }

})();
