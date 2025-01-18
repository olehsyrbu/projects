/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import { List, DotList, ChipList } from '../components/List';

export function Eligibility({ profile, anchorId }) {
  let matchAllConditions = profile.matchesAllConditionsFrom.includes('REQUIRED_THERAPEUTIC_AREAS');
  let therapeuticArea = profile.therapeuticAreas.map((i) => i.therapeuticArea);
  let otherCriterias = profile.otherAudienceCriteria.map((value) => ({ id: value, name: value }));

  return (
    <section className="space-y-4 pb-6 max-md:px-4">
      <h2 className="-mt-6 pt-12 text-2xl font-bold text-regular" id={anchorId}>
        Eligibility criteria
      </h2>

      <Section
        heading="Required conditions"
        as={ChipList}
        items={profile.requiredTherapeuticAreas}
        hint={matchAllConditions ? '* Required to match all conditions.' : null}
      />

      <Section
        heading="Excluded conditions"
        as={ChipList}
        items={profile.excludedTherapeuticAreas}
      />

      <Section heading="Areas of specialization" as={DotList} items={therapeuticArea} />

      <Section heading="Age groups" as={List} items={profile.ageGroups} />

      <div className="grid grid-cols-2 gap-4 empty:hidden md:grid-cols-[280px_1fr] md:gap-x-9">
        <Section heading="Gender" as={List} items={profile.genders} />
        <Section heading="Ethnic identity" as={List} items={profile.ethnicities} />
        <Section heading="Sexual identity" as={List} items={profile.sexualIdentities} />
        <Section heading="Faith" as={List} items={profile.religions} />
        <Section heading="Experience supporting" as={List} items={profile.specialGroups} />
        <Section heading="Other" as={List} items={otherCriterias} />
      </div>
    </section>
  );
}

function Section({ heading, items, as: As, hint, sort }) {
  return items.length > 0 ? (
    <div>
      <h3 className="mb-3 text-base font-bold">{heading}</h3>
      <As items={items} />
      {hint ? <p className="mt-2 text-xs text-hint">{hint}</p> : null}
    </div>
  ) : null;
}

Eligibility.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
Section.propTypes = {
  heading: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  as: PropTypes.elementType.isRequired,
  sort: PropTypes.func,
  hint: PropTypes.string,
};
