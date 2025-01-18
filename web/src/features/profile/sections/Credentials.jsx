/* eslint-disable jsx-a11y/no-redundant-roles */
import PropTypes from 'prop-types';
import {
  ContactCard24Filled as ContactCard,
  Ribbon24Filled as Ribbon,
  HatGraduation24Filled as HatGraduation,
  News24Filled as News,
} from '@fluentui/react-icons';
import { TooltipPsypact } from '@/modules/provider/components';

export function Credentials({ profile, anchorId }) {
  let { licenses, accreditations, certifications, educations, publications } = profile;
  let lists = [licenses, accreditations, certifications, educations, publications];

  if (lists.filter(Boolean).flat().length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 pb-6 max-md:px-4">
      <h2 className="-mt-6 pt-12 text-2xl font-bold" id={anchorId}>
        Credentials
      </h2>

      {licenses?.length > 0 ? (
        <div>
          <H3 icon={<ContactCard />}>Licenses</H3>

          <ul role="list" className="space-y-2 pl-8">
            {licenses
              .slice()
              .sort((l1, l2) => {
                if (l1.type === 'PSYPACT') return -1;
                if (l2.type === 'PSYPACT') return 1;
                return 0;
              })
              .map(({ type, id, name, organization, number, state }) =>
                type === 'PSYPACT' ? (
                  <li key={type}>
                    <h4 className="mb-1 font-medium text-p-100">
                      PSYPACT Provider <TooltipPsypact />
                    </h4>
                    <p>Mobility number: {number}</p>
                  </li>
                ) : (
                  <li key={id} className="space-y-1">
                    <h4 className="mb-2 font-bold">{name}</h4>
                    {organization ? <p className="mb-1">{organization}</p> : null}
                    <p>
                      {number}
                      {state ? <span>, {state.name}</span> : null}
                    </p>
                  </li>
                ),
              )}
          </ul>
        </div>
      ) : null}

      {accreditations?.length > 0 ? (
        <div>
          <H3 icon={<ContactCard />}>Accreditations</H3>

          <ul role="list" className="space-y-2 pl-8">
            {accreditations.map(({ id, body }) => (
              <li key={id}>{body}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {certifications?.length > 0 ? (
        <div>
          <H3 icon={<Ribbon />}>Certificates</H3>

          <ul role="list" className="space-y-2 pl-8">
            {certifications.map(({ id, name, authority, description }) => (
              <li key={id} className="space-y-2">
                <h4 className="font-bold">{name}</h4>
                <p>{authority}</p>
                {description ? <p>{description}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {educations?.length > 0 ? (
        <div>
          <H3 icon={<HatGraduation />}>Education</H3>

          <ul role="list" className="space-y-3 pl-8">
            {educations.map(({ id, schoolName, education, graduationYear, comment }) => (
              <li key={id} className="space-y-2">
                <h4 className="font-bold">{schoolName}</h4>
                <p>
                  {education?.name}, {graduationYear}
                </p>
                {comment ? <p>{comment}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {publications?.length > 0 ? (
        <div>
          <H3 icon={<News />}>Publications</H3>

          <ul role="list" className="space-y-3 pl-8">
            {publications.map(
              ({ id, title, publicationDate, publicationIn, doi, description, url }) => (
                <li key={id} className="space-y-2">
                  <h4 className="font-bold">{title}</h4>
                  <p>{[publicationDate, publicationIn, doi].filter(Boolean).join(', ')}</p>
                  {description ? <p>{description}</p> : null}
                  {url ? (
                    <a
                      href={url}
                      rel="noreferrer"
                      target="_blank"
                      className="text-sm font-medium text-p-100"
                    >
                      See publication
                    </a>
                  ) : null}
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function H3({ icon, children }) {
  return (
    <h3 className="mb-2 flex items-center gap-x-2 text-xl font-bold">
      {icon}
      {children}
    </h3>
  );
}

Credentials.propTypes = {
  profile: PropTypes.object.isRequired,
  anchorId: PropTypes.string.isRequired,
};
H3.propTypes = {
  icon: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};
