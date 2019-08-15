
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
              '/Users/dan/Documents/github/batfish/examples/markdown-wrappers/_batfish_tmp/_.js'
            ),
            
            
          },{
            path: '/markdown-a/',
            getPage: () => import(
              /* webpackChunkName: "markdown-a" */
              '/Users/dan/Documents/github/batfish/examples/markdown-wrappers/_batfish_tmp/_markdown-a.js'
            ),
            
            
          },{
            path: '/markdown-b/',
            getPage: () => import(
              /* webpackChunkName: "markdown-b" */
              '/Users/dan/Documents/github/batfish/examples/markdown-wrappers/_batfish_tmp/_markdown-b.js'
            ),
            
            
          },{
            path: '/markdown-c/',
            getPage: () => import(
              /* webpackChunkName: "markdown-c" */
              '/Users/dan/Documents/github/batfish/examples/markdown-wrappers/_batfish_tmp/_markdown-c.js'
            ),
            
            
          },{
            path: '/markdown-fake-a/',
            getPage: () => import(
              /* webpackChunkName: "markdown-fake-a" */
              '/Users/dan/Documents/github/batfish/examples/markdown-wrappers/_batfish_tmp/_markdown-fake-a.js'
            ),
            
            
          }],
            notFoundRoute: {
      path: '',
      getPage: () => { throw new Error('No matching route.'); },
      is404: true
    }
          };