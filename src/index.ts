interface IEvent {
  [type: string]: Array<ICallback>
}

interface ICallback {
  callback?: Function
  args?: Array<any>
}

export class EventBus {
  private events: IEvent

  constructor() {
    this.events = {}
  }

  /**
   * Adds listener to EventBus
   * @param {string} type The name of the event to listen for
   * @param {function} callback Callback to call when event was triggered
   * @param  {...any} args Any number of args to be passed to the callback
   */
  on(type: string, callback: Function, ...args: any): void {
    if (typeof this.events[type] === 'undefined') {
      this.events[type] = []
    }
    this.events[type].push({ callback, args })
  }

  /**
   * Removes listener from EventBus
   * @param {string} type The name of the event to remove
   * @param {function} callback Callback of the event to remove
   */
  off(type: string, callback: Function): void {
    if (typeof this.events[type] === 'undefined') {
      throw Error('type not found in event-bus')
    }

    const filterFn = (event: ICallback) => event.callback !== callback
    this.events[type] = this.events[type].filter(filterFn)
  }

  /**
   * Checks if the passed event is registered in the EventBus
   * @param {string} type Type of the to be checked event
   * @param {callback} callback Callback of the to be checked event
   */
  has(type: string, callback: Function): boolean {
    if (typeof this.events[type] === 'undefined') {
      return false
    }

    const numOfCallbacks = this.events[type].length
    if (callback === undefined) {
      return numOfCallbacks > 0
    }

    const conditionFn = (event: ICallback) => {
      const callbackIsSame = event.callback === callback // Check if callback is equal to the one passed
      if (callbackIsSame) {
        return true
      }
    }
    return this.events[type].some(conditionFn)
  }

  /**
   * Emits an event on the EventBus
   * @param {string} type Type of event to emit
   * @param {...any} args Any number of args to be passed to the callback
   */
  emit(type: string, ...args: any) {
    if (typeof this.events[type] === 'undefined') {
      return
    }
    const events = this.events[type].slice()

    for (const event of events) {
      if (event && event.callback) {
        event.callback.apply(this, [...args, ...event.args])
      }
    }
  }
}

export const global = new EventBus()
