	DownloadDialogController.$inject = ['thisKit', 'device', '$mdDialog'];
export default function DownloadDialogController(thisKit, device, $mdDialog) {
		var vm = this;

		vm.kit = thisKit;
		vm.download = download;
		vm.hide = hide;

		////////////////////////////

		function download(){
			device.mailReadings(vm.kit)
				.then(function (){
					$mdDialog.hide();
				}).catch(function(err){
					$mdDialog.cancel(err);
				});
		}

		function hide(){
			$mdDialog.cancel();
		}
	}
