import defaultSettings from '@/setting'
import Storage from '@/utils/token'

export default function getPageTitle(pageTitle) {
  const logo = JSON.parse(Storage.getSession('logo'))

  let name = ''

  if (logo && logo.name) {
    name = logo.name.trim()
  }

  const title = name || defaultSettings.title

  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
