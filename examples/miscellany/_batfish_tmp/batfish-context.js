
          export const batfishContext = {
            selectedConfig: {
              siteBasePath: '/miscellany',
              siteOrigin: 'https://www.your-batfish-site.com',
              hijackLinks: true,
              manageScrollRestoration: true
            },
            routes: [{
            path: '/miscellany/',
            getPage: () => import(
              /* webpackChunkName: "miscellany" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany.js'
            ),
            
            
          },{
            path: '/miscellany/404/',
            getPage: () => import(
              /* webpackChunkName: "not-found" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_404.js'
            ),
            
            is404: true,
          },{
            path: '/miscellany/holidays/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-holidays" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_holidays.js'
            ),
            
            
          },{
            path: '/miscellany/holidays/independence-day/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-holidays-independence-day" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_holidays_independence-day.js'
            ),
            
            
          },{
            path: '/miscellany/holidays/labor-day/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-holidays-labor-day" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_holidays_labor-day.js'
            ),
            
            
          },{
            path: '/miscellany/holidays/memorial-day/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-holidays-memorial-day" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_holidays_memorial-day.js'
            ),
            
            
          },{
            path: '/miscellany/stories/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-stories" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_stories.js'
            ),
            
            
          },{
            path: '/miscellany/stories/five-white-mice/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-stories-five-white-mice" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_stories_five-white-mice.js'
            ),
            
            
          },{
            path: '/miscellany/stories/great-mistake/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-stories-great-mistake" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_stories_great-mistake.js'
            ),
            
            
          },{
            path: '/miscellany/stories/ominous-baby/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-stories-ominous-baby" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_stories_ominous-baby.js'
            ),
            
            
          },{
            path: '/miscellany/stories/open-boat/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-stories-open-boat" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_stories_open-boat.js'
            ),
            
            
          },{
            path: '/miscellany/stories/wise-men/',
            getPage: () => import(
              /* webpackChunkName: "miscellany-stories-wise-men" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_stories_wise-men.js'
            ),
            
            
          }],
            notFoundRoute: {
            path: '/miscellany/404/',
            getPage: () => import(
              /* webpackChunkName: "not-found" */
              '/Users/dan/Documents/github/batfish/examples/miscellany/_batfish_tmp/_miscellany_404.js'
            ),
            
            is404: true,
          }
          };