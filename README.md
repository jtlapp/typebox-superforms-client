# TypeBox Superforms

SvelteKit superforms using TypeBox schemas, hitting API endpoints

**UNDER DEVELOPMENT**

## Introduction

[SvelteKit Superforms](https://superforms.rocks/) has made forms for [SvelteKit](https://kit.svelte.dev/) super easy and super user friendly, but it is based on [Zod](https://zod.dev/) schemas. When people choose [TypeBox](https://github.com/sinclairzx81/typebox) over Zod, it is because they are prioritizing [backend performance](https://moltar.github.io/typescript-runtime-type-benchmarks/). The present library is for those who want the client-side benefits of Superforms while still maximizing backend performance. Rather than sending form data to the server to parse as a function of the schema, this library parses the form data on the client and submits the data as JSON to a backend endpoint. The library also supports HTTP query parameters, which it specially encodes for both readability and fast parsing into JSON.

## Limitations

- Does not support `dataType: 'json'` at this time.
- Does not support nested objects at this time.

---

# create-svelte

Everything you need to build a Svelte library, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

Read more about creating a library [in the docs](https://kit.svelte.dev/docs/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```bash
npm run package
```

To create a production version of your showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```bash
npm publish
```
