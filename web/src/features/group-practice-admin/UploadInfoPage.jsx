import { Actions, Content, Heading, Page } from '@/modules/app-shell';
import { useNavigate } from 'react-router-dom';
import config from '@/core/config';
import { useState } from 'react';
import {
  ChevronUp20Filled as ChevronUp,
  ChevronDown20Filled as ChevronDown,
} from '@fluentui/react-icons';
import mixpanel from '@/core/mixpanel';
import PropTypes from 'prop-types';

export function UploadInfoPage({ path }) {
  let navigate = useNavigate();

  function handleBack() {
    navigate(path);
  }

  return (
    <Page>
      <Heading>
        <h1>My Resources</h1>
      </Heading>
      <Content surface>
        <UploadInfoTemplate />
      </Content>
      <Actions>
        <button className="mir-button" onClick={handleBack}>
          Back to My resources
        </button>
      </Actions>
    </Page>
  );
}

function UploadInfoTemplate() {
  const [shouldShowInfo, setShouldShowInfo] = useState(false);
  return (
    <div className="flex flex-col items-start text-base">
      <h2 className="text-2xl font-bold">How to add provider information with a spreadsheet</h2>
      <p className="mt-4">
        We have a bulk import feature ready for you if you have an existing spreadsheet with your
        provider information. On the spreadsheet template below, you will find all the required
        fields to fill out a provider profile and send an invitation.
      </p>
      <p className="mt-2">
        After you complete this spreadsheet, you'll have to send it to{' '}
        <a className="font-medium" href="mailto:support@miresource.com" type="email">
          support@miresource.com
        </a>{' '}
        and we will upload it to the platform. Then your providers will be invited via email, and
        once they accept, they will be live immediately to patients on MiResource.
      </p>
      <p className="mt-4 font-medium">
        Email us at{' '}
        <a href="mailto:support@miresource.com" type="email">
          support@miresource.com
        </a>{' '}
        if you have any questions or want to learn more about the feature.
      </p>
      <a
        href={config.gpaUploadTemplate}
        rel="noreferrer"
        className="mir-button primary !mb-6 !mt-4"
        onClick={() => mixpanel.track('Download template')}
      >
        Download template
      </a>
      <button
        type="button"
        className="mir-button link"
        onClick={() => setShouldShowInfo(!shouldShowInfo)}
      >
        Instructions to fill out spreadsheet
        {shouldShowInfo ? <ChevronUp className="!ml-1" /> : <ChevronDown className="!ml-1" />}
      </button>
      {shouldShowInfo && (
        <ol className="mt-2 list-decimal space-y-2 rounded-lg bg-surface py-6 pl-8 pr-4 text-sm">
          <li>
            Open the <span className="font-medium">"Template to fill"</span> tab.
          </li>
          <li>
            Each row is one new provider.{' '}
            <span className="font-medium">Provider 1, Provider 2,</span> and others until you fill
            all of them. There is no limit to how many providers you can add.
          </li>
          <li>
            All profiles require a photo of the provider. Please attach it to the email in the
            format .jpg and name <span className="font-medium">"ProviderFirstNameLastName."</span>
          </li>
          <li>
            <span className="font-medium">Column F "Areas of specialization"</span>: you can select
            all areas that apply to that provider and add them on the appropriate cell. Check the
            tab <span className="font-medium">"Areas of specialization"</span> for the list of
            available specialties.
          </li>
          <li>
            <span className="font-medium">Column H "Type of Provider"</span>: you can select all
            types that apply to that provider and add them to the appropriate cell. Check the tab{' '}
            <span className="font-medium">"Provider type"</span> for the list of available provider
            types.
          </li>
          <li>
            <span className="font-medium">Column Q "In Network Insurance"</span>: you can select all
            that apply to that provider and add them to the appropriate cell. Check the tab{' '}
            <span className="font-medium">"In-network insurance"</span> for the list of available
            insurance plans.
          </li>
          <li>
            Once you complete all the fields, save the spreadsheet and send it along with the
            profile photos to{' '}
            <a href="mailto:support@miresource.com" type="email" className="font-medium">
              support@miresource.com
            </a>
            . We will upload it to MiResource and invite the providers.
          </li>
        </ol>
      )}
    </div>
  );
}

UploadInfoPage.propTypes = {
  path: PropTypes.string,
};

UploadInfoPage.defaultProps = {
  path: '/group-practice/resources',
};
