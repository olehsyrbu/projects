import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/modules/auth';
import { useUserRedirect } from '@/modules/auth/hooks';

export function AppRedirect() {
  let { user } = useAuthContext();
  let newAccountLocation = useUserRedirect();

  if (!user) return null;

  let redirect = <Navigate to={newAccountLocation} replace />;

  return (
    <Routes>
      <Route path="provider" element={redirect} />
      <Route path="referral-coordinator" element={redirect} />
      <Route path="team-member" element={redirect} />
      <Route path="group-practice-admin" element={redirect} />
    </Routes>
  );
}
