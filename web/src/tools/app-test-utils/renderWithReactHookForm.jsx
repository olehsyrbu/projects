import { FormProvider, useForm } from 'react-hook-form';
import { render } from '@/tools/app-test-utils';
import PropTypes from 'prop-types';

/**
 * Testing Library utility function to wrap tested component in React Hook Form
 * @param {ReactElement} ui A React component
 * @param objectParameters
 * @param {Object} objectParameters.defaultValues Initial form values to pass into
 * React Hook Form, which you can then assert against
 */
export function renderWithReactHookForm(ui, { defaultValues = {} } = {}) {
  // eslint-disable-next-line react/function-component-definition
  const Wrapper = ({ children }) => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  Wrapper.propTypes = {
    children: PropTypes.node,
  };

  return {
    ...render(ui, { wrapper: Wrapper }),
  };
}
