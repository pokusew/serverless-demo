# serverless-demo

A [Cloudflare Workers]-based serverless demo.

This project is implemented in [TypeScript] and uses Cloudflare [Wrangler] (via [npm]).

## Content

<!-- **Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)* -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Description](#description)
- [Development](#development)
  - [Requirements](#requirements)
  - [Setup](#setup)
  - [Commands](#commands)
  - [Deployment](#deployment)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Description

To understand the behavior, see the code in 👉[src/index.ts](./src/index.ts).

## Development

### Requirements

- [Node.js] >=20
- [npm] (comes with Node.js)
- You can follow the Node.js Development Setup guide below.

<details>
<summary>Node.js Development Setup</summary>

We'll install a recent version of [Node.js] using [nvm].

1. Install nvm using Git:

   ```bash
   cd ~/
   git clone https://github.com/nvm-sh/nvm.git .nvm
   cd ~/.nvm
   git checkout v0.39.7
   ```

2. Add the following at the end of your `~/.bashrc`:

   ```bash
   ###
   # nvm
   # source: https://github.com/nvm-sh/nvm#git-install
   ###
   export NVM_DIR="$HOME/.nvm"
   [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
   [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
   ```

3. Restart your terminal. Verify nvm works (should print something like `0.39.7`):

   ```bash
   nvm -v
   ```

4. Install the latest Node.js 20:

   ```bash
   nvm install 20.*
   ```

5. Verify Node.js is installed and active (should print something like `v20.10.0`):

   ```bash
   node -v
   ```

6. Upgrade the bundled npm:

   ```bash
   npm --global install npm
   ```

7. Check the installed npm version:
   ```bash
   npm -v
   ```

That's all!

</details>

### Setup

First, install the dependencies using [npm]:

```bash
npm install
```

Then, you can run the worker locally using:

```bash
npm run dev
```

There is one variable (build-time definition) `MODE` that affects the worker execution.
It can be set in [`wrangler.toml`](./wrangler.toml) and also using CLI flags (which take precedence):

```bash
npm run dev -- --define --define "MODE:'development'"
```

### Commands

This section describes the available commands that you can use during the development process.

Refer to the [package.json scripts section](./package.json) to see the underlying commands.

In order to pass additional arguments to the scripts invoked using `npm run`, an extra `--` is needed, otherwise,
npm won't pass the arguments correctly.

If you want to pass different arguments, you can use the command directly (but you might need to use the full name for
the Node.js executables, e.g. `wrangler` -> `./node_modules/.bin/wrangler` or use `npx`).

See also the documentation for the [Wrangler commands].

- `npm run dev` - This runs the worker locally using [`wrangler dev`].
  It auto-restarts anytime you make a change in the source code or config.
  This way you can test your changes in real-time.

- `npm run deploy` - Once you're satisfied with your changes, you can deploy them to the live environment.
  This command uses the [`wrangler deploy`] to publish your Cloudflare Worker.

- `npm run format` - Formats the code using [Prettier] (`prettier . --write`).

- `npm run check-format` - Checks if all the code is correctly formatted with [Prettier] (`prettier . --check`).

- `npm run lint` – Runs [ESLint]. Outputs errors to console. See [the ESLint config](./.eslintrc.cjs).

- `npm run test` - Runs the tests written in [Jest] (`jest`).

- `npm run tsc` - Runs the TypeScript compiler (`tsc`) that check the types and outputs any type errors to console.

### Deployment

❗️Make sure, that the Cloudflare account you're deploying to has access to the custom domain defined
in the `routes` field in the [`wrangler.toml`](./wrangler.toml#L21).

```bash
npm run deploy
```

See the documentation for [`wrangler deploy`].

<!-- links references -->

[Cloudflare R2]: https://www.cloudflare.com/developer-platform/r2/
[Cloudflare Images]: https://www.cloudflare.com/developer-platform/cloudflare-images/
[Cloudflare Images Transformations Docs]: https://developers.cloudflare.com/images/transform-images/
[Cloudflare Workers]: https://workers.cloudflare.com/
[Cloudflare Workers Docs]: https://developers.cloudflare.com/workers/
[Cloudflare Workers Pricing]: https://developers.cloudflare.com/workers/platform/pricing/
[Using the Cache API]: https://developers.cloudflare.com/r2/examples/cache-api/
[Cache API]: https://developers.cloudflare.com/workers/runtime-apis/cache/
[Wrangler]: https://developers.cloudflare.com/workers/wrangler/
[Wrangler commands]: https://developers.cloudflare.com/workers/wrangler/commands/
[`wrangler dev`]: https://developers.cloudflare.com/workers/wrangler/commands/#dev
[`wrangler deploy`]: https://developers.cloudflare.com/workers/wrangler/commands/#deploy
[nvm]: https://github.com/nvm-sh/nvm
[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[TypeScript]: https://www.typescriptlang.org/
[ESLint]: https://eslint.org/
[Jest]: https://jestjs.io/
[Prettier]: https://prettier.io/
[AWS S3 Website Endpoint]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteEndpoints.html
