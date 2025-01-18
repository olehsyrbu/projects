import { useState } from 'react';
import mixpanel from '@/core/mixpanel';
import { useNavigate } from 'react-router-dom';
import { useProgram } from '@/core/api/ProgramQueries';
import { useProgramDraft } from '@/core/api/ProgramDraftQueries';
import { useAuthContext } from '@/modules/auth';
import { OnboardingTypeSurvey } from './OnboardingTypeSurvey';
import { SingleProgramSurvey } from './SingleProgramSurvey';
import { MultipleProgramSurvey } from './MultipleProgramSurvey';

export function ProgramCreationSurvey() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const draft = useProgramDraft();

  const [programId, setProgramId] = useState(() => {
    let count = user.ownership?.length;
    if (count > 1) {
      return;
    } else if (count === 1 && user.ownership[0].status === 'COMPLETED') {
      return;
    }

    return user.ownership.find((p) => p.id !== draft?.program?.id)?.id;
  });

  const program = useProgram(programId);

  const [type, setType] = useState(() => {
    if (draft && program) {
      return program.updatedAt > draft.updatedAt ? 'single' : 'multiple';
    }
    if (program) return 'single';
    if (draft) return 'multiple';
    return null;
  });

  async function handleFinish() {
    navigate('/program/resources');
  }

  function handleType(type) {
    mixpanel.track('Number of organizations step', { type });
    setType(type);
  }

  if (type === 'single') {
    return (
      <SingleProgramSurvey
        program={program}
        onProgramCreate={({ id }) => setProgramId(id)}
        onExitBack={() => setType(null)}
        onFinish={handleFinish}
      />
    );
  }

  if (type === 'multiple') {
    return (
      <MultipleProgramSurvey draft={draft} onReturn={() => setType(null)} onFinish={handleFinish} />
    );
  }

  return <OnboardingTypeSurvey onSubmit={handleType} />;
}
