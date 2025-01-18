import { useNavigate, useParams } from 'react-router-dom';
import { useProgram } from '@/core/api/ProgramQueries';
import { SingleProgramSurvey } from '@/modules/program/survey';

export function ProgramPublishing() {
  let navigate = useNavigate();
  let params = useParams();
  let program = useProgram(params.programId);

  return (
    <main className="grid min-h-full">
      <SingleProgramSurvey
        shouldRestart
        program={program}
        onExitBack={() => navigate('/program/resources')}
        onFinish={() => navigate('/program/resources')}
      />
    </main>
  );
}
