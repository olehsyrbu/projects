import {
  Checkmark16Regular as CheckmarkRegular,
  Checkmark16Filled as CheckmarkFilled,
} from '@fluentui/react-icons';

export function PasswordStrength({ password }) {
  return (
    <div className="space-y-1 rounded-lg bg-p-10 px-3 py-2 text-xs text-hint">
      <Rule valid={/[A-Z]/.test(password)}>One uppercase letter</Rule>
      <Rule valid={/[a-z]/.test(password)}>One lowercase letter</Rule>
      <Rule valid={/\d/.test(password)}>One number</Rule>
      <Rule valid={password?.length >= 8}>8 characters min</Rule>
    </div>
  );
}

function Rule({ children, valid }) {
  return (
    <div>
      {valid ? (
        <CheckmarkFilled className="text-p-100" />
      ) : (
        <CheckmarkRegular className="text-p-40" />
      )}
      <span className="ml-2">{children}</span>
    </div>
  );
}
