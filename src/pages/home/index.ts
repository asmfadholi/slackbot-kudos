import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import setupModal from './components/setup-modal';
import { HOME_OPENED } from './constants/homeAppEvent';
import { APP_SETUP_MESSAGE } from './constants/setupAppBlockUI';

const homePage = (app: App<StringIndexed>) => {
    setupModal(app);

    app.event(HOME_OPENED, async ({ body, say }) => {
        const isTabMessage = body.event.tab === 'messages';
        if (!isTabMessage) {
            await say(APP_SETUP_MESSAGE);
        }
    });
}

export default homePage;