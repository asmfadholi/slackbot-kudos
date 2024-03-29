import { SayArguments } from "@slack/bolt"
import { OPEN_SETUP_INIT } from "../../../constants/slackActions";

export const APP_MESSAGE_TAB = ({ showButton }: { showButton: boolean }) => ({
    "blocks": [
        {
            "type": "section",
            "block_id": "section_welcome_get_started",
            "text": {
                "type": "mrkdwn",
                "text": "*Welcome to Heykudo on Slack! 🎉* \n I'm Heykudo and I'm here to help you set up Heykudo. To get started, we'll need to add Heykudo to a Slack channel."
            }
        },
        ...(showButton ? [{
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Get Started",
                        "emoji": true
                    },
                    "style": "primary",
                    "action_id": OPEN_SETUP_INIT
                }
            ], 
        }] : [])
    ]
} as SayArguments);

