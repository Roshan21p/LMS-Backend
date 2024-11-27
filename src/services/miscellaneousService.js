import { CONTACT_US_EMAIL } from '../config/serverConfig.js';
import BadRequestError from '../utils/badRequestError.js';
import InternalServerError from '../utils/internalServerError.js';
import sendEmail from '../utils/sendEmail.js';

const getContactInfo = async (contactDetails) => {
  // Destructuring the required data from req.body
  const { name, email, message } = contactDetails;

  // Checking if values are valid
  if (!name || !email || !message) {
    throw new BadRequestError('Name, Email, Message are required');
  }

  try {
    const subject = 'Contact Us Form';
    const textMessage = `Name: ${name} <br /> Email: ${email} <br /> Message: ${message}`;

    // Await the send email
    await sendEmail(CONTACT_US_EMAIL, subject, textMessage);
  } catch (error) {
    throw new InternalServerError(error);
  }
};

export { getContactInfo };
