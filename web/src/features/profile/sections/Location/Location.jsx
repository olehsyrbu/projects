/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import {
  ConferenceRoom24Filled as ConferenceRoom,
  Megaphone24Filled as Megaphone,
  HomeCheckmark24Filled as HomeCheckmark,
  Couch24Filled as Couch,
  Food24Regular as Food,
  Comment24Filled as Comment,
  Call24Filled as Call,
  VideoPerson24Filled as VideoPerson,
} from '@fluentui/react-icons';
import { List } from '../../components/List';

import { LocationCard } from './LocationCard';
import { Gallery as Photos } from './Gallery';
import { Amenities } from './Amenities';
import { useState } from 'react';
import {
  ChevronRight24Filled as ChevronRight,
  ChevronLeft24Filled as ChevronLeft,
} from '@fluentui/react-icons';

let accommodationsCategories = [
  { category: 'Entering the practice', icon: ConferenceRoom },
  { category: 'Communication', icon: Megaphone },
  { category: 'Getting around', icon: HomeCheckmark },
  { category: 'Settling in', icon: Couch },
  { category: 'Dietary accomodations', icon: Food },
];

export function Location({ profile, anchorId }) {
  let [locationIndex, setLocationIndex] = useState(0);
  let locations = profile.locations?.filter((location) => !location.hide) ?? [];

  const clickToNext = () => setLocationIndex((i) => (i + 1) % locations.length);
  const clickToPrev = () => setLocationIndex((i) => (i + locations.length - 1) % locations.length);

  return profile.inPerson?.available && locations.length > 0 ? (
    <section className="space-y-4 pb-6 max-md:px-4">
      <div className="-mt-6 flex items-center justify-between pt-12">
        <h2 className="text-2xl font-bold text-regular" id={anchorId}>
          Location {locations.length > 1 ? `${locationIndex + 1} of ${locations.length}` : null}
        </h2>
        {locations.length > 1 && (
          <div className="flex items-center" aria-hidden="true">
            <button onClick={clickToPrev}>
              <ChevronLeft />
            </button>
            <button className="ml-12" onClick={clickToNext}>
              <ChevronRight />
            </button>
          </div>
        )}
      </div>

      <ul role="list" className="max-md:divide-graphics-30 md:space-y-6">
        {locations.map((location, index) => (
          <li
            key={location.id}
            className={`-mx-4 space-y-4 px-4 py-6 pt-0 md:m-0 md:p-0 ${
              index !== locationIndex ? 'sr-only' : ''
            }`}
          >
            <LocationCard photoUrl={profile.photoUrl} location={location} />
            <Amenities amenities={location?.amenities} />
            <Accommodations
              accommodations={location.accommodations}
              dietaryAccommodation={location.dietaryAccommodation}
            />
            <Gallery photos={location?.photos} />
          </li>
        ))}
      </ul>
    </section>
  ) : null;
}

export function Remote({ profile, anchorId }) {
  if (!profile.remote?.available) {
    return null;
  }

  let { chat, voice, video, accommodations } = profile.remote;

  return profile.remote?.available ? (
    <section className="space-y-4 pb-6 max-md:px-4">
      <h2 className="-mt-6 pt-12 text-2xl font-bold text-regular" id={anchorId}>
        Remote options
      </h2>

      <ul role="list" className="flex space-x-6">
        {chat ? (
          <li className="flex items-center">
            <Comment className="mr-2 flex-none" />
            Chat
          </li>
        ) : null}
        {voice ? (
          <li className="flex items-center">
            <Call className="mr-2 flex-none" />
            Voice
          </li>
        ) : null}
        {video ? (
          <li className="flex items-center">
            <VideoPerson className="mr-2 flex-none" />
            Video
          </li>
        ) : null}
      </ul>

      {accommodations?.length > 0 ? <Accommodations accommodations={accommodations} /> : null}
    </section>
  ) : null;
}

function Accommodations({ accommodations, dietaryAccommodation }) {
  accommodations = accommodations ?? [];

  if (dietaryAccommodation) {
    accommodations = accommodations.concat({
      ...dietaryAccommodation,
      category: 'Dietary accomodations',
    });
  }

  return accommodations?.length > 0 ? (
    <div>
      <h3 className="text-xl font-bold">Accommodations</h3>

      <div className="columns-1 md:max-w-[596px] md:columns-2 [&>*]:pt-4">
        {accommodationsCategories.map(({ category, icon: Icon }) => {
          let items = accommodations.filter((a) => a.category === category);

          return items.length > 0 ? (
            <div key={category} className="break-inside-avoid space-y-2 pl-8 md:w-[280px]">
              <h4 className="-ml-8 flex items-center text-base font-bold">
                <Icon className="mr-2" />
                {category}
              </h4>
              <List items={items} />
            </div>
          ) : null;
        })}
      </div>
    </div>
  ) : null;
}

function Gallery({ photos }) {
  return photos?.length > 0 ? (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Gallery</h3>
      <Photos images={photos} />
    </div>
  ) : null;
}

Location.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
Remote.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
Accommodations.propTypes = {
  accommodations: PropTypes.array,
  dietaryAccommodation: PropTypes.array,
};
Gallery.propTypes = {
  photos: PropTypes.array,
};
