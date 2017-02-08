#r "../node_modules/fable-core/Fable.Core.dll"
#r "../npm/Fable.Helpers.Sample.dll"

open Fable.Core.Testing
open Fable.Helpers.Sample

let test() =
    Assert.AreEqual(true, true)

test()
printfn "Test finished correctly"
