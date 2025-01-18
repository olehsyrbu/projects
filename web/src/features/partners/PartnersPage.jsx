import React, { useEffect, useState } from 'react';
import Footer from '@/modules/app-shell/Footer';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { FrameImage, Waves } from '@/modules/app-shell';
import { useScreen } from '@/core/hooks';
import mixpanel from '@/core/mixpanel';
import { DownloadDocumentDialog } from './DownloadDocumentDialog';

import { WavesDark } from '@/features/invite/provider/components/Waves';
import {
  ChevronRight24Filled as ChevronRight,
  ArrowDownload20Filled as Arrow,
} from '@fluentui/react-icons';
import * as images from './assets';

export default function PartnersPage() {
  const isMediumScreen = useScreen('md');
  const [download, setDownload] = useState(null);

  useEffect(() => {
    mixpanel.track('Partners page visit');
  }, []);

  return (
    <div>
      <div className="min-h-screen bg-surface">
        <Header />
        <main>
          <div className="mb-20 flex flex-col items-center justify-center md:flex-row">
            <FrameImage
              src={images.main}
              width={isMediumScreen ? 630 : 360}
              imageProps={{ width: '500px' }}
              aria-hidden="true"
            />
            <div className="mt-8 flex flex-col justify-center px-4 text-center md:ml-6 md:mt-8 md:max-w-[35rem] md:text-left">
              <h1 className="font-serif text-2xl font-bold md:text-3xl">
                Make the world a mentally healthy place with MiResource
              </h1>
              <p className="my-6 text-xl">
                Finding the right mental health care is often challenging. With MiResource
                technology, you can support your members through every step of finding and
                connecting with the best care. 
              </p>
            </div>
          </div>

          <Waves
            firstColor="#F2F0E9"
            secondColor="var(--background)"
            className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
            aria-hidden="true"
          />

          <div className="flex w-full flex-col bg-background md:items-center">
            <div className="py-16 md:pb-28">
              <h2 className="mb-7 px-4 font-serif text-2xl font-bold md:mb-10 md:text-left md:text-3xl">
                Who we work with
              </h2>
              <div className="flex space-x-6 overflow-x-auto md:space-x-12">
                <div className="min-w-[15rem] space-y-6 pl-4 md:max-w-[17rem]">
                  <img width="154" src={images.healthplans} alt="Health plans" aria-hidden="true" />
                  <h2 className="text-2xl font-bold md:font-serif">Health plans </h2>
                  <p>
                    MiResource’s white-labeled mental health provider finder will make it seamless
                    to engage your in-network mental health care, keep provider information
                    up-to-date, increase member engagement, track health equity initiatives, and get
                    a return on investment.
                  </p>
                  <a
                    onClick={() => mixpanel.track('Health plans learn more')}
                    className="text-normal block font-medium text-p-100"
                    target="_blank"
                    rel="noreferrer"
                    href="https://youtu.be/Ej5okdVWGK0"
                  >
                    Learn more <ChevronRight />
                  </a>{' '}
                </div>

                <div className="min-w-[15rem] space-y-6 md:max-w-[17rem]">
                  <img
                    src={images.universityCounselingCenters}
                    width="154"
                    alt="University Counseling Centers"
                    aria-hidden="true"
                  />
                  <h2 className="text-2xl font-bold md:font-serif">
                    University Counseling Centers
                  </h2>
                  <p>
                    Used by over 60 leading university health systems across the United States,
                    MiResource is the gold standard for connecting students to local mental health
                    resources.
                  </p>
                  <a
                    onClick={() => mixpanel.track('University Counseling Centers learn more')}
                    className="text-norma block font-medium text-p-100"
                    target="_blank"
                    rel="noreferrer"
                    href="https://youtu.be/uSzU1uzTz3o"
                  >
                    Learn more <ChevronRight />
                  </a>
                </div>
                <div className="min-w-[15rem] space-y-6 pr-4 md:max-w-[17rem]">
                  <img
                    width="154"
                    src={images.digitalHealth}
                    alt="Digital Health"
                    aria-hidden="true"
                  />
                  <h2 className="text-2xl font-bold md:font-serif">Digital Health </h2>
                  <p>
                    MiResource equips innovative companies who recognize the importance of mental
                    health care with a white labeled mental health provider finder, access to the
                    MiResource provider network, and straightforward case management tools.
                  </p>
                  <button
                    onClick={() => {
                      mixpanel.track('Digital Health download intro packet');
                      setDownload({
                        name: 'Download intro packet',
                        href: 'https://assets.miresource.com/parthners/Digital_Innovator_Intro_Packet.pdf',
                      });
                    }}
                    className="text-normal block font-medium text-p-100"
                  >
                    Download intro packet <Arrow />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <WavesDark
            fill="#6CCACE"
            className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
            aria-hidden="true"
          />

          <div className="md:mb-18 relative flex w-full flex-col bg-p-100 text-background md:items-center">
            <img
              className="absolute left-0 top-[-3rem] z-0 hidden md:block"
              src={images.leaves}
              aria-hidden="true"
              alt=""
              width={250}
            />
            <div className="z-10 flex flex-col items-center justify-center px-4 text-center md:flex-row md:py-8 md:text-left">
              <div className="max-w-[26rem]">
                <h2 className="mb-8 mt-24 font-serif text-2xl font-bold md:mb-10 md:mt-6 md:text-left md:text-3xl">
                  See our platform live
                </h2>
                <p className="mb-8 text-xl">
                  Get a personal demo of our platform, customized for your organization’s needs.
                </p>
                <a
                  onClick={() => mixpanel.track('Partners page Request demo')}
                  target="_blank"
                  rel="noreferrer"
                  className="h-12 w-48 rounded-full bg-white px-16 py-3 text-center text-base font-medium text-p-100 md:text-base md:font-medium"
                  href="https://forms.gle/YWYKmRLUHoDJaSdE8"
                >
                  Request demo
                </a>
              </div>
              <img
                className="py-12 md:py-0"
                src={images.seeourplatformlive}
                width="224"
                alt=""
                aria-hidden="true"
              />
            </div>
            <img
              className="absolute right-0 top-[-3rem] z-0 hidden md:block"
              src={images.leavesRight}
              aria-hidden="true"
              alt=""
              width={250}
            />
          </div>

          <Waves
            fill="var(--p-55)"
            secondColor="var(--surface)"
            className=" w-full bg-p-100"
            aria-hidden="true"
          />

          <div className="relative top-[-1px] flex w-full items-center space-y-12 bg-surface pb-24 pt-16 md:justify-center">
            <div className="flex w-full flex-col items-baseline space-y-12 md:w-[69rem]">
              <div className="flex w-full flex-col items-baseline lg:flex-row lg:items-center lg:space-x-16">
                <div className="flex px-4 pb-6 font-serif text-2xl font-bold md:pb-0 md:text-3xl">
                  Awards
                </div>
                <div className="flex w-full space-x-6 overflow-x-auto px-4 md:w-[70rem]">
                  <div className="flex items-center space-x-6">
                    <img
                      className="max-w-[10rem]"
                      src={images.bcbs}
                      aria-hidden="true"
                      alt="bcbs"
                    />
                    <span className="min-w-[14rem] text-xl font-bold md:max-w-[14rem]">
                      Blue Cross Blue Shield Association Brand Innovation Award
                    </span>
                  </div>
                  <div className="flex items-center space-x-6">
                    <img
                      className="max-w-[10rem]"
                      src={images.Forbes30}
                      aria-hidden="true"
                      alt="forbes"
                    />
                    <span className="min-w-[14rem] text-xl font-bold md:max-w-[14rem]">
                      Founders recognized by Forbes 30 under 30 in healthcare
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-baseline lg:flex-row lg:items-center lg:space-x-20">
                <div className=" flex px-4 pb-6 font-serif text-2xl font-bold md:pb-0 md:text-3xl">
                  Seen in
                </div>
                <div className="flex space-x-10 overflow-x-auto px-4">
                  <img width="130" src={images.vogue} aria-hidden="true" alt="Vogue" />
                  <img width="130" src={images.forbes} aria-hidden="true" alt="Forbes" />
                  <img width="130" src={images.inc} aria-hidden="true" alt="Inc" />
                  <img width="130" src={images.MIT} aria-hidden="true" alt="MIT" />
                </div>
              </div>
            </div>
          </div>

          <Waves
            firstColor="#D3EAE8"
            secondColor="var(--background)"
            className="-mt-2 w-full bg-surface"
            aria-hidden="true"
          />

          <div className="flex flex-col bg-white pb-24 pt-16 md:items-center">
            <div className="md:items-left flex w-full flex-col md:max-w-[65rem]">
              <h2 className="mb-7 px-4 font-serif text-2xl font-bold md:text-left md:text-3xl">
                Resources
              </h2>
              <DownloadResources setDownload={setDownload} />
            </div>
          </div>
        </main>

        <div className="relative z-10">
          <Waves
            className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
            aria-hidden="true"
          />
          <Footer />
        </div>
      </div>
      {download && (
        <DownloadDocumentDialog
          name={download.name}
          href={download.href}
          onCloseDialog={() => setDownload(null)}
        />
      )}
    </div>
  );
}

function DownloadResources({ setDownload }) {
  return (
    <div className="flex max-w-full space-x-20 overflow-x-auto px-4">
      <div className="flex w-[12rem] flex-wrap content-between space-y-6">
        <img
          width="100"
          src={images.miResourceOutcomesReport}
          aria-hidden="true"
          alt="MiResource Outcomes Report"
        />
        <p className="text-xl font-bold text-p-100">2022 MiResource Outcomes report</p>
        <button
          onClick={() => {
            mixpanel.track('MiResource Outcomes report Popup open');
            setDownload({
              name: '2022 MiResource Outcomes report',
              href: 'https://assets.miresource.com/parthners/MiResource_Outcomes_Report_2022.pdf',
            });
          }}
          className="mir-button w-[8.5rem] rounded-full text-p-100 md:text-base md:font-medium"
        >
          Download
        </button>
      </div>
      <div className="flex w-[12rem] flex-wrap content-between space-y-6">
        <img
          width="100"
          src={images.miResourceProviderExperience}
          aria-hidden="true"
          alt="MiResource Provider Experience"
        />
        <p className="text-xl font-bold text-p-100">MiResource Provider Experience</p>
        <button
          onClick={() => {
            mixpanel.track('MiResource Provider Experience Popup open');
            setDownload({
              name: 'MiResource Provider Experience',
              href: 'https://assets.miresource.com/parthners/MiResource_Provider_Relations_One-Pager.pdf',
            });
          }}
          className="mir-button w-[8.5rem] rounded-full text-p-100 md:text-base md:font-medium"
        >
          Download
        </button>
      </div>
      <div className="flex w-[12rem] flex-wrap content-between space-y-6">
        <img
          width="100"
          src={images.miResourceCaseManagement}
          aria-hidden="true"
          alt="MiResource Case Management"
        />
        <p className="text-xl font-bold text-p-100">MiResource Case Management</p>
        <button
          onClick={() => {
            mixpanel.track('MiResource Case Management Popup open');
            setDownload({
              name: 'MiResource Case Management',
              href: 'https://assets.miresource.com/parthners/MiResource_Medical_Affairs_One-Pager.pdf',
            });
          }}
          className="mir-button w-[8.5rem] rounded-full text-p-100 md:text-base md:font-medium"
        >
          Download
        </button>
      </div>
      <div className="flex w-[12rem] flex-wrap content-between space-y-6">
        <img
          width="100"
          src={images.miResourceMemberExperience}
          aria-hidden="true"
          alt="MiResource Member Experience"
        />
        <p className="text-xl font-bold text-p-100">MiResource Member Experience</p>
        <button
          onClick={() => {
            mixpanel.track('MiResource Member Experience Popup open');
            setDownload({
              name: 'MiResource Member Experience',
              href: 'https://assets.miresource.com/parthners/MiResource_Member_Experience_One-Pager.pdf',
            });
          }}
          className="mir-button w-[136px] rounded-full  text-p-100 md:text-base md:font-medium"
        >
          Download
        </button>
      </div>
    </div>
  );
}
