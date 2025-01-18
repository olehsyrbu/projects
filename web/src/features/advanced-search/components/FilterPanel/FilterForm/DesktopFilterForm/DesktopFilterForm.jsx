import { Suspense, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  filterNonUndefinedValues,
  filterPanelDefaultProps,
  filterPanelPropTypes,
  getFiltersCount,
  toItems,
} from '../utils';
import { ChipBoxWithTooltipFilter } from './ChipBoxWithTooltipFilter';
import { TooltipSkeleton } from '../TooltipSkeleton';
import './DesktopFilterForm.css';

export function DesktopFilterForm(props) {
  const { children, onApply, onClearAll, onClear, onChange } = props;
  const [activeFilterType, setActiveFilterType] = useState('');
  const methods = useForm();

  function handleChipClick(e, item) {
    e.stopPropagation();
    const type = activeFilterType === item.id ? null : item.id;
    setActiveFilterType(type);
  }

  function formSubmit(data) {
    onApply({ section: activeFilterType, ...filterNonUndefinedValues(data) });
    setActiveFilterType(null);
  }

  let items = toItems(children);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(formSubmit)} className="chip-filter">
        <div className="filter-row">
          {items.map((item) => {
            const Child = item.component;
            const position = item.position;

            let filtersCount = item.component.getFilterCount
              ? item.component.getFilterCount(item.query)
              : getFiltersCount(item) || null;
            return (
              <ChipBoxWithTooltipFilter
                key={item.id}
                label={item.label}
                selected={activeFilterType === item.id}
                handleChipClick={(e) => handleChipClick(e, item)}
                handleOutClick={(data) => {
                  !data && setActiveFilterType(null);
                }}
                count={filtersCount}
                reset={methods.reset}
                position={position}
                handleClearFilter={(e) => {
                  e.stopPropagation();
                  onClear(item.component.defaultProps.query);
                  setActiveFilterType(null);
                }}
                id={item.id}
              >
                <Suspense fallback={<TooltipSkeleton />}>
                  <Child
                    query={item.query}
                    register={methods.register}
                    control={methods.control}
                    dataKey={item.id}
                    onAfterChange={onChange}
                  />
                </Suspense>
              </ChipBoxWithTooltipFilter>
            );
          })}
          <div className="clear-button" onClick={onClearAll}>
            Clear all
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

DesktopFilterForm.propTypes = {
  ...filterPanelPropTypes(),
};

DesktopFilterForm.defaultProps = {
  ...filterPanelDefaultProps(),
};
