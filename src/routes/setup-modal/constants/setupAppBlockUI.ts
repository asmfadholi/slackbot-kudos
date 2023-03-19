import { View } from "@slack/bolt"
import { CLICK_NEXT_ONBOARDING_APPS, CLICK_SKIP_ONBOARDING_APPS, OPEN_SETUP_EXISTING_CHANNEL, OPEN_SETUP_INIT, OPEN_SETUP_NEW_CHANNEL } from "../../../constants/slackActions";
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

export const ONBOARDING_MESSAGE = ({ channelName, showButton }: { channelName: string, showButton: boolean }) => {
	return {
		"blocks": [
			{
				"type": "section",
				"text": {
					"type": "mrkdwn",
					"text": `Congrats! We are now connected to <${channelName}> \n Using Heykudo is easy 1-2-3: \n1️. What is Kudos \n 2. What is Feedback Friday \n 3. Give your first Kudo`
				}
			},
			...(showButton ? [{
				"type": "actions",
				"elements": [
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Start",
							"emoji": true
						},
						"action_id": CLICK_NEXT_ONBOARDING_APPS,
						"value": '0',
						"style": "primary"
					},
					{
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Skip",
							"emoji": true
						},
						"action_id": CLICK_SKIP_ONBOARDING_APPS,
					}
				]
			}]: [])
		]
	} as View;
}

interface OnboardingStepProps {
	showButton: boolean;
}

export const ONBOARDING_STEP1 = ({ showButton }: OnboardingStepProps) => ({
	"private_metadata": '1',
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*1. What is Kudos*`
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `What is kudo? \n • Kudos are virtual cards used for team member recognition. Make your own custom Kudos around company values, inside jokes, and more!`
			}
		},
		...(showButton ? [{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Next",
						"emoji": true
					},
					"value": '1',
					"action_id": CLICK_NEXT_ONBOARDING_APPS,
					"style": "primary"
				},
			]
		}] : [])
	]
} as View);

export const ONBOARDING_STEP2 = ({ showButton }: OnboardingStepProps) => ({
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*2. What is Feedback Friday*`
			}
		},

		
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Feedback Friday is a dedicated day to help teams establish a feedback habit and improve team culture. I’ll be encouraging Kudos and constructive feedback through nudges, team streaks, and participation awards. Feedback Friday is customizable to your team's needs!`
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `
				Current Feedback Friday settings: \nOccurs [once every week] on [Friday]\nKicks off on [March 10] at [10AM JST]`
			}
		},
		...(showButton ? [{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Next",
						"emoji": true
					},
					"value": '2',
					"action_id": CLICK_NEXT_ONBOARDING_APPS,
					"style": "primary"
				},
			]
		}] : [])
	]
} as View);

export const ONBOARDING_STEP3 = ({ showButton }: OnboardingStepProps) => ({
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `*3. Give your forst Kudos*`
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": `Now that Feedback Friday is all set up, below are some actions to start experiencing Heykudo. Enjoy! Give Kudos to a teammate that shined bright this week!`
			}
		},
		...(showButton ? [{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Give Kudos",
						"emoji": true
					},
					"value": '3',
					"action_id": CLICK_NEXT_ONBOARDING_APPS,
					"style": "primary"
				},
			]
		}] : [])
	]
} as View);




