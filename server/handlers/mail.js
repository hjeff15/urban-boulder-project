const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const promisify = require('es6-promisify');
const sgMail = require('@sendgrid/mail');
// const { options } = require('../routes');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// var transport = nodemailer.createTransport({
// 	host: process.env.MAIL_HOST,
// 	port: process.env.MAIL_PORT,
// 	auth: {
// 		user: process.env.MAIL_USER,
// 		pass: process.env.MAIL_PASS,
// 	},
// });

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
	// const mailOptions = {
	// 	from: `Hugo <noreply@urbanboulderproject.com>`,
	// 	to: options.user.email,
	// 	subject: options.subject,
	// 	html,
	// 	text,
	// };
	const msg = {
		to: options.user.email, // Change to your recipient
		from: ' info@urbanboulderproject.com', // Change to your verified sender
		subject: options.subject,
		text,
		html,
	};
	sgMail
		.send(msg)
		.then(() => {
			console.log('Email sent');
		})
		.catch((error) => {
			console.error(error);
		});
	// const sendMail = promisify(transport.sendMail, transport);
	// return sendMail(mailOptions);
	return;
};
