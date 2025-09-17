// Utility for handling product refresh events
const PRODUCT_REFRESH_EVENT = 'productRefresh'

// Trigger a refresh event
export const triggerProductRefresh = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PRODUCT_REFRESH_EVENT))
  }
}

// Listen for refresh events
export const addProductRefreshListener = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(PRODUCT_REFRESH_EVENT, callback)
    return () => window.removeEventListener(PRODUCT_REFRESH_EVENT, callback)
  }
  return () => {}
}