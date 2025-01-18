import { Link } from 'react-router-dom';
import config from '@/core/config';
import { useOrganization } from '@/modules/organization';
import { isEmpty } from 'lodash-es';
import './Footer.css';

function Footer() {
  let organization = useOrganization();
  let isBcbsk = organization?.subdomain === 'bcbsks';
  let isNCSU = organization?.subdomain === 'ncsu';

  return (
    <div className="section-footer bg-p-120">
      <div className="section-layout">
        <div className="text-wrapper">
          <div className="content-us">
            <a target="_blank" href="/about" rel="noreferrer">
              {isEmpty(organization?.subdomain) ? 'About us' : 'About MiResource'}
            </a>
            <div>
              <a href={config.learningCenterUrl} target="_blank" rel="noreferrer">
                Learning center
              </a>
            </div>
            <div className="!mb-6">
              <Link to="/partners" target="_blank">
                Partners
              </Link>
            </div>
            <p>Contact us:</p>
            <a href="mailto:support@miresource.com">support@miresource.com</a>
          </div>
          <div className="policy">
            <a target="_blank" href={config.copyrightPolicyUrl} rel="noreferrer">
              Copyright Policy
            </a>
            <a target="_blank" href={config.privacyPolicyUrl} rel="noreferrer">
              Privacy Policy
            </a>
            <a target="_blank" href={config.termsOfUseUrl} rel="noreferrer">
              Terms of Use
            </a>
          </div>
          <p
            className={`disclaimer bcbs:text-p-10}
            ${isNCSU ? 'md:!max-w-[620px]' : ''}  `}
          >
            <span>DISCLAIMER</span>:{` `}
            {isNCSU ? (
              <>
                Your answers to screening questions on the MiResource website are anonymous; NC
                State does not have access to your answers and does not have the ability to follow
                up with you based on the information provided. Providers included in the MiResource
                database have chosen to serve students seeking off-campus care by voluntarily
                including their information in the MiResource database. Please be aware that the
                providers in the database are not affiliated with NC State. NC State does not
                guarantee the accuracy, completeness, or timeliness of the information supplied by
                the providers and does not endorse any particular provider listed. You are strongly
                encouraged to verify information (including fees, insurance, etc.) directly with the
                chosen provider. NC State does not supervise the individuals, agencies, and
                off-campus resources included in this database and bears no responsibility for
                services provided thereby. If you have any feedback about a provider or resource in
                this database, please feel free to contact the Counseling Center at 919-515-2423 and
                ask to speak to one of our Case Managers about your treatment experience.
              </>
            ) : (
              <>
                All MiResource pages are for informational & educational purposes only. All
                informational materials & guides on this site are offered "as is" & are NOT a
                substitute for medical advice, diagnostic analysis, or treatment planning by a
                licensed provider. Please note that the information found on this site is not a
                comprehensive review of any condition, drug, or body system; do not use it to
                replace clinical decision-making.
              </>
            )}
          </p>
        </div>
        <p className="mb-6 mt-12 pr-[44px] text-left text-sm font-medium leading-relaxed text-inverted md:pr-0 md:text-center md:text-base md:leading-tight">
          If you are at risk of harming yourself or others, or experiencing a mental health crisis,
          call{' '}
          <a
            className="inline-block rounded-xl bg-p-100 px-2 pt-0.5 leading-[1.3] text-inverted hover:text-inverted"
            href={`tel:988`}
          >
            988.
          </a>{' '}
          For emergencies, call{' '}
          <a
            className="inline-block rounded-xl bg-p-100 px-2 pt-0.5 leading-[1.3] text-inverted hover:text-inverted"
            href={`sms:911&body=HOME`}
          >
            911.
          </a>
        </p>

        <p className="license">© 2023 MiResource</p>
        {isBcbsk && (
          <p className="mr-auto mt-6 text-xs font-normal text-p-10">
            Blue Cross and Blue Shield of Kansas is an independent licensee of the Blue Cross Blue
            Shield Association. BLUE CROSS®, BLUE SHIELD® and the Cross and Shield Symbols are
            registered service marks of the Blue Cross Blue Shield Association, an association of
            independent Blue Cross and Blue Shield Plans. Blue Cross and Blue Shield of Kansas
            contracts with MiResource to provide mental health resources to members. MiResource is
            unaffiliated with Blue Cross and Blue Shield of Kansas.
          </p>
        )}
      </div>
    </div>
  );
}

export default Footer;
