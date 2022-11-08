import { parseServerConfiguration } from "./config/parse-server";
const { default: ParseServer, ParseGraphQLServer } = require("parse-server");
import express, { Request, Response } from "express";
import cors from "cors";
var bp = require("body-parser");

var port = process.env.PORT;
var mountPath = "/parse";
var serverURL =
  process.env.SERVER_URL || "http://localhost:" + port + mountPath; // Don't forget to change to https if needed
var parseServer = new ParseServer(parseServerConfiguration); // Convert all the prior code to this line to TYPESCRIPT
var liveQuery = process.env.LIVEQUERY_SUPPORT;

while (true) {
  try {
    var app = express();

    var trustProxy = !!+(process.env.TRUST_PROXY || "1"); // default enable trust
    if (trustProxy) {
      console.log("trusting proxy: " + process.env.TRUST_PROXY);
      app.enable("trust proxy");
    }
    
    app.use(cors({
        origin: '*'
    }));

    app.use(cors({
      origin: '*'
    }))

    app.use(mountPath, parseServer.app);
    app.use(bp.json());

    app.get("/", (req: Request, res: Response) => {
      res.send("Parse API is running...!");
    });


    if (liveQuery) {
      console.log("Starting live query server");
      var httpServer = require("http").createServer(app);
      httpServer.listen(port);
      ParseServer.createLiveQueryServer(httpServer);
    } else {
      app.listen(port, function () {
        console.log(
          "dr-h-co-api-server running on " +
          serverURL +
          " (:" +
          port +
          mountPath +
          ")"
        );
      });
    }
    // GraphQL
    var isSupportGraphQL = process.env.GRAPHQL_SUPPORT;

    console.log("isSupportGraphQL :", isSupportGraphQL);

    if (isSupportGraphQL) {
      console.log("Starting GraphQL...");

      // Create the GraphQL Server Instance
      const parseGraphQLServer = new ParseGraphQLServer(parseServer, {
        graphQLPath: "/graphql",
        playgroundPath: "/playground",
      });

      // Mounts the GraphQL API using graphQLPath: '/graphql'
      parseGraphQLServer.applyGraphQL(app);
      // (Optional) Mounts the GraphQL Playground - do NOT use in Production
      parseGraphQLServer.applyPlayground(app);

      isSupportGraphQL &&
        console.log(
          "GraphQL running on " +
          serverURL.split(port + mountPath).join(port) +
          "/graphql"
        );
      isSupportGraphQL &&
        console.log(
          "GraphQL Playground is available at " +
          serverURL.split(port + mountPath).join(port) +
          "/playground"
        );
    }
    break;
  } catch (error) {
    console.log(error);
  }
}

// app.listen(port, () => {
//   console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
// });