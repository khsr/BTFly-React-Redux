# Butterfly Client

[![Circle CI](https://circleci.com/gh/appynest/butterfly.svg?style=svg&circle-token=ff4017292ad10dc0c64d3bec61c3c1007c865440)](https://circleci.com/gh/appynest/butterfly)

It builds src/, uploads files to S3, and serves via CloudFlare.

## Development

- `npm install` - to install dependencies
- `npm test` - run tests
- `npm run dev` - start development server
- `npm run publish` - build src/apps & upload changes to S3
- `npm run stat` - get code stats with [cloc](http://cloc.sourceforge.net/)
- `aws s3 sync s3://assets.butterflyhacks.com/build ./public/build/` - sync bucket


## Setup /etc/hosts

```
127.0.0.1 butterfly.dev
127.0.0.1 www.butterfly.dev
127.0.0.1 api.butterfly.dev
127.0.0.1 anonymessenger.butterfly.dev
127.0.0.1 social-lab.butterfly.dev
127.0.0.1 foo-bar.butterfly.dev
127.0.0.1 foobar.butterfly.dev
127.0.0.1 back-office.butterfly.dev
```
