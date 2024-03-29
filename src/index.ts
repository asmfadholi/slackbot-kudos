import { App } from '@slack/bolt';

import * as dotenv from 'dotenv';

// routes
import appMessages from './routes/app-messages';
import appOnboarding from './routes/app-onboarding';
import giveKudosModal from './routes/give-kudos-modal';
import setupModal from './routes/setup-modal';

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

appMessages(app);
setupModal(app);
giveKudosModal(app);
appOnboarding(app);


(async () => {
    // Start the app
    console.log(slackApptoken, 'slackApptoken');
    console.log(slackSigningSecret, 'slackSigningSecret');
    console.log(slackAppBotToken, 'slackAppBotToken');
    const PORT = process.env.PORT;
    await app.start(PORT || 3000);
    console.log(PORT, 'PORT');
  
    console.log('⚡️ Bolt app is running!');
})();