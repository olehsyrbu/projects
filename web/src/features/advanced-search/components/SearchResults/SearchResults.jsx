import PropTypes from 'prop-types';
import { useSearchResults } from '@/features/advanced-search/hooks';
import { NoResults } from './NoResults';
import { ProviderCard } from './ProviderCard';

export function SearchResults({
  query,
  onResetFilters,
  onOpenProfile,
  onChangeNotes,
  hoveredProviderId,
  onHoverProvider,
}) {
  let { items } = useSearchResults(query) || {};

  if (!items?.length) {
    return (
      <section>
        <NoResults onResetFilters={onResetFilters} />
      </section>
    );
  }

  let providers = [];
  let unclaimed = [];

  for (let provider of items) {
    if (provider.status === 'COMPLETED') providers.push(provider);
    if (['ONBOARDING', 'UNCLAIMED', 'PENDING'].includes(provider.status)) unclaimed.push(provider);
  }

  return (
    <section className="mb-6 md:mb-10">
      {providers?.length > 0 ? (
        <ProviderList
          providers={providers}
          hoveredId={hoveredProviderId}
          onProviderClick={({ slug, mode, distance, partner, status }) => {
            onOpenProfile(slug, distance, mode, partner, status);
          }}
          onProviderHover={onHoverProvider}
          onNoteChange={onChangeNotes}
        />
      ) : null}

      {unclaimed?.length > 0 ? (
        <div className="border-light max-md:first:border-t">
          <div className="max-md:px-4 max-md:py-2 md:mb-6">
            <h2 className="mb-2 text-base font-bold md:mb-4 md:text-xl">
              These providers are in network with your insurance, but have not fully signed up
            </h2>
            <p className="max-md:text-sm">
              We are working with these providers to create their account, but meanwhile you can
              contact them to inquire about their availability and schedule.
            </p>
          </div>

          <ProviderList
            providers={unclaimed}
            hoveredId={hoveredProviderId}
            onProviderClick={({ slug, mode, distance, partner, status }) => {
              onOpenProfile(slug, distance, mode, partner, status);
            }}
            onProviderHover={onHoverProvider}
            onNoteChange={onChangeNotes}
          />
        </div>
      ) : null}
    </section>
  );
}

function ProviderList({ providers, hoveredId, onProviderClick, onProviderHover, onNoteChange }) {
  return (
    <ul className="divide-light border-light max-md:divide-y max-md:border-b md:mb-6 md:space-y-6 md:last:mb-0">
      {providers.map((provider) => (
        <li key={provider.id}>
          <ProviderCard
            provider={provider}
            hovered={provider.slug === hoveredId}
            onClick={(event) => {
              if (!event.target.closest('button')) {
                onProviderClick(provider);
              }
            }}
            onMouseEnter={() => onProviderHover(provider.slug)}
            onMouseLeave={() => onProviderHover(null)}
            onNoteChange={onNoteChange}
          />
        </li>
      ))}
    </ul>
  );
}

SearchResults.propTypes = {
  query: PropTypes.object,
  onResetFilters: PropTypes.func,
  onChangeNotes: PropTypes.func,
  onOpenProfile: PropTypes.func,
  onHoverProvider: PropTypes.func,
  hoveredProviderId: PropTypes.string,
};

SearchResults.defaultProps = {
  onOpenProfile: () => {},
  onChangeNotes: () => {},
  onResetFilters: () => {},
};
