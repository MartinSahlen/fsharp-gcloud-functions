#load "../node_modules/fable-import-express/Fable.Import.Express.fs"

open Fable.Import

module GcloudFunction =
  let helloWorld (request: express.Request) (response: express.Response) =
    response.send "Hello, World!"

  let yolo (request: express.Request) (response: express.Response) =
    response.send "Hello, World!"
