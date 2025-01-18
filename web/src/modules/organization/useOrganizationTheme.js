import { useEffect } from 'react';
import { useOrganization } from './useOrganization';
import { colorMix as mix } from './colorMix';

export function useOrganizationTheme(options) {
  let organization = useOrganization();
  let enabled = Boolean(organization);

  if (options?.enableFor) {
    enabled = options.enableFor.includes(organization?.type);
  }

  // Replace with useInsertionEffect when https://github.com/facebook/react/issues/26670 is fixed
  useEffect(() => {
    if (enabled) {
      let style = getOrganizationStyle(organization);
      let styleElement = document.createElement('style');

      styleElement.innerHTML = `:root { ${style} }`;

      document.body.appendChild(styleElement);
      document.body.setAttribute('data-organization', organization.subdomain);

      return () => {
        styleElement.remove();
        document.body.removeAttribute('data-organization');
      };
    }
  }, [enabled]);
}

function getOrganizationStyle({ attributes }) {
  let style = '';

  if (attributes.colorPrimary) {
    let primary = attributes.colorPrimary;

    style += `
    --p-5: ${mix(primary, '#fff', 0.95)};
    --p-10: ${mix(primary, '#fff', 0.9)};
    --p-20: ${mix(primary, '#fff', 0.8)};
    --p-40: ${mix(primary, '#fff', 0.6)};
    --p-55: ${mix(primary, '#fff', 0.45)};
    --p-75: ${mix(primary, '#fff', 0.25)};
    --p-100: ${primary};
    --p-120: ${mix(primary, '#000', 0.2)};
    --p-140: ${mix(primary, '#000', 0.4)};
    --p-160: ${mix(primary, '#000', 0.6)};

    --chip: ${mix(primary, '#fff', 0.9)};
    --banner-get-matched: ${primary};
    --banner-emergency: ${mix(primary, '#fff', 0.9)};
    `;
  }

  if (attributes.colorSecondary || attributes.colorPrimarySecondary) {
    let secondary = attributes.colorSecondary || attributes.colorPrimarySecondary;
    style += `--chip: ${mix(secondary, '#fff', 0.85)};`;
  }

  if (attributes.colorChip) {
    style += `--chip: ${attributes.colorChip};`;
  }

  if (attributes.colorSurface) {
    style += `--surface: ${attributes.colorSurface};`;
  }

  return style;
}
