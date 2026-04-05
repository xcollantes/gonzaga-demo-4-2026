/** API URLs. */

const baseApiUrl = process.env.NEXT_PUBLIC_API_BACKEND_URL;

// User API URL.
export const initUserApiUrl = `${baseApiUrl}/v1/firebase/init-user`;

// Profile API URL.
export const profileApiUrl = `${baseApiUrl}/v1/user/profile`;

// Image upload API URLs.
export const faceApiUrl = `${baseApiUrl}/v1/images/face`;
export const fullBodyApiUrl = `${baseApiUrl}/v1/images/full-body`;

// Feedback API URL for creating Jira tickets.
export const feedbackApiUrl = `${baseApiUrl}/v1/jira/feedback`;

// Available plans.
export const availablePlansApiUrl = `${baseApiUrl}/v1/subscriptions/available`;

// Call to reduce usage metrics being tracked for each plan.
// Track usage should all be backend.
// export const trackUsageApiUrl = `${baseApiUrl}/v1/subscriptions/track-usage`;

// Call to get usage metrics for a user.
export const usageApiUrl = `${baseApiUrl}/v1/subscriptions/usage`;

// Call to get chat sessions.
export const chatSessionsApiUrl = `${baseApiUrl}/v1/chatbot/sessions`;

// Call to get chat session messages.
export const chatSessionMessagesApiUrl = (sessionId: string) => `${baseApiUrl}/v1/chatbot/sessions/${sessionId}/messages`;

// Call to create a new chat session.
export const createChatSessionApiUrl = `${baseApiUrl}/v1/chatbot/sessions`;

// Stripe payment API URLs.
export const stripeCheckoutApiUrl = `${baseApiUrl}/v1/payments/stripe/checkout`;
export const stripeBillingPortalApiUrl = `${baseApiUrl}/v1/payments/stripe/billing-portal`;