// Utility for handling kategori olahraga refresh events
const KATEGORI_OLAHraga_REFRESH_EVENT = 'kategoriOlahragaRefresh'

// Trigger a refresh event
export const triggerKategoriOlahragaRefresh = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(KATEGORI_OLAHraga_REFRESH_EVENT))
  }
}

// Listen for refresh events
export const addKategoriOlahragaRefreshListener = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener(KATEGORI_OLAHraga_REFRESH_EVENT, callback)
    return () => window.removeEventListener(KATEGORI_OLAHraga_REFRESH_EVENT, callback)
  }
  return () => {}
}