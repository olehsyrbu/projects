import { useScreen } from '@/core/hooks';
import { Quotes } from './DecorativeGraphic';
import foundersPhoto from './assets/FoundersPhoto.jpg';
import { FrameImage } from '@/modules/app-shell';

export function OurCommitment() {
  const isMediumScreen = useScreen('md');
  return (
    <div className="flex w-full flex-col items-center ">
      <div className="mx-4 max-w-[75rem] pb-14 text-xl md:mx-0 md:pb-28">
        <div className="flex flex-col md:flex-row md:flex-row-reverse">
          <div>
            <FrameImage
              src={foundersPhoto}
              width={isMediumScreen ? 630 : 360}
              aria-hidden="true"
              background="var(--background)"
              foreground="var(--p-10)"
            />
            {isMediumScreen && <h2 className="sr-only"> Our commitment as a company</h2>}
            <h2 className="mt-6 text-center font-serif text-2xl font-bold text-p-100 md:mt-12 md:hidden">
              Our commitment as a company
            </h2>
            <div className="flex">
              <div>
                <Quotes className="ml-14 mt-2 hidden md:block" aria-hidden="true" />
              </div>
              <div className="md:w-[26.5rem]">
                <p className="my-8 md:ml-2">
                  I watched my sister Shelby struggle, fail to find the right care in her darkest
                  moments, and ultimately I lost her to depression. I have a lifelong commitment to
                  helping people find and connect with mental health care so that no one has to
                  struggle the way Shelby did.
                </p>
                <p className="w-48 font-bold text-p-100">Mackenzie Drazan, CEO of MiResource</p>
              </div>
            </div>
          </div>
          <div>
            <div className="flex">
              <div>
                <Quotes className="mt-[15.5rem] hidden md:block" aria-hidden="true" />
              </div>
              <div className="md:ml-2 md:w-[30rem]">
                <h2
                  aria-hidden="true"
                  className="mt-12 hidden w-3/5 w-9/12 font-serif text-2xl text-3xl font-bold text-p-100 md:mt-32 md:block"
                >
                  Our commitment as a company
                </h2>
                <p className="mb-6 mt-10 md:mt-14 md:pr-5">
                  At MiResource, we understand that everyone’s needs are unique and may change over
                  time. We support people in finding the right mental health care for all levels of
                  severity, from finding someone to talk, to needing a prescription, to a referral
                  to a residential program or crisis services.
                </p>
                <p>
                  We support people and their loved ones in navigating the many ups and downs of the
                  mental health system.
                </p>
                <p className="mt-8 w-48 font-bold text-p-100">
                  Gabriela Asturias, COO of MiResource
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
