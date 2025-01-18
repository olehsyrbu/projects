import PropTypes from 'prop-types';
import { Edit16Filled as Edit } from '@fluentui/react-icons';
import { noop } from '@/core/utils';

export function ActionsSubDetailsPending({ email, onChangeEmail }) {
  return (
    <div onClick={onChangeEmail} className="cursor-pointer">
      <span className="font-bold">Invitation email: </span>
      <span className="pl-1 font-light">{email}</span>
      <button className="mir-button text button-text-xs !md:ml-3 !md:pl-0 !ml-3 flex !pl-0 text-p-100">
        <Edit className="h-3 w-3" />
      </button>
    </div>
  );
}

ActionsSubDetailsPending.defaultProps = {
  email: '',
  onChangeEmail: noop,
};
ActionsSubDetailsPending.propTypes = {
  email: PropTypes.string,
  onChangeEmail: PropTypes.func,
};
