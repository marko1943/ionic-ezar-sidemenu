angular.module('starter.controllers', [])

.controller('AppCtrl', function() {})

.controller('HomeCtrl', function($scope) {

    $scope.image = window.localStorage.getItem('image');

    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() { screen.lockOrientation('portrait'); }

})

.controller('EzarCtrl', function($scope, $timeout, $state) {

    
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() { screen.unlockOrientation(); }

    $scope.snapshotTimestamp = Date.now();
    $scope.reverseCameraTimestamp = Date.now();

    $scope.goHome = function() {
        // window.open('file:///android_asset/www/index.html#/app/home', '_self'); //ucomment this for a standalone app routing

        window.open('../#/app/home'); // live reload routing - remove when using standalone app
    }

    $scope.snapshot = function() {
        //ignore ghost clicks, wait 1.5 sec between invocations
        if (Date.now() - $scope.snapshotTimestamp < 1500) return;
        $scope.snapshotTimestamp = Date.now();

        //get snapshot & revcamera buttons to hide/show
        var snapshotBtn = document.getElementById("snapshot");
        var revCameraBtn = document.getElementById("revcamera");

        var inclWebView = true; // include/exclude webView content on top of cameraView
        var inclCameraBtns = true; // show/hide snapshot & revcamera btns

        if (inclWebView && !inclCameraBtns) {
            revCameraBtn.classList.add("hide");
            snapshotBtn.classList.add("hide");
        }

        setTimeout(function() {
            ezar.snapshot(
                function(base64EncodedImage) {

                    $scope.imgURI = base64EncodedImage;
                    window.localStorage.setItem('image', $scope.imgURI);
                    //perform screen capture
                    //show snapshot button
                    if (inclWebView && !inclCameraBtns) {
                        snapshotBtn.classList.remove("hide");
                        revCameraBtn.classList.remove("hide");
                    }
                }, null, {
                    encodingType: ezar.ImageEncoding.PNG,
                    includeWebView: inclWebView,
                    saveToPhotoAlbum: false,
                    fitWebViewToCameraView: false,
                    quality: 100
                });
        }, 200);
    };

    $scope.reverseCamera = function() {
        //ignore ghost clicks, wait 1.5 sec between invocations
        if (Date.now() - $scope.reverseCameraTimestamp < 1500) return;
        $scope.reverseCameraTimestamp = Date.now();

        var camera = ezar.getActiveCamera();
        if (!camera) {
            return; //no camera running; do nothing
        }

        var newCamera = camera;
        if (camera.getPosition() == "BACK" && ezar.hasFrontCamera()) {
            newCamera = ezar.getFrontCamera();
        } else if (camera.getPosition() == "FRONT" && ezar.hasBackCamera()) {
            newCamera = ezar.getBackCamera();
        }

        if (newCamera) {
            newCamera.start();
        }
    }
});

;
