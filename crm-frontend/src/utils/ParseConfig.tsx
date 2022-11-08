import Parse from "parse";

export function parseConfig() {
  (Parse as any).initialize(
    process.env.REACT_APP_ID,
    process.env.REACT_APP_JAVASCRIPT_KEY
  );
  (Parse as any).serverURL = process.env.REACT_APP_SERVER_URL;
}
