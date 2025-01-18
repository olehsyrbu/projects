import { Meter, MeterCircle } from './Meter';

export default {
  title: 'components/Meter',
  component: Meter,
  parameters: {
    layout: 'centered',
  },
};

export let MeterBar = {
  name: 'Meter',
  render: () => <Meter value={33} aria-label="Meter bar" style={{ width: 200 }} />,
};

export let MeterCrcl = {
  name: 'Meter Circle',
  render: () => (
    <div className="flex space-x-2">
      <MeterCircle value={70} aria-label="Meter circle" />
      <MeterCircle value={100} aria-label="Meter circle" />
    </div>
  ),
};
