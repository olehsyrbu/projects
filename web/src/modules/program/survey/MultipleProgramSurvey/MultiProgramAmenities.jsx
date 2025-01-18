import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import mixpanel from '@/core/mixpanel';
import { logger } from '@/core/logger';
import { useUpdateProgramDraft } from '@/core/api/ProgramDraftQueries';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import {
  AccommodationsFieldSet,
  AmenitiesFieldSet,
  DietaryAccommodationFieldSet,
  InlineAddress,
  LocationFieldSet,
} from '@/modules/program';
import { Details, Summary } from '@/features/guided-search/components/Details';

export function MultiProgramAmenities({ draft }) {
  let update = useUpdateProgramDraft();
  let survey = useSurvey();

  const {
    program: { locations },
  } = draft;
  let {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      amenities: locations.map(({ amenities }) => AmenitiesFieldSet.toFormValue(amenities || [])),
      accommodations: locations.map(
        (location) => location.accommodations?.map(({ id }) => id) ?? [],
      ),
      dietaryAccommodation: locations.map((location) => location.dietaryAccommodation?.code),
    },
  });

  async function submit({ accommodations, amenities, dietaryAccommodation }) {
    try {
      if (isDirty) {
        const program = {
          locations: locations.map((location, index) => ({
            ...LocationFieldSet.toApiValue(location),
            accommodations: accommodations[index],
            amenities: AmenitiesFieldSet.toValueApi(amenities[index]),
            dietaryAccommodation: dietaryAccommodation[index],
          })),
        };
        await update({ program });

        mixpanel.track('Multiple program amenities step');
      }
      survey.navigateNext();
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <article className="survey-step !max-w-[934px]">
      <SurveyStepInfo />
      <h1 className="space-y-2 font-sans !text-2xl">
        <span>Tell us more about the experience in each location</span>
      </h1>
      <div className="mb-2 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-max">
        <Info className="text-p-75" />
        <p className="flex-1">
          Clients/patients frequently have questions about the facilities and rules because they
          want to know what to expect. Please identify these for each location.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        {locations.map(({ address, id }, index) => (
          <Details open={index === 0} key={index} className={index === 0 && 'border-t-0'}>
            <Summary className="flex flex-1 cursor-pointer flex-row !text-base">
              <InlineAddress {...address} className="flex h-10 items-center" />
            </Summary>
            <div>
              <p className="mb-6 text-xl font-bold">Amenities and rules</p>
              <AmenitiesFieldSet name={`amenities.${index}`} columns={3} control={control} />
              <p className="mt-8 text-xl">
                <span className="font-bold">Accommodations</span> (optional)
              </p>
              <p className="mb-2">Please check any accommodations you offer:</p>
              <AccommodationsFieldSet name={`accommodations.${index}`} control={control} />
              <p className="mb-2 mt-4 text-base font-bold">Dietary accommodations</p>
              <DietaryAccommodationFieldSet
                name={`dietaryAccommodation.${index}`}
                control={control}
              />
              <div className="mb-10" />
            </div>
          </Details>
        ))}
        <SurveyStepControls />
      </form>
    </article>
  );
}

MultiProgramAmenities.propTypes = {
  draft: PropTypes.object,
};
