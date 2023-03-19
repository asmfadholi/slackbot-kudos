import { App } from '@slack/bolt';
import homePage from './pages/home';

const slackApptoken = 'xapp-1-A04UZ4C8ERX-4969656527861-e3d25526a535f70085a5c050efebab95ec2fd04263beb25e79ab34dbd240aa79';
const slackSigningSecret = '24fcb70f11ef1019843226c294c00abd';
const slackAppBotToken = 'xoxb-2528249851142-4958070773287-huP7NLwVOXWjF5JQh5ZpG2Gh';

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