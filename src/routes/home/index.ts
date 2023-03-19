import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { HOME_OPENED } from '../../constants/slackEvents';
import { APP_MESSAGE_TAB } from './constants/homeBlockUI';

const homeApp = (app: App<StringIndexed>) => {

    app.event(HOME_OPENED, async ({ body, say }) => {
        const tab = body.event.tab;
        const isTabMessage = tab === 'messages';
        const isTabHome = tab === 'home';
        if (isTabMessage) {
            await say(APP_MESSAGE_TAB);
        } else if (isTabHome) {
            console.log('isTabHome');
        }
    });
}

export default homeApp;