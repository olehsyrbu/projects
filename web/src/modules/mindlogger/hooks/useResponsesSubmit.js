import { useCallback } from 'react';
import { isNull, isString } from 'lodash-es';
import { logger } from '@/core/logger';
import Api from '@/modules/mindlogger/api';
import { useAppletContext } from './useAppletContext';

export function useResponsesSubmit(activity) {
  const { applet } = useAppletContext();

  return useCallback(
    (responses) => {
      const screenIndex = 0;
      const nextsAt = {
        [screenIndex]: Date.now() + 600,
      };

      // workaround for not consistent responses format
      responses = responses.map((res) => {
        if (!isString(res) && !isNull(res)) {
          return { value: res };
        }
        return res;
      });

      logger.info({ responses, message: 'before send and encoding' });

      return Api.Applets.submitResponse({
        applet,
        activity,
        publicId: applet.publicId,
        startedAt: Date.now(),
        completedAt: Date.now() + 300,
        responses,
        nextsAt,
      });
    },
    [applet, activity],
  );
}
