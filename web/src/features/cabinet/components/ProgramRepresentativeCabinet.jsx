import { NavLink, Route, Routes, useParams } from 'react-router-dom';
import { ROLE_NAMES } from '@/core/definitions';
import { Cabinet } from '@/modules/app-shell/Cabinet';
import { PrivateRoute } from '@/modules/auth/components';
import { ProgramList } from '@/features/program';
import { ProgramEdit } from '@/features/profile-edit';
import { ProgramPublishing } from '@/features/program-publishing/ProgramPublishing';

export function ProgramRepresentativeCabinet() {
  return (
    <Cabinet
      navigation={
        <>
          <NavLink to="/program/resources">My resources</NavLink>
        </>
      }
    >
      <PrivateRoute role={ROLE_NAMES.PROGRAM} fallback="/program">
        <Routes>
          <Route index element={<ProgramList />} />
          <Route path="edit/:programId/*" element={<ProgramEditCabinet />} />
          <Route path="publish/:programId/*" element={<ProgramPublishing />} />
        </Routes>
      </PrivateRoute>
    </Cabinet>
  );
}

function ProgramEditCabinet() {
  const params = useParams();
  return <ProgramEdit id={params.programId} />;
}
