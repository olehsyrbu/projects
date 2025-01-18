import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio } from '@/core/components/Radio';
import { importRcInvitations } from '@/core/api/InvitationQueries';
import { useMatchMedia } from '@/core/hooks';
import { useAuthContext } from '@/modules/auth';
import { AddResourcesForm } from '@/modules/invitations/components';
import { usePendingResourcesState } from '../PendingResourcesStateContext';
import { FileImportForm } from './FileImportForm';
import { Actions, Content, Heading, Page } from '@/modules/app-shell/Cabinet';
import './ResourcesImport.css';

export default function ResourcesImport() {
  let resourcesFormRef = useRef();
  let navigate = useNavigate();
  let { user } = useAuthContext();
  let [, dispatch] = usePendingResourcesState();
  let isMobile = useMatchMedia('(max-width: 767px)');

  let [tab, setTab] = useState('manual');
  let [pending, setPending] = useState(false);
  let [error, setError] = useState(null);
  let [file, setFile] = useState(null);

  async function uploadFile() {
    setPending(true);

    try {
      let results = await importRcInvitations(file);
      let totalRows = Object.values(results).reduce((x, y) => x + y);

      if (totalRows === results.errored) {
        setError(
          'Too many missed data (no email, no First Name etc.) in your spreadsheet. Please check it out again and fill the miss data. We suggest to create a new one based on our template.',
        );
        return;
      }
      dispatch({ type: 'clear-selection' });
      const activeTab = results.skipped && !results.created ? 'active' : 'pending';
      navigate('/referral-coordinator/resources', {
        replace: true,
        state: {
          highlight: results.created,
          activeTab,
        },
      });
    } catch (e) {
      setError('Something went wrong. Please try again.');
      setPending(false);
    }
  }

  function handleAddResourcesSuccess(success) {
    const createdResources = success.filter((item) => item.entity === null);
    const activeTab = createdResources.length ? 'pending' : 'active';
    navigate('/referral-coordinator/resources', {
      replace: true,
      state: {
        highlight: createdResources.length,
        activeTab,
      },
    });
  }

  return (
    <Page className="ResourcesImport">
      <Heading>
        <h1>My Resources</h1>
      </Heading>
      <Content surface>
        <div className="page-content box">
          <h2>Time to invite your resources!</h2>

          <p>
            Add resources by manually adding them one-by-one or by importing them all-at-once by
            uploading an XLSX file.
          </p>

          <div className="mb-4 space-x-6" onChange={(event) => setTab(event.target.value)}>
            <Radio name="method" value="manual" defaultChecked={tab === 'manual'}>
              Add manually
            </Radio>
            <Radio name="method" value="file" defaultChecked={tab === 'file'}>
              Import XLSX
            </Radio>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div hidden={tab !== 'manual'}>
            <AddResourcesForm
              organizationId={user.organization.id}
              onSuccess={handleAddResourcesSuccess}
              ref={resourcesFormRef}
            />
          </div>

          <div hidden={tab !== 'file'}>
            <FileImportForm
              isMobile={isMobile}
              disabled={pending}
              onChange={setFile}
              file={file}
              onSubmit={uploadFile}
            />
          </div>
        </div>
      </Content>

      {isMobile ? (
        <Actions>
          {tab === 'file' && (
            <button className="mir-button primary" disabled={!file || pending} onClick={uploadFile}>
              Import resources
            </button>
          )}
          {tab === 'manual' && (
            <button
              className="mir-button primary"
              disabled={pending}
              onClick={() => resourcesFormRef.current.submit()}
            >
              Add resource
            </button>
          )}
          <button className="mir-button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </Actions>
      ) : (
        <Actions>
          <button className="mir-button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </Actions>
      )}
    </Page>
  );
}
