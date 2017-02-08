## WAT?

Make F# run on google cloud functions

## How?

Do `npm install && npm run build &&`, then:

`gcloud alpha functions deploy helloWorld --stage-bucket <your_bucket> --trigger-http`
