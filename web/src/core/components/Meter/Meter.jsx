import { Meter as AriaMeter } from 'react-aria-components';
import { Checkmark12Filled as Checkmark } from '@fluentui/react-icons';

export function Meter(props) {
  return (
    <AriaMeter {...props}>
      {({ percentage }) => (
        <div className="rounded-full bg-p-10">
          <div className="h-2 rounded-full bg-p-100" style={{ width: percentage + '%' }} />
        </div>
      )}
    </AriaMeter>
  );
}

export function MeterCircle(props) {
  let size = 30;
  let strokeWidth = 6.8;
  let center = size / 2;
  let radius = center - strokeWidth / 2;
  let circumference = 2 * Math.PI * radius;

  return (
    <AriaMeter {...props}>
      {({ percentage }) =>
        percentage === 100 ? (
          <div className="flex items-center justify-center rounded-full bg-p-75 size-[30px]">
            <Checkmark className="text-white" />
          </div>
        ) : (
          <svg width={size} height={size} fill="none" strokeWidth={strokeWidth}>
            <circle cx={center} cy={center} r={radius} stroke="var(--p-20)" />
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="var(--p-75)"
              strokeDasharray={`${(circumference * percentage) / 100} 99`}
              strokeLinecap="round"
              transform="rotate(-90 15 15)"
            />
          </svg>
        )
      }
    </AriaMeter>
  );
}
