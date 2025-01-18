import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isArray } from 'lodash-es';

import mixpanel from '@/core/mixpanel';
import { logger } from '@/core/logger';
import { toast, ToastContainer } from '@/core/components/Toast';
import { useCloneProgram, useDeleteMyPrograms, useUpdateProgram } from '@/core/api/ProgramQueries';
import { Actions, Content, Heading, Page } from '@/modules/app-shell';
import { usePrograms } from './usePrograms';
import { ProgramCard } from './ProgramCard';
import { DeactivateDialog } from './DeactivateDialog';
import { CloneProgramDialog } from './CloneProgramDialog';

export function ProgramList() {
  const { data: programs, mutate } = usePrograms();
  const remove = useDeleteMyPrograms();
  const update = useUpdateProgram();
  const [stateProgram, setStateProgram] = useState({ showDeactivateDialog: false });

  const navigate = useNavigate();
  const cloneProgram = useCloneProgram();
  const [showAddProgramDialog, setShowAddProgramDialog] = useState(false);

  async function handleEdit(id) {
    navigate(`/program/resources/edit/${id}`);
  }

  async function handlePublish(id) {
    mixpanel.track('Proceed to publish', { id });
    navigate(`/program/resources/publish/${id}`);
  }

  async function handleRemove(id) {
    try {
      mutate((ps) => ps.filter((p) => p.id !== id), false);
      await remove(id);

      mixpanel.track('Remove program', { id });
    } catch (error) {
      logger.error(error);
    }
  }

  async function handleShowDeactivateDialog(id) {
    setStateProgram({ showDeactivateDialog: true, id });
  }

  function handleCloseDeactivateDialog() {
    setStateProgram({ showDeactivateDialog: false });
  }

  async function handleDeactivate() {
    try {
      const { id } = stateProgram;

      await update(id, { active: false });
      mutate((ps) => ps.map((p) => (p.id === id ? { ...p, active: false } : p)), false);
      mixpanel.track('Deactivate program', { id });
    } catch (error) {
      logger.error(error);
    }
    handleCloseDeactivateDialog();
  }

  async function handleActivate(id) {
    await update(id, { active: true });
    mutate((ps) => ps.map((p) => (p.id === id ? { ...p, active: true } : p)), false);
    mixpanel.track('Activate program', { id });
  }

  let urlPath = '/program/onboarding';

  async function handleCloneProgram(selectedProgram) {
    try {
      if (selectedProgram && selectedProgram.id) {
        const newProgram = await cloneProgram(selectedProgram.id);
        urlPath = `/program/resources/publish/${newProgram.id}/`;
        mixpanel.track('Number of organizations step', { type: 'single' });
      }

      navigate(urlPath);
      mixpanel.track('Add program');
    } catch (e) {
      toast.warning("Can't copy program, contact our support");
    }
    setShowAddProgramDialog(false);
  }

  return (
    <Page style={{ paddingLeft: 0, paddingRight: 0 }}>
      <ToastContainer />
      {showAddProgramDialog && (
        <CloneProgramDialog
          onDismiss={() => setShowAddProgramDialog(false)}
          onAddProgram={handleCloneProgram}
          open={showAddProgramDialog}
        />
      )}
      <Heading className="px-4 md:px-0">
        <h1>My Resources</h1>
      </Heading>
      <DeactivateDialog
        type="PROGRAM"
        open={stateProgram.showDeactivateDialog}
        onDeactivate={handleDeactivate}
        onClose={handleCloseDeactivateDialog}
      />

      {programs.length > 0 && isArray(programs) ? (
        <>
          <Content>
            <article className="max-w-5xl">
              <h3 className="mb-3 ml-4 text-2xl font-bold md:ml-0">Programs</h3>
              <div className="md:space-y-6">
                {programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onEdit={handleEdit}
                    onPublish={handlePublish}
                    onRemove={handleRemove}
                    onDeactivate={handleShowDeactivateDialog}
                    onActivate={handleActivate}
                  />
                ))}
              </div>
            </article>
          </Content>
          <Actions>
            <button className="mir-button primary" onClick={() => setShowAddProgramDialog(true)}>
              Add program
            </button>
          </Actions>
        </>
      ) : (
        <Content surface>
          <h2 className="mb-2 text-2xl font-bold leading-9">Time to invite your resources!</h2>
          <p className="mb-6 text-base">
            Add programs one-by-one or add them all at once through multiple programs creation
            wizard
          </p>
          <button className="mir-button primary" onClick={() => navigate(urlPath)}>
            Add program
          </button>
        </Content>
      )}
    </Page>
  );
}
