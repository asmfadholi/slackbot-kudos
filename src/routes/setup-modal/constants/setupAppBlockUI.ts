import { View } from "@slack/bolt"
import { OPEN_GIVE_KUDOS, OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_NEW_CHANNEL } from "../../../constants/slackActions";
import { SUBMIT_SETUP_EXISTING_CHANNEL, SUBMIT_SETUP_NEW_CHANNEL } from "../../../constants/slackViews";

export const APP_SETUP_NEW_CHANNEL = (channelId: string) => ({
	"type": "modal",
	"callback_id": SUBMIT_SETUP_NEW_CHANNEL,
	
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
			"block_id": "channel_name",
			"element": {
				"action_id": "channel_name_action",
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
			"block_id": "user_ids",
			"element": {
				"type": "multi_users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "select people in the channels",
					"emoji": true
				},
				"action_id": "user_ids_action"
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
					"action_id": OPEN_SETUP_EXISTING_CHANNEL
				}
			]
		}
	],
	"private_metadata": channelId
} as View);

export const APP_SETUP_EXISTING_CHANNEL = (channelId: string) => ({
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
	"callback_id": SUBMIT_SETUP_EXISTING_CHANNEL,
	"private_metadata": channelId,
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"blocks": [
        {
			"type": "input",
			"block_id": "channel",
			"element": {
				"type": "channels_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Choose channel",
					"emoji": false
				},
				"action_id": "channel_action"
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
					"action_id": OPEN_SETUP_NEW_CHANNEL
				}
			]
		}
	]
} as View);

interface InitMessageProps {
	slackbotId: string;
	ownerName: string;
}

export const INIT_MESSAGE_IN_CHANNEL = ({ slackbotId, ownerName }: InitMessageProps) => {
	return {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "plain_text",
					"text": `Hey <${slackbotId}> here! :wave:`,
					"emoji": true
				},
			},
			{
				"type": "section",
				"text": {
					"type": "plain_text",
					"text": `I’m here to help you send Kudos (publicly) and feedback (privately) to your teammates. :trophy: \n To kick things off, let’s start by giving a big Kudos to <${ownerName}> for connecting us all here! :raised_hands:`,
					"emoji": true
				}
			},
			{
				"type": "image",
				"title": {
					"type": "plain_text",
					"text": "kudos",
					"emoji": true
				},
				"image_url": "https://i.ibb.co/HCM8hTD/Screenshot-2023-03-23-at-10-47-33.png",
				"alt_text": "kudos-image"
			},
			{
				"type": "actions",
				"elements": [
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": ":tada: Give Kudos to other members",
							"emoji": true
						},
						"style": "primary",
						"value": "click_me_123",
						"action_id": OPEN_GIVE_KUDOS
					}
				]
			}
		]
	} as View;
}






