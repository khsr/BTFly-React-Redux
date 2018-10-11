const subdomain = (location.host.match(/^([a-z][a-z0-9_-]+)./) || [])[1]
export default subdomain
