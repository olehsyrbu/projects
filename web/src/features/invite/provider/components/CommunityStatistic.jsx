import cn from 'classnames';
import PropTypes from 'prop-types';
import { useReferenceData } from '@/modules/reference-data';

export function CommunityStatistic() {
  const landingPageStatsData = useReferenceData('ProviderLandingPageStats');

  function getStatByCode(code) {
    return landingPageStatsData?.find((stat) => stat.code === code);
  }

  return (
    <div className="flex w-full flex-col items-center bg-background">
      <div className="mx-9 pb-14 font-serif md:mx-0 md:min-w-[65rem] md:pb-28">
        <h2 className="mb-8 mt-7 text-center text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
          The MiResource community
        </h2>
        <div className="mt-6 grid w-fit grid-cols-1 gap-y-7 md:mt-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10">
          <Stat value={getStatByCode('PPUM')} className="md:max-w-[17rem]">
            providers and programs are <span className="font-bold">using MiResource</span>
          </Stat>
          <Stat value={getStatByCode('PUMSCEM')} className="md:max-w-[17rem]">
            people <span className="font-bold">use MiResource to search</span> for care every month
          </Stat>
          <Stat value={getStatByCode('ASM')} className="md:max-w-[12rem]">
            <span className="font-bold">appointments scheduled</span> monthly
          </Stat>
          <Stat value={getStatByCode('GPHJ')} className="md:max-w-[10rem]">
            <span className="font-bold">group practices</span> have joined
          </Stat>
          <Stat value={getStatByCode('SWOSA')} className="md:max-w-[12rem]">
            <span className="font-bold">states with our services</span> available
          </Stat>
          <Stat value={getStatByCode('LHITM')} className="md:max-w-[17rem]">
            leading healthcare <span className="font-bold">institutions trust MiResource</span>
          </Stat>
        </div>
      </div>
    </div>
  );
}
function Stat({ value, children, className }) {
  const { name, description } = value;
  return (
    <div aria-label={`${name} ${description}`}>
      <p aria-hidden="true" className="text-3xl font-bold text-p-100 ">
        {name}
      </p>
      <p aria-hidden="true" className={cn('mt-0 font-sans text-xl md:mt-2', className)}>
        {children}
      </p>
    </div>
  );
}

Stat.propTypes = {
  value: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
