
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
              '/Users/dan/Documents/github/batfish/examples/static-files/_batfish_tmp/_.js'
            ),
            
            
          },{
            path: '/star/',
            getPage: () => import(
              /* webpackChunkName: "star" */
              '/Users/dan/Documents/github/batfish/examples/static-files/_batfish_tmp/_star.js'
            ),
            
            
          },{
            path: '/static/not-page/',
            getPage: () => import(
              /* webpackChunkName: "static-not-page" */
              '/Users/dan/Documents/github/batfish/examples/static-files/_batfish_tmp/_static_not-page.js'
            ),
            
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };