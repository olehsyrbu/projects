import PropTypes from 'prop-types';

export function HelpDesk() {
  return (
    <div className="flex w-full flex-col items-center bg-background">
      <div className="mx-9 pb-14 md:mx-0 md:w-[65rem] md:pb-28">
        <h2 className="mb-8 mt-7 text-center font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
          Help desk articles
        </h2>
        <ul className="mt-8 list-disc space-y-6 font-bold text-p-100 md:columns-2 md:space-y-0 md:pl-4">
          <LinkItem
            title="How do I create a profile?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4403073094801-How-do-I-create-a-profile-"
          />
          <LinkItem
            title="What should I do if my invitation link doesn’t work?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4403073179793-What-should-I-do-if-my-invitation-link-doesn-t-work-"
          />
          <LinkItem
            title="What if I don’t have time to complete my entire profile in one sitting?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4403378560401-What-if-I-don-t-have-time-to-complete-my-entire-profile-at-one-time-"
          />
          <LinkItem
            title="What do I do if I forget my username or password?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4403385352465-What-do-I-do-if-I-forgot-my-username-or-password-"
          />
          <LinkItem
            title="What if I am uncomfortable treating certain conditions?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4403069360401-What-if-I-am-uncomfortable-treating-certain-conditions-"
          />
          <LinkItem
            title="Which contact information (email, phone, online scheduler) is visible on my profile?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4405090077457-Which-of-my-contact-info-would-be-visible-on-the-platform-"
          />
          <LinkItem
            title="Do I have to receive payments from my clients/patients through your platform?"
            url="https://miresource.zendesk.com/hc/en-us/articles/4403187850001-Do-I-have-to-receive-payments-from-my-clients-patients-through-your-platform-"
          />
        </ul>
        <p className="mt-8">
          Looking for more information? Check our Help Center{' '}
          <a
            target="_blank"
            href="https://miresource.zendesk.com/hc/en-us/categories/4403073047313-MiResource-for-Providers"
            rel="noreferrer"
            className="font-bold"
          >
            here.
          </a>
        </p>
      </div>
    </div>
  );
}

function LinkItem({ title, url }) {
  return (
    <li className="md:w-[30rem]">
      <a target="_blank" href={url} rel="noreferrer">
        {title}
      </a>
    </li>
  );
}
LinkItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};
