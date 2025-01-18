import { deleteInvitation } from '@/core/api/InvitationAPI';
import { setupServer } from '@/tools/test-server/setupServer';
import { invitationFixture } from '@/tools/test-fixtures';

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

it('delete single invitation', async () => {
  const actual = await deleteInvitation({
    ids: ['fdfdfd'],
    cascadeUsers: true,
  });
  expect(actual).toEqual(invitationFixture.batchDeleteSuccess());
});
