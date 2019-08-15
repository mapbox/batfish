
          export const batfishContext = {
            selectedConfig: {
              siteBasePath: '/spa',
              siteOrigin: '',
              hijackLinks: false,
              manageScrollRestoration: false
            },
            routes: [{
            path: '/spa/',
            getPage: () => import(
              /* webpackChunkName: "spa" */
              /* webpackMode: "eager" */
'/Users/dan/Documents/github/batfish/examples/spa-minimum-static-build/_batfish_tmp/_spa.js'
            ),
            
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };