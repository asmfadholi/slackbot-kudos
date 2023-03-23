import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { HOME_OPENED } from '../../constants/slackEvents';
import { APP_MESSAGE_TAB } from './constants/homeBlockUI';
import { deleteAllChats } from './helpers/deleteAllChats';

const appMessages = (app: App<StringIndexed>) => {

    app.event(HOME_OPENED, async ({ body, say, client }) => {
        const result = await client.conversations.history({
            channel: body.event.channel,
        });

        const getBotStartedMessages = result.messages?.filter(each => {
            const isBot = each.bot_id;
            const isGetStartedMessage = (each.blocks?.filter(block => block?.block_id === 'section_welcome_get_started') || []).length > 0;
            return isBot && isGetStartedMessage;
        }) || [];

        const isFirstOpenApp = getBotStartedMessages.length < 1;
        const tab = body.event.tab;
        const isTabMessage = tab === 'messages';
        const isTabHome = tab === 'home';
        if (isTabMessage && isFirstOpenApp) {
            await say(APP_MESSAGE_TAB({ showButton: true }));
        } else if (isTabHome) {
            console.log('isTabHome');
        }
    });
}

export default appMessages;