export function formatPhoneNumber(phone) {
  let digits = phone.replace(/\D/g, '');
  let match = digits.match(/(.*)(...)(...)(....)/);

  return match ? `${match[1]} (${match[2]}) ${match[3]}-${match[4]}`.trim() : phone;
}
