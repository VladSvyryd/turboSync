import * as winax from 'winax'

export const DeviceManager = new winax.Object('WIA.DeviceManager', {
  activate: true
})

process.on('exit', () => {
  winax.release(DeviceManager)
})
