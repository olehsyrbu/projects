import { uniqBy } from 'lodash-es';

const setOption = (item, chip) => ({
  value: item,
  label: item,
  chip,
});

export function getUserEmailsOptions(user) {
  const emailList = [];
  user.notificationEmail && emailList.push(setOption(user.notificationEmail));
  emailList.push(setOption(user.email));
  user.ownership.forEach((item) => {
    item.gpa.forEach((gpaElement) => {
      const userEmail = gpaElement?.email;
      if (user.notificationEmail === userEmail) {
        emailList[0] = setOption(userEmail, 'GPA');
      } else {
        emailList.push(setOption(userEmail, 'GPA'));
      }
    });
    emailList.push(setOption(item.email));
    item.sharedWith.forEach(({ email }) => emailList.push(setOption(email)));
  });

  return uniqBy(emailList, 'value');
}
