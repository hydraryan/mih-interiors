export function formatStartingPrice(value?: number | null) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null
  }

  return `₹${new Intl.NumberFormat('en-IN').format(Number(value))} per sq.ft`
}

export function buildServiceQuoteHref(pathname: string, serviceSlug: string) {
  return `${pathname}?service=${encodeURIComponent(serviceSlug)}#quote`
}

export function buildStartsFromLabel(value?: number | null) {
  const formatted = formatStartingPrice(value)
  return formatted ? `Starts from ${formatted}` : 'Request pricing'
}