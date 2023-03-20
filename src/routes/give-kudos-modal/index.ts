import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_GIVE_KUDOS } from '../../constants/slackActions';
import { SUBMIT_GIVE_KUDOS } from '../../constants/slackViews';
import { GIVE_KUDOS_FORM, GIVE_KUDOS_SUCCESS_SENT } from './constants/giveKudosModalBlockUI';

const giveKudosModal = (app: App<StringIndexed>) => {
    // Actions
    app.action(OPEN_GIVE_KUDOS, async ({ body, client, ack }) => {
        const bodyData = body as { trigger_id: string };
        await Promise.all([
            client.views.open({ view: GIVE_KUDOS_FORM, "trigger_id": bodyData.trigger_id }),
            ack(),
        ]);
    });

     // Views
     app.view(SUBMIT_GIVE_KUDOS, async ({ ack, body, client }) => {
        const stateValues =  body.view.state.values;
        console.log('SUBMIT_GIVE_KUDOS', JSON.stringify(stateValues));

        // TODO: send kudos to users
        
        const bodyData = body as { trigger_id: string };
        await ack();
        await client.views.open({ view: GIVE_KUDOS_SUCCESS_SENT, "trigger_id": bodyData.trigger_id});
    });
}

export default giveKudosModal;