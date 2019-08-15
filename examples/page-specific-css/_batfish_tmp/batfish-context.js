
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
              '/Users/dan/Documents/github/batfish/examples/page-specific-css/_batfish_tmp/_.js'
            ),
            
            
          },{
            path: '/another/',
            getPage: () => import(
              /* webpackChunkName: "another" */
              '/Users/dan/Documents/github/batfish/examples/page-specific-css/_batfish_tmp/_another.js'
            ),
            
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };