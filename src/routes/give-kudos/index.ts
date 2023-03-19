import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_GIVE_KUDOS } from '../../constants/slackActions';

const giveKudos = (app: App<StringIndexed>) => {

    app.action(OPEN_GIVE_KUDOS, async ({ body, say, client, ack }) => {
        console.log('success give kudos');
        await ack()
    });
}

export default giveKudos;