import { useEffect } from 'react';
import { useFlag } from '@/core/feature-split';
import { useOrganization } from '@/modules/organization';
import { useLocation } from 'react-router-dom';
import './UkraineBanner.css';

export function UkraineBanner() {
  let organization = useOrganization();
  const enableHelpUkraine = useFlag('help-ukraine');
  const location = useLocation();

  useEffect(() => {
    if (!organization?.subdomain && enableHelpUkraine && location.pathname === '/') {
      const script = document.createElement('script');
      script.async = true;
      script.id = 'help-ukraine-win';
      script.src =
        'https://helpukrainewinwidget.org/cdn/widget.js?type=four&position=bottom-left&layout=collapsed';

      document.body.appendChild(script);
      script.onload = () => {
        setTimeout(() => {
          const banner = document.body.getElementsByClassName('huww-widget');
          if (banner?.length > 0) banner[0].dataset.huwwSlide = 'collapsed';
          document.querySelector('.huww-title').textContent = 'Help Ukraine!';
        });
      };
      return () => {
        const helpUkraine = document.body.getElementsByClassName('huww-widget');
        if (helpUkraine?.length > 0) helpUkraine[0].remove();
        document.body.removeChild(script);
      };
    }
  }, [enableHelpUkraine, location.pathname, organization?.subdomain]);
  return null;
}
