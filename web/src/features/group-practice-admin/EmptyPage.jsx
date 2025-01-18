import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { DocumentTable20Filled as DocumentTable } from '@fluentui/react-icons';
import { Content, Heading, Page } from '@/modules/app-shell';
import cx from './Page.module.css';

export function EmptyPage() {
  const navigate = useNavigate();

  function handleAddResource() {
    navigate('/group-practice/resources/onboarding/newProvider');
  }

  function handleUploadInfo() {
    navigate('/group-practice/resources/upload-template');
  }

  return (
    <Page className={cn(cx.GroupPracticeAdmin)}>
      <Heading>
        <h1>My Profiles</h1>
      </Heading>
      <Content surface>
        <div>
          <h2 className="font-bold">Time to invite your resources!</h2>
          <p>Add providers one-by-one or import them all at once by emailing us a spreadsheet.</p>
          <div className="flex flex-col items-center  space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <button className="mir-button primary w-full md:w-fit" onClick={handleAddResource}>
              Add resources
            </button>
            <button
              type="button"
              className="mir-button link w-full md:w-fit"
              onClick={handleUploadInfo}
            >
              Add via spreadsheet
              <DocumentTable className="!ml-1" />
            </button>
          </div>
        </div>
      </Content>
    </Page>
  );
}
