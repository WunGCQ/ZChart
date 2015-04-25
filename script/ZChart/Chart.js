/**
 * Created by ս on 2015/4/18.
 */

ZChart.Chart = function (dom) {

    this.scWidth = window.innerWidth - 200;
    this.scHeight = window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, this.scWidth/this.scHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.scWidth, this.scHeight);
    dom.appendChild(this.renderer.domElement);

    this.controls = new THREE.TrackballControls(this.camera, dom.firstChild );

    this.controls.rotateSpeed = 4.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    this.renderer.setClearColor(0x010100);

    this.autoRotate = true;

};

ZChart.Chart.prototype.constructor = ZChart.Chart;

ZChart.Chart.prototype.rotate = function ( theta ) {
    if( this.autoRotate == false ) return;
    var cosT = Math.cos(theta);
    var sinT = Math.sin(theta);
    var matrix = new THREE.Matrix3();
    matrix.set(
        cosT, 0, sinT,
        0, 1, 0,
        -sinT, 0, cosT
    );

    this.camera.position.applyMatrix3(matrix);
};

ZChart.Chart.prototype.switchAutoRotate = function () {
    this.autoRotate = !this.autoRotate;
};