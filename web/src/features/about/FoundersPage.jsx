import React from 'react';
import { useScreen } from '@/core/hooks';
import Footer from '@/modules/app-shell/Footer';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { FrameImage, Waves } from '@/modules/app-shell';
import * as images from './assets';

export default function FoundersPage() {
  const isMediumScreen = useScreen('md');

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        <div className="absolute w-full pt-40">
          <Waves
            firstColor="var(--n-40)"
            secondColor="var(--background)"
            className="hidden w-full md:block"
            aria-hidden="true"
          />
          <Waves
            firstColor="var(--p-20)"
            secondColor="var(--surface)"
            className="hidden w-full rotate-180 transform md:block"
            aria-hidden="true"
          />
        </div>

        <div className="m-auto flex flex-col  items-center justify-center px-4 pb-8 text-left md:w-[38rem] md:max-w-fit md:pb-16">
          <FrameImage
            className="z-10 mb-6 flex h-[12rem] justify-center md:mb-12 md:h-[24rem]"
            src={images.founders}
            width={isMediumScreen ? 630 : 360}
            aria-hidden="true"
            background="var(--p-100)"
            foreground="var(--background)"
          />
          <h1 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            MiResource founding story
          </h1>
          <div className="space-y-4 text-xl md:space-y-6 md:text-base">
            <p>
              Growing up in a family of doctors in Northern California, I never imagined mental
              health care would become such a critical part of my life. However, everything changed
              when my younger sister, Shelby, began struggling with her mental health. It started
              with anxiety and soon escalated into depression, self-harm, and an eating disorder.
              Despite our parents' best efforts to get her the care she needed, Shelby was trapped
              in a never-ending cycle of treatments and hospital visits.
            </p>
            <p>
              We were fortunate to live next to Stanford Hospital, and my parents did everything
              they could to find the right doctors and programs for her. But no matter what we
              tried, nothing seemed to work. As a family, we struggled to navigate the mental health
              care system. Sadly, Shelby was ping-ponged around the system, in and out of the
              emergency room, IOPs, PHPs, residential treatment programs, three different
              psychologists, three different psychiatrists, and more. Despite her willingness to
              seek help and follow through with treatment, we couldn't find the right care for her.
              Ultimately, we failed to find her the right care, and in 2014, we lost her to suicide.
            </p>
            <p>
              Losing Shelby changed me forever. I knew I had to do something to prevent others from
              experiencing the same pain and hopelessness that Shelby did. I vowed to devote my life
              to creating a world where mental health care was accessible to everyone who needed it,
              where no one would be lost in the shuffle of the system.
            </p>
            <p>
              In 2017, I teamed up with Gabriela Asturias to co-found MiResource. We were frustrated
              with how difficult it was for people to find and connect with mental health care after
              bravely seeking help. We set out to create a world where people could access effective
              mental health care. Since the company's inception, MiResource has helped connect
              hundreds of thousands of people to mental health care through its marketplace.
            </p>
            <p>
              MiResource spent the first three years as a company powering the case management
              services at university counseling centers with a white-labeled provider finder that
              guides students through finding and connecting with local mental health care. In 2020,
              MiResource was awarded a $1.2 million phase 1&2 Fast Track grant by the National
              Institute of Mental Health to build the first machine learning algorithm to predict
              the right level of care for someone. I started to feel we were getting closer to
              helping others like Shelby. In 2021, we pivoted to powering health plans with our
              technology to help them connect their members to in-network mental health care. We
              want everyone to access affordable and effective mental health care for their needs,
              including therapy, medications, programs, and other treatments.
            </p>
          </div>
          <a
            className="mt-6 rounded-full border border-p-100 px-6 py-2 text-base font-medium text-p-100 md:flex md:text-base md:font-medium"
            href="/about"
          >
            Back to about us
          </a>
        </div>
      </main>
      <Waves className="mb-[-1px] block w-full" aria-hidden="true" />
      <Footer />
    </div>
  );
}
