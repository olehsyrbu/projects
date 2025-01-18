import { useState } from 'react';
import {
  Dismiss20Filled as Dismiss,
  ErrorCircle16Regular as ErrorCircle,
} from '@fluentui/react-icons';
import config from '@/core/config';
import { useOrganization } from '@/modules/organization';

export function EmergencyBanner() {
  let organization = useOrganization();
  let [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="flex items-start bg-banner-emergency p-2 md:px-8">
      <div className="mx-auto flex">
        <ErrorCircle className="mr-2 mt-0.5 flex-none" />
        <p className="text-sm">
          If you are at risk of harming yourself or others, or experiencing a mental health crisis,
          call 988. For emergencies, call 911.{' '}
          {organization?.subdomain === 'ncsu' ? (
            <a
              className="underline"
              href={config.ncsuEmergencyUrl}
              target="_blank"
              rel="noreferrer"
            >
              More resources
            </a>
          ) : null}
        </p>
      </div>

      <button
        aria-label="Dismiss"
        className="ml-2 flex-none cursor-pointer max-[630px]:mt-1"
        onClick={() => setClosed(true)}
      >
        <Dismiss className="text-p-100" />
      </button>
    </div>
  );
}
