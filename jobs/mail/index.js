/**
 * Created by michael.stifter on 28.04.2017.
 */
var fs = require('fs');
var path = require('path');

var mailController = require('../../controllers/mailer');
var User = require('../../models/user');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var checkNested = function(obj) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {
        if (!obj || !obj.hasOwnProperty(args[i])) {
            return false;
        }
        obj = obj[args[i]];
    }
    return true;
};

var getMailContent = function(config) {
    return new Promise(function(resolve, reject) {
        if ((!checkNested(config, 'params', 'mail', 'useText') && typeof config.params.mail.useText === 'string') ||
            (!checkNested(config, 'params', 'mail', 'useFile') && typeof config.params.mail.useFile === 'string')) {
            reject("Either mail.useText or mail.useFile must be set in config object");
        }

        if (checkNested(config, 'params', 'mail', 'useText') && typeof config.params.mail.useText === 'string') {
            resolve(config.params.mail.useText);
        } else if (checkNested(config, 'params', 'mail', 'useFile') && typeof config.params.mail.useFile === 'string') {
            fs.readFile(path.resolve(config.params.mail.useFile), 'utf-8', function(err, data) {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        } else {
            reject("I am not comfortable with this situation");
        }
    });
};

var parseContextDefinition = function(def, context) {
    var contextDef = getContentBetween("{{context:", "}}", def);

    return context[contextDef] || def;
};

var getContentBetween = function(start, end, substr) {
    var startIdx = substr.indexOf(start);
    var endIdx = substr.indexOf(end);

    var startPos = startIdx + start.length;
    var endPos = endIdx;

    if (startIdx < 0 || endIdx < 0 || endPos < startPos) {
        return substr;
    }

    return substr.substr(startPos, endPos - startPos);
};

var replaceStrings = function(config, content, context) {
    var replacements = {};

    if (checkNested(config, 'params', 'mail', 'replace') && typeof config.params.mail.replace === 'object') {
        replacements = config.params.mail.replace;
    }

    for (var key in replacements) {
        content = content.replaceAll(key, parseContextDefinition(replacements[key], context));
    }

    return content;
};

fs.readFile('config.json', 'utf-8', function(err, data) {
    if (err) {
        console.error(err);
        exit(1);
    }

    var config;

    try {
        config = JSON.parse(data);
    } catch (e) {
        return console.error('Could not parse config.json', e);
    }

    // check for dryrun
    var dryrun = false;

    if (checkNested(config, 'params', 'dryrun') && config.params.dryrun === true) {
        dryrun = true;
        console.log('Job is running in dryrun (no e-mails will be sent)');
    }

    // get mail subject
    var mailSubject;

    if (checkNested(config, 'params', 'mail', 'subject') && typeof config.params.mail.subject === 'string') {
        mailSubject = config.params.mail.subject;
    } else {
        throw new Error("Cannot send mails without subject");
    }

    // find all user elements
    User.find({
        active: true
    }, function (err, users) {
        if (err) {
            return console.error('failed to fetch users', err);
        }
		
		// use static recipients if they are set
		if (checkNested(config, 'params', 'mail', 'useRecipients') && typeof config.params.mail.useRecipients === 'object') {
			users = config.params.mail.useRecipients;
		}

        if (!users || users.length === 0) {
            console.log('No users found - no e-mails can be sent');
        } else {
            // create array only with users e-mail addresses
            var userArray = users.map(function(user) {
                return {
                    username: user.username,
                    email: user.email,
                    color: user.color
                }
            });

            // get the mail content
            getMailContent(config)
                .then(function(content) {
                    // Promise array
                    var promises = [];

                    userArray.forEach(function(u) {
                        var finalContent = replaceStrings(config, content, u);

                        if (dryrun === true) {
                            console.log('\n=======================================');
                            console.log('would now sent the following mail:', '\n');

                            console.log('To:', u.email);
                            console.log('Subject:', mailSubject, '\n');

                            console.log(finalContent);
                            console.log('=======================================\n');
                        } else {
                            promises.push(mailController.sendMail({
                                to: u.email,
                                subject: mailSubject,
                                mode: 'html',
                                content: finalContent
                            }));
                        }
                    });

                    if (dryrun === false) {
                        Promise.all(promises)
                            .then(function(result) {
                                console.log('All mails sent', result);

                                // we're finished now, exit program
                                process.exit();
                            })
                            .catch(function(err) {
                                console.error('Failed to send all mails', err);

                                // we're finished now, exit program
                                process.exit();
                            });
                    }
                })
                .catch(function(err) {
                    console.error('failed to get mail content', err);
                })
        }
    })
});