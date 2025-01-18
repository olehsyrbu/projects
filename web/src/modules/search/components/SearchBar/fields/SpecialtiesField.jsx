import { useController } from 'react-hook-form';
import { useTherapeuticAreas } from '@/core/api/ReferenceDataQueries';
import { ReferenceDataSelect } from '@/modules/reference-data';
import { useScreen } from '@/core/hooks';
import { MultiSelect } from './MultiSelect';

export function SpecialtiesField() {
  return useScreen('md') ? <SpecialtiesFieldDesktop /> : <SpecialtiesFieldMobile />;
}

function SpecialtiesFieldDesktop() {
  let areas = useTherapeuticAreas();
  let { field } = useController({ name: 'specialties' });

  areas = areas.slice().sort((a1, a2) => a1.name.localeCompare(a2.name));

  return (
    <MultiSelect
      label="Specialty"
      valueText={(selectedItems) =>
        selectedItems.length > 0 ? `${selectedItems.length} selected` : 'All specialties'
      }
      items={areas}
      selectedItems={field.value.map((code) => areas.find((area) => area.code === code))}
      onChange={(items) => field.onChange(items.map(({ code }) => code))}
      filterBy={(item) => item.name}
    />
  );
}

function SpecialtiesFieldMobile() {
  let { field } = useController({ name: 'specialties' });
  let { value, onChange } = field;
  const therapeuticAreas = useTherapeuticAreas();
  const selectedTherapeutic = value.map((name) =>
    therapeuticAreas.find(({ code }) => code === name),
  );

  return (
    <div className="field">
      <ReferenceDataSelect
        isMulti
        inputNoBorder
        isShowChevron={false}
        value={selectedTherapeutic}
        options={therapeuticAreas}
        label="Specialty"
        triggerText={({ items, selectedItems }) =>
          selectedItems.length === 0 || selectedItems.length === items.length
            ? 'All specialties'
            : `${selectedItems.length} selected`
        }
        onChange={(items) => {
          onChange(items.map(({ code }) => code));
        }}
      />
    </div>
  );
}
