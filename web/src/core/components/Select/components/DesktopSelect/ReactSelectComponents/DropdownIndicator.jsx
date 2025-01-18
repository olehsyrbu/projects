import cn from 'classnames';
import cx from '../../../Select.module.css';
import DropdownArrow from '@/images/Shared/DropdownArrow.svg';

export function DropdownIndicator() {
  return (
    <div className={cn(cx.dropdownIndicator)}>
      <img src={DropdownArrow} alt="" />
    </div>
  );
}
