import { useEffect } from 'react';
import config from '@/core/config';

export function ZendeskScript() {
  useEffect(() => {
    if (!document.documentMode) {
      // not IE browser
      let script = document.createElement('script');
      script.id = 'ze-snippet';
      script.src = `https://static.zdassets.com/ekr/snippet.js?key=${config.zendeskKey}`;
      script.defer = true;
      window.zESettings = {
        webWidget: {
          offset: {
            vertical: '71px',
            mobile: { vertical: '20px' },
          },
        },
      };
      document.body.appendChild(script);

      return () => script.remove();
    }
  }, []);
  return null;
}
