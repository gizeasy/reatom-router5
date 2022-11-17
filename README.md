# Reatom-router5

package allows [router5](https://router5.js.org/) to be used with [Reatom](https://reatom.dev)

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, Link } from 'react-router5';
import { routerAtom, plugin, navigateToAction } from 'reatom-router5';
import { createCtx, atom } from '@reatom/core';
import { useAction, useAtom, reatomContext } from '@reatom/npm-react';
import createRouter from 'router5';
import loggerPlugin from 'router5-plugin-logger';
import browserPlugin from 'router5-plugin-browser';

const ROUTES_NAMES = {
  ROOT: 'ROOT',
  SECTION_1: 'SECTION_1',
  SECTION_1_PAGE: 'SECTION_1.PAGE',
  SECTION_2: 'SECTION_2',
  SECTION_2_LIST: 'SECTION_2.LIST',
  SECTION_2_PRODUCT: 'SECTION_2.LIST.PRODUCT',
};

type RouterItem = {
  name: string;
  path: string;
};

const routes: RouterItem[] = [
  {
    name: ROUTES_NAMES.ROOT,
    path: '/?:param',
  },
  {
    name: ROUTES_NAMES.SECTION_1,
    path: '/section-1',
  },
  {
    name: ROUTES_NAMES.SECTION_1_PAGE,
    path: '/page?:param',
  },
  {
    name: ROUTES_NAMES.SECTION_2,
    path: '/section-2',
  },
  {
    name: ROUTES_NAMES.SECTION_2_LIST,
    path: '/list?:searchText',
  },
  {
    name: ROUTES_NAMES.SECTION_2_PRODUCT,
    path: '/:id',
  },
];

const ctx = createCtx();

function configRouter() {
  const router = createRouter(routes, {
    defaultRoute: ROUTES_NAMES.ROOT,
  });

  router.usePlugin(loggerPlugin, browserPlugin(), plugin(ctx));
  router.usePlugin();

  router.start();

  return router;
}

const router = configRouter();

const routeAtomName = atom((ctx) => ctx.spy(routerAtom).route?.name);

export function App() {
  const [name] = useAtom(routeAtomName);
  const navigateTo = useAction(navigateToAction);

  return (
    <div className="App">
      <p>{name}</p>
      <Link routeName={ROUTES_NAMES.ROOT}>ROOT - Link</Link>
      <Link routeName={ROUTES_NAMES.SECTION_1} routeParams={{ param: 'param' }}>
        SECTION_1 - Link
      </Link>
      <p
        onClick={() => navigateTo({ name: ROUTES_NAMES.SECTION_1_PAGE })}
        className="App-link"
      >
        SECTION_1_PAGE - navigateTo
      </p>
      <p
        onClick={() =>
          navigateTo({
            name: ROUTES_NAMES.SECTION_2_LIST,
            params: { searchText: 'blabla' },
          })
        }
      >
        SECTION_2_LIST - navigateTo
      </p>
      <Link
        routeName={ROUTES_NAMES.SECTION_2_PRODUCT}
        routeParams={{ id: '200' }}
      >
        SECTION_2_PRODUCT - Link
      </Link>
    </div>
  );
}

const Root: React.FC = () => {
  return (
    <reatomContext.Provider value={ctx}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </reatomContext.Provider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
```
