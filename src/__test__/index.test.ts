import { global as EventBus } from '../index'

describe('Test EventBus', () => {
  test('simple emit and callback', () => {
    const handler = jest.fn()
    EventBus.on('say', handler)
    EventBus.emit('say')

    expect(handler.mock.calls.length).toBe(1)
  })
})
