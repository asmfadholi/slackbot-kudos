import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { CLICK_NEXT_ONBOARDING_APPS, CLICK_SKIP_ONBOARDING_APPS, OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from '../../constants/slackActions';
import { APP_SETUP_NEW_CHANNEL, APP_SETUP_EXISTING_CHANNEL, ONBOARDING_MESSAGE, ONBOARDING_STEP1, ONBOARDING_STEP2, ONBOARDING_STEP3 } from './constants/setupAppBlockUI';
import { SUBMIT_SETUP_EXISTING_CHANNEL, SUBMIT_SETUP_NEW_CHANNEL } from '../../constants/slackViews';
import { APP_MESSAGE_TAB } from '../app-messages/constants/homeBlockUI';

const setupModal = (app: App<StringIndexed>) => {

    // Actions
    app.action(OPEN_SETUP_INIT, async ({ ack, client, body }) => {
        const bodyData = body as { trigger_id: string };
        await client.views.open({ view: APP_SETUP_NEW_CHANNEL(body.channel?.id || ''), "trigger_id": bodyData.trigger_id });
        await ack();
    });
    
    app.action(OPEN_SETUP_EXISTING_CHANNEL, async ({ ack, client, body }) => {
        const bodyData = body as { view: { id: string, private_metadata: string } };
        await client.views.update({ view: APP_SETUP_EXISTING_CHANNEL(bodyData.view.private_metadata), view_id: bodyData.view.id });
        await ack();
    });
    
    app.action(OPEN_SETUP_NEW_CHANNEL, async ({ ack, client, body }) => {
        const bodyData = body as { view: { id: string, private_metadata: string } };
        await client.views.update({ view: APP_SETUP_NEW_CHANNEL(bodyData.view.private_metadata), view_id: bodyData.view.id });
        await ack();
    });

    app.action(CLICK_NEXT_ONBOARDING_APPS, async ({ ack, say, payload, body, client }) => {
        const bodyData = body as { message: { ts: string }}
        const channelId = body?.channel?.id || '';
        const getTs = bodyData?.message?.ts || '';
        
        const payloadData = payload as { value: string };
        const currentStep = Number(payloadData?.value) as 0 | 1 | 2 | 3; 
        const nextStep = currentStep + 1;

        if (nextStep === 1) {
            // remove button in current message
            // create new message onboarding
            const handleRequests = [
                client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_MESSAGE({ channelName: `#${channelId}` , showButton: false }) }),
                say(ONBOARDING_STEP1({ showButton: true }))
            ];
            await Promise.all(handleRequests);
        } else if (nextStep === 2) {
            // remove button in current message
            // create new message onboarding
            const handleRequests = [
                client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_STEP1({ showButton: false }) }),
                say(ONBOARDING_STEP2({ showButton: true }))
            ];
            await Promise.all(handleRequests);
        } else if (nextStep === 3) {
            // remove button in current message
            // create new message onboarding
            const handleRequests = [
                client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_STEP2({ showButton: false }) }),
                say(ONBOARDING_STEP3({ showButton: true }))
            ];
            await Promise.all(handleRequests);
        }

        await ack();
    });

    app.action(CLICK_SKIP_ONBOARDING_APPS, async ({ ack, say, body, client }) => {
        const bodyData = body as { message: { ts: string }}
        const channelId = body?.channel?.id || '';
        const getTs = bodyData?.message?.ts || '';

        const handleRequests = [
            client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_MESSAGE({ channelName: `#${channelId}` , showButton: false }) }),
            ack(),
        ];

        await Promise.all(handleRequests);
    });

    // Views
    app.view(SUBMIT_SETUP_NEW_CHANNEL, async ({ ack, body, view, client }) => {
        const stateValues =  body.view.state.values;
        const getChannelName = stateValues?.channel_name?.channel_name_action?.value || '';
        console.log('SUBMIT_NEW_CHANNEL', JSON.stringify(stateValues));

        // TODO: action create channel, invite bot and invite users
        // create new channel, invite bot and invite users

        // send message congrats to bot app message
        await client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE({ channelName: getChannelName, showButton: true }) })
        
        // update button get started
        const result = await client.conversations.history({
            channel: view.private_metadata,
        });

        const getBotStartedMessages = result.messages?.filter(each => {
            const isBot = each.bot_id;
            const isBlockUI =  Boolean(each.text?.includes(`This content can't be displayed.`));
            const isGetStartedMessage = (each.blocks?.filter(block => block?.block_id === 'section_welcome_get_started') || []).length > 0;
            return isBot && isBlockUI && isGetStartedMessage;
        }) || [];

        const detailStarted = getBotStartedMessages?.[0]
        await client.chat.update({ ts: detailStarted?.ts || '', channel: view.private_metadata, ...APP_MESSAGE_TAB({ showButton: false }) }),

        await ack();
    });

    app.view(SUBMIT_SETUP_EXISTING_CHANNEL, async ({ ack, body, view, client }) => {
        const stateValues =  body.view.state.values;
        const getChannelName = `#${stateValues?.channel?.channel_action?.selected_channel || ''}`;
        console.log('SUBMIT_EXISTING_CHANNEL', JSON.stringify(stateValues));

        // TODO: action invite bot to channel
        // invite bot to existing channel

        // send message congrats to bot app message
        await client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE({ channelName: getChannelName, showButton: true }) });

        // update button get started
        const result = await client.conversations.history({
            channel: view.private_metadata,
        });

        const getBotStartedMessages = result.messages?.filter(each => {
            const isBot = each.bot_id;
            const isBlockUI =  Boolean(each.text?.includes(`This content can't be displayed.`));
            const isGetStartedMessage = (each.blocks?.filter(block => block?.block_id === 'section_welcome_get_started') || []).length > 0;
            return isBot && isBlockUI && isGetStartedMessage;
        }) || [];

        const detailStarted = getBotStartedMessages?.[0]
        await client.chat.update({ ts: detailStarted?.ts || '', channel: view.private_metadata, ...APP_MESSAGE_TAB({ showButton: false }) }),

        await ack();
    });
}

export default setupModal;