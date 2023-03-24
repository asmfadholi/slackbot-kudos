import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { OPEN_GIVE_KUDOS } from '../../constants/slackActions';
import { SUBMIT_GIVE_KUDOS } from '../../constants/slackViews';
import { GIVE_KUDOS_FORM, GIVE_KUDOS_SUCCESS_SENT, MESSAGE_KUDOS } from './constants/giveKudosModalBlockUI';
import { SubmitKudosForm } from './types';

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
        const stateValues =  body.view.state.values as unknown as SubmitKudosForm;
        console.log('SUBMIT_GIVE_KUDOS', JSON.stringify(stateValues));

        // send kudos to users
        const imageUrl = stateValues.type['static_select-action'].selected_option.value || '';
        const isPublic = stateValues.visibility['radio_buttons-action'].selected_option.value === 'public';
        const currentUserName = body.user.name;
        const usersList = stateValues.users['multi_users_select-action'].selected_users || [];
        const detailUserList = usersList.map(each => client.users.info({ user: each  }));
        const getDetailUserList =  await Promise.all(detailUserList);
        if (isPublic) {
            const recipients = getDetailUserList.map(each => `<@${each.user?.name}>`);
            await client.chat.postMessage({ channel: 'C04UZ0EKA2D', ...MESSAGE_KUDOS({ sender: `@${currentUserName}`, recipient: recipients.join(', '), imageUrl }) })
        } else {
            const sendAllKudos = getDetailUserList.map(each => {
                const recipientName = each.user?.name || '';
                const recipientId = each.user?.id || '';
                return client.chat.postMessage({ channel: recipientId, ...MESSAGE_KUDOS({ sender: `@${currentUserName}`, isPrivate: true, imageUrl }) })
            });
            await Promise.all(sendAllKudos);
        }
       

        
        
        const bodyData = body as { trigger_id: string };
        await Promise.all([
            client.views.open({ view: GIVE_KUDOS_SUCCESS_SENT, "trigger_id": bodyData.trigger_id}),
            ack(),
        ]);
    });
}

export default giveKudosModal;