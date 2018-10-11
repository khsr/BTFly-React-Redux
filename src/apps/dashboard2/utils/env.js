
/**
 * Detect env.
 */

export const isProd = location.hostname.includes('butterfly.ai') &&
                      !location.search.includes('debug')
export const isDev = !isProd
