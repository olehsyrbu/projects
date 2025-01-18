import { Switch as AriaSwitch } from 'react-aria-components';
import cn from 'classnames';
import styles from './Switch.module.css';

export function Switch({ children, className, ...rest }) {
  return (
    <AriaSwitch {...rest} className={cn(styles.switch, className)}>
      <div className={styles.indicator} />
      {children ? <span>{children}</span> : null}
    </AriaSwitch>
  );
}
