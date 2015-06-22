module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            TypeScript: {
                command: 'node node_modules/typescript/bin/tsc.js bootstrap.ts --out dist/nerve.js --sourceMap'
            }
        },
        uglify: {
            options: {
                banner: [
                    '/*! <%= pkg.name %> - v<%= pkg.version %> - ',
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
                ].join('')
            },
            prod: {
                files: {
                    '../nerve.min.js': ['dist/nerve.js']
                }
            }
        },
        copy: {
            prod: {
                files: [
                    // includes files within path
                    {expand: false, src: ['dist/nerve.js'], dest: '../nerve.js', filter: 'isFile'}
                ]
            }
        },
        testem: {
            unit: {
                options: {
                    framework: 'jasmine2',
                    launch_in_dev: ['PhantomJS'],
                    before_tests: '',
                    serve_files: [
                        'dist/**/*.js',
                        'test/**/*.js'
                    ],
                    watch_files: [
                        'dist/**/*.js',
                        'test/**/*.js'
                    ]
                }
            }
        },
        watch: {
            scripts: {
                files: ['**/*.ts'],
                tasks: ['shell']
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-testem');


    grunt.registerTask('default', ['shell', 'watch']);
    grunt.registerTask('test', ['testem:run:unit']);
    grunt.registerTask('prod', ['shell', 'copy:prod', 'uglify:prod']);

};