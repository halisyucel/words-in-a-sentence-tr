import { queryScheme } from './api/global';
import { pushNotification } from './components/notification';
import jwt from 'jsonwebtoken';
import slugify from 'slugify';

const fallbackCopyTextToClipboard = (text) => {
	let textArea = document.createElement('textarea');
	textArea.value = text;

	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		let successful = document.execCommand('copy');
		if (successful)
			pushNotification({
				id: 'copy-notification',
				type: 'success',
				text: 'Copied to clipboard',
			});
	} catch (err) {
		pushNotification({
			id: 'copy-notification',
			type: 'error',
			text: 'Unable to copy to clipboard',
		});
	}

	document.body.removeChild(textArea);
};
export const copyTextToClipboard = (text) => {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	navigator.clipboard.writeText(text).then(
		() =>
			pushNotification({
				id: 'copy-notification',
				type: 'success',
				text: 'Copied to clipboard',
			}),
		(_error) =>
			pushNotification({
				id: 'copy-notification',
				type: 'error',
				text: 'Unable to copy to clipboard',
			}),
	);
};
export const createSlug = (text) => {
	return slugify(text, {
		replacement: '-',
		remove: /[*+~.,()'"!?:@]/g,
		lower: true,
	});
};
export const getCoords = (elem) => {
	let box = elem.getBoundingClientRect();

	let body = document.body;
	let docEl = document.documentElement;

	let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
	let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

	let clientTop = docEl.clientTop || body.clientTop || 0;
	let clientLeft = docEl.clientLeft || body.clientLeft || 0;

	let top = box.top + scrollTop - clientTop;
	let left = box.left + scrollLeft - clientLeft;

	return { top: Math.round(top), left: Math.round(left) };
};
export const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
export const replaceAll = (text, substr, newSubstr) => {
	return text.split(substr).join(newSubstr);
};
export const validate = (req) => {
	const { error, value } = queryScheme.validate(req.query);
	if (error) return { error };
	try {
		jwt.verify(req.headers['x-access-token'], process.env.JWT_SECRET);
		return { value };
	} catch (_err) {
		return { error: { message: 'Invalid token' } };
	}
};
