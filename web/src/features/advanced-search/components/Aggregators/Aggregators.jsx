import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import * as Collapsible from '@radix-ui/react-collapsible';
import {
  ChevronDown24Filled as ChevronDown,
  ChevronLeft24Filled as ChevronLeft,
  ChevronRight24Filled as ChevronRight,
  Dismiss24Filled as Dismiss,
  Payment16Regular as Payment,
  PeopleCommunity16Regular as PeopleCommunity,
  Open20Filled as Open,
} from '@fluentui/react-icons';
import mixpanel from '@/core/mixpanel';
import { Avatar } from '@/core/components/Avatar';
import { useAggregators } from './useAggregators';

function useTrackOpenState(isOpen) {
  let prevValueRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen !== prevValueRef.current) {
      mixpanel.track(isOpen ? 'Aggregators Block Open' : 'Aggregators Block Close');
      prevValueRef.current = isOpen;
    }
  }, [isOpen]);
}

export function Aggregators({ query }) {
  let aggregators = useAggregators(query);
  let [open, setOpen] = useState(true);
  let [page, setPage] = useState(1);

  useEffect(() => setPage(1), [aggregators]);

  useTrackOpenState(open);

  let limit = 3;
  let index = (page - 1) * limit;
  let paged = aggregators.slice(index, index + limit);

  return aggregators.length > 0 ? (
    <Collapsible.Root asChild open={open} onOpenChange={setOpen}>
      <section className="    border-t border-light">
        <div className="relative">
          <Header open={open} />
          <Collapsible.Trigger className="absolute inset-0" />
        </div>

        <Collapsible.Content>
          <AggregatorList aggregators={paged} searchedConditions={query.specialties ?? []} />
          <Pagination
            page={page}
            limit={limit}
            totalItems={aggregators.length}
            onPageChange={setPage}
          />
        </Collapsible.Content>
      </section>
    </Collapsible.Root>
  ) : null;
}

function Header({ open }) {
  return (
    <header className="grid grid-cols-[1fr_auto] gap-2 py-6 max-md:px-4 md:gap-x-6">
      <h2 className={cn('text-base font-bold md:text-xl', { 'text-p-100': !open })}>
        {open
          ? 'Based on your search, these organizations can help you find a remote provider:'
          : 'Find a remote provider through a third-party organization:'}
      </h2>
      <div className="row-span-2">
        {open ? <Dismiss /> : <ChevronDown className="text-p-100" />}
      </div>
      <p className="max-md:text-sm">
        If you are interested in being connected through a third-party organization covered by your
        insurance, you can click on the card and follow the steps on their website to get matched
        with the appropriate care.
      </p>
    </header>
  );
}

function AggregatorList({ aggregators, searchedConditions }) {
  return (
    <ul className="divide-light border-light max-md:divide-y max-md:border-y md:space-y-6">
      {aggregators.map((aggregator) => (
        <li key={aggregator.id}>
          <a
            href={aggregator.website}
            className="!text-regular"
            target="_blank"
            rel="noreferrer"
            onClick={() => {
              mixpanel.track('Aggregator Website Open', {
                name: aggregator.name,
                website: aggregator.website,
              });
            }}
          >
            <AggregatorCard aggregator={aggregator} searchedConditions={searchedConditions} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function AggregatorCard({ aggregator, searchedConditions }) {
  return (
    <article className="rounded-2xl border-p-55 p-4 pt-3 md:flex md:items-center md:gap-3 md:border">
      <Avatar
        url={aggregator.photoUrl}
        className="max-md:float-left max-md:my-[5px] max-md:mr-3 md:flex-none"
      />
      <div className="md:flex-1">
        <div className="mb-4 flex gap-2 max-md:flex-col md:mb-2 md:items-center">
          <h3 className="text-xl font-bold">{aggregator.name}</h3>
          <div className="flex flex-wrap gap-2">
            {aggregator.therapies?.length > 0 ? <Service>Therapy</Service> : null}
            {aggregator.medication ? <Service>Medications</Service> : null}
          </div>
        </div>

        {aggregator.therapeuticAreas?.length > 0 ? (
          <Conditions
            conditions={aggregator.therapeuticAreas}
            searchedConditions={searchedConditions}
          />
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center text-xs">
            <PeopleCommunity className="mr-1" />
            <span className="text-n-120">
              {aggregator.ages?.length === 6
                ? 'All ages'
                : aggregator.ages
                  .sort((age1, age2) => age1.from - age2.from)
                  .map((age) => age.name)
                  .join(', ')}
            </span>
          </div>
          <div className="flex items-center text-xs">
            <Payment className="mr-1" />
            <span className="text-n-120">
              {aggregator.paymentOptions.map((paymentOption) => paymentOption.name).join(', ')}
            </span>
          </div>
        </div>
      </div>
      <Open className="text-p-100 max-md:!hidden md:flex-none" />
    </article>
  );
}

function Conditions({ conditions, searchedConditions }) {
  let matchedCount = conditions.filter(({ area }) => searchedConditions.includes(area.code)).length;
  let maxToShowCount = Math.max(matchedCount, 6);
  let moreCount = conditions.length - maxToShowCount;

  return conditions.length > 0 ? (
    <div role="list" className="mb-4 flex flex-wrap items-center gap-2 max-md:col-span-2 md:mb-3">
      <p>Conditions:</p>
      {conditions.slice(0, maxToShowCount).map(({ area }) => (
        <span key={area.code} role="listitem" className="rounded-full bg-p-10 px-2.5 py-px text-sm">
          {area.name}
        </span>
      ))}
      {moreCount > 0 ? <span className="text-sm">+{moreCount} more</span> : null}
    </div>
  ) : null;
}

function Service(props) {
  return (
    <span
      {...props}
      className="rounded-full border border-current px-1.5 py-px text-xs text-[#6B3A00]"
    />
  );
}

function Pagination({ page, limit, totalItems, onPageChange }) {
  let from = (page - 1) * limit + 1;
  let to = Math.min(from + limit - 1, totalItems);
  return (
    <div className="grid grid-cols-[1fr_auto_auto] gap-x-10 font-bold max-md:p-4 md:py-6">
      Showing {from}&ndash;{to} of {totalItems}
      <button
        aria-label="Previous page"
        disabled={page <= 1}
        className="disabled:opacity-30"
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </button>
      <button
        aria-label="Next page"
        disabled={page >= totalItems / limit}
        className="disabled:opacity-30"
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
