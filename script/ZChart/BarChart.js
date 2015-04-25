

ZChart.BarChart = function (dom) {

    ZChart.Chart.call(this, dom);

    this.colorTheme = ZChart.DarkTheme;

    this.dataSource = 0;

    this.axisGeometry = [];
    this.axisMesh = [];
    this.barGeometry = [];
    this.barMesh = [];

    this.Dlight = new THREE.DirectionalLight(0xFFFFFF, 0.9);
    this.AlightDark = new THREE.AmbientLight(0x404040);
    this.AlightBright = new THREE.AmbientLight(0xAAAAAA);

    this.lightOn = true;

    this.userData = {};
};

ZChart.BarChart.prototype = Object.create(ZChart.Chart.prototype);
ZChart.BarChart.prototype.constructor = ZChart.BarChart;

ZChart.BarChart.prototype.drawFromJson = function ( data ) {

    this.dataSource = data;
    this.draw();

};

ZChart.BarChart.prototype.draw = function () {

    // Axis
    this.drawAxis();
    // Bar
    this.drawBars();

    this.Dlight.position.set(-20, 20, 20);
    this.scene.add(this.Dlight);
    this.scene.add(this.AlightDark);
};

ZChart.BarChart.prototype.loadDataFromJson = function ( path, callback ) {

    var _this = this;

    $.ajax({
        url:path,
        type:"POST",
        dataType:"json",
        success: function ( data ) {
            console.log(_this);
            _this.drawFromJson( data );
            callback.call();
        }
    });
};

ZChart.BarChart.prototype.drawAxis = function () {

    function getLineMesh ( v1, v2, color ) {
        var geo = new THREE.Geometry();
        geo.vertices.push(v1, v2);
        return new THREE.Line(geo, new THREE.LineBasicMaterial({color:color}));
    }

    //X axis
    this.axisGeometry[0] = new THREE.Geometry();
    this.axisGeometry[0].vertices.push(
        new THREE.Vector3(-20, 0, 0),
        new THREE.Vector3(20, 0, 0)
    );
    this.axisMesh[0] = new THREE.Line(this.axisGeometry[0], new THREE.LineBasicMaterial({color: 0xCCCCCC}));

    this.axisGeometry[1] = new THREE.Geometry();
    this.axisGeometry[1].vertices.push(
        new THREE.Vector3(0, -20, 0),
        new THREE.Vector3(0, 20, 0)
    );
    this.axisMesh[1] = new THREE.Line(this.axisGeometry[1], new THREE.LineBasicMaterial({color: 0xCCCCCC}));

    this.axisGeometry[2] = new THREE.Geometry();
    this.axisGeometry[2].vertices.push(
        new THREE.Vector3(0, 0, -20),
        new THREE.Vector3(0, 0, 20)
    );
    this.axisMesh[2] = new THREE.Line(this.axisGeometry[2], new THREE.LineBasicMaterial({color: 0xCCCCCC}));

    //mesh
    for(var i=-20;i<=20;i++){
        if(i == 0)continue;
        var groundMesh = getLineMesh(
            new THREE.Vector3(-20, 0, i),
            new THREE.Vector3(20, 0, i),
            0x666666
        );
        this.scene.add(groundMesh);

        groundMesh = getLineMesh(
            new THREE.Vector3(i, 0, -20),
            new THREE.Vector3(i, 0, 20),
            0x666666
        );
        this.scene.add(groundMesh);
    }


    for( var i = 0 ; i < 3 ; i++) {
        this.scene.add(this.axisMesh[i]);
    }
    this.camera.position.z = 23;
    this.camera.position.y = 9;
    this.camera.position.x = 13;
};

ZChart.BarChart.prototype.drawBars = function () {

    var bars = this.dataSource.value;
    var sum = bars.length;
    
    for( var i = 0; i < 20; i ++ ) {
        this.scene.remove(this.barMesh[i]);

        this.barGeometry[i] = new THREE.BoxGeometry(1, Math.abs(bars[i][1]), 1);
        this.barMesh[i] = new THREE.Mesh(
            this.barGeometry[i],
            new THREE.MeshLambertMaterial({color: Math.random()*0xFFFFFF})
        );

        this.barMesh[i].translateX(bars[i][0]);
        this.barMesh[i].translateZ(bars[i][2]);

        this.barMesh[i].translateY(
            bars[i][1]/2
        );

        this.scene.add(this.barMesh[i]);

    }
};

ZChart.BarChart.prototype.switchLight = function () {
    if(this.lightOn == true) {
        this.lightOn = false;
        this.scene.remove(this.Dlight);
        this.scene.remove(this.AlightDark);
        this.scene.add(this.AlightBright);

    }else{
        this.lightOn = true;
        this.scene.add(this.Dlight);
        this.scene.remove(this.AlightBright);
        this.scene.add(this.AlightDark);

    }
};