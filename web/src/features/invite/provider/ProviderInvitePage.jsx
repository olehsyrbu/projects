import { AuthActions } from './AuthActions';
import InvitePageTemplate from './InvitePageTemplate';
import welcomePhoto from './components/assets/WelcomePhoto.jpg';

import { useScreen } from '@/core/hooks';
import {
  AskedQuestions,
  Feedbacks,
  CustomerSupport,
  CommunityStatistic,
  PerksOfJoining,
  OurCommitment,
  HelpDesk,
  SiteTutorial,
} from './components';
import { WavesDark, WavesWhite, WavesGrey } from './components/Waves';
import { FrameImage, Waves } from '@/modules/app-shell';

export function ProviderInvitePage() {
  const isMediumScreen = useScreen('md');

  return (
    <InvitePageTemplate>
      <div>
        <div className="flex flex-col items-center justify-center md:flex-row">
          <FrameImage
            src={welcomePhoto}
            width={isMediumScreen ? 600 : 450}
            aria-hidden="true"
            className="mt-[-1.5rem] max-w-[95vw]"
          />
          <div className="mt-8 flex max-w-[85vw] flex-col justify-center text-center md:ml-6 md:mt-0 md:max-w-fit md:text-left">
            <h1 className="font-serif text-2xl font-bold md:max-w-[37rem] md:text-3xl">
              Welcome to MiResource, a free, invitation-only provider directory!
            </h1>
            <p className="mb-8 mt-6 text-xl">
              Join us in helping people when they need it the most.
            </p>
            <AuthActions />
          </div>
        </div>
      </div>
      <div>
        <WavesDark className="mb-[-0.25rem] mt-10 block w-full" aria-hidden="true" />
      </div>
      <div className="bg-[#f8f7f4]">
        <PerksOfJoining />
        {isMediumScreen ? (
          <Waves
            className="mt-[-0.75rem] w-full md:mt-[-1.75rem]"
            aria-hidden="true"
            firstColor="var(--p-10)"
            secondColor="#F8F7F4"
          />
        ) : (
          <WavesWhite className="mt-[-0.75rem] w-full md:mt-[-1.75rem]" aria-hidden="true" />
        )}
        <SiteTutorial />
        <WavesDark className="mt-[-0.75rem] w-full md:mt-[-1.75rem]" aria-hidden="true" />
        <Feedbacks />
        <WavesWhite className="mt-[-0.75rem] w-full md:mt-[-1.75rem]" aria-hidden="true" />
        <CommunityStatistic />
        <WavesGrey className="mt-[-0.75rem] w-full md:mt-[-2.75rem]" aria-hidden="true" />
        <OurCommitment />
        <WavesDark
          className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
          aria-hidden="true"
          fill="var(--p-75)"
        />
        <AskedQuestions />
        <WavesGrey className="mt-[-0.75rem] w-full md:mt-[-2.75rem]" aria-hidden="true" />
        <CustomerSupport />
        <WavesWhite
          className="mt-[-0.75rem] w-full md:mt-[-1.75rem]"
          aria-hidden="true"
          fill="var(--p-10)"
        />
        <HelpDesk />
        <Waves
          className=" mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
          aria-hidden="true"
        />
      </div>
    </InvitePageTemplate>
  );
}
