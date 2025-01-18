import useSWR from 'swr';
import { fetchTimezones } from './TimezonesAPI';
import { logger } from '@/core/logger';

export function useTimezoneCode() {
  const { getDefaultTimeZone, timezones } = useTimezones();

  const defaultTimeZone = getDefaultTimeZone();
  const timezone = timezones.find(({ tzCode }) => tzCode === defaultTimeZone);

  if (!timezone) {
    logger.warn(
      `We can't match our timezones with browser defaults #tz=${defaultTimeZone?.tzCode}`,
    );
    return 'America/Los_Angeles';
  }

  return timezone.tzCode;
}

export function useTimezones(countryCode = 'US') {
  let { data: timezonesByCountryCode } = useSWR(
    ['timezonesByCountryCode'],
    () => fetchTimezones(countryCode),
    {
      suspense: true,
    },
  );
  const timezones = timezonesByCountryCode || [];

  const getTimeZoneCodeByName = (name) => timezones?.find(({ tzCode }) => tzCode === name)?.tzCode;
  const getTimeZoneNameByCode = (timeZone) => timezones?.find(({ tzCode }) => tzCode === timeZone);
  const getDefaultTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    timezones,
    getDefaultTimeZone,
    getTimeZoneCodeByName,
    getTimeZoneNameByCode,
  };
}
