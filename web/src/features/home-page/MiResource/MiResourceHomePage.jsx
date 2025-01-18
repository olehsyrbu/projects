import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import mixpanel from '@/core/mixpanel';

import searchSectionFooterDarkLine from '@/images/HomePage-SearchSection-FooterLine-Dark.svg';
import searchSectionFooterLightLine from '@/images/HomePage-SearchSection-FooterLine-Light.svg';
import searchSectionLeftLeaves from '@/images/HomePage-SearchSection-LeftLeaves.svg';
import searchSectionRightLeaves from '@/images/HomePage-SearchSection-RightLeaves.svg';
import searchSectionSun from '@/images/HomePage-SearchSection-Sun.svg';
import searchSectionLeftLeavesMobile from '@/images/HomePage-SearchSection-LeftLeaves-mobile.svg';
import searchSectionRightLeavesMobile from '@/images/HomePage-SearchSection-RightLeaves-mobile.svg';
import workTypeSectionFirstCard from '@/images/HomePage-workTypeSection-FirstCart.svg';
import workTypeSectionSecondCard from '@/images/HomePage-workTypeSection-SecondCart.svg';
import workTypeSectionThirdsCard from '@/images/HomePage-workTypeSection-ThirdsCart.svg';
import workTypeSectionFooter from '@/images/HomePage-workTypeSection-footerLine.svg';
import visitTypeSectionFirstCard from '@/images/HomePage-VisitTypeSection-FirstCard.svg';
import visitTypeSectionSecondCard from '@/images/HomePage-VisitTypeSection-SecondCard.svg';
import visitTypeSectionThirdsCard from '@/images/HomePage-VisitTypeSection-ThirdsCard.svg';
import visitTypeSectionFourthCard from '@/images/HomePage-VisitTypeSection-FourthCard.svg';
import visitTypeSectionFooterLines from '@/images/HomePage-VisitTypeSection-FooterLines.svg';
import workInfoSectionFirstCard from '@/images/HomePage-WorkInfoSection-FirstCard.svg';
import workInfoSectionSecondCard from '@/images/HomePage-WorkInfoSection-SecondCard.svg';
import workInfoSectionThirdsCard from '@/images/HomePage-WorkInfoSection-ThirdsCard.svg';
import workInfoSectionFooterLineDark from '@/images/HomePage-WorkInfoSection-FooterLineDark.svg';
import workInfoSectionFooterLineLight from '@/images/HomePage-WorkInfoSection-FooterLineLight.svg';
import workInfoSectionLeftLeaf from '@/images/HomePage-WorkInfoSection-LeftLeaf.svg';
import workInfoSectionRightLeaf from '@/images/HomePage-WorkInfoSection-RightLeaf.svg';
import partnersSectionUniversity1 from '@/images/HomePage-PartnersSection-University1.svg';
import partnersSectionUniversity2 from '@/images/HomePage-PartnersSection-University2.svg';
import partnersSectionUniversity3 from '@/images/HomePage-PartnersSection-University3.svg';
import partnersSectionUniversity4 from '@/images/HomePage-PartnersSection-University4.png';
import searchSectionDarkBG from '@/images/HomePage-SearchSection-DarkBG.svg';

import { SearchBar } from '@/modules/search/components';
import Header from '@/modules/app-shell/HeaderWithLogin/Header';
import Footer from '@/modules/app-shell/Footer';
import { useMatchMedia, useScreen } from '@/core/hooks';
import { useFlag } from '@/core/feature-split';

import Card from './components/Card/Card';
import BorderCard from './components/BorderCard/BorderCard';

import config from '@/core/config';
import './MiResourceHomePage.css';
import 'swiper/css';

import { useOrganization } from '@/modules/organization';
import { OnDemandCaseManagementBlock } from './components/OnDemandCaseManagementBlock';
import { UkraineBanner } from '@/modules/support';
import { EmergencyBanner } from '../EmergencyBanner';
import { useProgramSearchFlag } from '@/modules/search/hooks';
import { Waves } from '@/modules/app-shell';

export function MiResourceHomePage({ onSearch }) {
  const screenSize993 = useMatchMedia('(max-width: 993px)');
  const isMediumScreen = useScreen('md');
  let organization = useOrganization();
  const enableStudyOnHomePage = useFlag('enable-study-on-home-page');
  const onDemandCaseManagement = useFlag('on-demand-case-management');
  const shouldShowMatchMe = onDemandCaseManagement && !organization?.id;

  const hasProgramsEnabled = useProgramSearchFlag();

  const handleMatchMe = (control) => {
    mixpanel.track('Demand Case Management', { control });
  };

  const handleLearningLink = (control) => {
    mixpanel.track('Open learning center link', { control });
  };

  return (
    <section className="HomePage">
      <UkraineBanner />
      <EmergencyBanner />

      <div className="home-page-content">
        <div className="header-layout">
          <Header>
            <div className="flex w-full justify-end">
              <a
                className="mr-8 font-medium"
                href={config.learningCenterUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleLearningLink('header')}
              >
                Learning center
              </a>
            </div>
          </Header>
        </div>
        <section className="search-section">
          <div className="background">
            <div className="relative-background">
              <img src={searchSectionLeftLeaves} className="left-leaves" alt="" />
              <img src={searchSectionRightLeaves} className="right-leaves" alt="" />
              <img src={searchSectionLeftLeavesMobile} className="left-leaves-mobile" alt="" />
              <img src={searchSectionRightLeavesMobile} className="right-leaves-mobile" alt="" />
              <img src={searchSectionSun} className="sun" alt="" />
              <div className="top-banner" />
              <div className="dark-background">
                <div />
              </div>
              <img src={searchSectionFooterDarkLine} className="footer-line-dark" alt="" />
              <img src={searchSectionFooterLightLine} className="footer-line-light" alt="" />
            </div>
          </div>
          <div className="section-layout">
            <p className="title">We have someone good in mind for every type of mind</p>
            <p className="subtitle">
              All the mental health care you’ll ever need, someone good and available for you.
            </p>

            <SearchBar
              onSubmit={onSearch}
              renderCategoryField={() =>
                shouldShowMatchMe ? (
                  <span className="relative inline-block">
                    <a
                      className="mir-button category-button"
                      href={config.onDemandCaseManagementUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleMatchMe('search')}
                    >
                      Match me
                    </a>
                    <span className="text-text-heading absolute right-5 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform rounded-lg bg-background px-2 py-1 text-xs leading-none">
                      NEW
                    </span>
                  </span>
                ) : null
              }
            />
            <div className="z-10 mt-6 flex w-full flex-col items-center text-xl md:ml-12 md:flex-row">
              <p className="">Not sure what you’re looking for?</p>
              <Link className="md:ml-2" to="/guided-search">
                Get matched
              </Link>
            </div>

            <div className="search-section-footer">
              {enableStudyOnHomePage?.publicId && (
                <Link className="mir-button light" to={`/study/${enableStudyOnHomePage?.publicId}`}>
                  Get matched
                </Link>
              )}
              {shouldShowMatchMe ? (
                <OnDemandCaseManagementBlock onMatchMe={handleMatchMe} />
              ) : (
                <>
                  <img
                    src={searchSectionDarkBG}
                    className="dark-bg w-screen max-w-none md:hidden"
                    alt=""
                  />

                  <div className="flex w-screen max-w-none flex-col bg-inherit text-xl text-inverted md:flex-row">
                    <div className="mx-6 mt-8 flex flex-col items-center md:mt-0 md:items-start">
                      <h3 className="mb-4 font-serif text-2xl font-bold md:mb-6 md:text-3xl">
                        Have any questions?
                      </h3>
                      <div className="flex flex-col items-center md:flex-row">
                        <p className="text-center text-base font-normal md:text-left md:text-2xl md:font-medium">
                          Browse our guide on how to use your insurance and what to expect.
                        </p>
                        <a
                          className="mir-button light mt-4 min-w-[12rem] md:ml-28 md:mr-11 md:mt-0"
                          href="https://www.learn.miresource.com"
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => handleLearningLink('button')}
                        >
                          Learning center
                        </a>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="work-type-section">
          <p className="title">How we work with you</p>
          {!isMediumScreen ? (
            <Swiper className="swiper" slidesPerView="auto" spaceBetween={44}>
              <SwiperSlide>
                <BorderCard
                  imageSrc={workTypeSectionFirstCard}
                  imageBackground="#FFC596"
                  title="First, we identify the right care"
                  description="We help you understand your needs and find the best services for you."
                />
              </SwiperSlide>
              <SwiperSlide>
                <BorderCard
                  imageSrc={workTypeSectionSecondCard}
                  imageBackground="#F2F9F2"
                  title="Then, we help you choose "
                  description="We guide you through each step, including understanding your payment options to creating a dialogue for your first call."
                />
              </SwiperSlide>
              <SwiperSlide>
                <BorderCard
                  imageSrc={workTypeSectionThirdsCard}
                  imageBackground="#F2F9F8"
                  title="Throughout each step, we’re here"
                  description="As your needs change, we help you find care throughout your therapeutic journey."
                />
              </SwiperSlide>
            </Swiper>
          ) : (
            <div className="card-wrapper">
              <Card
                imageSrc={workTypeSectionFirstCard}
                title="First, we identify the right care"
                description="We help you understand your needs and find the best services for you."
              />
              <Card
                imageSrc={workTypeSectionSecondCard}
                title="Then, we help you choose "
                description="We guide you through each step, including understanding your payment options to creating a dialogue for your first call."
              />
              <Card
                imageSrc={workTypeSectionThirdsCard}
                title="Throughout each step, we’re here"
                description="As your needs change, we help you find care throughout your therapeutic journey."
              />
            </div>
          )}
          <img src={workTypeSectionFooter} className="footer-lines" alt="" />
        </section>
        <section className="visit-type-section">
          <p className="title">We put together the best options to help you feel better</p>
          <p className="subtitle">Your needs, your price, your setting—it’s all here </p>
          {screenSize993 ? (
            <Swiper className="swiper swiper-small-cards" slidesPerView="auto" spaceBetween={24}>
              <SwiperSlide>
                <BorderCard
                  imageSrc={visitTypeSectionSecondCard}
                  imageBackground="#FFC596"
                  title="Providers"
                  description="One-on-one talk therapy, psychotherapy, or medication management."
                />
              </SwiperSlide>
              <SwiperSlide>
                <BorderCard
                  imageSrc={visitTypeSectionFirstCard}
                  imageBackground="#F2F9F8"
                  title="Remote care"
                  description="All the care options available and convenient for you wherever you are."
                />
              </SwiperSlide>
              <SwiperSlide>
                <BorderCard
                  imageSrc={visitTypeSectionFourthCard}
                  imageBackground="#FFC596"
                  comingSoon={!hasProgramsEnabled}
                  title="Treatment Centers"
                  description="Places with intensive outpatient (IOP), partial hospitalization (PHP), and inpatient programs."
                />
              </SwiperSlide>
              <SwiperSlide>
                <BorderCard
                  imageSrc={visitTypeSectionThirdsCard}
                  imageBackground="#F2F9F2"
                  comingSoon={true}
                  title="Group Therapy"
                  description="A group of people guided by a therapist for counseling and support."
                />
              </SwiperSlide>
            </Swiper>
          ) : (
            <div className="card-wrapper">
              <BorderCard
                imageSrc={visitTypeSectionSecondCard}
                imageBackground="#FFC596"
                title="Providers"
                description="One-on-one talk therapy, psychotherapy, or medication management."
              />
              <BorderCard
                imageSrc={visitTypeSectionFirstCard}
                imageBackground="#F2F9F8"
                title="Remote care"
                description="All the care options available and convenient for you wherever you are."
              />
              <BorderCard
                imageSrc={visitTypeSectionFourthCard}
                imageBackground="#FFC596"
                comingSoon={!hasProgramsEnabled}
                title="Treatment Centers"
                description="Places with intensive outpatient (IOP), partial hospitalization (PHP), and inpatient programs."
              />
              <BorderCard
                imageSrc={visitTypeSectionThirdsCard}
                imageBackground="#F2F9F2"
                comingSoon={true}
                title="Group Therapy"
                description="A group of people guided by a therapist for counseling and support."
              />
            </div>
          )}
          <img src={visitTypeSectionFooterLines} className="footer-lines" alt="" />
        </section>
        <section className="work-info-section">
          <p className="title">
            We do all the work to vet options so you can focus on working on yourself.
          </p>
          <div className="section-layout">
            <div className="card-wrapper">
              <Card
                description="Invite and referral only network"
                imageSrc={workInfoSectionFirstCard}
              />
              <Card
                description="Deep vetting by local experts"
                imageSrc={workInfoSectionSecondCard}
              />
              <Card description="Up-to-date availability" imageSrc={workInfoSectionThirdsCard} />
            </div>
          </div>
          <div className="background">
            <div className="relative-background">
              <div className="line-wrapper">
                <img src={workInfoSectionFooterLineDark} className="footer-line-dark" alt="" />
                <img src={workInfoSectionFooterLineLight} className="footer-line-light" alt="" />
              </div>
              <img src={workInfoSectionLeftLeaf} className="left-leave" alt="" />
              <img src={workInfoSectionRightLeaf} className="right-leave" alt="" />
            </div>
          </div>
        </section>
        <section className="partners-section">
          <div className="section-layout">
            <p className="title">
              Partnered with 50 university and college counseling centers to source the best mental
              health providers
            </p>
            <div className="university-wrapper md:space-x-12">
              <img src={partnersSectionUniversity1} alt="" />
              <img src={partnersSectionUniversity2} alt="" />
              <img src={partnersSectionUniversity3} alt="" />
              <img src={partnersSectionUniversity4} alt="" width="272" height="88" />
            </div>
          </div>
          <div className="max-h-4 md:max-h-24">
            <Waves aria-hidden="true" width={isMediumScreen ? 2560 : 700} />
          </div>
        </section>
        <Footer />
      </div>
    </section>
  );
}

MiResourceHomePage.propTypes = {
  onSearch: PropTypes.func.isRequired,
};
