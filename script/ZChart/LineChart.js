/**
 * Created by ս on 2015/4/18.
 */


ZChart.LineChart = function (dom) {

    ZChart.Chart.call( this, dom );

    this.colorTheme = ZChart.DarkTheme;

    this.dataSource = 0;

    this.xAxis = [];
    this.yAxis = [];
    this.zAxis = [];

    this.pcLeft = 0;
    this.pcRight = 0;
    this.pcTop = 0;
    this.pcBottom = 0;
    this.pcFront = 0;
    this.pcBack = 0;

    this.dataGeometry = [];
    this.dataMesh = [];
    this.linkGeometry = [];
    this.linkMesh = [];
    this.pcGeometry = [];
    this.pcMesh = [];

    this.showPointCloud = true;
    this.autoRotate = true;
};

ZChart.LineChart.prototype = Object.create( ZChart.Chart.prototype );
ZChart.LineChart.prototype.constructor = ZChart.LineChart;


ZChart.LineChart.prototype.setAxis = function ( x, y ,z ) {

    this.xAxis = x;
    this.yAxis = y;
    this.zAxis = z;

    var halfx = ( x.length - 1 )/2;
    var halfy = ( y.length - 1 )/2;
    var halfz = ( z.length - 1 )/2;

    this.pcLeft = Math.ceil(- halfx);
    this.pcRight = Math.ceil(halfx);
    this.pcTop = Math.ceil(halfy);
    this.pcBottom = Math.ceil(- halfy);
    this.pcFront = Math.ceil(halfz);
    this.pcBack = Math.ceil(- halfz);

    this.camera.position.z = this.pcFront*2;
};

// set axis from string array x, y and z

ZChart.LineChart.prototype.draw = function () {

    // surrounding mesh
    this.drawSurroundingMesh( 0x449999 );

    // data points
    this.drawData( 0x66ccff );

    //point cloud effect
    this.drawPointCloud();

};

ZChart.LineChart.prototype.drawFromJson = function ( data ) {

    var x = data.axis[0];
    var y = data.axis[1];
    var z = data.axis[2];

    this.setAxis( x, y, z );

    this.dataSource = data;
    this.draw();

};

ZChart.LineChart.prototype.loadDataFromJson = function ( path, callback ) {

    var _this = this;

    $.ajax({
        url:path,
        type:"POST",
        dataType:"json",
        success: function ( data ) {

            _this.drawFromJson( data );
            callback.call();
        }
    });
};

ZChart.LineChart.prototype.drawPointCloud = function () {
    var pcDensity = 15000;
    var front = this.pcFront;

    for ( i = 0 ; i < this.pcFront - this.pcBack ; i++) {
        this.scene.remove(this.pcMesh[i]);

        this.pcGeometry[i] = new THREE.Geometry();
        for (j = 0; j < pcDensity; j++) {
            var vTest = new THREE.Vector3(
                Math.random() * (this.pcRight - this.pcLeft + 2) + this.pcLeft - 1,
                Math.random() * (this.pcTop - this.pcBottom + 2) + this.pcBottom - 1,
                Math.random() + front - 1
            );
            if (vTest.x > this.pcLeft && vTest.x < this.pcRight && vTest.y > this.pcBottom && vTest.y < this.pcTop)
                this.pcGeometry[i].vertices.push(vTest);
        }
        this.pcMesh[i] = new THREE.PointCloud(this.pcGeometry[i], new THREE.PointCloudMaterial({
            size: 0.01,
            color: ZChart.Tool.getDarkColor(0x66)
        }));
        if(this.showPointCloud)
            this.scene.add(this.pcMesh[i]);

        front -= 1;
    }
};

ZChart.LineChart.prototype.drawData = function ( color ) {
    var pts = this.dataSource.value;

    for ( i = 0; i < pts.length ; i ++) {
        this.scene.remove(this.dataMesh[i]);

        this.dataGeometry[i] = new THREE.SphereGeometry(0.065, 10, 10);
        this.dataMesh[i] = new THREE.Mesh(this.dataGeometry[i], new THREE.MeshBasicMaterial({color:color}));

        this.dataMesh[i].translateX(i + this.pcLeft);
        this.dataMesh[i].translateY( ZChart.Tool.reRange( pts[i][1], this.yAxis, 1 ) );
        this.dataMesh[i].translateZ( ZChart.Tool.reRange( pts[i][2], this.zAxis, -1 ) );

        this.scene.add(this.dataMesh[i]);

    }

    //data link lines
    for ( i = 0; i < pts.length - 1; i ++ ) {
        this.scene.remove(this.linkMesh[i]);

        this.linkGeometry[i] = new THREE.Geometry();
        this.linkGeometry[i].vertices.push( this.dataMesh[i].position, this.dataMesh[i + 1].position);
        this.linkMesh[i] = new THREE.Line(this.linkGeometry[i], new THREE.LineBasicMaterial({color: color}));

        this.scene.add(this.linkMesh[i]);
    }
};

ZChart.LineChart.prototype.drawSurroundingMesh = function ( color ) {

    function getLineMesh ( v1, v2 ) {
        var geo = new THREE.Geometry();
        geo.vertices.push(v1, v2);
        return new THREE.Line(geo, new THREE.LineBasicMaterial({color:0x888888}));
    }

    for(i=this.pcLeft;i<=this.pcRight;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(i, this.pcBottom, this.pcFront),
            new THREE.Vector3(i, this.pcBottom, this.pcBack)
        ));
        // subtext for x axis
        this.scene.add(
            ZChart.Tool.loadFontMesh(
                this.xAxis[i-this.pcLeft].toString(),
                new THREE.Vector3(i, this.pcBottom-0.1, this.pcFront),
                0.05,
                0.01,
                color
            )
        );

        this.scene.add(getLineMesh(
            new THREE.Vector3(i, this.pcTop, this.pcFront),
            new THREE.Vector3(i, this.pcTop, this.pcBack)
        ));
    }
    for(i=this.pcBottom;i<=this.pcTop;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(this.pcLeft, i, this.pcFront),
            new THREE.Vector3(this.pcLeft, i, this.pcBack)
        ));
        // subtext for y axis
        this.scene.add(
            ZChart.Tool.loadFontMesh(
                this.yAxis[i-this.pcBottom].toString(),
                new THREE.Vector3(this.pcLeft-0.15, i, this.pcFront),
                0.05,
                0.01,
                color
            )
        );


        this.scene.add(getLineMesh(
            new THREE.Vector3(this.pcRight, i, this.pcFront),
            new THREE.Vector3(this.pcRight, i, this.pcBack)
        ));
    }
    for(i=this.pcBack;i<=this.pcFront;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(this.pcLeft, this.pcBottom, i),
            new THREE.Vector3(this.pcRight, this.pcBottom, i)
        ));
        this.scene.add(getLineMesh(
            new THREE.Vector3(this.pcLeft, this.pcTop, i),
            new THREE.Vector3(this.pcRight, this.pcTop, i)
        ));
    }
    for(i=this.pcBack;i<=this.pcFront;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(this.pcLeft, this.pcTop, i),
            new THREE.Vector3(this.pcLeft, this.pcBottom, i)
        ));
        this.scene.add(getLineMesh(
            new THREE.Vector3(this.pcRight, this.pcTop, i),
            new THREE.Vector3(this.pcRight, this.pcBottom, i)
        ));
    }
};

ZChart.LineChart.prototype.switchPointCloud = function () {
    this.showPointCloud = !this.showPointCloud;
    this.drawPointCloud();
};
