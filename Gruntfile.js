/**
 *
 * @created ${DATE}
 *
 * @author Popov Nikolay <cejixo3dr@gmail.com>
 * @copyright Beeplans ${YEAR}
 */

module.exports = function (grunt) {

    grunt.initConfig({


        pkg: {
            npm: grunt.file.readJSON('package.json'),
            bower: grunt.file.readJSON('bower.json')
        },


        /**
         * Copy task: copy from src to dst.
         * {@link https://github.com/gruntjs/grunt-contrib-copy}
         */
        copy: {
            main: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: [
                    'build/vendor/js/vendor.min.js',
                    'build/application/js/application.min.js',
                    'build/application/js/application.js'
                ],
                dest: './app/js/'
            },
            big: {
                expand: true,
                flatten: true,
                filter: 'isFile',
                src: [
                    'runtime/vendor/js/vendor.js',
                    'runtime/application/js/application.js'
                ],
                dest: './app/js/'
            }
        },


        /**
         * Task for clean up.
         * {@link https://github.com/gruntjs/grunt-contrib-clean}
         */
        clean: {
            build: {
                src: [
                    'runtime'
                ]
            }
        },


        /**
         * Checking js code
         * grunt-contrib-jshint
         * {@link https://github.com/gruntjs/grunt-contrib-jshint}
         */
        jshint: {
            all: ['Gruntfile.js', 'sources/angular/**/*.js', 'sources/vanilla/**/*.js']
        },


        /**
         * If you haven't used Grunt before, be sure to check out the Getting Started guide,
         * as it explains how to create a Gruntfile as well as install and use Grunt plugins.
         * {@link https://github.com/gruntjs/grunt-contrib-uglify}
         */
        uglify: {
            options: {
                report: 'min',
                mangle: false,
                banner: '/** \n * <%= pkg.bower.name %> <%= grunt.template.today("yyyy-mm-dd") %>  \n */\n'
            },
            build: {
                files: [
                    {
                        src: 'runtime/vendor/js/vendor.js',
                        dest: 'build/vendor/js/vendor.min.js'
                    },
                    {
                        src: 'runtime/application/js/application.js',
                        dest: 'build/application/js/application.min.js'
                    }
                ]
            }
        },


        /**
         * Concat Project files.
         * {@link https://github.com/gruntjs/grunt-contrib-concat}
         */
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'sources/vanilla/**/*.js',
                    'runtime/application/js/angular_application.js'
                    /*'runtime/application/js/angular_application_templates.js'*/
                ],
                dest: 'runtime/application/js/application.js'
            }
        },


        /**
         * Build angular application (concat) with right order.
         * {@link https://www.npmjs.com/package/grunt-angular-builder}
         */
        'angular-builder': {
            options: {
                mainModule: 'FSUAClient.application',
                externalModules: ['ui.bootstrap', 'ngRoute', 'btford.socket-io', 'ngAnimate']
            },
            app: {
                src: [
                    'runtime/application/js/templates_auto_generated.js',
                    'sources/angular/**/*.js'
                ],
                dest: 'runtime/application/js/angular_application.js'
            }
        },


        /**
         * Automatic concatenation of installed Bower components (JS and/or CSS) in the right order.
         * {@link https://github.com/sapegin/grunt-bower-concat}
         */
        bower_concat: {
            all: {
                dest: {
                    'js': 'runtime/vendor/js/vendor.js'
                    /*'css': 'runtime/vendor/css/vendor.css'*/
                },
                exclude: [
                /**
                 * If license not allow to modify code
                 */
                ],
                bowerOptions: {
                    relative: true
                }
            }
        },


        /**
         * Cache all .html templates to Angular $templateCache
         * {@link https://www.npmjs.com/package/grunt-angular-templates}
         */
        ngtemplates: {
            app: {
                src: ['sources/**/*.html'],
                dest: 'runtime/application/js/templates_auto_generated.js',
                options: {
                    standalone: true,
                    module: 'CacheTemplatesAutoGenerated.application',
                    url: function (url) {
                        /**
                         * Show created templates in console
                         */
                        console.log(url.replace('.html', '')
                            .replace('sources/templates/modules/', '')
                            .replace('sources/templates/components/', '')
                            .replace(/\//g, '_'));
                        return url.replace('.html', '')
                            .replace('sources/templates/modules/', '')
                            .replace('sources/templates/components/', '')
                            .replace(/\//g, '_');
                    }
                }
            }
        },

        /**
         * Compile Jade templates
         * {@link https://github.com/gruntjs/grunt-contrib-jade}
         */
        jade: {
            compile: {
                options: {
                    pretty: true
                },
                files: [{
                    cwd: 'sources/templates',
                    src: '**/*.jade',
                    dest: 'sources/templates',
                    expand: true,
                    ext: '.html'
                }]
            }
        },

        less: {
            development: {
                options: {
                    paths: ["sources/less/"]
                },
                files: {
                    "app/css/application.min.css": "sources/styles/less/root.less"
                }
            }/*,
             production: {
             options: {
             paths: ["assets/css"],
             plugins: [
             new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
             new (require('less-plugin-clean-css'))(cleanCssOptions)
             ],
             modifyVars: {
             imgPath: '"http://mycdn.com/path/to/images"',
             bgColor: 'red'
             }
             },
             files: {
             "path/to/result.css": "path/to/source.less"
             }
             }*/
        },

        /**
         *  Watch changes
         */
        watch: {
            node: {
                files: ['app/**/*'],
                tasks: ['nwjs'],
                options: {
                    spawn: false
                }
            }
        },

        /**
         * grunt-nw-builder
         * {@link https://github.com/nwjs/grunt-nw-builder}
         */
        nwjs: {
            options: {
                platforms: ['win64', 'linux64'],
                buildDir: './binary',
                version: '0.12.2'
            },
            src: './app/**/*'
        }
    });


    /**
     * Place to load tasks
     */
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-angular-builder');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-nw-builder');


    /**
     * Place to register tasks.
     */
    grunt.registerTask('default', [
        'jshint',
        'bower_concat',
        'jade',
        'ngtemplates',
        'angular-builder',
        'concat',
        'uglify',
        'copy:main',
        'less',
        'clean',
        'nwjs'
    ]);
    /*grunt.registerTask('default', ['watch']);*/
};