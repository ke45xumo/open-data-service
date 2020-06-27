/* eslint-env jest */
const request = require('supertest')
const waitOn = require('wait-on')

const URL = process.env.SCHEDULER_API || 'http://localhost:8080'

const MOCK_ADAPTER_PORT = process.env.MOCK_ADAPTER_PORT || 8082
const MOCK_ADAPTER_HOST = process.env.MOCK_ADAPTER_HOST || 'localhost'
const MOCK_ADAPTER_URL = 'http://' + MOCK_ADAPTER_HOST + ':' + MOCK_ADAPTER_PORT

const data = {
  field1: 'abc', // 'field' variables from adapter data
  field2: 123,
  field3: {
    name: 'simpleObject'
  },
  field4: [3, 5, 'a', 'z'],
  test: 'abc' // from transformation service
}

describe('Scheduler', () => {
  console.log('Scheduler-Service URL= ' + URL)

  beforeAll(async () => {
    const pingUrl = URL + '/'
    console.log('Waiting for service with URL: ' + MOCK_ADAPTER_URL)
    await waitOn(
      { resources: [MOCK_ADAPTER_URL], timeout: 50000 })
    console.log('Waiting for service with URL: ' + pingUrl)
    await waitOn({ resources: [pingUrl], timeout: 50000 })
  }, 60000)

  test('GET /version', async () => {
    const response = await request(URL).get('/version')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('text/plain')
    const semanticVersionRegEx = '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)'
    expect(response.text).toMatch(new RegExp(semanticVersionRegEx))
  })

  test('GET /jobs', async () => {
    await sleep(4000) // wait until scheduler does sync
    const response = await request(URL).get('/jobs')
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body).toHaveLength(2)
    expect(response.body[0].scheduleJob).toBeDefined() // TODO: make explicit
    expect(response.body[0].datasourceConfig.id).toEqual(1)
    expect(response.body[1].datasourceConfig.id).toEqual(2)
  })

  test('Datasources triggered first times', async () => {
    await sleep(10000) // pipeline should have been executing until now!
    const response = await request(MOCK_ADAPTER_URL).get('/mock/dataImportCounter') // see how many imports
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.dataImportCounter).toEqual(2) // 2 datasource x 1 call
  }, 12000)

  test('Datasources triggered twice only if periodic', async () => {
    await sleep(10000) // pipeline should have been executing until now!
    const response = await request(MOCK_ADAPTER_URL).get('/mock/dataImportCounter') // see how many imports
    expect(response.status).toEqual(200)
    expect(response.type).toEqual('application/json')
    expect(response.body.dataImportCounter).toEqual(3) // 2 datasource x 1 call + 1 datasource x 1 call
  }, 12000)

})

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

afterAll(() => setTimeout(() => process.exit(), 1000))
