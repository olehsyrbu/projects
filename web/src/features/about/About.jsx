import React from 'react';
import Footer from '@/modules/app-shell/Footer';
import Header from '@/modules/app-shell/HeaderWithLogin';
import { FrameImage, Waves } from '@/modules/app-shell';
import { useScreen } from '@/core/hooks';
import foundersPhoto from '@/features/invite/provider/components/assets/FoundersPhoto.jpg';
import { WavesDark, WavesWhite, WavesGrey } from '@/features/invite/provider/components/Waves';
import { Quotes } from '@/features/invite/provider/components/DecorativeGraphic';
import { ChevronRight24Filled as ChevronRight } from '@fluentui/react-icons';
import * as images from './assets';
import { PropTypes } from 'prop-types';

export default function AboutPage() {
  const isMediumScreen = useScreen('md');

  return (
    <div>
      <div className="min-h-screen bg-surface">
        <Header />
        <main>
          <div>
            <div className="mb-8 flex flex-col items-center justify-center md:flex-row">
              <FrameImage
                src={foundersPhoto}
                width={isMediumScreen ? 630 : 360}
                aria-hidden="true"
                background="var(--p-10)"
                foreground="var(--background)"
              />
              <div className="mt-8 flex max-w-[85vw] flex-col justify-center text-center md:ml-6 md:mt-0 md:max-w-fit md:text-left">
                <h1 className="font-serif text-2xl font-bold md:max-w-[37rem] md:text-3xl">
                  We are working to create a world where everyone has the opportunity to be happy.
                </h1>
              </div>
            </div>
            <Waves
              firstColor="var(--n-20)"
              secondColor="var(--background)"
              className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
              aria-hidden="true"
            />
            <div className="bg-background">
              <div className="flex w-full flex-col justify-center bg-background px-4 py-8 text-center md:flex-row md:text-left">
                <div className="md:pr-24">
                  <h2 className="pb-4 text-base text-banner-get-matched ">OUR MISSION</h2>
                  <p className="font-serif text-xl font-bold md:max-w-[26rem] ">
                    Make it easy for people to find and connect with affordable and effective mental
                    health care.
                  </p>
                </div>

                <div className="pt-12 md:pt-0">
                  <h2 className="pb-4 text-base text-banner-get-matched ">OUR COMPANY</h2>
                  <p className="font-serif text-xl font-bold md:max-w-[26rem] ">
                    MiResource guides and supports people through the process of finding and
                    connecting with mental health care for their unique needs.
                  </p>
                </div>
              </div>
              <WavesDark
                fill="var(--p-55)"
                className="mb-[-1px] block w-full pt-10"
                aria-hidden="true"
              />
            </div>
            <div className="flex flex-col justify-center bg-p-100 p-4 py-16 text-inverted md:flex-row">
              <div className="flex md:space-x-6 md:pr-24">
                <div>
                  <Quotes className="mt-24 hidden md:block" aria-hidden="true" />
                </div>
                <div className="md:w-[26rem]">
                  <h2 className="font-serif text-3xl font-bold text-inverted text-p-10">
                    Our commitment as a company
                  </h2>

                  <p className="mb-8 mt-10">
                    I watched my sister Shelby struggle, fail to find the right care in her darkest
                    moments, and ultimately I lost her to depression. I have a lifelong commitment
                    to helping people find and connect with mental health care so that no one has to
                    struggle the way Shelby did.
                  </p>
                  <p className="w-48 font-bold text-p-40">Mackenzie Drazan</p>
                  <p className="w-48 font-bold text-p-40">CEO of MiResource</p>
                  <a
                    className="border-inverded mt-6 hidden h-12 w-full items-center justify-center rounded-full border  px-6 py-2 text-xl text-inverted hover:text-inverted md:flex md:w-64 md:text-base md:font-medium"
                    href="/founders"
                  >
                    Read our founding story
                  </a>
                </div>
              </div>
              <div className="flex md:space-x-4">
                <div>
                  <Quotes className="mt-8 hidden md:block" aria-hidden="true" />
                </div>
                <div className="md:ml-2 md:w-[26rem]">
                  <p className="mb-6 mt-10 md:mt-14 md:pr-5">
                    At MiResource, we understand that everyone’s needs are unique and may change
                    over time. We support people in finding the right mental health care for all
                    levels of severity, from finding someone to talk, to needing a prescription, to
                    a referral to a residential program or crisis services.
                  </p>
                  <p>
                    We support people and their loved ones in navigating the many ups and downs of
                    the mental health system.
                  </p>
                  <p className="mt-8 w-48 font-bold text-p-40">Gabriela Asturias</p>
                  <p className="font-bold text-p-40">COO of MiResource</p>
                </div>
              </div>
              <a
                className="border-inverded visible mt-6 flex h-12 w-full items-center justify-center rounded-full border px-6 py-2 text-xl font-medium text-inverted hover:text-inverted md:hidden md:w-64 md:text-base md:font-medium"
                href="/founders"
              >
                Read our founding story
              </a>
            </div>

            <WavesWhite
              fill="var(--p-120)"
              className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
              aria-hidden="true"
            />

            <div className="flex w-full flex-col bg-background md:items-center">
              <div className="pb-14 pl-4 md:min-w-[65rem] md:pb-28 md:pl-0">
                <h2 className="mb-7 mt-8 font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
                  Our community
                </h2>
                <div className="flex space-x-6 overflow-x-auto">
                  <div className="block min-w-[15rem] md:w-[20rem]">
                    <img
                      className="mb-6"
                      src={images.partners}
                      width="154"
                      alt=""
                      aria-hidden="true"
                    />
                    <p className="sr-only">partners image</p>
                    <h2 className="pb-4 font-serif text-2xl font-bold">Partners</h2>
                    <p>
                      We empower healthcare institutions with technology to connect their members to
                      mental health care. Learn more about our work with health insurance plans,
                      university counseling centers, and other healthcare organizations.
                    </p>
                  </div>
                  <div className="block min-w-[15rem] md:w-[20rem]">
                    <img
                      className="mb-6"
                      src={images.providers}
                      width="154"
                      alt=""
                      aria-hidden="true"
                    />
                    <h2 className="pb-4 font-serif text-2xl font-bold">Providers</h2>
                    <p>
                      We recognize that providers are essential to helping people heal. We built a
                      community of vetted providers to support people achieve their therapeutic
                      goals.
                    </p>
                    <a
                      className="text-normal mt-6 block font-medium text-p-100"
                      target="_blank"
                      href="/invite"
                    >
                      Learn more <ChevronRight />
                    </a>
                  </div>
                  <div className="block min-w-[15rem] md:w-[20rem]">
                    <img
                      className="mb-6"
                      src={images.programs}
                      width="154"
                      alt=""
                      aria-hidden="true"
                    />
                    <h2 className="pb-4 font-serif text-2xl font-bold">Programs</h2>
                    <p>
                      Our users need help navigating the entire continuum of mental health care. We
                      work with treatment programs to offer options for different levels of mental
                      illness severity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <WavesDark
              fill="var(--p-75)"
              className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
              aria-hidden="true"
            />
            <div className="flex w-full flex-col bg-p-100  text-background md:items-center">
              <div className="pb-14 pl-4 md:min-w-[65rem] md:pb-28 md:pl-0">
                <h2 className="mb-8 mt-7 font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
                  MiResource leadership
                </h2>
                <LeaderShip />
              </div>
            </div>
            <Waves
              firstColor="var(--p-10)"
              secondColor="var(--background)"
              className="mb-[-0.25rem] mt-[-0.75rem] w-full md:mt-[-1.75rem]"
              aria-hidden="true"
            />
            <div className="flex w-full flex-col bg-background md:items-center">
              <div className="pb-14 pl-4 md:max-w-[65rem] md:pb-28 md:pl-0">
                <h2 className="mb-8 mt-7 font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
                  Research team
                </h2>
                <ResearchTeam />
              </div>
            </div>
            <WavesGrey className="mb-[-0.25rem] block w-full bg-white" aria-hidden="true" />
            <div className="flex w-full flex-col bg-surface md:items-center">
              <div className="pb-14 pl-4 md:max-w-[65rem] md:pb-28 md:pl-0">
                <h2 className="mb-8 mt-7 font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
                  Advisors
                </h2>
                <AdvisorsTeam />
              </div>
            </div>
            <WavesWhite className="mb-[-0.25rem] block w-full" aria-hidden="true" />
            <div className="relative">
              <div className="flex w-full flex-col bg-background md:items-center">
                <div className="pb-14 pl-4 md:w-[65rem] md:pb-32 md:pl-0">
                  <h2 className="mb-8 mt-7 font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
                    Our investors
                  </h2>
                  <div className="relative z-10 flex items-center space-x-16 overflow-x-auto">
                    <img src={images.drapper} alt="drapper" width="150" aria-hidden="true" />
                    <img src={images.oneMind} alt="one mind" width="100" aria-hidden="true" />
                    <img src={images.gragecap} alt="grace cap" width="160" aria-hidden="true" />
                    <img src={images.royal} alt="royal" width="231" aria-hidden="true" />
                    <p className="sr-only">Drapper associates</p>
                    <p className="sr-only">Drapper one mind</p>
                    <p className="sr-only">Drapper grace cap</p>
                    <p className="sr-only">Drapper royal</p>
                  </div>
                </div>
              </div>
              <img
                className="absolute right-0 top-0 z-0 hidden md:block"
                src={images.flowers}
                aria-hidden="true"
                alt=""
              />
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
    </div>
  );
}

function LeaderShip() {
  return (
    <div className="flex gap-x-6 gap-y-14 overflow-x-auto md:grid md:grid-cols-4 md:space-x-0">
      <Card
        link="https://www.linkedin.com/in/mackenziedrazan/"
        img={images.mack}
        name="Mackenzie Drazan"
        pos="CEO, Co-Founder"
        theme="dark"
      />
      <Card
        link="https://www.linkedin.com/in/gabriela-asturias/"
        img={images.gab}
        name="Gabriela Asturias"
        pos="COO, Co-Founder"
        theme="dark"
      />
      <Card
        link="https://www.linkedin.com/in/igor-nesterenko-34b00328/"
        img={images.igor}
        name="Igor Nesterenko"
        pos="Lead Software Engineer"
        theme="dark"
      />
      <Card
        link="https://www.linkedin.com/in/raissa-ahumada/"
        img={images.raissa}
        name="Raissa Ahumada"
        pos="Head of Customer Success"
        theme="dark"
      />
      <Card
        link="https://www.linkedin.com/in/annalisniak/"
        img={images.anna}
        name="Anna Lisniak"
        pos="Product Design Lead"
        theme="dark"
      />
      <Card
        link="https://www.linkedin.com/in/tdenysova/"
        img={images.tatiana}
        name="Tetiana Denysova"
        pos="Product Manager"
        theme="dark"
      />
    </div>
  );
}

function ResearchTeam() {
  return (
    <div className="flex space-x-6 overflow-x-auto">
      <Card
        link="https://childmind.org/bio/michael-p-milham-md-phd/"
        img={images.milham}
        name="Michael Milham, MD, PhD"
        pos="VP and Director of Research, Center for the Developing Brain at the Child Mind Institute"
        web
      />
      <Card
        link="https://mcgovern.mit.edu/profile/satrajit-ghosh/"
        img={images.satra}
        name="Satrajit Ghosh, PhD"
        pos="Principal Research Scientist, McGovern Institute, MIT"
        web
      />
      <Card
        link="https://childmind.org/bio/arno-klein-phd/"
        img={images.klein}
        name="Arno Klein, PhD"
        pos="Director of Innovative Technologies, Center for the Developing Brain at the Child Mind Institute"
        web
      />
      <Card
        link="https://childmind.org/bio/bennett-leventhal-md/"
        img={images.bannet}
        name="Bennett Leventhal, MD"
        pos="Member, Scientific Research Council at the Child Mind Institute"
        web
      />
    </div>
  );
}

function AdvisorsTeam() {
  return (
    <div className="flex space-x-6 overflow-x-auto">
      <Card
        link="https://en.wikipedia.org/wiki/Kafui_Dzirasa"
        img={images.kafui}
        name="Kaf Dzirasa, MD, PhD"
        pos="Associate Professor of Psychiatry and Behavioral Sciences, Neurobiology, and Neurosurgery at Duke University"
      />
      <Card
        link="https://www.linkedin.com/in/garen-staglin/"
        img={images.geren}
        name="Garen Staglin"
        pos="Chairman and Founder, One Mind Institute and the Healthy Brains Global Initiative"
      />
      <Card
        link="https://www.linkedin.com/in/lisa-gersh-a107a534/"
        img={images.lisa}
        name="Lisa Gersh"
        pos="Former CEO Martha Stewart, Goop and Alexander Wang. Board Member Hasbro and Moneylion"
      />
      <Card
        link="https://www.linkedin.com/in/ken-drazan-0529924/"
        img={images.ken}
        name="Ken Drazan, MD"
        pos="Chairman, CEO, Co-Founder at ArsenalBio. Board of Directors Member of Innovation Council at University of California"
      />
    </div>
  );
}

function Card({ link, img, name, pos, theme, web }) {
  return (
    <div className="block min-w-[15rem] text-background md:w-[15rem]">
      <div className="relative">
        <img className="h-[238px] w-[238px] rounded-[30px]" src={img} alt={name} />
        <p className="sr-only">{name}</p>
        <a target="_blank" href={link} rel="noreferrer">
          <img
            className="absolute bottom-5 left-5 h-6 w-6 cursor-pointer"
            src={web ? images.web : images.linkedin}
            alt="link"
            aria-hidden="true"
          />
        </a>
      </div>
      <p
        className={`mt-3 text-center text-xl font-bold ${
          theme === 'dark' ? 'text-inverted' : 'text-p-100'
        }`}
      >
        {name}
      </p>
      <p
        className={`text-normal mt-2 text-center ${
          theme === 'dark' ? 'text-p-10' : 'text-regular'
        }`}
      >
        {pos}
      </p>
    </div>
  );
}

Card.propTypes = {
  link: PropTypes.string,
  img: PropTypes.string,
  name: PropTypes.string,
  pos: PropTypes.string,
  theme: PropTypes.string,
  web: PropTypes.bool,
};
