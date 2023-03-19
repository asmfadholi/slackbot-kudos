import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from '../../constants/slackActions';
import { APP_SETUP_NEW_CHANNEL, APP_SETUP_EXISTING_CHANNEL } from './constants/setupAppBlockUI';
import { SUBMIT_SETUP_EXISTING_CHANNEL, SUBMIT_SETUP_NEW_CHANNEL } from '../../constants/slackViews';
import { APP_MESSAGE_TAB } from '../app-messages/constants/homeBlockUI';
import { ONBOARDING_MESSAGE } from '../app-onboarding/constants/onboardingBlockUI';

const setupModal = (app: App<StringIndexed>) => {

    // Actions
    app.action(OPEN_SETUP_INIT, async ({ ack, client, body }) => {
        const bodyData = body as { trigger_id: string };
        await Promise.all([
            client.views.open({ view: APP_SETUP_NEW_CHANNEL(body.channel?.id || ''), "trigger_id": bodyData.trigger_id }),
            ack(),
        ]);
    });
    
    app.action(OPEN_SETUP_EXISTING_CHANNEL, async ({ ack, client, body }) => {
        const bodyData = body as { view: { id: string, private_metadata: string } };
        await Promise.all([
            client.views.update({ view: APP_SETUP_EXISTING_CHANNEL(bodyData.view.private_metadata), view_id: bodyData.view.id }),
            ack(),
        ]);
    });
    
    app.action(OPEN_SETUP_NEW_CHANNEL, async ({ ack, client, body }) => {
        const bodyData = body as { view: { id: string, private_metadata: string } };
        await Promise.all([
            client.views.update({ view: APP_SETUP_NEW_CHANNEL(bodyData.view.private_metadata), view_id: bodyData.view.id }),
            ack(),
        ]);
    });

    // Views
    app.view(SUBMIT_SETUP_NEW_CHANNEL, async ({ ack, body, view, client }) => {
        const stateValues =  body.view.state.values;
        const getChannelName = stateValues?.channel_name?.channel_name_action?.value || '';
        console.log('SUBMIT_NEW_CHANNEL', JSON.stringify(stateValues));

        // TODO: action create channel, invite bot and invite users
        // create new channel, invite bot and invite users

        // send message congrats to bot app message
        const sendMessageCongrats = client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE({ channelName: getChannelName, showButton: true }) })
        
        // get history chat
        const getHistory = client.conversations.history({
            channel: view.private_metadata,
        });

        const [resGetHistory] = await Promise.all([
            getHistory,
            sendMessageCongrats,
        ]);

        const getBotStartedMessages = resGetHistory.messages?.filter(each => {
            const isBot = each.bot_id;
            const isGetStartedMessage = (each.blocks?.filter(block => block?.block_id === 'section_welcome_get_started') || []).length > 0;
            return isBot && isGetStartedMessage;
        }) || [];

        const detailStarted = getBotStartedMessages?.[0];

        await Promise.all([
            client.chat.update({ ts: detailStarted?.ts || '', channel: view.private_metadata, ...APP_MESSAGE_TAB({ showButton: false }) }),
            ack(),
        ]);
    });

    app.view(SUBMIT_SETUP_EXISTING_CHANNEL, async ({ ack, body, view, client }) => {
        const stateValues =  body.view.state.values;
        const getChannelName = `#${stateValues?.channel?.channel_action?.selected_channel || ''}`;
        console.log('SUBMIT_EXISTING_CHANNEL', JSON.stringify(stateValues));

        // TODO: action invite bot to channel
        // invite bot to existing channel

        // send message congrats to bot app message
        const sendMessageCongrats = client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE({ channelName: getChannelName, showButton: true }) })
        
        // get history chat
        const getHistory = client.conversations.history({
            channel: view.private_metadata,
        });

        const [resGetHistory] = await Promise.all([
            getHistory,
            sendMessageCongrats,
        ]);

        const getBotStartedMessages = resGetHistory.messages?.filter(each => {
            const isBot = each.bot_id;
            const isGetStartedMessage = (each.blocks?.filter(block => block?.block_id === 'section_welcome_get_started') || []).length > 0;
            return isBot && isGetStartedMessage;
        }) || [];

        const detailStarted = getBotStartedMessages?.[0];
        await Promise.all([
            client.chat.update({ ts: detailStarted?.ts || '', channel: view.private_metadata, ...APP_MESSAGE_TAB({ showButton: false }) }),
            ack(),
        ]);
    });
}

export default setupModal;