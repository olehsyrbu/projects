export function EmergencyMessage() {
  return (
    <div className="sticky bottom-0 bg-p-100 p-4 md:p-5">
      <p className="pr-[44px] text-left text-sm font-medium leading-relaxed text-inverted md:pr-0 md:text-center md:text-base md:leading-tight">
        If you are at risk of harming yourself or others, or experiencing a mental health crisis,
        call{' '}
        <a
          className="inline-block rounded-xl bg-p-140 px-2 pt-0.5 leading-[1.3] text-inverted hover:text-inverted"
          href={`tel:988`}
        >
          988.
        </a>{' '}
        For emergencies, call{' '}
        <a
          className="inline-block rounded-xl bg-p-140 px-2 pt-0.5 leading-[1.3] text-inverted hover:text-inverted"
          href={`sms:911&body=HOME`}
        >
          911.
        </a>
      </p>
    </div>
  );
}
