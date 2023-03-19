import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { HOME_OPENED } from '../../constants/slackEvents';
import { APP_MESSAGE_TAB } from './constants/homeBlockUI';

const homeApp = (app: App<StringIndexed>) => {

    app.event(HOME_OPENED, async ({ body, say, client }) => {
        const result = await client.conversations.history({
            channel: body.event.channel,
        });

        const getBotStartedMessages = result.messages?.filter(each => {
            const isBot = each.bot_id;
            const isBlockUI =  Boolean(each.text?.includes(`This content can't be displayed.`));
            const isGetStartedMessage = (each.blocks?.filter(block => block?.block_id === 'section_welcome_get_started') || []).length > 0;
            return isBot && isBlockUI && isGetStartedMessage;
        }) || [];

        const isFirstOpenApp = getBotStartedMessages.length < 1;
        const tab = body.event.tab;
        const isTabMessage = tab === 'messages';
        const isTabHome = tab === 'home';
        if (isTabMessage && isFirstOpenApp) {
            await say(APP_MESSAGE_TAB);
        } else if (isTabHome) {
            console.log('isTabHome');
        }
    });
}

export default homeApp;