import { DialogTrigger, Button } from 'react-aria-components';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { useOrganization } from '@/modules/organization';
import { BenefitsModal } from '@/modules/eligibility';

export function BenefitsTrigger() {
  let flags = useFlags();
  let organization = useOrganization();

  if (!flags.eligibility || organization?.subdomain !== 'aetna') {
    return null;
  }

  return (
    <DialogTrigger>
      <Button className="w-full rounded-lg bg-p-10 px-4 py-2 font-medium text-p-100 hover:bg-p-20">
        Check your plan benefits
      </Button>

      <BenefitsModal />
    </DialogTrigger>
  );
}
