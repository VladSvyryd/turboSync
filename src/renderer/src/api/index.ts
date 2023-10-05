export const fetcherWithQuery = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const errorResult = await res.json()
    console.log(res)
    const error = new Error(
      errorResult?.error ?? 'An error occurred while fetching the data.'
    ) as any
    // Attach extra info to the error object.
    error.status = res.status
    throw error
  }

  return res.json()
}
