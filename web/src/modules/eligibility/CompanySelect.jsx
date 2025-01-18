import mixpanel from '@/core/mixpanel';
import { Select } from '@/core/components/Select';
import { useSelectedCompany } from './useSelectedCompany';

let companies = [
  { slug: 'walmart', name: 'Wal-Mart Inc' },
  { slug: 'facebook', name: 'Facebook, Inc.' },
  { slug: 'apple', name: 'Apple Inc.' },
  { slug: 'alphabet', name: 'Alphabet Inc.' },
  { slug: 'berkshire-hathaway', name: 'Berkshire Hathaway Inc.' },
  { slug: 'boeing', name: 'The Boeing Company' },
  { slug: 'johnson-and-hohnson', name: 'Johnson & Johnson' },
];
let options = companies.map(({ slug, name }) => ({ value: slug, label: name }));

export function CompanySelect() {
  let selectedCompany = useSelectedCompany();

  function changeCompany(option) {
    selectedCompany.set(option.value);
    mixpanel.track('Eligibility Company Change', {
      companyName: option.label,
    });
  }

  return (
    <Select
      className="md:max-w-[400px]"
      label="Company name"
      value={options.find((option) => option.value === selectedCompany.id)}
      onChange={changeCompany}
      options={options}
      isSearchable={false}
    />
  );
}
