/**
 * Created by ս on 2015/4/18.
 */

ZChart.Tool = {

    //require the font js file
    loadFontMesh : ( function () {

        var _text;
        var _size;
        var _height;
        var _color;
        var _p = new THREE.Vector3();
        return function ( text, p, size, height, color) {
            _text = ( text !== undefined ) ? text : "0";
            _size = ( size !== undefined ) ? size : 0.1;
            _height = ( height !== undefined ) ? height : 0.01;
            _color = ( color !== undefined ) ? color : 0x006df2;
            if( p !== undefined ) _p = p;

            var mesh = new THREE.Mesh(
                new THREE.TextGeometry( text, { size : _size, height : _height, curveSegment : 1, font : "helvetiker" } ),
                new THREE.MeshBasicMaterial( { color : _color } )
            );

            mesh.translateX( _p.x );
            mesh.translateY( _p.y );
            mesh.translateZ( _p.z );

            return mesh;
        }
    }()),

    //  Map value to the screen
    reRange: function( value, vec, positive ) {

        positive = ( positive !== undefined ) ? positive : 1;

        var l = vec.length;
        var maxi = vec[l-1];
        var mini = vec[0];

        var targetMax = Math.ceil( ( l - 1 ) / 2 );
        var targetMin = Math.ceil( ( l - 1 ) / - 2 );

        var pcg = ( value - mini ) / ( maxi - mini );

        if(positive == 1)
            return targetMin + ( pcg * ( targetMax - targetMin ) );
        else{
            return targetMax - ( pcg * ( targetMax - targetMin ) );
        }
    },

    getDarkColor: function( darkStandard ) {
        var r, g, b;
        r = parseInt(Math.random()*darkStandard);
        g = parseInt(Math.random()*darkStandard);
        b = parseInt(Math.random()*darkStandard);
        return ((r*256)+g)*256+b;
    }
};

