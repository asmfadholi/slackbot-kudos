import { App } from '@slack/bolt';
import { OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL, SELECT_CHANNEL_ACTION } from './constants/setupAction';
import { APP_SETUP_MESSAGE, APP_SETUP_NEW_CHANNEL, APP_SETUP_EXISTING_CHANNEL } from './constants/setupApp';

// const token = 'xoxb-2528249851142-4965765247350-hkKg79wmAM9CjO2NahPkc9dc';
// const signingSecret = 'signing';

const slackApptoken = 'xapp-1-A04UZ4C8ERX-4969656527861-e3d25526a535f70085a5c050efebab95ec2fd04263beb25e79ab34dbd240aa79';
const slackSigningSecret = '24fcb70f11ef1019843226c294c00abd';
const slackAppBotToken = 'xoxb-2528249851142-4958070773287-huP7NLwVOXWjF5JQh5ZpG2Gh';

const app = new App({
  signingSecret: slackSigningSecret,
  token: slackAppBotToken,
  appToken: slackApptoken,
  socketMode: true,
});

app.action(OPEN_SETUP_INIT, async ({ ack, client, body }) => {
    await ack();
    const bodyData = body as { trigger_id: string };
    await client.views.open({ view: APP_SETUP_NEW_CHANNEL, "trigger_id": bodyData.trigger_id });
});

app.action(OPEN_SETUP_EXISTING_CHANNEL, async ({ ack, client, body }) => {
    await ack();
    const bodyData = body as { trigger_id: string, actions: { value: string }[], view: { id: string} };
    await client.views.update({ view: APP_SETUP_EXISTING_CHANNEL, view_id: bodyData.view.id });
});

app.action(OPEN_SETUP_NEW_CHANNEL, async ({ ack, client, body }) => {
    await ack();
    const bodyData = body as { trigger_id: string, actions: { value: string }[], view: { id: string} };
    await client.views.update({ view: APP_SETUP_NEW_CHANNEL, view_id: bodyData.view.id });
});

app.action(SELECT_CHANNEL_ACTION, async ({ ack }) => {
    await ack();
})

app.event('app_home_opened', async ({ body, say }) => {
   const isTabMessage = body.event.tab === 'messages';
   if (isTabMessage) {
    await say(APP_SETUP_MESSAGE);
   }
});


(async () => {
    // Start the app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
})();