// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');

exports.config = {
  getPageTimeout: 60000,
  allScriptsTimeout: 60000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  commonCapabilities: {
    'browserstack.user': process.env['BROWSERSTACK_USER'],
    'browserstack.key': process.env['BROWSERSTACK_ACCESS_KEY'],
    'browserstack.local': true,
    'browserstack.debug': 'true'
  },
  multiCapabilities: [{
    'browserName': 'Chrome'
  }, {
    'browserName': 'Safari',
    'browser_version': '10'
  }, {
    'browserName': 'Firefox'
  }, {
    'browserName': 'IE',
    'browser_version': '11',
    'os': 'Windows',
    'os_version': '10'
  }],
  baseUrl: 'http://localhost:4000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  },
  // https://github.com/browserstack/protractor-browserstack
  // Code to start browserstack local before start of test
  beforeLaunch: function () {
    console.log("Connecting local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': exports.config.commonCapabilities['browserstack.key'] }, function (error) {
        if (error) return reject(error);
        console.log('Connected. Now testing...');

        resolve();
      });
    });
  },

  // Code to stop browserstack local after end of test
  afterLaunch: function () {
    return new Promise(function (resolve, reject) {
      exports.bs_local.stop(resolve);
    });
  }
};

// https://www.browserstack.com/automate/protractor
exports.config.multiCapabilities.forEach(function (caps) {
  for (var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
