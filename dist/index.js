import * as twilio_1 from "./providers/twilio";
export { twilio_1 as twilio };
import * as sendgridEmail_1 from "./providers/sendgrid-email";
export { sendgridEmail_1 as sendgridEmail };
import * as mailgunEmail_1 from "./providers/mailgun-email";
export { mailgunEmail_1 as mailgunEmail };
// Social logins
export { default as apple } from "./providers/apple";
export { default as github } from "./providers/github";
export { default as google } from "./providers/google";
export { default as facebook } from "./providers/facebook";
export { default as discord } from "./providers/discord";
export { default as spotify } from "./providers/spotify";
export * from "./types";
