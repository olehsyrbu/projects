import { loginHandler } from './loginHandler';
import { meAsRcHandler } from './meHandler';
import { pingHandler } from './pingHandler';
import {
  batchDeleteInvitationHandler,
  createInvitationsHandler,
  teamMemberInvitationHandler,
} from './invitationHandlers';
import { organizationBySubDomainHandler } from './organizationHandlers';
import { updateUserHandler } from './userHandlers';
import { registrationHandler } from './registrationHandler';
import {
  listTeamNotesHandler,
  createTeamNoteHandler,
  deleteTeamNoteHandler,
  deleteAllTeamNoteHandler,
} from '@/tools/test-server/handlers/teamNotesHandler';

export const handlers = [
  loginHandler,
  meAsRcHandler,
  pingHandler,
  teamMemberInvitationHandler,
  organizationBySubDomainHandler,
  createInvitationsHandler,
  batchDeleteInvitationHandler,
  updateUserHandler,
  registrationHandler,
  listTeamNotesHandler,
  createTeamNoteHandler,
  deleteTeamNoteHandler,
  deleteAllTeamNoteHandler,
];
