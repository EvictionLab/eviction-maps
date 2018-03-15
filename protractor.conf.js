// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');

const browserStackConfig = {
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
    'browserName': 'Chrome',
    'resolution': '1440x900',
  }, {
    'browserName': 'Safari',
    'browser_version': '10',
    'resolution': '1440x900'
  }, {
    'browserName': 'Firefox',
    'browserVersion': '57',
    'resolution': '1440x900'
  }, {
    'browserName': 'IE',
    'browser_version': '11',
    'os': 'Windows',
    'os_version': '10',
    'resolution': '1440x900'
  }],
  baseUrl: 'http://localhost:4000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function () { }
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
browserStackConfig.multiCapabilities.forEach(function (caps) {
  for (var i in browserStackConfig.commonCapabilities) caps[i] = caps[i] || browserStackConfig.commonCapabilities[i];
});

const localConfig = {
  getPageTimeout: 120000,
  allScriptsTimeout: 120000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  directConnect: true,
  baseUrl: 'http://localhost:4000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: function() {}
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStackTrace: true }}));
  }
};

exports.config = process.env['TRAVIS_BRANCH'] ? browserStackConfig : localConfig;
