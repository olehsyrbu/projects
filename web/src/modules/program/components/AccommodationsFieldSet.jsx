import PropTypes from 'prop-types';

import { useAccommodations } from '@/core/api/ReferenceDataQueries';
import { Checkbox } from '@/modules/form';

export function AccommodationsFieldSet({ name, control, isRemote, mode }) {
  let accommodations = useAccommodations(mode);

  function getAccommodationsByCategory(type) {
    return accommodations.filter(({ category }) => category === type);
  }

  const accommodationsEntering = getAccommodationsByCategory('Entering the practice');
  const accommodationsCommunication = getAccommodationsByCategory('Communication');
  const accommodationsGettingAround = getAccommodationsByCategory('Getting around');
  const accommodationsSettling = getAccommodationsByCategory('Settling in');

  return (
    <div className="grid grid-cols-1 flex-wrap gap-x-6 md:grid-cols-2">
      {!isRemote && (
        <div>
          <div className="mb-6">
            <h4 className="my-4 font-bold">Entering the practice</h4>
            <div className="flex flex-col space-y-4">
              {accommodationsEntering.map(({ name: accommodationName, id }) => (
                <Checkbox key={id} name={name} value={id} control={control}>
                  <span className="text-sm">{accommodationName}</span>
                </Checkbox>
              ))}
            </div>
          </div>
          <div>
            <h4 className="my-4 font-bold">Getting around</h4>
            <div className="flex flex-col space-y-4">
              {accommodationsGettingAround.map(({ name: accommodationName, id }) => (
                <Checkbox key={id} name={name} value={id} control={control}>
                  <span className="text-sm">{accommodationName}</span>
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        {!isRemote && (
          <div className="mb-6">
            <h4 className="my-4 mt-6 font-bold">Settling in</h4>
            <div className="flex flex-col space-y-4">
              {accommodationsSettling.map(({ name: accommodationName, id }) => (
                <Checkbox key={id} name={name} value={id} control={control}>
                  <span className="text-sm">{accommodationName}</span>
                </Checkbox>
              ))}
            </div>
          </div>
        )}
        <div className="mb-6">
          {!isRemote && <h4 className="my-4 font-bold">Communication</h4>}
          <div className="flex flex-col space-y-4">
            {accommodationsCommunication.map(({ name: accommodationLabel, id }) => (
              <Checkbox key={id} name={name} value={id} control={control}>
                <span className="text-sm">{accommodationLabel}</span>
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

AccommodationsFieldSet.defaultProps = {
  mode: 'PROGRAM',
};

AccommodationsFieldSet.propTypes = {
  name: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  control: PropTypes.object,
  className: PropTypes.string,
  isRemote: PropTypes.bool,
};
