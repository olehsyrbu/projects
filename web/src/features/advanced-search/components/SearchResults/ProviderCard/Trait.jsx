import cn from 'classnames';

export function Trait({ Icon, children, gap = true }) {
  return (
    <div className="flex text-xs">
      <Icon className={cn('mt-px flex-none', { 'mr-1 ': gap })} />
      <span className="text-n-120">{children}</span>
    </div>
  );
}
