import { View } from "@slack/bolt"
import { CLICK_NEXT_ONBOARDING_APPS, CLICK_SKIP_ONBOARDING_APPS, OPEN_GIVE_KUDOS } from "../../../constants/slackActions";

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
			},
			
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
	],
	
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
					"action_id": OPEN_GIVE_KUDOS,
					"style": "primary"
				},
			]
		}] : [])
	]
} as View);



