exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec.js'],
    "browserName": "chrome",
    "chromeOptions": {
        binary: "D:/Program Files/Chrome/chrome.exe",
        args: [],
        extensions: []
    }
}
