module Fable.Helpers.Sample.MyLib
#r "../node_modules/fable-core/Fable.Core.dll"
#load "../node_modules/fable-import-express/Fable.Import.Express.fs"

open System
open Fable.Core
open Fable.Import

let helloWorld (request: express.Request) (response: express.Response) =
    response.send "Hello, World!"
