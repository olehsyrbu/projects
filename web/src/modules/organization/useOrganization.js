import { useMemo } from 'react';
import { camelCase } from 'lodash-es';
import { useImmutableQuery, gql } from '@/core/graphql';
import config from '@/core/config';

let query = gql`
  query Organization($subdomain: String!) {
    organizationBySubdomain(subdomain: $subdomain) {
      id
      subdomain
      name
      crisisTextNumber: crisis_text_number
      crisisPhoneNumber: crisis_phone_number
      type: organization_type {
        code
      }
      attributes {
        name
        value
      }
      insuranceTypes: insurance_types {
        id
        code
        name
        category
      }
    }
  }
`;

export function useOrganization() {
  let subdomain = useMemo(getSubdomain, []);

  let { data } = useImmutableQuery(subdomain ? query : null, { subdomain });
  let organization = data?.organizationBySubdomain;

  return useMemo(() => {
    if (!organization) {
      return null;
    }

    return {
      ...organization,
      type: organization.type.code,
      attributes: Object.fromEntries(
        organization.attributes.map(({ name, value }) => [camelCase(name), value]),
      ),
    };
  }, [organization]);
}

export function getSubdomain() {
  if (config.whiteLabeling.subdomain) {
    return config.whiteLabeling.subdomain;
  }

  let { hostname } = window.location;

  return hostname.endsWith('.' + config.deploymentUrl)
    ? hostname.replace('.' + config.deploymentUrl, '')
    : null;
}
