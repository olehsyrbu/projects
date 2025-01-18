import { parseAdvancedSearchUrl, toAdvancedSearchParams } from './advancedSearchUrl';

it('has rainbowMember', () => {
  const params = parseAdvancedSearchUrl('?rainbowMember=true');
  expect(params.rainbowMember).toBe(true);
  params.rainbowMember = false;
  expect(toAdvancedSearchParams(params)).toBe('rainbowMember=false');
  params.rainbowMember = undefined;
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has canPrescribeMedication flag', () => {
  const params = parseAdvancedSearchUrl('?canPrescribeMedication=true');
  expect(params.canPrescribeMedication).toBe(true);
  params.canPrescribeMedication = false;
  expect(toAdvancedSearchParams(params)).toBe('canPrescribeMedication=false');
  params.canPrescribeMedication = undefined;
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has isAcceptingNewClients flag', () => {
  const params = parseAdvancedSearchUrl('?isAcceptingNewClients=true');
  expect(params.isAcceptingNewClients).toBe(true);
  params.isAcceptingNewClients = false;
  expect(toAdvancedSearchParams(params)).toBe('isAcceptingNewClients=false');
  params.isAcceptingNewClients = undefined;
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has canAssistWithDailyLiving flag', () => {
  const params = parseAdvancedSearchUrl('?canAssistWithDailyLiving=true');
  expect(params.canAssistWithDailyLiving).toBe(true);
  params.canAssistWithDailyLiving = false;
  expect(toAdvancedSearchParams(params)).toBe('canAssistWithDailyLiving=false');
  params.canAssistWithDailyLiving = undefined;
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has treatsMedicallyUnstable flag', () => {
  const params = parseAdvancedSearchUrl('?treatsMedicallyUnstable=true');
  expect(params.treatsMedicallyUnstable).toBe(true);
  params.treatsMedicallyUnstable = false;
  expect(toAdvancedSearchParams(params)).toBe('treatsMedicallyUnstable=false');
  params.treatsMedicallyUnstable = undefined;
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has treatsSuicidalIdeation flag', () => {
  const params = parseAdvancedSearchUrl('?treatsSuicidalIdeation=true');
  expect(params.treatsSuicidalIdeation).toBe(true);
  params.treatsSuicidalIdeation = false;
  expect(toAdvancedSearchParams(params)).toBe('treatsSuicidalIdeation=false');
  params.treatsSuicidalIdeation = undefined;
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('check category', () => {
  const params = parseAdvancedSearchUrl('?category=provider');
  expect(params.category).toBe('provider');
  params.category = 'person';
  expect(toAdvancedSearchParams(params)).toBe('category=person');
});

it('check query', () => {
  const params = parseAdvancedSearchUrl('?query=bzzz');
  expect(params.query).toBe('bzzz');
  params.query = 'san diego';
  expect(toAdvancedSearchParams(params)).toBe('query=san+diego');
});

it('check zoomMap', () => {
  const params = parseAdvancedSearchUrl('?zoom=9');
  expect(params.zoomMap).toBe(9);
  params.zoomMap = 4;
  expect(toAdvancedSearchParams(params)).toBe('zoom=4');
});

it('check age', () => {
  const params = parseAdvancedSearchUrl('?ageGroup=bzzz&ageGroup=xxx');
  expect(params.ageGroups).toEqual(['bzzz', 'xxx']);
  expect(toAdvancedSearchParams(params)).toBe('ageGroup=bzzz&ageGroup=xxx');
});

it('has day startTime and endTime param', () => {
  let params = parseAdvancedSearchUrl('endTime=01%3A00&startTime=00%3A00');
  expect(params.startTime).toBe('00:00');
  expect(params.endTime).toBe('01:00');
  params.startTime = '14:00';
  params.endTime = '15:00';
  expect(toAdvancedSearchParams(params)).toBe('startTime=14%3A00&endTime=15%3A00');
});

it('check timeZone', () => {
  const params = parseAdvancedSearchUrl('?timeZone=EU');
  expect(params.timeZone).toBe('EU');
  params.timeZone = 'USA';
  expect(toAdvancedSearchParams(params)).toBe('timeZone=USA');
});

it('check setting', () => {
  const params = parseAdvancedSearchUrl('?workSetting=remote');
  expect(params.setting).toBe('remote');
  params.setting = 'both';
  expect(toAdvancedSearchParams(params)).toBe('workSetting=both');
});

it('check location', () => {
  const params = parseAdvancedSearchUrl('?location=Mission St, SF');
  expect(params.location).toBe('Mission St, SF');
  params.location = 'Alabama';
  expect(toAdvancedSearchParams(params)).toBe('location=Alabama');
});

it('has day param', () => {
  let params = parseAdvancedSearchUrl('?day=WEDNESDAY');
  expect(params.day).toEqual(['WEDNESDAY']);
  params.day = ['THURSDAY'];
  expect(toAdvancedSearchParams(params)).toBe('day=THURSDAY');
});

it('check specialGroups', () => {
  let params = parseAdvancedSearchUrl('?specialGroup=ccc&specialGroup=ddd');
  expect(params.specialGroups).toEqual(['ccc', 'ddd']);
  params.specialGroups = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('specialGroup=000&specialGroup=111');
});

it('has networkInsurance param', () => {
  let params = parseAdvancedSearchUrl('?networkInsurance=ccc&networkInsurance=ddd');
  expect(params.networkInsurance).toEqual(['ccc', 'ddd']);
  params.networkInsurance = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('networkInsurance=000&networkInsurance=111');
});

it('has paymentMethods param', () => {
  let params = parseAdvancedSearchUrl('?paymentMethod=ccc&paymentMethod=ddd');
  expect(params.paymentMethods).toEqual(['ccc', 'ddd']);
  params.paymentMethods = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('paymentMethod=000&paymentMethod=111');
});

it('has treatments param', () => {
  let params = parseAdvancedSearchUrl('?treatment=ccc&treatment=ddd');
  expect(params.treatments).toEqual(['ccc', 'ddd']);
  params.treatments = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('treatment=000&treatment=111');
});

it('has modalities param', () => {
  let params = parseAdvancedSearchUrl('?modality=ccc&modality=ddd');
  expect(params.modalities).toEqual(['ccc', 'ddd']);
  params.modalities = ['000'];
  expect(toAdvancedSearchParams(params)).toBe('modality=000');
});

it('has providerType param', () => {
  let params = parseAdvancedSearchUrl('?providerType=ccc&providerType=ddd');
  expect(params.providerTypes).toEqual(['ccc', 'ddd']);
  params.providerTypes = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('providerType=000&providerType=111');
});

it('has gender param', () => {
  let params = parseAdvancedSearchUrl('?gender=ccc&gender=ddd');
  expect(params.genders).toEqual(['ccc', 'ddd']);
  params.genders = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('gender=000&gender=111');
});

it('has accommodation param', () => {
  let params = parseAdvancedSearchUrl('?accommodation=ccc&accommodation=ddd');
  expect(params.accommodation).toEqual(['ccc', 'ddd']);
  params.accommodation = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('accommodation=000&accommodation=111');
});

it('has globalSearch param', () => {
  let params = parseAdvancedSearchUrl('?globalSearch=true');
  expect(params.organizationTypes).toEqual({ ne: 'insurance' });

  expect(toAdvancedSearchParams({ organizationTypes: { ne: 'insurance' } })).toBe(
    'globalSearch=true',
  );
});

it('has programTypes param', () => {
  let params = parseAdvancedSearchUrl('?programType=ccc&programType=ddd');
  expect(params.programTypes).toEqual(['ccc', 'ddd']);
  params.programTypes = ['000', '111'];
  expect(toAdvancedSearchParams(params)).toBe('programType=000&programType=111');
});

it('has modes param', () => {
  let params = parseAdvancedSearchUrl('?mode=PERSON&mode=PROGRAM');
  expect(params.modes).toEqual(['PERSON', 'PROGRAM']);
  params.modes = ['PROGRAM'];
  expect(toAdvancedSearchParams(params)).toBe('mode=PROGRAM');
});

it('has languages param', () => {
  let params = parseAdvancedSearchUrl('?language=ARAB&language=ENG');
  expect(params.languages).toEqual(['ARAB', 'ENG']);
  params.languages = ['FRANC'];
  expect(toAdvancedSearchParams(params)).toBe('language=FRANC');
});

it('has religions param', () => {
  let params = parseAdvancedSearchUrl('?religion=ARAB&religion=ENG');
  expect(params.religions).toEqual(['ARAB', 'ENG']);
  params.religions = ['FRANC'];
  expect(toAdvancedSearchParams(params)).toBe('religion=FRANC');
  params.religions = [];
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has ethnicities param', () => {
  let params = parseAdvancedSearchUrl('?ethnicity=ARAB&ethnicity=ENG');
  expect(params.ethnicities).toEqual(['ARAB', 'ENG']);
  params.ethnicities = ['FRANC'];
  expect(toAdvancedSearchParams(params)).toBe('ethnicity=FRANC');
  params.ethnicities = [];
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has specialties param', () => {
  let params = parseAdvancedSearchUrl('?therapyArea=SS&therapyArea=CC');
  expect(params.specialties).toEqual(['SS', 'CC']);
  params.specialties = ['AA'];
  expect(toAdvancedSearchParams(params)).toBe('therapyArea=AA');
  params.specialties = [];
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has sexualIdentities param', () => {
  let params = parseAdvancedSearchUrl('?sexualIdentity=MAN&sexualIdentity=WOMAN');
  expect(params.sexualIdentities).toEqual(['MAN', 'WOMAN']);
  params.sexualIdentities = ['MAN'];
  expect(toAdvancedSearchParams(params)).toBe('sexualIdentity=MAN');
  params.sexualIdentities = [];
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has amenities param', () => {
  let params = parseAdvancedSearchUrl('?amenity=AN&amenity=SS');
  expect(params.amenities).toEqual(['AN', 'SS']);
  params.amenities = ['MAN'];
  expect(toAdvancedSearchParams(params)).toBe('amenity=MAN');
  params.amenities = [];
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has dietaryAccommodations param', () => {
  let params = parseAdvancedSearchUrl('?dietaryAccommodation=MAN&dietaryAccommodation=WOMAN');
  expect(params.dietaryAccommodations).toEqual(['MAN', 'WOMAN']);
  params.dietaryAccommodations = ['MAN'];
  expect(toAdvancedSearchParams(params)).toBe('dietaryAccommodation=MAN');
  params.dietaryAccommodations = [];
  expect(toAdvancedSearchParams(params)).toBe('');
});

it('has locationCoordinates param', () => {
  let params = parseAdvancedSearchUrl('?loc_lng=-122.11&loc_lat=20.00');
  expect(params.locationCoordinates).toEqual({
    lat: 20.0,
    lng: -122.11,
  });
  params.locationCoordinates = { lat: 70.11, lng: 30.22 };
  expect(toAdvancedSearchParams(params)).toBe('loc_lat=70.11&loc_lng=30.22');
});

it('has centerMap param', () => {
  let params = parseAdvancedSearchUrl('?lng=33.11&lat=55.00');
  expect(params.centerMap).toEqual({
    lat: 55.0,
    lng: 33.11,
  });
  params.centerMap = { lat: 99.22, lng: 44.11 };
  expect(toAdvancedSearchParams(params)).toBe('lat=99.22&lng=44.11');
});

it('has bounds param', () => {
  let params = parseAdvancedSearchUrl('?ne_lat=37.3&ne_lng=-122.1&sw_lat=37.4&sw_lng=-122.5');
  expect(params.bounds).toEqual({
    northeast: {
      lat: 37.3,
      lng: -122.1,
    },
    southwest: {
      lat: 37.4,
      lng: -122.5,
    },
  });
  params.bounds = {
    northeast: {
      lat: 57.3,
      lng: -112.1,
    },
    southwest: {
      lat: 32.4,
      lng: -12.5,
    },
  };
  expect(toAdvancedSearchParams(params)).toBe('ne_lat=57.3&ne_lng=-112.1&sw_lat=32.4&sw_lng=-12.5');
});
