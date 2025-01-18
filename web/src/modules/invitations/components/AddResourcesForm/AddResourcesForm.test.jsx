import { InvitationTypes } from '@/core/definitions';
import { AddResourcesForm } from '@/modules/invitations/components';
import { invitationFixture } from '@/tools/test-fixtures';
import { render, screen } from '@/tools/app-test-utils';
import { waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

async function setupForm({
  onSuccess,
  response,
  hasTestInput = false,
  failedMessage,
  successMessage,
} = {}) {
  const batchCreateInvitations = vi.fn().mockResolvedValue(response);

  render(
    <AddResourcesForm
      failedMessage={failedMessage}
      successMessage={successMessage}
      invitationType={InvitationTypes.OrganizationMember}
      organizationId="demo"
      onSuccess={onSuccess}
      batchCreateInvitations={batchCreateInvitations}
    />,
  );
  const submitButton = screen.getByText('Add resource', { selector: 'button' });

  if (hasTestInput) {
    await userEvent.type(screen.getByLabelText(/First name/i), 'test');
    await userEvent.type(screen.getByLabelText(/Last name/i), 'test');
    await userEvent.type(screen.getByLabelText(/Email/i), 'test@email.com');
  }

  return {
    submit: () => userEvent.click(submitButton),
  };
}

it('submit with success', async () => {
  const handleSubmit = vi.fn();
  const { submit } = await setupForm({
    onSuccess: handleSubmit,
    response: invitationFixture.batchCreateOnlySuccess(),
    hasTestInput: true,
  });

  await submit();

  await waitFor(() => {
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  expect(handleSubmit).toHaveBeenCalledWith(invitationFixture.batchCreateOnlySuccess().success);
});

it('renders message when only failed results', async () => {
  const handleSubmit = vi.fn();
  const { submit } = await setupForm({
    response: invitationFixture.batchCreateOnlyFailed(),
    hasTestInput: true,
    onSuccess: handleSubmit,
  });

  await submit();

  await waitFor(() => {
    expect(screen.getByText(/These resources are already registered/i)).toBeInTheDocument();
  });

  expect(handleSubmit).not.toHaveBeenCalled();
});

it('renders message when success and failed results', async () => {
  const { submit } = await setupForm({
    response: invitationFixture.batchCreateSuccessAndFailed(),
    hasTestInput: true,
  });

  await submit();

  await waitFor(() => {
    expect(screen.getByText(/These resources are already registered/i)).toBeInTheDocument();
  });

  expect(screen.getByText(/New resources have been added/i)).toBeInTheDocument();
});

it('customize messaging', async () => {
  const { submit } = await setupForm({
    response: invitationFixture.batchCreateSuccessAndFailed(),
    hasTestInput: true,
    failedMessage: 'Bad',
    successMessage: 'Good',
  });

  await submit();

  await waitFor(() => {
    expect(screen.getByText(/Bad/i)).toBeInTheDocument();
  });

  expect(screen.getByText(/Good/i)).toBeInTheDocument();
});

it('provides input validation', async () => {
  const handleSubmit = vi.fn();
  const { submit } = await setupForm({
    onSuccess: handleSubmit,
    response: invitationFixture.batchCreateOnlySuccess(),
  });

  await submit();

  await waitFor(() => {
    const alerts = screen.queryAllByText(/This field is required/i);
    expect(alerts.length).toBe(3);
  });
});
