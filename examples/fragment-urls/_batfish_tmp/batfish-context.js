
          export const batfishContext = {
            selectedConfig: {
              siteBasePath: '',
              siteOrigin: '',
              hijackLinks: true,
              manageScrollRestoration: true
            },
            routes: [{
            path: '/',
            getPage: () => import(
              /* webpackChunkName: "home" */
              '/Users/dan/Documents/github/batfish/examples/fragment-urls/_batfish_tmp/_.js'
            ),
            
            
          },{
            path: '/two/',
            getPage: () => import(
              /* webpackChunkName: "two" */
              '/Users/dan/Documents/github/batfish/examples/fragment-urls/_batfish_tmp/_two.js'
            ),
            
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };