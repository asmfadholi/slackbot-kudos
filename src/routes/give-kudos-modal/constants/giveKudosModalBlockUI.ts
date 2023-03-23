import { View } from "@slack/bolt";
import { OPEN_GIVE_KUDOS } from "../../../constants/slackActions";
import { SUBMIT_GIVE_KUDOS } from "../../../constants/slackViews";

export const GIVE_KUDOS_FORM = {
	"type": "modal",
    "callback_id": SUBMIT_GIVE_KUDOS,
	"submit": {
		"type": "plain_text",
		"text": "Send",
		"emoji": true
	},
	"close": {
		"type": "plain_text",
		"text": "Cancel",
		"emoji": true
	},
	"title": {
		"type": "plain_text",
		"text": "Heykudo",
		"emoji": true
	},
	"blocks": [
		{
			"type": "input",
            "block_id": "users",
			"element": {
				"type": "multi_users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select users",
					"emoji": true
				},
				"action_id": "multi_users_select-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Give to",
				"emoji": true
			}
		},
		{
			"type": "input",
            "block_id": "type",
			"element": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select type",
					"emoji": true
				},
				"action_id": "static_select-action",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Amazing job",
							"emoji": true
						},
						"value": "Amazing job"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Cheers",
							"emoji": true
						},
						"value": "Cheers"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Impressive",
							"emoji": true
						},
						"value": "Impressive"
					}
				],
			},
			"label": {
				"type": "plain_text",
				"text": "Type",
				"emoji": true
			}
		},
		{
			"type": "input",
            "block_id": "message",
			"element": {
				"type": "plain_text_input",
				"multiline": true,
				"action_id": "plain_text_input-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Massage",
				"emoji": true
			}
		},
		{
			"type": "input",
            "block_id": "visibility",
			"element": {
				"type": "radio_buttons",
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Public : Everyone can see",
							"emoji": true
						},
						"value": "public"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Private : Only the kudo recipients can see",
							"emoji": true
						},
						"value": "private"
					}
				],
				"action_id": "radio_buttons-action"
			},
			"label": {
				"type": "plain_text",
				"text": "Visibility",
				"emoji": true
			}
		}
	]
} as View;

export const GIVE_KUDOS_SUCCESS_SENT = {
	"type": "modal",
	"close": {
		"type": "plain_text",
		"text": "Close",
		"emoji": true
	},
	"title": {
		"type": "plain_text",
		"text": "Heykudo",
		"emoji": true
	},
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": "Keep it up! You have successfully sent kudos.",
				"emoji": true
			}
		}
	]
} as View;

interface MessageKudosProps {
	recipient: string;
	sender: string;
	isPrivate?: boolean;
}

export const MESSAGE_KUDOS = ({ recipient, sender, isPrivate }: MessageKudosProps) => {
	return {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `${isPrivate ? 'You' : `<${recipient}>`} just received a Kudos from <${sender}>.`,
				}
			},
			{
				"type": "image",
				"title": {
					"type": "plain_text",
					"text": "kudos",
					"emoji": true
				},
				"image_url": "https://i.ibb.co/BfpnxCT/Screenshot-2023-03-23-at-13-57-29.png",
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
						"action_id": OPEN_GIVE_KUDOS
					}
				]
			}
		]
	} as View;
}