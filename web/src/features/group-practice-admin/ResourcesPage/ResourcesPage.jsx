import { useState } from 'react';
import cn from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';

import { useGPAProviders } from '@/core/api/ProviderQueries';
import Pagination from '@/core/components/Pagination';

import { Actions, Content, Heading, Page } from '@/modules/app-shell';
import { ResourcesList } from './ResourcesList';
import { CreatedProfileDialog } from './dialogs';
import cx from '../Page.module.css';
import { DocumentTable20Filled as DocumentTable } from '@fluentui/react-icons';

export function ResourcesPage() {
  let location = useLocation();
  let navigate = useNavigate();
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const { data, mutate } = useGPAProviders(query);
  const { items: providers, pageInfo } = data || { items: [] };

  function closeCongratsModal() {
    navigate(location.pathname, {
      state: { isFirstOnboardingVisit: false },
      replace: true,
    });
  }

  function handleAddResource() {
    navigate('/group-practice/resources/onboarding/newProvider/*');
  }

  function handleRedirectToEditProfile() {
    closeCongratsModal();
    navigate(`/group-practice/resources/edit/${location.state.id}`);
  }

  return (
    <Page className={cn(cx.GroupPracticeAdmin)}>
      <Heading>
        <h1>My Resources</h1>
      </Heading>
      <Content>
        <CreatedProfileDialog
          onConfirm={handleRedirectToEditProfile}
          isOpen={!!location.state?.isFirstOnboardingVisit}
          onDismiss={closeCongratsModal}
        />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold">Providers</h2>
          <button
            type="button"
            className="mir-button link"
            onClick={() => navigate('/group-practice/resources/upload-template')}
          >
            Add via spreadsheet
            <DocumentTable className="!ml-1" />
          </button>
        </div>
        <ResourcesList providers={providers} onChange={mutate} />
        {pageInfo.totalItems > pageInfo.perPage && (
          <div className="my-9 flex justify-center">
            <Pagination
              pageSize={pageInfo.perPage}
              totalPages={pageInfo.totalPages}
              hasPrev={pageInfo.hasPrevPage}
              hasNext={pageInfo.hasNextPage}
              currentPage={pageInfo.page}
              onPageChange={(page) => {
                setQuery({
                  ...query,
                  page,
                });
              }}
            />
          </div>
        )}
      </Content>
      <Actions>
        <button className="mir-button primary" onClick={handleAddResource}>
          Add resources
        </button>
      </Actions>
    </Page>
  );
}
