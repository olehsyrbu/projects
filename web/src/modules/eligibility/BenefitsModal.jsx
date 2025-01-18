import { useSelectedCompany, CompanySelect, CompanyBenefits } from '@/modules/eligibility';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@/core/components/Dialog';

export function BenefitsModal() {
  let company = useSelectedCompany();

  return (
    <Dialog width={536} contentClassName="!overflow-visible">
      {({ close }) => (
        <>
          <DialogTitle>Your benefits plan</DialogTitle>
          <DialogContent className={!company.id ? '!overflow-visible' : ''}>
            <p className="mb-3">Choose your company to see the benefits:</p>

            <div className="space-y-6">
              <CompanySelect />
              {company.id ? <CompanyBenefits companyId={company.id} /> : null}
            </div>
          </DialogContent>

          <DialogActions>
            <button className="mir-button" onClick={close}>
              Close
            </button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
