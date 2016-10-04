var nodemailer = require('nodemailer');
var config = require('../config/server');

/**
 * Sends an e-mail via the configured mail provider service.
 * @param options   Object containing all information about the mail to be sent
 *                  Example: {
 *                              "to": ...           // recipient's e-mail address
 *                              "subject": ...      // subject line of e-mail
 *                              "mode": ...         // e-mail mode, can be "text" (default) or "html"
 *                              "content": ...      // body of e-mail
 *                              "attachments": ...  // attachments of e-mail
 *                            }
 * @returns {Promise} A resolved promise takes the form { "status": "Message sent", "info": NODEMAILER_SUCCESS_INFO }
 */
var sendMail = function(options) {
    return new Promise(function(resolve, reject) {
        var defaultConfig = {
            from: null,
            options: {
                service: null,
                auth: {
                    user: null,
                    pass: null
                }
            }
        };

        var to = options.to;
        var subject = options.subject;
        var mode = options.mode || 'text';
        var content = options.content;
        var attachments = options.attachments;

        var mailConfig = config.mail || defaultConfig;

        var transporter = nodemailer.createTransport(mailConfig.options);

        var mailOptions = {
            from: mailConfig.from,
            to: to,
            subject: subject
        };

        // add attachments if necessary
        if (attachments) {
            mailOptions['attachments'] = attachments;
        }

        // set content for mode (either 'html' or 'text')
        mailOptions[mode] = content;

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                reject(error);
            }

            resolve({
                "status": "Message sent"
            });
        });
    });
};

module.exports.sendMail = sendMail;