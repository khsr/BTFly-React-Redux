import { host } from '../components/boot'

/**
 * Generate url using `host` domain and `subdomain`.
 *
 * @param {String} subdomain
 * @return {String}
 */

export default function resolveSubdomain (subdomain) {
  return host.replace('://', `://${subdomain}.`)
}
