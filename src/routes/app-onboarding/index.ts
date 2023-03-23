import { App } from '@slack/bolt';
import { StringIndexed } from '@slack/bolt/dist/types/helpers';
import { CLICK_NEXT_ONBOARDING_APPS, CLICK_SKIP_ONBOARDING_APPS } from '../../constants/slackActions';
import { ONBOARDING_MESSAGE, ONBOARDING_STEP1, ONBOARDING_STEP2, ONBOARDING_STEP3 } from './constants/onboardingBlockUI';

const appOnboarding = (app: App<StringIndexed>) => {

    // Actions
    app.action(CLICK_NEXT_ONBOARDING_APPS, async ({ ack, say, payload, body, client }) => {
        const bodyData = body as { message: { ts: string }}
        const channelId = body?.channel?.id || '';
        const getTs = bodyData?.message?.ts || '';
        
        const payloadData = payload as { value: string };
        const includeHash = payloadData?.value.includes('#');
        const currentStep = Number(includeHash ? '0' : payloadData?.value) as 0 | 1 | 2 | 3; 
        
        const nextStep = currentStep + 1;

        let handleRequests: Promise<unknown>[] = [];

        if (nextStep === 1) {
            // remove button in current message
            // create new message onboarding
            handleRequests = [
                client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_MESSAGE({ channelName: `${payloadData?.value}` , showButton: false }) }),
                say(ONBOARDING_STEP1({ showButton: true }))
            ];
        } else if (nextStep === 2) {
            // remove button in current message
            // create new message onboarding
            handleRequests = [
                client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_STEP1({ showButton: false }) }),
                say(ONBOARDING_STEP2({ showButton: true }))
            ];
        } else if (nextStep === 3) {
            // remove button in current message
            // create new message onboarding
            handleRequests = [
                client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_STEP2({ showButton: false }) }),
                say(ONBOARDING_STEP3({ showButton: true }))
            ];
        }

        await Promise.all([...handleRequests, ack()]);
    });

    app.action(CLICK_SKIP_ONBOARDING_APPS, async ({ ack, body, client }) => {
        const bodyData = body as { message: { ts: string }}
        const channelId = body?.channel?.id || '';
        const getTs = bodyData?.message?.ts || '';

        const handleRequests = [
            client.chat.update({ ts: getTs, channel: channelId, ...ONBOARDING_MESSAGE({ channelName: `#${channelId}` , showButton: false }) }),
            ack(),
        ];

        await Promise.all(handleRequests);
    });
}

export default appOnboarding;