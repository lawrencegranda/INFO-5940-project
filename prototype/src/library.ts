import type { Asset } from './core.ts'

interface Library {
  folder: string
  assets: Asset[]
}

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('campaign-asset-copilot', 1)
    request.onupgradeneeded = () => {
      request.result.createObjectStore('assets', { keyPath: 'id' })
      request.result.createObjectStore('settings')
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function withDatabase<T>(run: (db: IDBDatabase) => Promise<T>) {
  const db = await openDatabase()
  try {
    return await run(db)
  } finally {
    db.close()
  }
}

export function loadLibrary() {
  return withDatabase(db => new Promise<Library>((resolve, reject) => {
    const transaction = db.transaction(['assets', 'settings'])
    const assets = transaction.objectStore('assets').getAll()
    const folder = transaction.objectStore('settings').get('folder')
    transaction.oncomplete = () => resolve({
      folder: typeof folder.result === 'string' ? folder.result : '',
      assets: (assets.result as Asset[]).sort((a, b) => a.path.localeCompare(b.path)),
    })
    transaction.onabort = () => reject(transaction.error)
  }))
}

export function replaceLibrary(folder: string, assets: Asset[]) {
  return withDatabase(db => new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(['assets', 'settings'], 'readwrite')
    const store = transaction.objectStore('assets')
    store.clear()
    for (const asset of assets) store.put(asset)
    transaction.objectStore('settings').put(folder, 'folder')
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(transaction.error)
  }))
}

export function saveAsset(asset: Asset) {
  return withDatabase(db => new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('assets', 'readwrite')
    transaction.objectStore('assets').put(asset)
    transaction.oncomplete = () => resolve()
    transaction.onabort = () => reject(transaction.error)
  }))
}
