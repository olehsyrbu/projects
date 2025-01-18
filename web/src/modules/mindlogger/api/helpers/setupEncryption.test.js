import { setupEncryption } from './setupEncryption';
import { appletFixtures } from '../fixtures';

it('decrypt default response', async () => {
  const applet = appletFixtures.defaultApplet();

  const encryption = await setupEncryption({
    prime: applet.encryption.appletPrime,
    generator: applet.encryption.base,
    publicKey: applet.encryption.appletPublicKey,
  });

  const data = { boo: 1 };

  let encryptedData = await encryption.encrypt(JSON.stringify(data));
  let decryptedData = JSON.parse(await encryption.decrypt(encryptedData));
  expect(decryptedData).toEqual(data);
});
