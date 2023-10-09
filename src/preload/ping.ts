import ping from 'ping'

export const pingAddress = (address: string) => {
  ping.promise.probe(address).then(function (res) {
    console.log(res)
  })
}
