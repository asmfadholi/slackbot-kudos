import { App } from '@slack/bolt';
import * as dotenv from 'dotenv';

// routes
import homePage from './routes/home';

dotenv.config();

const slackApptoken = process.env.SLACK_APP_TOKEN;
const slackSigningSecret = process.env.SLACK_SIGNIN_SECRET;
const slackAppBotToken = process.env.SLACK_APP_BOT_TOKEN;

const app = new App({
  signingSecret: slackSigningSecret,
  token: slackAppBotToken,
  appToken: slackApptoken,
  socketMode: true,
});

homePage(app);

(async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
})();