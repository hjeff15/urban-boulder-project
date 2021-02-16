const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
// const { options } = require('../routes');

var transport = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

const generateHTML = (filename, options = {}) => {
	const html = pug.renderFile(
		`${__dirname}/../email/${filename}.pug`,
		options
	);
	const inlined = juice(html);
	return inlined;
};

exports.send = async (options) => {
	const html = generateHTML(options.filename, options);
	const text = htmlToText.fromString(html);
	const mailOptions = {
		from: `Hugo <noreply@urbanboulderproject.com>`,
		to: options.user.email,
		subject: options.subject,
		html,
		text,
	};
	const sendMail = promisify(transport.sendMail, transport);
	return sendMail(mailOptions);
};
