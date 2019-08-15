
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
              '/Users/dan/Documents/github/batfish/examples/internal-routing/_batfish_tmp/_.js'
            ),
            
            
          },{
            path: '/letters/',
            getPage: () => import(
              /* webpackChunkName: "letters" */
              '/Users/dan/Documents/github/batfish/examples/internal-routing/_batfish_tmp/_letters.js'
            ),
            internalRouting: true,
            
          },{
            path: '/numbers/',
            getPage: () => import(
              /* webpackChunkName: "numbers" */
              '/Users/dan/Documents/github/batfish/examples/internal-routing/_batfish_tmp/_numbers.js'
            ),
            internalRouting: true,
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };