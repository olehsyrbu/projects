import { Link } from 'react-router-dom';

export function SubFooter() {
  return (
    <aside className="bg-banner-get-matched px-4 py-8 text-center md:py-10">
      <h2 className="mb-4 font-serif text-2xl text-white max-md:whitespace-pre md:mb-6 md:text-3xl">
        Need help looking{'\n'}for the right care?
      </h2>

      <Link
        to="/guided-search"
        className="inline-block rounded-lg bg-white px-8 py-3 font-medium text-p-100"
      >
        Get matched
      </Link>
    </aside>
  );
}
