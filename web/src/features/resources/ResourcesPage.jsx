import { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useNavigate, NavLink, Route, Routes } from 'react-router-dom';

import Pagination from '@/core/components/Pagination';
import { useProviders } from '@/core/api/ProviderQueries';

import { useAuthContext } from '@/modules/auth';
import { NotFound } from '@/modules/error-handling/components';
import { Cabinet } from '@/modules/app-shell/Cabinet';
import { Content, Heading, Page as PageShell } from '@/modules/app-shell';

import { ProviderEdit } from '@/features/profile-edit';
import { ResourcesList } from './ResourcesList';
import { ImportProvidersButton } from './ImportProvidersButton';
import Report from './Report';

export default function ResourcesPage() {
  let { user } = useAuthContext();
  let navigate = useNavigate();

  function handleBack() {
    navigate('/resources');
  }

  if (!user) {
    return <NotFound />;
  }

  return (
    <Cabinet
      className="!bg-surface"
      containerClassName="!m-0 !p-0"
      navigation={
        <>
          <NavLink to="/resources">My resources</NavLink>
        </>
      }
    >
      <Routes>
        <Route path="/edit/:providerId/*" element={<ProfileEditPage onBack={handleBack} />} />
        <Route
          path="/report"
          element={
            <div className="px-12 py-8">
              <Report />
            </div>
          }
        />
        <Route path="/" element={<Page />} />
      </Routes>
    </Cabinet>
  );
}

function Page() {
  const [query, setQuery] = useState({ page: 1, limit: 100 });
  const { data, mutate } = useProviders(query);

  const { items: providers, pageInfo } = data || { items: [] };

  return (
    <PageShell className="!m-0 !max-w-full">
      <ResourceHeading>
        {providers.length > 0 && <ImportProvidersButton onSuccessClose={mutate} />}
      </ResourceHeading>
      <Content className="!mt-0 !border-0 !p-0">
        {providers.length === 0 ? (
          <NotificationPanel>
            <ImportProvidersButton onSuccessClose={mutate} />
          </NotificationPanel>
        ) : (
          <>
            <ResourcesList
              providers={providers}
              totalItems={pageInfo.totalItems}
              onChange={mutate}
            />
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
          </>
        )}
      </Content>
    </PageShell>
  );
}

function NotificationPanel({ children }) {
  return (
    <div className="mx-12 my-6 rounded-lg border border-n-40 bg-white p-8">
      <h2 className="font-bold">Time to invite your resources!</h2>
      <p>Add providers one-by-one or import them all at once by emailing us a spreadsheet.</p>
      <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
        <div className="hidden md:block">{children}</div>
      </div>
    </div>
  );
}

NotificationPanel.propTypes = { children: PropTypes.node };

function ResourceHeading({ children }) {
  return (
    <Heading className="flex justify-between md:px-12 md:py-6">
      <h1 className="!text-2xl !leading-[3rem]">My resources</h1>
      {children}
    </Heading>
  );
}

ResourceHeading.propTypes = {
  children: PropTypes.node,
};

function ProfileEditPage({ onBack }) {
  const { providerId } = useParams();
  //TODO: MIR-5309 New layout for all pages
  return (
    <div id="content" className="md:!max-w-[68rem] md:pl-12">
      <ProviderEdit id={providerId} onBack={onBack} />
    </div>
  );
}
ProfileEditPage.propTypes = {
  onBack: PropTypes.func,
};
