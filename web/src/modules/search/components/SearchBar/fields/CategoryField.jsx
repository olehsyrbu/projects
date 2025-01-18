import { useController, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { ChevronDown16Filled as ChevronDown } from '@fluentui/react-icons';
import { useScreen } from '@/core/hooks';
import { useProgramSearchFlag } from '@/modules/search/hooks';

let defaultCategories = [
  { slug: 'provider', label: 'Providers' },
  { slug: 'program', label: 'Programs' },
  { slug: 'all', label: 'All' },
  { slug: 'by-name', label: 'By name' },
];

export function CategoryField({ categories, centered, renderCategoryField, onChange }) {
  const isMediumScreen = useScreen('md');
  let { control } = useFormContext();

  return !isMediumScreen ? (
    <CategoryFieldMobile
      name="category"
      categories={categories}
      control={control}
      onChange={onChange}
    />
  ) : (
    <CategoryFieldDesktop
      name="category"
      categories={categories}
      centered={centered}
      control={control}
      renderCategoryField={renderCategoryField}
      onChange={onChange}
    />
  );
}

CategoryField.propTypes = {
  name: PropTypes.string,
  control: PropTypes.object,
  categories: PropTypes.any,
  renderCategoryField: PropTypes.func,
  onChange: PropTypes.func,
};

CategoryField.defaultProps = {
  onChange: () => {},
};

function CategoryFieldDesktop({
  name,
  control,
  categories = defaultCategories,
  renderCategoryField,
  onChange,
  centered,
}) {
  let { field } = useController({ name, control });
  let hasProgramsEnabled = useProgramSearchFlag();

  if (categories && !hasProgramsEnabled) {
    categories = categories.filter(({ slug }) => slug !== 'program' && slug !== 'all');
  }

  function handleChange(evt) {
    field.onChange(evt);
    onChange(evt.target?.value);
  }

  return (
    <div className={cn('mb-4 flex items-center space-x-8 px-6', { 'justify-center': centered })}>
      <span className="text-xl font-bold">Search:</span>

      {categories.map((category) => (
        <label key={category.slug}>
          <input
            className="peer sr-only"
            type="radio"
            {...field}
            value={category.slug}
            onChange={handleChange}
            checked={field.value === category.slug}
          />
          <span className="cursor-pointer text-xl text-p-100 underline-offset-8 peer-checked:font-bold peer-checked:underline">
            {category.label}
          </span>
        </label>
      ))}
      {renderCategoryField && renderCategoryField()}
    </div>
  );
}

CategoryFieldDesktop.propTypes = {
  ...CategoryField.propTypes,
};

CategoryFieldDesktop.defaultProps = {
  ...CategoryField.defaultProps,
};

function CategoryFieldMobile({ name, control, categories = defaultCategories, onChange }) {
  let programsEnabled = useProgramSearchFlag();

  let { field } = useController({ name, control });

  if (!programsEnabled) {
    categories = categories.filter((c) => c.slug !== 'program' && c.slug !== 'all');
  }

  let { label } = categories.find((category) => category.slug === field.value);

  function handleChange(evt) {
    field.onChange(evt);
    onChange(evt.target?.value);
  }

  return (
    <div className="mb-6 text-center">
      <span className="font-bold">Search:</span>{' '}
      <div className="relative inline-block" aria-hidden="true">
        <div className="inline-flex items-center font-bold text-p-100" aria-hidden="true">
          {label}
          <ChevronDown className="ml-1" />
        </div>

        <select
          {...field}
          aria-label="Category"
          className="absolute inset-0 opacity-0"
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.slug} value={category.slug} disabled={category.disabled}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

CategoryFieldMobile.propTypes = {
  ...CategoryField.propTypes,
};

CategoryFieldMobile.defaultProps = {
  ...CategoryField.defaultProps,
};
