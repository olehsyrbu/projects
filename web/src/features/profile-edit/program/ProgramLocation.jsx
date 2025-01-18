import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { first } from 'lodash-es';
import { object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { EditorActions } from '../EditorActions';
import { UnsavedDataPrompt } from '../UnsavedDataPrompt';

import {
  AccommodationsFieldSet,
  AmenitiesFieldSet,
  DietaryAccommodationFieldSet,
  LocationFieldSet,
  RemoteFieldSet,
} from '@/modules/program';
import { useUpdateProgram } from '@/core/api/ProgramQueries';
import { logger } from '@/core/logger';

const schema = object({
  location: object().when('type', { is: 'inPerson', then: LocationFieldSet.schema }),
  remote: object().when('type', { is: 'remote', then: RemoteFieldSet.schema }),
});

export function ProgramLocation({ program }) {
  let update = useUpdateProgram();
  const {
    amenities = [],
    accommodations = [],
    dietaryAccommodation = [],
    ...location
  } = first(program?.locations) || {};

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { isDirty, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      location: {
        id: location?.id,
        address: location?.address,
        facilityType: location?.facilityType,
        name: location?.name,
        hide: location?.hide,
      },
      type: program?.remote?.available ? 'remote' : 'inPerson',
      inPerson: program.inPerson?.available,
      remote: program.remote || {},
      amenities: AmenitiesFieldSet.toFormValue(amenities),
      accommodations: accommodations.map(({ id }) => id),
      remoteAccommodations: program?.remote?.accommodations.map(({ id }) => id),
      dietaryAccommodation: dietaryAccommodation?.code,
    },
    resolver: yupResolver(schema),
  });

  let type = watch('type');

  async function submit(data) {
    try {
      if (isDirty) {
        let patch = {
          inPerson: { available: false },
          remote: {
            available: false,
            voice: false,
            chat: false,
            video: false,
            states: [],
            accommodations: [],
          },
          locations: [],
        };

        if (type === 'inPerson') {
          patch.inPerson.available = true;
          patch.locations.push({
            ...LocationFieldSet.toApiValue(data.location),
            accommodations: data.accommodations,
            ...(data.amenities && { amenities: AmenitiesFieldSet.toValueApi(data.amenities) }),
            ...(data.dietaryAccommodation?.length > 0 && {
              dietaryAccommodation: data.dietaryAccommodation,
            }),
          });
        }

        if (type === 'remote') {
          patch.remote = {
            ...data.remote,
            available: true,
            states: data.remote.states.map((s) => s.code),
            accommodations: data.remoteAccommodations,
          };
        }

        await update(program.id, patch);

        reset(data);
      }
    } catch (error) {
      logger.error(error);
    }
  }

  return (
    <>
      <UnsavedDataPrompt
        when={isDirty}
        title="Unsaved changes"
        message="Please save your changes before exiting your profile. If you exit without saving, your
        changes will be lost."
      />
      <form onSubmit={handleSubmit(submit)}>
        <div className="space-y-6">
          {type === 'inPerson' && (
            <>
              <div className="space-y-4">
                <span className="text-xl font-bold">In-person location</span>
              </div>
              <div className="space-y-4">
                <div className="space-y-6">
                  <div className="first:pt-0 last:pb-0">
                    <LocationFieldSet
                      mode="PROGRAM"
                      name="location"
                      control={control}
                      onClear={() => {
                        setValue('location', LocationFieldSet.defaultLocation, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4 md:border-0 md:border-t md:border-solid md:border-graphics-70">
                  <p className="pt-4 text-base font-bold">
                    Amenities and rules
                    <span className="font-normal"> (optional)</span>
                  </p>
                  <AmenitiesFieldSet name="amenities" control={control} />

                  <p className="pt-4 text-base font-bold">
                    Accommodations
                    <span className="font-normal"> (optional)</span>
                  </p>
                  <p className="text-base">Please check any accommodations you offer:</p>
                  <AccommodationsFieldSet name="accommodations" control={control} />

                  <p className="pt-4 text-base font-bold">Dietary accommodations</p>
                  <DietaryAccommodationFieldSet name="dietaryAccommodation" control={control} />
                </div>
              </div>
            </>
          )}
          {type === 'remote' && (
            <div className="space-y-4">
              <span className="text-xl font-bold">Remote location</span>
              <RemoteFieldSet name="remote" control={control} />
              <div className="md:border-0 md:border-t md:border-solid md:border-graphics-70">
                <p className="pt-4 font-bold">
                  Accommodations
                  <span className="font-normal"> (optional)</span>
                </p>
                <p className="mb-4 mt-3">
                  Please check any accommodations you offer for communication:
                </p>
                <AccommodationsFieldSet name="remoteAccommodations" control={control} isRemote />
              </div>
            </div>
          )}
        </div>
      </form>
      <EditorActions
        isDisabled={!isDirty}
        isLoading={isSubmitting}
        onSave={handleSubmit(submit)}
        onCancel={() => reset()}
      />
    </>
  );
}

ProgramLocation.propTypes = {
  program: PropTypes.object,
};
