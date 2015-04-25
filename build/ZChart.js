/**
 * Created by ս on 2015/4/18.
 */


// version info
var ZChart = { VERSION : 0.1 };

// color themes
ZChart.DarkTheme = 0;
ZChart.LightTheme = 1;


/**
 * Created by ս on 2015/4/18.
 */

ZChart.Chart = function () {

    this.scene = new THREE.Scene ();
    this.camera = new THREE.PerspectiveCamera ( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    //this.orthoCamera = new THREE.OrthographicCamera(pcLeft-3, pcRight+3, pcTop+1, pcBottom-1, 10, -1000);
    this.renderer = new THREE.WebGLRenderer ();
    this.controls = new THREE.TrackballControls ( this.camera );

    this.controls.rotateSpeed = 4.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
    this.controls.addEventListener( 'change', this.render);

    this.renderer.setClearColor( 0x010100 );
};

ZChart.Chart.prototype = {
    constructor: ZChart.Chart,
    
    setCamera: function () {
        console.log( "yes" );
    },

    render: function () {
        renderer.render(this.camera);
    }
};

/**
 * Created by ս on 2015/4/18.
 */


ZChart.LineChart = function () {

    ZChart.Chart.call( this );

    this.colorTheme = ZChart.DarkTheme;

    this.xAxis = [];
    this.yAxis = [];
    this.zAxis = [];

    this.pcLeft = 0;
    this.pcRight = 0;
    this.pcTop = 0;
    this.pcBottom = 0;
    this.pcFront = 0;
    this.pcBack = 0;
};

ZChart.LineChart.prototype = Object.create( ZChart.Chart.prototype );
ZChart.LineChart.prototype.constructor = ZChart.LineChart;

ZChart.LineChart.prototype.setDataFromJson = function () {

};

ZChart.LineChart.prototype.loadDataFromJson = function ( path ) {

    $.ajax({
        url:path,
        type:"POST",
        dataType:"json",
        success: function ( data ) {
            console.log(data);
        }
    });
};

// set axis from string array x, y and z
ZChart.LineChart.prototype.setAxis = function ( x, y ,z ) {

    this.xAxis = x;
    this.yAxis = y;
    this.zAxis = z;

    var halfx = Math.ceil( x.length/2 );
    var halfy = Math.ceil( y.length/2 );
    var halfz = Math.ceil( z.length/2 );

    this.pcLeft = - halfx;
    this.pcRight = halfx;
    this.pcTop = halfy;
    this.pcBottom = - halfy;
    this.pcFront = halfz;
    this.pcBack = - halfz;
    
};

ZChart.LineChart.prototype.draw = function () {
    
    for(i=pcLeft;i<=pcRight;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(i, pcBottom, pcFront),
            new THREE.Vector3(i, pcBottom, pcBack)
        ));
        // subtext for x axis
        if(pcRight == 6)
            this.scene.add(getMonthMesh(
                new THREE.Vector3(i, pcBottom, pcFront)
            ));
        else
            this.scene.add(getNumberMesh(
                new THREE.Vector3(i, pcBottom, pcFront)
            ));
        this.scene.add(getLineMesh(
            new THREE.Vector3(i, pcTop, pcFront),
            new THREE.Vector3(i, pcTop, pcBack)
        ));
    }
    for(i=pcBottom;i<=pcTop;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(pcLeft, i, pcFront),
            new THREE.Vector3(pcLeft, i, pcBack)
        ));
        // subtext for y axis
        this.scene.add(getPollutionMesh(
            new THREE.Vector3(pcLeft, i, pcFront)
        ));
        this.scene.add(getLineMesh(
            new THREE.Vector3(pcRight, i, pcFront),
            new THREE.Vector3(pcRight, i, pcBack)
        ));
    }
    for(i=pcBack;i<=pcFront;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(pcLeft, pcBottom, i),
            new THREE.Vector3(pcRight, pcBottom, i)
        ));
        this.scene.add(getLineMesh(
            new THREE.Vector3(pcLeft, pcTop, i),
            new THREE.Vector3(pcRight, pcTop, i)
        ));
    }
    for(i=pcBack;i<=pcFront;i++){
        this.scene.add(getLineMesh(
            new THREE.Vector3(pcLeft, pcTop, i),
            new THREE.Vector3(pcLeft, pcBottom, i)
        ));
        this.scene.add(getLineMesh(
            new THREE.Vector3(pcRight, pcTop, i),
            new THREE.Vector3(pcRight, pcBottom, i)
        ));
    }
};

