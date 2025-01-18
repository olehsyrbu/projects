import { Slider, SliderThumb, SliderTrack } from 'react-aria-components';
import cn from 'classnames';

export function StepSlider(props) {
  return (
    <Slider
      {...props}
      onChange={(value) => {
        props.onChange(Array.isArray(value) ? value[0] : value);
      }}
    >
      <SliderTrack className="relative flex h-2 justify-between rounded-full bg-p-10">
        {Array.from(Array(props.maxValue)).map((_, i) => (
          <div key={i} className="rounded-full bg-p-100 size-2" />
        ))}

        <SliderThumb
          className={({ state }) => {
            let value = parseInt(state.getThumbValue(0), 10);
            return cn('top-1 rounded-full bg-p-100 size-6', { invisible: isNaN(value) });
          }}
        />
      </SliderTrack>
    </Slider>
  );
}

StepSlider.propTypes = Slider.propTypes;
