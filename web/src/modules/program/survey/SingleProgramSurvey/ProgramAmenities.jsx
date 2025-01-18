import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSurvey } from '@/modules/survey/hooks';
import { SurveyStepControls, SurveyStepInfo } from '@/modules/survey/components';
import {
  AccommodationsFieldSet,
  AmenitiesFieldSet,
  DietaryAccommodationFieldSet,
  InlineAddress,
  LocationFieldSet,
} from '@/modules/program';
import { Info24Filled as Info } from '@fluentui/react-icons';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import mixpanel from '@/core/mixpanel';

export function ProgramAmenities({ program }) {
  let survey = useSurvey();
  let update = useUpdateProgram();

  let location = program.locations[0];
  let {
    handleSubmit,
    control,
    formState: { isDirty },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      amenities: AmenitiesFieldSet.toFormValue(location.amenities),
      accommodations: location.accommodations.map(({ id }) => id),
      dietaryAccommodation: location.dietaryAccommodation?.code,
    },
  });

  async function submit(data) {
    if (isDirty) {
      await update(program.id, {
        locations: [
          {
            ...LocationFieldSet.toApiValue(location),
            amenities: AmenitiesFieldSet.toValueApi(data.amenities),
            accommodations: data.accommodations,
            dietaryAccommodation: data.dietaryAccommodation,
          },
        ],
      });

      mixpanel.track('Single program amenities step');
    }

    survey.navigateNext();
  }

  return (
    <article className="survey-step !max-w-[934px]">
      <SurveyStepInfo />
      <h1 className="space-y-2 font-sans !text-2xl">
        <span>Tell us more about the experience at:</span>
        <br />
        <InlineAddress className="text-xl" {...location.address} />
      </h1>
      <div className="mb-8 box-border flex items-center space-x-4 rounded-lg bg-white p-4 shadow-lg md:max-w-max">
        <Info className="text-p-75" />
        <p className="flex-1">
          Please select the amenities, rules and accomodations available for this location.
        </p>
      </div>
      <form onSubmit={handleSubmit(submit)}>
        <p className="mb-6 text-xl font-bold">Amenities and rules</p>
        <AmenitiesFieldSet name="amenities" columns={3} control={control} />

        <p className="mt-8 text-xl">
          <span className="font-bold">Accommodations</span> (optional)
        </p>
        <p className="mb-2">Please check any accommodations you offer:</p>
        <AccommodationsFieldSet name="accommodations" control={control} />

        <p className="mb-2 mt-4 text-base font-bold">Dietary accommodations</p>
        <DietaryAccommodationFieldSet name="dietaryAccommodation" control={control} />

        <div className="mb-10" />
        <SurveyStepControls />
      </form>
    </article>
  );
}

ProgramAmenities.propTypes = {
  program: PropTypes.object.isRequired,
};
