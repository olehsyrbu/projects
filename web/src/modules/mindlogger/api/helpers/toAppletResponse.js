import { setupEncryption } from './setupEncryption';

const trimId = (id) => id.split('/').pop();

export async function toAppletResponse(input = {}, options = { lang: 'en' }) {
  const { lang } = options;
  const { applet, activity, publicId, startedAt, completedAt, responses, nextsAt } = input;

  const encryption = await setupEncryption({
    prime: applet.encryption.appletPrime,
    generator: applet.encryption.base,
    publicKey: applet.encryption.appletPublicKey,
  });

  let formattedResponses = [];
  let dataSource;

  if (applet.encryption) {
    formattedResponses = activity.items.reduce(
      (accumulator, item, index) => ({ ...accumulator, [item.schema]: index }),
      {},
    );

    dataSource = await encryption.encrypt(JSON.stringify(responses));
  }

  let newNextsAt = {};

  let i = 0;
  for (const key in formattedResponses) {
    newNextsAt[key] = (nextsAt && nextsAt[i]) || completedAt;
    i++;
  }

  return {
    applet: {
      id: trimId(applet.id),
      schemaVersion: applet.schemaVersion[lang],
    },
    activity: {
      id: trimId(activity.id),
      schema: trimId(activity.id),
      schemaVersion: activity.schemaVersion[lang],
    },
    alerts: [],
    subject: null,
    timeout: 0,
    languageCode: lang,
    nextActivities: [],
    event: null,
    client: {
      appId: 'miresource-spa',
      appVersion: '2.10.1',
    },
    publicId,
    tokenCumulation: {
      value: 0,
    },
    responses: formattedResponses,
    nextsAt: newNextsAt,
    userPublicKey: encryption.publicKey,
    responseStarted: startedAt,
    responseCompleted: completedAt,
    dataSource,
  };
}
