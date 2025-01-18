import { ToastContainer, toast } from '.';

export default {
  title: 'Components/Toast',
};

const message = 'Confirmation text';

export function Toast() {
  return (
    <>
      <div className="mt-4">
        <button className="mir-button" onClick={() => toast.success(message)}>
          Open success
        </button>
      </div>
      <div className="mt-4">
        <button className="mir-button" onClick={() => toast.warning(message)}>
          Open warning
        </button>
      </div>
      <div className="mt-4">
        <button className="mir-button" onClick={() => toast.primary(message)}>
          Open primary
        </button>
      </div>

      <ToastContainer />
    </>
  );
}

Toast.storyName = 'Toast';
