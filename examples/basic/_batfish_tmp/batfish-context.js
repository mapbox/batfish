
          export const batfishContext = {
            selectedConfig: {
              siteBasePath: '',
              siteOrigin: 'https://www.batfish-basic.com',
              hijackLinks: true,
              manageScrollRestoration: true
            },
            routes: [{
            path: '/',
            getPage: () => import(
              /* webpackChunkName: "home" */
              '/Users/dan/Documents/github/batfish/examples/basic/_batfish_tmp/_.js'
            ),
            
            
          },{
            path: '/markdown/',
            getPage: () => import(
              /* webpackChunkName: "markdown" */
              '/Users/dan/Documents/github/batfish/examples/basic/_batfish_tmp/_markdown.js'
            ),
            
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };