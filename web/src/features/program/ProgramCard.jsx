import { useState } from 'react';
import {
  Clock16Filled as Clock,
  DismissCircle20Filled as DismissCircle,
  Edit20Filled as Edit,
  Pause12Filled as PauseSmall,
  Pause20Filled as Pause,
  Play20Filled as Play,
} from '@fluentui/react-icons';
import { differenceInDays } from 'date-fns';
import PropTypes from 'prop-types';
import { formatPhoneNumber } from '@/core/utils';
import { Dialog, DialogActions, DialogContent, DialogTitle, LinkAvatar } from '@/core/components';
import { Availability, getLastUpdatedAt } from '@/modules/provider';

export function ProgramCard({ program, onPublish, onEdit, onRemove, onDeactivate, onActivate }) {
  let [showDeleteDialog, setShowDeleteDialog] = useState(false);
  let isDraft = program.status === 'PENDING';
  let name = program.programName ?? program.programType?.name;
  let location = formatLocation(program);

  return (
    <div
      className={`block border-t !text-regular last:border-b md:flex md:rounded-2xl md:border ${
        program.active ? 'bg-white' : 'bg-n-20'
      }`}
    >
      <div className="p-4 after:clear-both after:block max-md:py-3 md:flex md:flex-1">
        <LinkAvatar
          url={program.photoUrl}
          linkHref={!isDraft ? `/program/${program.slug}` : null}
          className="size-16 max-md:float-right max-md:ml-5 md:mr-3"
        />

        <div className="self-center">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{name}</h3>
            {!program.active && (
              <p className="flex items-center gap-x-0.5 rounded-full bg-n-75 px-2 text-xs font-medium">
                <PauseSmall />
                Deactivated
              </p>
            )}
            {isDraft ? <Draft /> : null}
          </div>

          {location ? <p className="mt-1 text-sm">{location}</p> : null}

          <div className="mt-3 flex flex-wrap gap-y-2 empty:hidden">
            {program.availability?.status ? (
              <Availability status={program.availability.status} className="mr-4" />
            ) : null}

            {!isDraft ? (
              <div className="group inline-flex items-center text-sm">
                <Clock className="mr-1" />
                {formatUpdatedAt(program)}
                <Dot className="group-last:hidden" />
              </div>
            ) : null}

            {program.mobile ? (
              <div className="group inline-flex items-center text-sm">
                {formatPhoneNumber(program.mobile)}
                <Dot className="group-last:hidden" />
              </div>
            ) : null}

            {program.email ? (
              <div className="inline-flex items-center text-sm">{program.email}</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex flex-none items-center justify-between px-14 max-md:border-t max-md:py-4 md:space-x-12 md:px-6">
        {isDraft ? (
          <button
            className="mir-button !px-[calc(1rem-1px)] !text-sm max-md:h-8 md:h-12"
            onClick={(event) => {
              event.preventDefault();
              onPublish(program.id);
            }}
          >
            Proceed to publish
          </button>
        ) : (
          <>
            {program.active ? (
              <button
                title="Deactivate"
                className="text-p-100"
                onClick={(event) => {
                  event.preventDefault();
                  onDeactivate(program.id);
                }}
              >
                <Pause />
              </button>
            ) : (
              <button
                title="Activate"
                className="text-p-100"
                onClick={(event) => {
                  event.preventDefault();
                  onActivate(program.id);
                }}
              >
                <Play />
              </button>
            )}
            <button
              title="Edit"
              className="text-p-100"
              onClick={(event) => {
                event.preventDefault();
                onEdit(program.id);
              }}
            >
              <Edit />
            </button>
          </>
        )}
        <button
          title="Delete"
          className="text-p-100"
          onClick={(event) => {
            event.preventDefault();
            setShowDeleteDialog(true);
          }}
        >
          <DismissCircle />
        </button>
      </div>

      {showDeleteDialog ? (
        <Dialog isOpen onDismiss={() => setShowDeleteDialog(false)} width={550}>
          <DialogTitle>Delete Program</DialogTitle>
          <DialogContent>
            You have selected to delete this program: <b>{name}.</b> To confirm, all data associated
            with this program will be lost. This data cannot be restored.
          </DialogContent>
          <DialogActions>
            <button
              className="mir-button primary"
              onClick={() => {
                setShowDeleteDialog(false);
                onRemove(program.id);
              }}
            >
              Delete
            </button>
            <button className="mir-button" onClick={() => setShowDeleteDialog(false)}>
              Close
            </button>
          </DialogActions>
        </Dialog>
      ) : null}
    </div>
  );
}

function formatLocation(program) {
  let { address } = program.locations[0] ?? {};

  if (address) {
    let { address1, city, state, zip } = address;
    return `${address1}, ${city}, ${state.code} ${zip}`;
  }

  if (program.remote?.available) {
    let { video, voice, chat } = program.remote;
    let options = [video ? 'Video' : '', voice ? 'Voice' : '', chat ? 'Chat' : ''].filter(Boolean);
    return options.length > 0 ? `Remote – ${options.join(', ')}` : 'Remote';
  }

  return null;
}

function formatUpdatedAt(program) {
  let updatedAt = getLastUpdatedAt(program.updatedAt, program.availability);
  let days = differenceInDays(new Date(), new Date(updatedAt));

  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  return `Updated within ${days} days`;
}

function Draft() {
  return (
    <div className="inline-flex items-center rounded-full bg-n-20 px-2.5 py-0.5 text-xs font-medium">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor">
        <path d="M8.182 2.332A6.165 6.165 0 0 0 3.94 4.04V2.949a.616.616 0 0 0-1.233 0v2.774a.616.616 0 0 0 .617.616h2.774a.616.616 0 1 0 0-1.233h-1.48a4.932 4.932 0 1 1 3.564 8.323.617.617 0 0 0 0 1.233 6.165 6.165 0 1 0 0-12.33Zm0 3.699a.616.616 0 0 0-.617.617v1.849a.616.616 0 0 0 .617.617h1.233a.616.616 0 1 0 0-1.233h-.617V6.648a.616.616 0 0 0-.616-.617Z" />
      </svg>
      Draft
    </div>
  );
}

function Dot({ className }) {
  return (
    <svg
      className={className}
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8.5" r="1" fill="currentColor" />
    </svg>
  );
}

ProgramCard.propTypes = {
  program: PropTypes.object.isRequired,
  onPublish: PropTypes.func,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  onDeactivate: PropTypes.func,
  onActivate: PropTypes.func,
};
Dot.propTypes = {
  className: PropTypes.string,
};

ProgramCard.defaultProps = {
  onEdit: () => {},
  onRemove: () => {},
  onPublish: () => {},
  onDeactivate: () => {},
  onActivate: () => {},
};
