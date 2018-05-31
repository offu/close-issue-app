import { parseConfig, isConfig, judge } from '../src/parser'
import * as path from 'path'

describe('parser', () => {
  const exampleConfig = {
    issues: [{
      label: 'bug',
      items: [
        {
          description: '内容缺失',
          content: [
            '内容1', '内容2'
          ]
        },
        {
          description: '缺少🐶',
          content: ['🐶']
        }
      ]
    },
      {
        label: 'Feature Request',
        items: [{
          description: '缺少🐱',
          content: ['🐱']
        }]
      }],
    comment: 'test'
  }

  it('parseConfig', () => {
    const configPath = path.resolve(__dirname, '../config.example.yml')
    const config = parseConfig(configPath)

    expect(config).toEqual(exampleConfig)
  })

  it('isConfig', () => {
    expect(isConfig(exampleConfig)).toBeTruthy()

    const emptyExample = {}
    expect(isConfig(emptyExample)).toBeFalsy()

    const wrongExample = { issues: [], comment: 'test' }
    expect(isConfig(wrongExample)).toBeFalsy()
    const rightExample = {
      issues: [{ label: 'test', items: [{ description: '233', content: ['123'] }] }],
      comment: 'test'
    }
    expect(isConfig(rightExample)).toBeTruthy()
  })

  it('judge', () => {
    const wrongContent = '内容1内容2'
    expect(judge(exampleConfig.issues, ['bug'], wrongContent)).toBeFalsy()

    const rightContent = '内容1内容2🐶'
    expect(judge(exampleConfig.issues, ['bug'], rightContent)).toBeTruthy()
  })
})
