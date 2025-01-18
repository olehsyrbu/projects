import { Select } from '@/core/components/Select';
import PropTypes from 'prop-types';

export function GroupPracticeAdminDashboardHeader({
  title,
  onChangeProvider,
  provider,
  providers,
}) {
  //prepare data for select component
  const selectProviders = providers.map(({ id, legalFirstName, legalLastName }) => ({
    label: `${legalFirstName} ${legalLastName}`,
    value: id,
  }));

  const providerSelect = {
    label: `${provider.legalFirstName} ${provider.legalLastName}`,
    value: provider.id,
  };

  function handleSelectProvider({ value }) {
    onChangeProvider(value);
  }

  return (
    <div className="flex h-20 items-center rounded-t-xl bg-graphics-10 px-6">
      <div className="flex w-full">
        <p className="flex w-full items-center text-base font-bold md:text-2xl lg:w-2/5">{title}</p>
        <div className="w-full lg:w-3/5">
          <Select
            label="Provider name"
            options={selectProviders}
            onChange={handleSelectProvider}
            value={providerSelect}
          />
        </div>
      </div>
    </div>
  );
}

GroupPracticeAdminDashboardHeader.propTypes = {
  title: PropTypes.string,
  onChangeProvider: PropTypes.func,
  providers: PropTypes.array,
  provider: PropTypes.shape({
    id: PropTypes.string,
    legalFirstName: PropTypes.string,
    legalLastName: PropTypes.string,
  }),
};
