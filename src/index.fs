module GcloudFunction
open Fable.Import
open System

module ExpressHelpers = 
  type ExpressContext = {
    Request: express.Request
    Response: express.Response
  }

  type ExpressPart = ExpressContext -> ExpressContext option

  let bind p1 ctx = 
    match ctx with
    | Some ctx -> p1 ctx
    | None -> None

  let compose p1 p2 ctx = 
    match p1 ctx with
    | None -> None
    | Some ctx -> p2 ctx

  let (>>=) x p = p x
  let (>=>) p1 p2 = compose p1 p2 

  let rec choose parts ctx = 
    match parts with
    | [] -> None
    | p::ps ->
      match p ctx with
      | None -> choose ps ctx
      | Some ctx -> Some ctx

  let answer = function
    | Some ctx ->
      ctx.Response
    | None -> raise (exn "Failed")

open ExpressHelpers

let hasBodyPart str ctx = 
  if ctx.Request.body.ToString().Contains(str) 
  then 
    {
      ctx with 
        Response = (ctx.Response.send ("Hello world: " + str))
    } |> Some
  else
    None

let helloTomas (request: express.Request) (response: express.Response) =
  let ctx = { Request = request; Response = response }
  ctx
  |> choose [
    hasBodyPart "Hello"
    hasBodyPart "Yolo"
  ]
  |> answer
//  response.send "Hello, World!"

let yolo (request: express.Request) (response: express.Response) =
  response.send "Yolo, World!"
