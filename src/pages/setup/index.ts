import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from './constants/setupAppAction';
import { APP_SETUP_NEW_CHANNEL, APP_SETUP_EXISTING_CHANNEL } from './constants/setupAppBlockUI';

const setupPage = (app: App<StringIndexed>) => {
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
}

export default setupPage;