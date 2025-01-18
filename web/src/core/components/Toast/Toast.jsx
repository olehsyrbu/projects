import classNames from 'classnames';
import { ToastContainer as ToastContainerAPI, toast as toastAPI } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styleType = {
  success: '!bg-green-100 !text-green-700',
  warning: '!bg-red-100 !text-red-700',
  primary: '!bg-graphics-30 !text-heading',
};

const showNotification = (type, content) =>
  toastAPI(content, {
    className: classNames('!rounded-lg !font-sans', styleType[type]),
  });

export const toast = {
  success: (content) => showNotification('success', content),
  warning: (content) => showNotification('warning', content),
  primary: (content) => showNotification('primary', content),
};

export function ToastContainer(props) {
  return (
    <ToastContainerAPI
      position={toastAPI.POSITION.TOP_RIGHT}
      hideProgressBar
      autoClose={5000}
      closeOnClick={false}
      closeButton={false}
      {...props}
    />
  );
}
