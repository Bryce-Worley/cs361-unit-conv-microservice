// testing for unit conversion microservice

const BASE_URL = 'http://localhost:3001';

async function callEndpoint(path, params) {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}?${query}`;

  console.log(`Request:  GET ${url}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log(`Response: ${response.status} ${JSON.stringify(data)}`);

  return data;
}

async function main() {
  console.log('Test 1: valid conversion (77 kg -> lbs)');
  await callEndpoint('/convert', { value: 77, from: 'kg', to: 'lbs' });

  console.log('\nTest 2: valid conversion (99.5 F -> C)');
  await callEndpoint('/convert', { value: 99.5, from: 'f', to: 'c' });

  console.log('\nTest 3: invalid conversion - incompatible units (kg -> m)');
  await callEndpoint('/convert', { value: 8, from: 'kg', to: 'm' });

  console.log('\nTest 4: default-units for (en-US)');
  await callEndpoint('/default-units', { locale: 'en-US' });

  console.log('\nTest 5: default-units for (de-DE)');
  await callEndpoint('/default-units', { locale: 'de-DE' });

  console.log('\nTesting completed.');
}

main().catch(err => {
  console.error('\nERROR: Test program failure.');
  console.error(err.message);
  process.exit(1);
});