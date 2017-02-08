module Fable.Helpers.Sample.MyLib
#r "../node_modules/fable-core/Fable.Core.dll"
#load "../node_modules/fable-import-express/Fable.Import.Express.fs"

open System
open Fable.Core
open Fable.Import

/// Use example
/// [ ("A", 234.45); ("B", 23458.0214) ]
/// |> printPairsPadded 3 12
let helloWorld (request: express.Request) (response: express.Response) =
    response.send "Hello, World!"
