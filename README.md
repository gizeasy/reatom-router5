# Reatom-router5

package allows [router5](https://router5.js.org/) to be used with [Reatom](https://reatom.js.org/)

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { RouterProvider, Link } from 'react-router5';
import { routerAtom, subscribe, navigateToAction } from 'reatom-router5';
import { createStore } from '@reatom/core';
import { useAction, useAtom, context } from '@reatom/react';
import createRouter, { Router } from 'router5';
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

function configRouter() {
  const router = createRouter(routes, {
    defaultRoute: ROUTES_NAMES.ROOT,
  });

  router.usePlugin(loggerPlugin);
  router.usePlugin(browserPlugin());

  return router;
}

const router = configRouter();

export function App() {
  const router = useAtom(routerAtom);
  const navigateTo = useAction(navigateToAction);

  if (!router.route) {
    return null;
  }

  return (
    <div className="App">
      <header className="App-header">
        <p className="App-PageTitle">{router.route.name}</p>
        <Link routeName={ROUTES_NAMES.ROOT}>ROOT - Link</Link>
        <Link routeName={ROUTES_NAMES.SECTION_1} routeParams={{ param: 'param' }}>
          SECTION_1 - Link
        </Link>
        <p onClick={() => navigateTo({ name: ROUTES_NAMES.SECTION_1_PAGE })} className="App-link">
          SECTION_1_PAGE - onClick
        </p>
        <p
          onClick={() =>
            navigateTo({ name: ROUTES_NAMES.SECTION_2_LIST, params: { searchText: 'blabla' } })
          }
        >
          SECTION_2_LIST - onClick
        </p>
        <Link routeName={ROUTES_NAMES.SECTION_2_PRODUCT} routeParams={{ id: '200' }}>
          SECTION_2_PRODUCT - Link
        </Link>
      </header>
    </div>
  );
}

const Root: React.FC<{ router: Router }> = () => {
  const store = createStore(routerAtom);

  subscribe(store, router);

  router.start();

  return (
    <context.Provider value={store}>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </context.Provider>
  );
};

ReactDOM.render(<Root router={router} />, document.getElementById('root'));
```