var path = require("path");
var fs = require("fs-extra");
var fable = require("fable-compiler");

// We will use `npm` as the build directory as it will contain
// the contents of the package to be published in npm. However,
// you can give it another name if you prefer.
var BUILD_DIR = "npm"
var PKG_JSON = "package.json"
var README = "README.md"
var RELEASE_NOTES = "RELEASE_NOTES.md"
var PROJ_FILE = "src/Fable.Helpers.Sample.fsproj"

// Here we're defining Fable options directly in the build script
// as a JS object, but it would have the same effect if we put them
// in a `fableconfig.json` json file.
var fableconfig = {
    projFile: PROJ_FILE,
    outDir: BUILD_DIR,
    dll: true,
    sourceMaps: true
};

var fableconfigUMD = {
    projFile: PROJ_FILE,
    outDir: path.join(BUILD_DIR,"umd"),
    module: "umd",
    sourceMaps: true
};

var targets = {
    all() {
        // We use Fable's `promisify` helper to convert node-style async functions
        // from "fs-extra" into Promise-returning functions. We will first remove
        // the contents of the build directories to have a clean build
        return fable.promisify(fs.remove, BUILD_DIR)
            // When this is complete, compile the F# project using Fable
            .then(_ => fable.compile(fableconfig))
            // According to the convention for Fable packages, compile the project
            // again with UMD modules and put the files in a `umd` subdirectory
            .then(_ => fable.compile(fableconfigUMD))
            // Run a simple test to make sure the build is correct
            .then(_ => fable.compile("test"))
            // Copy `package.json` and `README.md` into the build directory
            .then(_ => fable.promisify(fs.copy, PKG_JSON, path.join(BUILD_DIR, PKG_JSON)))
            .then(_ => fable.promisify(fs.copy, README, path.join(BUILD_DIR, README)))
            // Now let's take the latest version from the release notes and update package.json
            .then(_ => fable.promisify(fs.readFile, RELEASE_NOTES))
            .then(releaseNotes => {
                // Capture the version number on top of release notes
                var version = /\d[^\s]*/.exec(releaseNotes)[0];
                // Now run "npm version" command to update the version
                // in the `package.json` copy within the build directory
                return fable.runCommand(BUILD_DIR, "npm version " + version);
            });
    },
    publish() {
        // Because all targets return promises, chaining them becomes trivial
        return this.all()
            .then(_ => fable.runCommand(BUILD_DIR, "npm publish"))
    }
}

// As with FAKE scripts, run a default target if no one is specified
targets[process.argv[2] || "all"]().catch(err => {
    console.log(err);
    process.exit(-1);
});