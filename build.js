var path = require("path");
var fs = require("fs-extra");
var fable = require("fable-compiler");

var BUILD_DIR = "npm"
var RELEASE_NOTES = "RELEASE_NOTES.md"
var PROJ_FILE = "src/Fable.Helpers.Sample.fsproj"

// Here we're defining Fable options directly in the build script
// as a JS object, but it would have the same effect if we put them
// in a `fableconfig.json` json file.
var fableconfig = {
    projFile: PROJ_FILE,
    outDir: BUILD_DIR,
    module: 'commonjs',
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
            // Run a simple test to make sure the build is correct
            // Now let's take the latest version from the release notes and update package.json
    },
}

// As with FAKE scripts, run a default target if no one is specified
targets[process.argv[2] || "all"]().catch(err => {
    console.log(err);
    process.exit(-1);
});
