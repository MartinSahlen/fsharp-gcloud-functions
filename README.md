# Fable Helpers Sample

This is an example of how to create and publish a [Fable](http://fable.io/) package to [npm](https://www.npmjs.com/).
The package will include the compiled JS code and a `.dll` with the F# type metadata.

Note our sample project is a library consisting of a single method to print key-value pairs
in padded format (because padding is one of the most demanded features in npm packages).

## Project structure

It is recommended that a Fable package has a structure similar to the following.

```text
/src/
/package.json
/build.js
/README.md
/RELEASE_NOTES.md
```

### `src`

Folder containing the F# source code and the `.fsproj` file. The convention is the project file
has the same name as the npm package, even though the former uses Pascal case with periods between
the words (`Fable.Helpers.Sample.fsproj`) while the latter uses snake case (`fable-helpers-sample`).

### `package.json`

Used both to manage our dependencies and to publish our package to npm.
There're dependencies that will be used only during development (like `fable-compiler`
and `fable-extra`) and others that will be necessary during runtime too (like `fable-core`).
However, for Fable packages it's recommended to use only `devDevependencies` and indicate in
the README the dependencies that must be downloaded by the consumer of the library. If several
packages specify different versions of `fable-core` for example, npm may try to install them all,
creating conflicts during Fable runtime.

> `peerDependencies` are supposed to fix this problem as they require dependencies to be installed
in the same level. However, the way they're handled by npm can be confusing and thus they're not
recommended at the moment.

Note the version number in this file is `0.0.0`. This is because the version will be automatically
updated by the build script.

### `README.md`

Description of our project that will appear both in our public repository (like Github)
and the [npm web site](https://www.npmjs.com/package/fable-helpers-sample).

### `RELEASE_NOTES.md`

This is optional, but it's recommended to easily track changes between different releases.
You can check the file in this sample project to see the format. Usually we will just include
the messages of the commits between versions. Furthermore, the build script can use this file
to automatically update the version number in `package.json`.

### `build.js`

Simple node.js script to build the project, inspired by [FAKE](http://fsharp.github.io/FAKE/).
Check the file contents to learn more, you can also know more details about the build process
in the following section.

## Building

The build script does all the work of building the project, which in this case is just calling Fable
using its JavaScript API and performing a few file I/O operations (for this we download the `fs-extra`
package). The script is inspired by [FAKE](http://fsharp.github.io/FAKE/) and it can contain different
build targets that can be easily chained. The script contains multiple comments so please check it for
more details. A couple of important notes though:

- We are including the Fable options in the script, but it would have the same effect to have a
  `fableconfig.json` file and just call `fable.compile()` (with no options) instead.
- A very important option here is the `dll` flag, which is use to generate a .NET assembly with the
  only purpose to store the F# type metadata so it can be referenced by other projects.

> Together with the `.dll` a `.fablemap` file will be generated to link the types in the assembly with
the compiled JS files.

### Module target

The convention is that all Fable packages use [ES2015 modules](http://www.2ality.com/2014/09/es6-modules-final.html) by default,
because Fable takes advantage of this module system to [reduce the app size](http://fable.io/blog/Tree-shaking.html) when using bundlers like [Rollup](http://rollupjs.org/)
(embedded in Fable) or [Webpack 2](https://webpack.js.org/).

> Please note that libraries shouldn't be bundled. Only final apps must be bundled.

However, some users may not want to bundle their apps but rather load each file separately in a node app
or with [require.js](http://requirejs.org/) in the browser. For these cases, the convention is to also include
the JS files compiled with the `umd` module target and put them in a subdirectory also named `umd`. If you
follow this convention, when the consumer of your library selects a UMD-compatible module target (commonjs, amd),
Fable will automatically detect if a `umd` folder is present in your package in order to reference the JS files
within it instead of the default ones.

As you can see in the build script, compiling with `umd` modules just involves creating a `umd` target
in the fableconfig and then calling it after the first compilation.

### Publishing

This is automatically done in the `publish` target of the build script, so you only need to type:

```shell
node build publish
```

This is equivalent to building the project and then running `npm publish` in the build directory.

> The machine must be authorized to publish npm packages, see [npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) documentation for details.

## Consuming

To use your library, a Fable developer only needs to download it from npm, together with others
packages your library may rely on (say, [fable-powerpack](https://github.com/fable-compiler/fable-powerpack)).

```shell
npm install --save fable-helpers-sample
```

Then the user must add a reference to the `.dll` within the package from the F# code. For example,
in the case of an `.fsx` script:

```fsharp
#r "../node_modules/fable-helpers-sample/Fable.Helpers.Sample.dll"

open Fable.Helpers.Sample
```

If it's an `.fsproj` file, add the following:

```xml
<ItemGroup>
    <Reference Include="../node_modules/fable-helpers-sample/Fable.Helpers.Sample.dll" />
</ItemGroup>
```

Nothing else needs to be done. When compiling the app, Fable will automatically detect the `.dll` correspond
to a Fable package and (thanks to `.fablemap` file) it will correctly replace the references to the types in
the assembly with references to the compiled JS files.
