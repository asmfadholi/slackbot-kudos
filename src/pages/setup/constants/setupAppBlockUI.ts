import { SayArguments, View } from "@slack/bolt"
import { OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from "./setupAppAction";

export const APP_SETUP_MESSAGE = {
    "blocks": [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "Welcome to Heykudo on Slack! 🎉 \nI'm Heykudo and I'm here to help you set up Heykudo. To get started, we'll need to add Heykudo to a Slack channel."
            }
        },
        {
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
                    "value": "open setup",
                    "action_id": OPEN_SETUP_INIT
                }
            ], 
        }
    ]
} as SayArguments;

export const APP_SETUP_NEW_CHANNEL = {
	"type": "modal",
	"title": {
		"type": "plain_text",
		"text": "Start Heykudo Channel",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Next",
		"emoji": true,
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
			"element": {
                "max_length": 73,
				"type": "plain_text_input",
                "initial_value": "#Heykudo"
			},
			"label": {
				"type": "plain_text",
				"text": "Name your channel",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "Heykudo will share Kudos and announcements in this channel. We suggest naming it #Heykudo or #kudos. You can also be more specific, for example #seattle-heykudo or #engineering-heykudo.",
				"emoji": true
			}
		},
		{
			"type": "input",
            "optional": true,
			"element": {
				"type": "multi_users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "select people in the channels",
					"emoji": true
				},
				"action_id": "multi_users_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Add people to channels",
				"emoji": true
			}
		},
        {
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Use existing channel instead",
						"emoji": true
					},
					"value": 'open-11',
					"action_id": OPEN_SETUP_EXISTING_CHANNEL
				}
			]
		}
	]
} as View;

export const APP_SETUP_EXISTING_CHANNEL = {
	"title": {
		"type": "plain_text",
		"text": "Connect Existing Channel",
		"emoji": true
	},
	"submit": {
		"type": "plain_text",
		"text": "Next",
		"emoji": true
	},
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
        {
			"type": "input",
			"element": {
				"type": "channels_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Choose channel",
					"emoji": false
				},
				"action_id": "multi_users_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Select an existing channnel",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "We suggest not connecting Heykudo to critical channels such as #general. This is vecause Heykudo is based on channel membership and team members should be able to opt-in and opt-out."
			}
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Select new channel instead",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": OPEN_SETUP_NEW_CHANNEL
				}
			]
		}
	]
} as View;

