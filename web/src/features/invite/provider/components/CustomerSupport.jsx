import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { TextArea, TextField } from '@/modules/form';
import { toast } from '@/core/components/Toast';
import { sentSupportEmail } from '@/core/api/InvitationAPI';
import { pickBy, snakeCase } from 'lodash-es';
import { useOrganization } from '@/modules/organization';
import { Alert } from '@/core/components';
import { Checkmark20Filled as Checkmark } from '@fluentui/react-icons';
import { useEffect, useState } from 'react';

export function CustomerSupport() {
  const organization = useOrganization();
  const [showSuccess, setShowSuccess] = useState(false);

  let { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(
      object({
        name: string().required('This field is required'),
        message: string().required('This field is required'),
        email: string().email('Please enter an email address').required('This field is required'),
      }),
    ),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  async function submitForm(data) {
    try {
      const response = await sentSupportEmail(
        snakeCase(organization?.name ?? ''),
        pickBy(data, Boolean),
      );
      if (response.status >= 400) {
        toast.warning('Error sending email');
        return;
      }
      reset();
      setShowSuccess(true);
    } catch (error) {
      toast.warning('Error sending email');
    }
  }

  useEffect(() => {
    let timer;

    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [showSuccess]);

  return (
    <div className="flex w-full flex-col items-center ">
      <div className="mx-9 pb-14 md:mx-0 md:min-w-[65rem] md:pb-28">
        <h2 className="mb-8 mt-7 text-center font-serif text-2xl font-bold md:mb-10 md:mt-12 md:text-left md:text-3xl">
          Contact our team
        </h2>
        <div className="mt-8 flex flex-col md:mt-10 md:flex-row">
          <div className="space-y-4 text-xl font-normal md:w-[26rem]">
            <p>
              We recognize that providers are essential to helping people heal, and we are willing
              to work with you to make the experience of joining our community as seamless as
              possible.
            </p>
            <p>We want to hear from you!</p>
          </div>

          <form onSubmit={handleSubmit(submitForm)}>
            <div className="mt-6 space-y-4 md:ml-24 md:mt-0 md:w-[25.75rem]">
              <TextField label="Your name" name="name" control={control} />
              <TextField label="Your e-mail" type="email" name="email" control={control} />
              <TextArea
                name="message"
                control={control}
                placeholder="Your message here"
                minRows={5}
                maxRows={7}
              />
              {showSuccess ? (
                <div className="mt-6 text-sm ">
                  <Alert
                    className="bg-green-100"
                    text={
                      <p>
                        <span className="font-bold">Your message was sent!</span> Someone from our
                        support team will reply to your message within 24 hours
                      </p>
                    }
                    iconClassesName="text-[#02a3ab]"
                    icon={<Checkmark />}
                  />
                </div>
              ) : (
                <button
                  className="mir-button primary !mt-6 w-full rounded-3xl md:w-fit"
                  onClick={handleSubmit(submitForm)}
                  aria-label="Send your message"
                >
                  Send your message
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
