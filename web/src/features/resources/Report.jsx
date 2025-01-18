import { useLocation } from 'react-router-dom';
import { Content, Heading, Page } from '@/modules/app-shell/Cabinet';

export default function Report() {
  let {
    state: { importReport },
  } = useLocation();
  const ComponentReport = importReport ? ImportReport : InvitationReport;

  return <ComponentReport />;
}

function ImportReport() {
  let {
    state: { errors = [], succeeded = 0, failed = 0 },
  } = useLocation();
  return (
    <Page>
      <Heading>
        <h1 className="!mt-3 mb-5 font-bold">Generated import report</h1>
      </Heading>
      <Content>
        <div className="space-y-4">
          <p>
            Profiles created: <span className="font-bold">{succeeded}</span>
          </p>
          {errors && errors?.length > 0 && (
            <div>
              <p>
                Profiles failed: <span className="font-bold">{failed}</span>
              </p>
              <table className="table-auto border-collapse border  border-slate-500">
                <thead>
                  <tr>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">Code</th>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">Line</th>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">
                      Extensions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {errors?.map(({ code, line, extensions }) => (
                    <tr key={code}>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {code || '-'}
                      </td>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {line || '-'}
                      </td>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {JSON.stringify(extensions, null, 2) || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Content>
    </Page>
  );
}

function InvitationReport() {
  let {
    state: { selected = 0, success = [], failed = [] },
  } = useLocation();

  return (
    <Page>
      <Heading>
        <h1 className="!mt-3 mb-5 font-bold">Generated invitations report</h1>
      </Heading>
      <Content>
        <div className="space-y-4">
          <p>
            Providers selected: <span className="font-bold">{selected}</span>{' '}
          </p>
          <div>
            <p>
              Providers invited: <span className="font-bold">{success.length}</span>
            </p>
            {success.length > 0 && (
              <table className="table-auto border-collapse border  border-slate-500">
                <thead>
                  <tr>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">Name</th>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">
                      Email
                    </th>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">Slug</th>
                  </tr>
                </thead>
                <tbody>
                  {success.map(({ recipient_name, entity, email }) => (
                    <tr key={recipient_name}>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {recipient_name || '-'}
                      </td>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {email || '-'}
                      </td>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {entity?.slug || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div>
            <p>
              Failed invitations: <span className="font-bold">{failed.length}</span>
            </p>
            {failed.length > 0 && (
              <table className="table-auto border-collapse border border-slate-500">
                <thead>
                  <tr>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">Name</th>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">
                      Email
                    </th>
                    <th className="border p-4 text-left font-medium dark:border-slate-600">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {failed.map(({ reason, recipient_name, email }) => (
                    <tr key={reason}>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {recipient_name || '-'}
                      </td>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {email || '-'}
                      </td>
                      <td className="border border-slate-600 p-4 text-left font-medium">
                        {reason || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Content>
    </Page>
  );
}
