'use strict'

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['./.']
    },
    mochaTest: {
      test: {
        options: {
          timeout: 30000,
          reporter: 'spec'
        },
        src: [
          //'test/**/*_test.js',
          // 'test/unit/services/instagram/**/*_test.js',
          // 'test/integration/competitors_test.js'
          //'test/unit/services/instagram/taskController/process_test.js'
        ] //order matters .. so first unit test are run and then integrated test
      }
    },
    'mocha_istanbul': {
      coveralls: {
        src: [
          'test/**/*_test.js'
        ], // multiple folders also works
        options: {
          timeout: 30000,
          reporter: 'spec',
          coverage: true, // this will make the grunt.event.on('coverage') event listener to be triggered
          root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
          reportFormats: ['cobertura', 'lcov']
        }
      }
    }
  })

  grunt.event.on('coverage', function (lcovFileContents, done) {
    // Check below on the section "The coverage event"
    done()
  })

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-mocha-test')
  grunt.loadNpmTasks('grunt-mocha-istanbul')

  // Default task.
  grunt.registerTask('default', ['eslint', 'mocha_istanbul:coveralls'])
}
