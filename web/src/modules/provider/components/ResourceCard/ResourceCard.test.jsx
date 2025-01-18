import { AvailabilityBadge, ResourceCard, UpdatedWithinDays } from '@/modules/provider/components';
import { render, screen } from '@testing-library/react';
import {
  Edit16Filled as Edit16,
  Edit20Filled as Edit20,
  Mail12Regular as Mail,
  Checkmark12Filled as Checkmark,
  DismissCircle20Filled as DismissCircle,
} from '@fluentui/react-icons';
import PendingStatus from './Pending';

it('render ResourceCard with min value', async () => {
  render(
    <ResourceCard
      photo={{ src: undefined, alt: 'GPA provider profile' }}
      renderName={() => 'john Macalister'}
      renderActions={() => (
        <>
          <button className="mir-button text">
            <Edit20 />
          </button>
          <button className="mir-button text">
            <DismissCircle />
          </button>
        </>
      )}
    />,
  );
  let buttons = screen.getAllByRole('button');
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('john Macalister');
  expect(buttons[0]).toBeInTheDocument();
  expect(buttons[1]).toBeInTheDocument();
});

it('render ResourceCard pending state', async () => {
  const provider = {
    name: 'Ivan Macalister',
    email: 'melissa@familypractice.com',
    tagLine: 'Licensed Marriage and Family Therapist (LMFT)',
    emailSent: 'Sent Dec 23, 2021',
    status: 'Pending',
  };

  render(
    <ResourceCard
      photo={{ src: undefined, alt: 'GPA provider profile' }}
      className="bg-graphics-10"
      renderName={() => <p className="opacity-50">{provider.name}</p>}
      renderDetails={() => (
        <>
          <div className="basis-1/2 opacity-50">{provider.tagLine}</div>
          <div className="badge flex basis-1/6 items-center text-xs font-light ">
            <span className="mr-2 flex text-graphics-100">
              <PendingStatus size={12} />
            </span>
            {provider.status}
          </div>
          <div className="flex basis-1/6 items-center text-xs font-light">
            <span className="mr-2 flex text-graphics-100">
              <Mail />
            </span>
            {provider.emailSent}
          </div>
          <button className="mir-button text button-text-xs basis-1/6 text-xs font-bold text-p-100">
            Resend
          </button>
        </>
      )}
      renderSubDetails={() => (
        <>
          <div className="flex flex-row items-center">
            <span className="font-bold">Invitation email: </span>
            <span className="pl-1 font-light">{provider.email}</span>
            <span className="flex pl-2 text-p-100">
              <Edit16 />
            </span>
          </div>
        </>
      )}
      renderActions={() => (
        <>
          <button className="mir-button text">
            <Edit20 />
          </button>
          <button className="mir-button text">
            <DismissCircle />
          </button>
        </>
      )}
    />,
  );

  let buttons = screen.getAllByRole('button');
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ivan Macalister');
  expect(buttons[0]).toBeInTheDocument();
  expect(buttons[1]).toBeInTheDocument();

  expect(screen.getByText(provider.status)).toBeInTheDocument();
  expect(screen.getByText(provider.email)).toBeInTheDocument();
  expect(screen.getByText(provider.tagLine)).toBeInTheDocument();
  expect(screen.getByText(provider.emailSent)).toBeInTheDocument();
});

it('render ResourceCard Active state', async () => {
  const provider = {
    name: 'Ivan Macalister',
    email: 'melissa@familypractice.com',
    tagLine: 'Licensed Marriage and Family Therapist (LMFT)',
    updatedAt: '2022-02-02T12:21:43.837Z',
    phone: '1-222-333-444',
    status: 'Activated',
  };

  render(
    <ResourceCard
      photo={{ src: undefined, alt: 'GPA provider profile' }}
      renderName={() => <p>{provider.name}</p>}
      renderDetails={() => (
        <>
          <div className="basis-1/2">{provider.tagLine}</div>
          <div className="badge flex basis-1/6 items-center text-xs font-light ">
            <span className="mr-2 flex text-graphics-100">
              <Checkmark />
            </span>
            {provider.status}
          </div>
        </>
      )}
      renderSubDetails={() => (
        <>
          <div className="flex flex-row items-center">
            <AvailabilityBadge status="ACCEPTING_NEW_CLIENTS" name="Accepting new clients" />
            <span className="mir-badge-label-text-dash mir-badge">
              <UpdatedWithinDays updatedAt={provider.updatedAt} />
            </span>
            <span className="mir-badge-label-text-dash mir-badge">{provider.phone}</span>
            <span className="mir-badge-label-text-dash mir-badge">{provider.email}</span>
          </div>
        </>
      )}
      renderActions={() => (
        <>
          <button className="mir-button text">
            <Edit20 />
          </button>
          <button className="mir-button text">
            <DismissCircle />
          </button>
        </>
      )}
    />,
  );

  let buttons = screen.getAllByRole('button');
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Ivan Macalister');
  expect(buttons[0]).toBeInTheDocument();
  expect(buttons[1]).toBeInTheDocument();

  expect(screen.getByText('Activated')).toBeInTheDocument();
  expect(screen.getByText(provider.email)).toBeInTheDocument();
  expect(screen.getByText(provider.tagLine)).toBeInTheDocument();
});
