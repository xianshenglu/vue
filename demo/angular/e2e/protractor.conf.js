// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const { SpecReporter, StacktraceOption } = require("jasmine-spec-reporter");
const HtmlReporter = require("protractor-beautiful-reporter");
const { logging } = require("selenium-webdriver");
const path = require("path");

const { E2E_HEADLESS } = process.env;
const chromeDynamicArgs = E2E_HEADLESS ? ["--headless"] : [];
/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: ["./src/**/*.e2e-spec.ts"],
  capabilities: {
    browserName: "chrome",
    "goog:chromeOptions": {
      args: [
        "--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
        "--window-size=575,741",
        "--log-level=3",
        ...chromeDynamicArgs,
      ],
    },
  },
  directConnect: true,
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: "http://localhost:4200",
  framework: "jasmine",
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print() {},
  },
  onPrepare() {
    // eslint-disable-next-line global-require
    require("ts-node").register({
      project: path.join(__dirname, "./tsconfig.json"),
    });
    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: StacktraceOption.PRETTY,
        },
      })
    );
    jasmine.getEnv().addReporter(
      new HtmlReporter({
        baseDirectory: "tmp/screenshots",
        preserveDirectory: false,
      }).getJasmine2Reporter()
    );
    async function ExpectNoErrorLog() {
      const logs = await browser.manage().logs().get(logging.Type.BROWSER);
      expect(logs).not.toContain(
        jasmine.objectContaining({
          level: logging.Level.SEVERE,
        })
      );
    }
    afterEach(ExpectNoErrorLog);
  },
};
