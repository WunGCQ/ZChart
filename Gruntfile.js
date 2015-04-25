module.exports = function ( grunt ) {
	//
	grunt.initConfig ({
		pkg : grunt.file.readJSON ( 'package.json' ),
		concat : {
			domop: {
				src: [
					'script/ZChart/ZChart.js',
					'script/ZChart/Chart.js',
					'script/ZChart/LineChart.js'
				],
				dest: 'build/ZChart.js'
			}
		},

		uglify : {
			options: {
				banner : "ZChart"
			},
			build : {
				src : 'build/ZChart.js',
				dest : 'build/ZChart.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'uglify']);
};