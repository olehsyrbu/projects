import { Suspense, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as Accordion from '@radix-ui/react-accordion';
import {
  Dismiss24Filled as Dismiss,
  ChevronRight24Filled as ChevronRight,
} from '@fluentui/react-icons';
import { TooltipSkeleton } from './TooltipSkeleton';
import {
  filterNonUndefinedValues,
  filterPanelDefaultProps,
  filterPanelPropTypes,
  getFiltersCount,
  toItems,
} from './utils';

export function MobileFilterForm(props) {
  const { children, onDismiss, onApply, onClearAll, onClear, onChange, query } = props;
  const [activeTabId, setActiveTabId] = useState(null);
  const methods = useForm();
  const [items, setItems] = useState(() => toItems(children));

  useEffect(() => {
    setItems(toItems(children));
  }, [query]);

  function formSubmit(data) {
    onApply({ section: activeTabId, ...filterNonUndefinedValues(data) });
    setActiveTabId(null);
  }

  function handleAfterChange({ dataKey, name, next, prev }) {
    onChange({ name, next, prev });
    const index = items.findIndex(({ id }) => id === dataKey);
    items[index].query[name] = next;
    setItems([...items]);
  }

  return (
    <FormProvider {...methods}>
      <form
        className="fixed inset-0 grid grid-rows-[auto_1fr_auto] bg-white"
        onSubmit={methods.handleSubmit(formSubmit)}
      >
        <div className="grid grid-cols-3 border-b p-4">
          <button
            className="justify-self-start text-sm font-medium text-p-100"
            onClick={onClearAll}
          >
            Clear all
          </button>

          <h2 className="justify-self-center text-xl font-bold">Filters</h2>

          <button aria-label="Dismiss" className="justify-self-end" onClick={onDismiss}>
            <Dismiss className="text-p-100" />
          </button>
        </div>

        <Accordion.Root
          type="single"
          collapsible
          className="overflow-y-auto"
          value={activeTabId}
          onValueChange={setActiveTabId}
        >
          {items.map((item) => {
            let Component = item.component;
            let count = item.component.getFilterCount
              ? item.component.getFilterCount(item.query)
              : getFiltersCount(item);

            return (
              <Accordion.Item key={item.id} value={item.id} className="border-b border-light">
                <Accordion.Trigger className="group w-full px-4 py-3 text-left">
                  <ChevronRight className="mr-2 text-p-100 group-data-[state=open]:rotate-90" />
                  <span className="mr-2 group-data-[state=open]:font-bold">{item.label}</span>
                  {count > 0 ? <span className="text-hint">{count}</span> : null}
                </Accordion.Trigger>

                <Accordion.Content className="bg-n-10 p-4 pb-3">
                  <Suspense fallback={<TooltipSkeleton />}>
                    <Component
                      query={item.query}
                      register={methods.register}
                      control={methods.control}
                      dataKey={item.id}
                      onAfterChange={handleAfterChange}
                    />
                    <button
                      type="button"
                      className="mt-4 block font-medium text-p-100"
                      onClick={() => {
                        onClear(item.component.defaultProps.query);
                        setActiveTabId(null);
                      }}
                    >
                      Clear
                    </button>
                  </Suspense>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>

        <div className="z-10 bg-white px-4 py-3 shadow-[0_-3px_10px_rgba(0,0,0,0.06)]">
          <button type="submit" className="h-12 w-full rounded-lg bg-p-100 font-medium text-white">
            Show results
          </button>
        </div>
      </form>
    </FormProvider>
  );
}

MobileFilterForm.propTypes = {
  ...filterPanelPropTypes(),
};

MobileFilterForm.defaultProps = {
  ...filterPanelDefaultProps(),
};
