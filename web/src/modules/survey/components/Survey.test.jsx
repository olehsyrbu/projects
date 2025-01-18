import { Survey } from './Survey';
import { SurveyStep } from './SurveyStep';
import { useSurvey } from '../hooks';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function Step({ id }) {
  let survey = useSurvey();
  return (
    <article data-testid={id}>
      <span>Step: {survey.step}</span>
      <span>Total steps: {survey.totalSteps}</span>
      <button onClick={survey.navigatePrev}>Prev</button>
      <button onClick={survey.navigateNext}>Next</button>
      <button onClick={() => survey.navigate(2)}>Next by 2</button>
    </article>
  );
}

function SurveyComponent({ initialStep, onLeave = () => {} }) {
  return (
    <MemoryRouter>
      <Survey initialStep={initialStep} onLeave={onLeave}>
        <SurveyStep element={<Step id="step-1" />} />
        <SurveyStep element={<Step id="step-2" />} />
        <SurveyStep element={<Step id="step-3" />} />
        <SurveyStep element={<Step id="step-4" />} />
      </Survey>
    </MemoryRouter>
  );
}

describe('at the first render', () => {
  it('renders first step by default', () => {
    render(<SurveyComponent />);
    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });

  it('renders step set by initialStep', () => {
    render(<SurveyComponent initialStep={2} />);
    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });

  it('totalSteps value is correct', () => {
    render(<SurveyComponent />);
    expect(screen.getByText('Total steps: 4')).toBeInTheDocument();
  });

  it("can render with 'null' children", () => {
    render(
      <MemoryRouter>
        <Survey initialStep={2}>
          <SurveyStep element={<Step id="step-1" />} />
          {null}
          <SurveyStep element={<Step id="step-2" />} />
        </Survey>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });

  it('render steps with loop', () => {
    const steps = ['step-1', 'step-2', 'step-3'];

    render(
      <MemoryRouter>
        <Survey initialStep={2}>
          {steps.map((s) => (
            <SurveyStep key={s} element={<Step id={s} />} />
          ))}
        </Survey>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });
});

describe('on navigate() call', () => {
  it('renders next page with delta', async () => {
    render(<SurveyComponent />);

    expect(screen.getByTestId('step-1')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[2];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-3')).toBeInTheDocument();
  });

  it('changes location', async () => {
    render(<SurveyComponent />);

    expect(screen.getByTestId('step-1')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[2];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-3')).toBeInTheDocument();
  });

  it('calls leave handler on last step after navigate next', async () => {
    const handleLeave = vi.fn();
    render(<SurveyComponent initialStep={4} onLeave={handleLeave} />);

    expect(screen.getByTestId('step-4')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[2];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-4')).toBeInTheDocument();

    expect(handleLeave).toHaveBeenCalledTimes(1);
    expect(handleLeave).toHaveBeenCalledWith(4);
  });
});

describe('on navigateNext() call', () => {
  it('renders next page', async () => {
    const handleLeave = vi.fn();
    render(<SurveyComponent onLeave={handleLeave} />);

    expect(screen.getByTestId('step-1')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
    expect(handleLeave).not.toHaveBeenCalled();
  });

  it('changes location', async () => {
    render(<SurveyComponent />);

    expect(screen.getByTestId('step-1')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });

  it('does nothing on last step', async () => {
    render(<SurveyComponent initialStep={4} />);

    expect(screen.getByTestId('step-4')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-4')).toBeInTheDocument();
  });
});

describe('on navigatePrev() call', () => {
  it('renders prevoius page', async () => {
    render(<SurveyComponent initialStep={3} />);

    expect(screen.getByTestId('step-3')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[0];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });

  it('changes location', async () => {
    render(<SurveyComponent initialStep={3} />);

    expect(screen.getByTestId('step-3')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[0];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-2')).toBeInTheDocument();
  });

  it('does nothing on first step', async () => {
    render(<SurveyComponent />);

    expect(screen.getByTestId('step-1')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[0];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('step-1')).toBeInTheDocument();
  });
});

describe('leave handler', () => {
  it('calls leave handler on first step after navigate back', async () => {
    const handleLeave = vi.fn();
    render(<SurveyComponent initialStep={1} onLeave={handleLeave} />);

    let backButton = screen.getAllByRole('button')[0];
    await userEvent.click(backButton);

    expect(handleLeave).toHaveBeenCalledTimes(1);
    expect(handleLeave).toHaveBeenCalledWith(1);
  });
});

function NestedSurvey({ initialStepLevel1, initialStepLevel2, onLeave } = {}) {
  return (
    <MemoryRouter>
      <Survey initialStep={initialStepLevel1}>
        <SurveyStep element={<Step id="level-1/step-1" />} />
        <SurveyStep
          element={
            <Survey initialStep={initialStepLevel2} onLeave={onLeave}>
              <SurveyStep element={<Step id="level-2/step-1" />} />
              <SurveyStep element={<Step id="level-2/step-2" />} />
              <SurveyStep element={<Step id="level-2/step-3" />} />
            </Survey>
          }
        />
        <SurveyStep element={<Step id="level-1/step-3" />} />
      </Survey>
    </MemoryRouter>
  );
}

describe('nested rendering', () => {
  it('render nested hierarchy with two levels on unit', async () => {
    render(<NestedSurvey initialStepLevel1={2} initialStepLevel2={1} />);
    await waitFor(() => {
      expect(screen.getByTestId('level-2/step-1')).toBeInTheDocument();
    });
  });

  it('goes over all steps with nested structure', async () => {
    render(<NestedSurvey />);

    expect(screen.getByTestId('level-1/step-1')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('level-2/step-1')).toBeInTheDocument();

    nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('level-2/step-2')).toBeInTheDocument();

    nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('level-2/step-3')).toBeInTheDocument();

    nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(screen.getByTestId('level-1/step-3')).toBeInTheDocument();
  });

  it('calls onLeave for next navigation', async () => {
    const handleOnLeave = vi.fn();

    render(<NestedSurvey initialStepLevel1={2} initialStepLevel2={3} onLeave={handleOnLeave} />);

    expect(screen.getByTestId('level-2/step-3')).toBeInTheDocument();

    let nextButton = screen.getAllByRole('button')[1];
    await userEvent.click(nextButton);

    expect(handleOnLeave).toHaveBeenCalledTimes(1);
    expect(handleOnLeave).toHaveBeenCalledWith(3);
    expect(screen.getByTestId('level-2/step-3')).toBeInTheDocument();
  });

  it('calls parent prev navigation when goes back from first nested screen', async () => {
    render(<NestedSurvey initialStepLevel1={2} initialStepLevel2={1} />);

    expect(screen.getByTestId('level-2/step-1')).toBeInTheDocument();

    let backButton = screen.getAllByRole('button')[0];
    await userEvent.click(backButton);

    expect(screen.getByTestId('level-1/step-1')).toBeInTheDocument();
  });

  it('calls custom onLeave when go back', async () => {
    const handleOnLeave = vi.fn();
    render(<NestedSurvey initialStepLevel1={2} initialStepLevel2={1} onLeave={handleOnLeave} />);

    expect(screen.getByTestId('level-2/step-1')).toBeInTheDocument();

    let backButton = screen.getAllByRole('button')[0];
    await userEvent.click(backButton);

    expect(handleOnLeave).toHaveBeenCalledWith(1);
    expect(handleOnLeave).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('level-2/step-1')).toBeInTheDocument();
  });
});
