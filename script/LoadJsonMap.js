/**
 * Created by 战 on 2015/3/22.
 */

var ZP;
ZP = {};     //package name


//返回一个国家的地理信息
ZP.LoadJsonMap = function(url, adjust, callback){
    var _this = this;
    $.getJSON(url, function(data){
        var allData = data.features;
        _this.states = [];
        for(var i=0;i<allData.length;i++){
            _this.states[i] = {};
            _this.states[i].coordinates = [];
            _this.states[i].name = (allData[i].properties.name == undefined)?allData[i].properties.NAME:allData[i].properties.name;
            var g = allData[i].geometry.coordinates;
            if($.isArray(g[0][0][0])){
                for(var j=0;j< g.length;j++){
                    _this.states[i].coordinates[j] = [];
                    var li = g[j][0];
                    for(var k=0;k<li.length;k++){
                        _this.states[i].coordinates[j].push(new THREE.Vector3(li[k][0]+adjust[0], 0, -li[k][1]-adjust[1]));
                    }
                }
            }else{
                _this.states[i].coordinates[0] = [];
                var li = g[0];
                for(var k=0;k<li.length;k++){
                    _this.states[i].coordinates[0].push(new THREE.Vector3(li[k][0]+adjust[0], 0, -li[k][1]-adjust[1]));
                }

            }
        }


        callback.call();
    });

}
