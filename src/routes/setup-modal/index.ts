import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from '../../constants/slackActions';
import { APP_SETUP_NEW_CHANNEL, APP_SETUP_EXISTING_CHANNEL, ONBOARDING_MESSAGE } from './constants/setupAppBlockUI';
import { SUBMIT_SETUP_EXISTING_CHANNEL, SUBMIT_SETUP_NEW_CHANNEL } from '../../constants/slackViews';

const setupModal = (app: App<StringIndexed>) => {
    app.action(OPEN_SETUP_INIT, async ({ ack, client, body }) => {
        await ack();
        const bodyData = body as { trigger_id: string };
        await client.views.open({ view: APP_SETUP_NEW_CHANNEL(body.channel?.id || ''), "trigger_id": bodyData.trigger_id });
    });
    
    app.action(OPEN_SETUP_EXISTING_CHANNEL, async ({ ack, client, body }) => {
        await ack();
        const bodyData = body as { view: { id: string, private_metadata: string } };
        await client.views.update({ view: APP_SETUP_EXISTING_CHANNEL(bodyData.view.private_metadata), view_id: bodyData.view.id });
    });
    
    app.action(OPEN_SETUP_NEW_CHANNEL, async ({ ack, client, body }) => {
        await ack();
        const bodyData = body as { view: { id: string, private_metadata: string } };
        await client.views.update({ view: APP_SETUP_NEW_CHANNEL(bodyData.view.private_metadata), view_id: bodyData.view.id });
    });

    app.view(SUBMIT_SETUP_NEW_CHANNEL, async ({ ack, body, view, client }) => {
        const stateValues =  body.view.state.values;
        const getChannelName = stateValues?.channel_name?.channel_name_action?.value || '';
        console.log('SUBMIT_NEW_CHANNEL', JSON.stringify(stateValues));

        // TODO: action create channel, invite bot and invite users
        // create new channel, invite bot and invite users

        // send message congrats to bot app message
        await client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE(getChannelName) })
        await ack();
    });

    app.view(SUBMIT_SETUP_EXISTING_CHANNEL, async ({ ack, body, view, client }) => {
        const stateValues =  body.view.state.values;
        const getChannelName = `#${stateValues?.channel?.channel_action?.selected_channel || ''}`;
        console.log('SUBMIT_EXISTING_CHANNEL', JSON.stringify(stateValues));

        // TODO: action invite bot to channel
        // invite bot to existing channel

        // send message congrats to bot app message
        await client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE(getChannelName) })
        await ack();
    });
}

export default setupModal;