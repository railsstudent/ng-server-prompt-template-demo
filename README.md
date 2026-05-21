# NgServerPromptTemplateDemo

## Running the Project Locally

Follow these steps to set up and run the project on your local machine:

### Prerequisites

- **Node.js**: Version 20 or higher.
- **Angular CLI**: Version 21 or higher.
- **Firebase Project**: A Firebase project must already be created.

1. **Configure Firebase Project:**
   Open the `firebase/.firebaserc` file and update the `"default"` project name to your target Firebase project ID.

2. **Set up Environment Variables:**
   Copy the `.env.example` file to a new file named `.env` in the root directory, and fill in your required Firebase configuration values.

3. **Generate Firebase Configurations:**
   Run the following npm commands to generate your Firebase configuration and remote config defaults:

   ```bash
   npm run config
   npm run firebase:remoteconfig
   ```

4. **Install Dependencies:**
   Download the required project dependencies by running:

   ```bash
   npm install
   ```

5. **Start the Development Server:**
   Launch the Angular development server:

   ```bash
   ng serve
   ```

   > **Note:** Always remember to run the configuration scripts from Step 3 (`npm run config` and `npm run firebase:remoteconfig`) to pull the latest Firebase values before running `ng serve`.

   Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.
