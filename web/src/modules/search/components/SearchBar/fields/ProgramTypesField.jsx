import { useController } from 'react-hook-form';
import { useScreen } from '@/core/hooks';
import { useProgramTypes } from '@/core/api/ReferenceDataQueries';
import { ReferenceDataSelect } from '@/modules/reference-data';
import { MultiSelect } from './MultiSelect';

export function ProgramTypesField() {
  const isMediumScreen = useScreen('md');
  return isMediumScreen ? <ProgramTypesFieldDesktop /> : <ProgramTypesFieldMobile />;
}

function ProgramTypesFieldDesktop() {
  let types = useProgramTypes();
  let { field } = useController({ name: 'programTypes' });

  types = types.slice().sort((t1, t2) => t1.name.localeCompare(t2.name));

  return (
    <MultiSelect
      label="Types"
      valueText={(selectedItems) =>
        selectedItems.length > 0 ? `${selectedItems.length} selected` : 'All types'
      }
      items={types}
      selectedItems={field.value.map((code) => types.find((type) => type.code === code))}
      onChange={(items) => field.onChange(items.map(({ code }) => code))}
      filterBy={(item) => item.name}
      flexBasis={242}
    />
  );
}

function ProgramTypesFieldMobile() {
  let { field } = useController({ name: 'programTypes' });
  let { value, onChange } = field;
  const programTypes = useProgramTypes();
  const selectedPrograms = value.map((name) => programTypes.find(({ code }) => code === name));

  return (
    <div className="field">
      <ReferenceDataSelect
        isMulti
        inputNoBorder
        isShowChevron={false}
        value={selectedPrograms}
        options={programTypes}
        label="Type"
        triggerText={({ items, selectedItems }) =>
          selectedItems.length === 0 || selectedItems.length === items.length
            ? 'All types'
            : `${selectedItems.length} selected`
        }
        onChange={(items) => {
          onChange(items.map(({ code }) => code));
        }}
      />
    </div>
  );
}
