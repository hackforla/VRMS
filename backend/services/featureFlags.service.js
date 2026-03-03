const PostHog = require('posthog-node');

const client = new PostHog.PostHog(process.env.POSTHOG_KEY, {
    host: process.env.POSTHOG_HOST,
});

const getAllFlags = async (distinctId) => {
    return await client.getAllFlags(distinctId);
};

module.exports = { getAllFlags };
