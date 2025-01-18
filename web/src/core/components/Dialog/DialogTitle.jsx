import { Heading } from 'react-aria-components';

export function DialogTitle(props) {
  return (
    <Heading
      {...props}
      className="col-[1/2] row-[1/2] py-4 font-sans text-2xl font-bold sm:pb-2 sm:pt-6 sm:font-serif"
    />
  );
}
