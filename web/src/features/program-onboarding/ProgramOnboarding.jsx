import { Header } from '@/modules/app-shell';
import { ProgramCreationSurvey } from '@/modules/program/survey';
import { useAuthContext } from '@/modules/auth';
import { useOrganizationTheme, OrganizationTypes } from '@/modules/organization';

export default function ProgramOnboarding() {
  let { user } = useAuthContext();

  useOrganizationTheme({
    enableFor: [OrganizationTypes.Insurance],
  });

  return (
    <main className="grid min-h-screen grid-rows-[auto_1fr] bg-surface">
      <Header login={!user.onboarding} />
      <ProgramCreationSurvey />
    </main>
  );
}
