import { boot } from 'quasar/wrappers'

export default boot(() => {
  // Hole den originalen Descriptor
  const descriptor = Object.getOwnPropertyDescriptor(EventTarget.prototype, 'addEventListener')

  if (descriptor && typeof descriptor.value === 'function') {
    const originalMethod = descriptor.value

    Object.defineProperty(EventTarget.prototype, 'addEventListener', {
      ...descriptor,
      value: function (
        type: string,
        listener: EventListenerOrEventListenerObject | null,
        options?: boolean | AddEventListenerOptions,
      ) {
        if (type === 'touchstart' || type === 'touchmove' || type === 'touchend') {
          let processedOptions: AddEventListenerOptions

          if (typeof options === 'boolean') {
            processedOptions = { capture: options, passive: true }
          } else if (options && typeof options === 'object') {
            processedOptions = { ...options, passive: true }
          } else {
            processedOptions = { passive: true }
          }

          return originalMethod.call(this, type, listener, processedOptions)
        }

        return originalMethod.call(this, type, listener, options)
      },
    })
  }
})
