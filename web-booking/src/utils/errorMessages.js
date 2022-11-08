import { notify } from './helpers';

const errorMessages = [
  'Being a new patient, you cannot book an appointment while you already have one pending. Please cancel the existing appointment and try again.',
  'You must book your first appointment at a welcome center.',
  'You cannot book an appointment at this center.',
  "You don't have a card saved on file yet. Please save a card and try again.",
  'This slot is no longer available to book.',
  'You cannot use a landline number to sign in. Please try another number.',
];

export const errorNotify = (err, defaultMessage) => {
  notify(
    errorMessages.includes(err?.data?.message)
      ? err?.data?.message
      : defaultMessage,
    'error'
  );
};
