import {
  ArrowDownload20Regular as ArrowDownload,
  PersonMail20Filled as PersonMail,
  Copy20Regular as Copy,
  LinkDismiss20Filled as LinkDismiss,
  Delete20Filled as Delete,
} from '@fluentui/react-icons';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Tooltip } from '@/core/components/Tooltip';

export function Toolbar({ providers, onClick }) {
  function countProviderStates(providers) {
    let activatedCount = 0;
    let pendingCount = 0;
    let unclaimedCount = 0;

    providers.forEach(({ status }) => {
      switch (status) {
        case 'COMPLETED':
          activatedCount++;
          break;
        case 'PENDING':
        case 'ONBOARDING':
          pendingCount++;
          break;
        case 'UNCLAIMED':
          unclaimedCount++;
          break;
        default:
          break;
      }
    });

    const selectedLength = providers.length;

    return {
      isAllActivated: activatedCount === selectedLength,
      isAllPending: pendingCount === selectedLength,
      isAllUnclaimed: unclaimedCount === selectedLength,
      isSinglePending: pendingCount === 1 && selectedLength === 1,
    };
  }

  const { isAllActivated, isAllPending, isAllUnclaimed, isSinglePending } =
    countProviderStates(providers);

  return (
    <div
      className={cn('mr-auto flex gap-x-2 pl-8 ', {
        hidden: providers.length === 0,
      })}
    >
      <TooltipButton label="Export profiles" id="export" onClick={onClick}>
        <ArrowDownload className="text-white" />
      </TooltipButton>

      {isAllActivated && (
        <TooltipButton label="Remove" id="remove" onClick={onClick}>
          <LinkDismiss className="text-white" />
        </TooltipButton>
      )}

      {isSinglePending && (
        <TooltipButton label="Copy invitation" id="copyInvitation" onClick={onClick}>
          <Copy className="text-white" />
        </TooltipButton>
      )}

      {isAllUnclaimed && (
        <TooltipButton label="Generate invites" id="generateInvites" onClick={onClick}>
          <PersonMail className="text-white" />
        </TooltipButton>
      )}

      {(isAllPending || isAllUnclaimed) && (
        <TooltipButton label="Delete" id="delete" onClick={onClick}>
          <Delete className="text-white" />
        </TooltipButton>
      )}
    </div>
  );
}

Toolbar.propTypes = {
  providers: PropTypes.array,
  onClick: PropTypes.func,
};

function TooltipButton({ children, label, id, onClick }) {
  return (
    <Tooltip label={label}>
      <button
        onClick={() => onClick(id)}
        className={`h-10 w-[4.25rem] rounded-lg border border-p-100 bg-p-100 focus-visible:outline-none focus-visible:ring-2`}
      >
        {children}
      </button>
    </Tooltip>
  );
}

TooltipButton.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
};
