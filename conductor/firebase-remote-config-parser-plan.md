# Firebase Remote Config Parser Plan

## Objective

The `firebase:remoteconfig` npm script currently downloads the entire Firebase Remote Config template, which contains lots of schema and metadata overhead. The goal is to update this process to download the template and then parse it down into a simplified key/value JSON map (which the Angular app can then ingest directly as default values without runtime mapping logic).

## Context

- `package.json` contains the current script: `"firebase:remoteconfig": "cd firebase-workspace && firebase remoteconfig:get --project vertexai-prompt-templates -o remote_config_defaults.json"`.
- `firebase-workspace/remote_config_defaults.json` currently holds the verbose schema.

## Proposed Plan

1. **Modify npm Script**: Update the script in `package.json` to pipe the output through `jq` to extract just the default values and restructure them.
    - *New Script*: `"firebase:remoteconfig": "cd firebase-workspace && firebase remoteconfig:get --project vertexai-prompt-templates | jq '[.parameters | to_entries | .[] | {key: .key, value: .value.defaultValue.value}] | from_entries' > remote_config_defaults.json"`
    - *Note*: This requires `jq` to be available on the user's system. Alternatively, we could write a Node.js parser script if we want to avoid relying on `jq` being installed globally. Let's ask the user.

    *(Since the user previously selected a Node Script over an Inline Parser, I will plan for the Node Script approach)*

1. **Create a Node Parsing Script**:
    - Create `scripts/download-remote-config.js` (or similar).
    - This script will use `child_process.execSync` to run the `firebase remoteconfig:get` command and capture its stdout.
    - It will parse the JSON output.
    - It will iterate over the `.parameters` object, extracting the key and its `.defaultValue.value`.
    - It will write the simplified object back to `firebase-workspace/remote_config_defaults.json`.

1. **Update `package.json`**:
    - Change `"firebase:remoteconfig"` to run the new script: `"node scripts/download-remote-config.js"`.

1. **Update ConfigService**:
    - The `src/app/ai/services/config.service.ts` currently has logic to parse the verbose format at runtime:

      ```typescript
      const simplifiedDefaults: Record<string, string | number | boolean> = {};
      if (rcDefaults.parameters) {
        Object.keys(rcDefaults.parameters).forEach((key) => {
          const param = (rcDefaults.parameters as any)[key];
          if (param.defaultValue && param.defaultValue.value !== undefined) {
            simplifiedDefaults[key] = param.defaultValue.value;
          }
        });
      }
      this.#remoteConfig.defaultConfig = simplifiedDefaults;
      ```

    - Since `rcDefaults` will now *already* be the `simplifiedDefaults` object, this logic must be simplified to just `this.#remoteConfig.defaultConfig = rcDefaults;`.

## Present for Approval

Please review this plan. The main difference from the previous attempt is that I've recognized we also need to update the `ConfigService` in Angular, as it is currently expecting the verbose schema format. Does this look good?
