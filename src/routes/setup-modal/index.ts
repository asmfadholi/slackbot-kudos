import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from '../../constants/slackActions';
import { APP_SETUP_NEW_CHANNEL, APP_SETUP_EXISTING_CHANNEL, INIT_MESSAGE_IN_CHANNEL } from './constants/setupAppBlockUI';
import { SUBMIT_SETUP_EXISTING_CHANNEL, SUBMIT_SETUP_NEW_CHANNEL } from '../../constants/slackViews';
import { APP_MESSAGE_TAB } from '../app-messages/constants/homeBlockUI';
import { ONBOARDING_MESSAGE } from '../app-onboarding/constants/onboardingBlockUI';

interface FormCreateNewChannel {
    channel_name: ChannelName;
    user_ids:     UserIDS;
}

interface ChannelName {
    channel_name_action: ChannelNameAction;
}

interface ChannelNameAction {
    type:  string;
    value: string;
}

interface UserIDS {
    user_ids_action: UserIDSAction;
}

interface UserIDSAction {
    type:           string;
    selected_users: string[];
}
  
interface FormInviteToChannel {
    channel: Channel
  }
  
interface Channel {
    channel_action: ChannelAction
}
  
interface ChannelAction {
    type: string
    selected_channel: string
}

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
    app.view(SUBMIT_SETUP_NEW_CHANNEL, async ({ ack, body, view, client, context }) => {
        const stateValues =  body.view.state.values as unknown as FormCreateNewChannel;
        
        const getChannelName = stateValues?.channel_name?.channel_name_action?.value || '';
        const channelNameNoHash = getChannelName.replace('#', '');
        console.log(stateValues, 'SUBMIT_SETUP_NEW_CHANNEL');

        // create new channel
        const resCreateChannel = await client.conversations.create({ name: channelNameNoHash, is_private: false, });

        // send message congrats to bot app message
        const sendMessageCongrats = client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE({ channelName: `#${resCreateChannel.channel?.name || ''}`, showButton: true }) });
        
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

        // invite members to join
        const newChannel = resCreateChannel.channel?.id || '';
        const currentUserId = body.user.id;
        const usersList = [...(stateValues?.user_ids?.user_ids_action?.selected_users || []), currentUserId];
        const resInviteUsersToChannel = await client.conversations.invite({ channel: resCreateChannel.channel?.id || '', users: usersList.join(',') });
        console.log(resInviteUsersToChannel, 'resInviteUsersToChannel');

        // send init message to new channel
        const botId = context.botId || '';
        const currentUserName = body.user.name;
        const sendMessageInit = await client.chat.postMessage({ channel: newChannel, ...INIT_MESSAGE_IN_CHANNEL({ slackbotId: `@${botId}`, ownerName: currentUserName }) });
        console.log(sendMessageInit, 'sendMessageInit');

    });

    app.view(SUBMIT_SETUP_EXISTING_CHANNEL, async ({ ack, body, view, client, context }) => {
        const stateValues =  body.view.state.values as unknown as FormInviteToChannel;
        const getChannelName = `${stateValues?.channel?.channel_action?.selected_channel || ''}`;
        console.log(stateValues, 'SUBMIT_SETUP_EXISTING_CHANNEL');

        // send message congrats to bot app message
        const channelInfo = await client.conversations.info({ channel: getChannelName });
        const sendMessageCongrats = client.chat.postMessage({ channel: view.private_metadata, ...ONBOARDING_MESSAGE({ channelName:  `#${channelInfo.channel?.name}`, showButton: true }) })
        
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

        // send init message to new channel
        const botId = context.botUserId || '';
        const getChannel = stateValues.channel?.channel_action.selected_channel || '';
        const currentUserName = body.user.name;
       
        const sendMessageInit = await client.chat.postMessage({ link_names: true, channel: getChannel, ...INIT_MESSAGE_IN_CHANNEL({ slackbotId: `@${botId}`, ownerName: `@${currentUserName}` }) });
        console.log(sendMessageInit, 'sendMessageInit');
    });
}

export default setupModal;