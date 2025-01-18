import {
  Handshake16Filled as Handshake,
  LeafThree16Filled as LeafThree,
  HandRight16Filled as HandRight,
  PeopleCommunity16Filled as PeopleCommunity,
  CalendarLtr16Filled as CalendarLtr,
  Speaker216Filled as Speaker,
} from '@fluentui/react-icons';

export function PerksOfJoining() {
  return (
    <div className="w-full bg-p-100 text-background ">
      <div className="flex flex-col items-center">
        <div className="mx-9 pb-14 md:mx-0 md:min-w-[65rem] md:pb-28">
          <h2 className="pt-10 text-center font-serif text-2xl font-bold md:pt-16 md:text-left md:text-3xl">
            Perks of joining our community
          </h2>
          <div className="flex w-fit justify-center">
            <div className="mt-6 grid grid-cols-1 gap-y-7 md:mt-10 md:grid-cols-3 md:gap-x-16 md:gap-y-10">
              <div className="flex items-center">
                <Handshake className="mr-6 h-8 w-8" />
                <p className="max-w-[14rem]">
                  Connect with clients who meet your practice’s strengths
                </p>
              </div>
              <div className="flex items-center">
                <Speaker className="mr-6 h-8 w-8 rotate-180" />
                <p className="max-w-[14rem]">Free marketing for your services</p>
              </div>
              <div className="flex items-center">
                <LeafThree className="mr-6 h-8 w-8" />
                <p className="max-w-[14rem]">
                  A referral tool to help you find additional care for your clients
                </p>
              </div>
              <div className="flex items-center">
                <HandRight className="mr-6 h-8 w-8" />
                <p className="max-w-[14rem]">
                  Reduced requests for services when your practice is full
                </p>
              </div>
              <div className="flex items-center">
                <PeopleCommunity className="mr-6 h-8 w-8" />
                <p className="max-w-[14rem]">Access to an exclusive community of resources</p>
              </div>
              <div className="flex items-center">
                <CalendarLtr className="mr-6 h-8 w-8" />
                <p className="max-w-[14rem]">Integrates with your existing scheduling flow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
