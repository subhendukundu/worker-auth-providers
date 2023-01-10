import { getFixedDigitRandomNumber } from '../../utils/helpers';
import { ConfigError, UnknownError } from '../../utils/errors';
import { logger } from '../../utils/logger';

type SendOptions = {
	from: string;
	to: string;
	subject?: string;
	otpLength?: number;
	kvProvider: any;
	expirationTtl?: number;
	apiKey: string;
	templateId?: string;
	dynamicTemplateData?: any;
	text?: string;
	isLogEnabled?: boolean;
};

async function sendMail({ body, apiKey }: { body: any, apiKey: string }): Promise<Response> {
	const email = await fetch('https://api.sendgrid.com/v3/mail/send', {
		body: JSON.stringify(body),
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});
	return email;
}

export default async function send({ options }: { options: SendOptions }): Promise<Response> {
	const {
		from,
		to,
		subject = 'Varification OTP',
		otpLength = 4,
		kvProvider,
		expirationTtl = 60,
		apiKey,
		templateId,
		dynamicTemplateData,
		text = 'Your verification code is: {OTP}',
		isLogEnabled = false,
	} = options;
	const otp = getFixedDigitRandomNumber(otpLength);

	if (otpLength < 4) {
		throw new ConfigError({
			message: 'OTP length can not be less then 4'
		});
	}

	const templateContent = templateId
		? {
			template_id: templateId
		}
		: {
			content: [
				{
					type: 'text/plain',
					value: text.replace('{OTP}', otp)
				}
			]
		};

	const personalizedData = templateId
		? {
			dynamic_template_data: dynamicTemplateData
		}
		: {
			subject
		};
	const body = {
		from: {
			email: from
		},
		personalizations: [
			{
				to: [
					{
						email: to
					}
				],
				...personalizedData
			}
		],
		...templateContent
	};

	try {
		const res = await sendMail({ body, apiKey });
		logger.setEnabled(isLogEnabled);
		logger.log(`[success send], ${JSON.stringify(res)}`, 'info');
		const savedData = await kvProvider.put(to, otp, {
			expirationTtl
		});
		logger.log(`[savedData], ${JSON.stringify(savedData)}`, 'info');
		return res;
	} catch (e: any) {
		logger.log(`[error], ${JSON.stringify(e.stack)}`, 'error');
		throw new UnknownError({
			message: 'e.stack'
		});
	}
}
