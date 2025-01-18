import { useRef, useLayoutEffect } from 'react';
import { SurveyStepControls } from '@/modules/survey/components';

export function Controls(props) {
  let ref = useRef();

  function alignControls() {
    let stepElement = ref.current.closest('article');
    let rootRect = document.body.getBoundingClientRect();
    let stepRect = stepElement.getBoundingClientRect();
    ref.current.style.bottom = `${rootRect.bottom - stepRect.bottom}px`;
  }

  useLayoutEffect(() => {
    alignControls();

    let resizeObserver = new ResizeObserver(alignControls);
    resizeObserver.observe(document.body);
    return () => {
      resizeObserver.unobserve(document.body);
    };
  }, []);

  return <SurveyStepControls ref={ref} {...props} />;
}
