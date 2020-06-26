/* eslint-env jest */
import * as PipelineExecution from './workflow-execution'
import * as AdapterClient from './clients/adapter-client'
import AdapterResponse from '@/interfaces/adapter-response'
import DatasourceConfig from './interfaces/datasource-config'

jest.mock('./clients/adapter-client')

const mockExecuteAdapter = AdapterClient.executeAdapter as jest.Mock

const adapterResponse: AdapterResponse = {
  id: 42,
  location: '/data/42'
}

const importedData = {
  value1: 1,
  value2: 'zwo'
}
const transformedData = {
  value2: 'zwo'
}

afterEach(() => {
  jest.clearAllMocks()
})

test('Should execute adapter once', async () => {
  const datasourceConfig = generateDatasourceConfig(false)
  mockExecuteAdapter.mockResolvedValue(adapterResponse)

  await PipelineExecution.execute(datasourceConfig)

  expect(mockExecuteAdapter).toHaveBeenCalledWith(datasourceConfig)
})

test('Should execute adapter periodicly', async () => {
  const datasourceConfig = generateDatasourceConfig(true)
  mockExecuteAdapter.mockResolvedValue(adapterResponse)

  await PipelineExecution.execute(datasourceConfig)

  expect(mockExecuteAdapter).toHaveBeenCalledWith(datasourceConfig)
})

function generateDatasourceConfig (periodic = true): DatasourceConfig {
  return {
    id: 123,
    format: {
      type: 'XML',
      parameters: {}
    },
    protocol: {
      type: 'HTTP',
      parameters: {
        location: 'somewhere'
      }
    },
    trigger: {
      periodic: periodic,
      firstExecution: new Date(Date.now() + 5000),
      interval: 5000
    },
    metadata: {
      displayName: 'datasource 123',
      creationTimestamp: new Date(Date.now() + 5000),
      license: 'license 123'
    },
  }
}
