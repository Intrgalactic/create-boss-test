const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MANDRILLAAPP_API_KEY);

async function sendTemplateEmail(templateName, recipient, merges, senderEmail) {
    console.log(process.env.MAILCHIMP_API_KEY);
    try {
        console.log(recipient);
        const response = await mailchimp.messages.sendTemplate({
            template_name: templateName,
            template_content: [],
            message: {
                from_email: senderEmail, // Ensure this is a verified sender email in Mandrill
                to: [{ email: recipient, type: 'to' }],
                merge: true,
                merge_language: 'mailchimp',
                global_merge_vars: merges
            },
        });
        console.log(response);
    
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = sendTemplateEmail;