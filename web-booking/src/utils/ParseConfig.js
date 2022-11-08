import Parse from "parse";

export async function parseConfig() {
  Parse.initialize(
    process.env.REACT_APP_ID,
    process.env.REACT_APP_JAVASCRIPT_KEY
  );
  Parse.serverURL = process.env.REACT_APP_SERVER_URL;
}
