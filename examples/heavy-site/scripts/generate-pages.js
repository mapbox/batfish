const argv = require('argv');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const loremIpsum = require('lorem-ipsum');
const rimraf = require('rimraf');

async function utileWriteFile(path, data, overwrite) {
  const stat = promisify(fs.stat);
  const write = promisify(fs.writeFile);
  const doesExists = await stat(path)
    .then(() => true)
    .catch(() => false);

  if (doesExists && !overwrite) {
    return;
  }

  return write(path, data, 'utf-8');
}

function utilMkdir(path, remove = false) {
  if (remove) {
    rimraf.sync(path);
  }
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function generateRandomReactComp(index, lastLorem = 100) {
  return `
    var x =[]
    import React from 'react';
    ${
      Math.random() < 0.3
        ? `import lodash from 'lodash';x.push(...Object.keys(lodash));`
        : ''
    }
    ${
      Math.random() < 0.3
        ? `import moment from 'moment';x.push(...(Object.keys(moment)));`
        : ''
    }
    ${
      Math.random() < 0.3
        ? `import * as ramda from 'ramda';x.push(...Object.keys(ramda))`
        : ''
    }

    import PageShell from '../page-shell';

    export default class Comp${index} extends React.Component {
      render() {
        return (
          <PageShell>
            <h1>This is page ${index}.</h1>
            <ul style={{}}>
              <li >
                <a href="#lorem-ipsum">
                  lorem-ipsum sdsdsd
                </a>
              </li>
              <li>
                <a href="#nam-rhoncus">nam-rhoncus</a>
              </li>
              <li>
                <a href="#integer-ut">integer-ut</a>
              </li>
              <li>
                <a href="#praesent-vel">praesent-vel</a>
              </li>
              <li>
                <a href="#ut-posuere">ut-posuere</a>
              </li>
              <li>
                <a href="#suspendisse-ut">suspendisse-ut</a>
              </li>
              <li>
                <a href="#nam-vel">nam-vel</a>
              </li>
              <li>
                <a href="#ut-venenatis">ut-venenatis</a>
              </li>
              <li>
                <a href="#in-efficitur">in-efficitur</a>
              </li>
              <li>
                <a href="#quisque-cursus">quisque-cursus</a>
              </li>
            </ul>
            <span>{x.join('-')}</span>
            <h2 id="lorem-ipsum">Lorem ipsum</h2>
            <p>
              ${loremIpsum({
                count: lastLorem,
                units: 'sentences'
              })}
            </p>
            
    
            <h2 id="nam-rhoncus">Nam rhoncus</h2>
            <p>
              Nam rhoncus metus efficitur nisi pulvinar tincidunt. Aliquam erat
              volutpat. Ut a elementum ipsum, ac posuere nulla. Nam lobortis ac nisl
              et varius. Curabitur nec commodo lacus. Proin consectetur posuere
              velit vel pulvinar. Nullam condimentum eleifend ante, nec egestas eros
              tristique id. Aliquam at ornare dui. Fusce auctor tellus pharetra
              suscipit volutpat. In sed enim eu quam condimentum sollicitudin non
              tristique elit.
            </p>
    
            <h2 id="integer-ut">Integer ut</h2>
            <p>
              Integer ut justo lectus. Praesent feugiat, erat non pretium luctus,
              dolor tellus gravida neque, a eleifend mi ex a neque. Cras massa
              velit, bibendum eget consectetur in, pretium eget libero. Suspendisse
              leo lorem, eleifend sed sapien sed, ultrices mattis mauris. Sed ac
              tortor a magna pretium pharetra. Mauris risus dolor, accumsan eget
              auctor id, porta quis quam. Class aptent taciti sociosqu ad litora
              torquent per conubia nostra, per inceptos himenaeos. Pellentesque nec
              mi quis dolor placerat accumsan. Phasellus congue mi sem, ut posuere
              lacus tempus ut.
            </p>
    
            <h2 id="praesent-vel">Praesent vel</h2>
            <p>
              Praesent vel nibh eu sapien fermentum dictum id id lectus. Sed risus
              nulla, tristique a mollis non, tincidunt eget eros. Duis metus dolor,
              cursus ut blandit a, ullamcorper ut nisl. Aliquam eu ex at nulla
              blandit vehicula. Quisque quis tellus quis turpis pharetra gravida.
              Sed eros justo, faucibus quis nunc nec, viverra sagittis felis. Ut
              pharetra egestas leo sit amet vestibulum. Nunc cursus ex non velit
              facilisis eleifend. Pellentesque eget orci pretium, pharetra magna
              efficitur, viverra lorem. Nam ullamcorper libero est, sit amet
              ultricies purus sagittis ac.
            </p>
    
            <h2 id="ut-posuere">Ut posuere</h2>
            <p>
              Ut posuere tellus eu est dapibus convallis. Proin posuere finibus arcu
              sed sagittis. Aenean sed aliquet urna, nec ullamcorper leo. Vestibulum
              vel nulla dictum, interdum ligula id, egestas eros. Vestibulum
              porttitor vel sem in ornare. Nam nunc ex, condimentum vitae imperdiet
              non, dapibus at sapien. Curabitur dictum velit at dolor tincidunt, a
              auctor tellus placerat. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Maecenas condimentum blandit ipsum, ac mollis arcu
              euismod ac. Nullam ligula tortor, gravida sit amet rhoncus id, viverra
              vitae diam. Vivamus interdum leo sed vestibulum egestas. Sed fermentum
              faucibus metus, sed congue metus pulvinar id.
            </p>
    
            <h2 id="suspendisse-ut">Suspendisse ut</h2>
            <p>
              Suspendisse ut ligula ut est suscipit imperdiet. Phasellus tempus nec
              sem ac sodales. Praesent id venenatis ex. Aliquam posuere quam ac
              cursus consequat. Nulla eu ex scelerisque, blandit velit in, molestie
              elit. Aenean non justo at quam condimentum consectetur ac id augue.
              Nulla facilisi. Pellentesque pellentesque auctor erat. Suspendisse
              interdum pretium diam eget condimentum. Nullam vehicula nunc vel
              mauris sagittis, a consectetur risus vehicula. Fusce a ullamcorper
              arcu. Aenean auctor ante euismod orci finibus venenatis. Quisque leo
              risus, commodo vel nisi eget, ultricies iaculis ex. Duis lacinia
              euismod molestie. Praesent sit amet magna non odio porta pharetra.
            </p>
    
            <h2 id="nam-vel">Nam vel</h2>
            <p>
              Nam vel ante at augue aliquam eleifend eget vel leo. Phasellus tempor,
              nisi sed suscipit sagittis, arcu tellus consectetur lectus, quis
              ornare massa turpis ut mi. Nulla ultrices sapien nunc, vel vulputate
              sapien aliquet vel. Ut molestie metus ac dolor eleifend, sit amet
              lacinia quam gravida. Curabitur a aliquet tellus, at laoreet quam.
              Integer nec auctor enim. Nulla risus eros, feugiat id ligula at,
              vulputate scelerisque velit. Duis ut faucibus lacus, vitae fringilla
              turpis. Proin congue condimentum magna fringilla tincidunt. Cras
              lacinia, orci ac sollicitudin blandit, nisi erat rhoncus nunc, eu
              elementum justo nibh vel metus. Vestibulum sagittis tristique laoreet.
            </p>
    
            <h2 id="ut-venenatis">Ut venenatis</h2>
            <p>
              Ut venenatis, orci a venenatis volutpat, tortor sapien consectetur
              arcu, sit amet sagittis enim lorem eu libero. Nam eu pellentesque
              magna. Mauris eget scelerisque arcu, sit amet tristique mauris. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos. Fusce tincidunt enim id faucibus commodo. Aliquam
              a tellus ut magna mollis lacinia. Sed ut mauris suscipit nunc lacinia
              euismod a eu ipsum. Nunc id neque justo. Fusce ut justo ac nibh
              pretium tristique a in erat.
            </p>
    
            <h2 id="in-efficitur">In efficitur</h2>
            <p>
              In efficitur laoreet dui. Fusce et turpis mi. Cras lacinia euismod est
              et condimentum. Proin sit amet vestibulum nisi. Nullam vel arcu
              libero. Proin tempor lacus et metus condimentum hendrerit. Ut
              consequat, lorem eu aliquam rutrum, enim sem maximus lacus, a
              pellentesque arcu ex sed purus. Sed finibus dapibus urna non pulvinar.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia Curae; Ut gravida sem orci, sit amet rutrum sapien
              dapibus ut. Donec maximus suscipit nisi, ac elementum tortor maximus
              ut. Vestibulum cursus arcu lacus, rutrum vulputate tortor consectetur
              vel. Sed id augue maximus orci maximus vehicula cursus eget ligula.
              Duis purus nisl, dignissim at purus quis, cursus molestie velit.
              Aenean ultrices metus mi, ut feugiat diam efficitur eget. Duis at
              tellus vel augue fermentum pretium a sit amet est.
            </p>
    
            <h2 id="quisque-cursus">Quisque cursus</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              interdum auctor erat rutrum consectetur. Ut sit amet mi pulvinar,
              mattis ex quis, tincidunt nunc. Mauris quis lacinia quam. Praesent
              congue neque dui, nec maximus diam ullamcorper vitae. Quisque odio
              nunc, aliquet at luctus vel, egestas eu felis. Vivamus vitae justo
              maximus, egestas massa quis, varius nisi. Phasellus bibendum tortor
              non massa bibendum, sit amet dapibus augue venenatis. In hac habitasse
              platea dictumst. Suspendisse accumsan, felis eu pharetra dignissim,
              sem ante tristique augue, ornare tristique risus ex imperdiet velit.
              Proin nulla neque, luctus eu arcu eget, facilisis consectetur arcu.
              Proin mollis sem sit amet ante imperdiet elementum. Curabitur in erat
              tincidunt, pharetra libero sed, vestibulum ipsum. Duis ut consequat
              libero, eu auctor quam. Maecenas sit amet ex nec orci iaculis
              pharetra. Praesent non augue metus. Ut rhoncus placerat felis.
            </p>
          </PageShell>
        );
      }
    }
    
    `;
}

function generatePageShell(allPages) {
  return `
  import React from 'react';
  export default class PageShell extends React.Component {
    render() {
      return (
        <div>
          <ul style={{display: 'flex', flexWrap: 'wrap'}}>
           <li style={{display: 'flex', padding: '3px 6px'}}>
              <a href="/">index</a>
           </li>
          ${allPages
            .map(
              page => `
              <li style={{display: 'flex',  padding: '3px 6px'}}>
                <a href="/${path.parse(page).name}">Page-${
                path.parse(page).name
              }</a>
              </li>
            `
            )
            .join('\n')}
          </ul>
          {this.props.children}
        </div>
      );
    }
  }
  `;
}

function main(numberOfPages = 2, maxPageSentences = 2) {
  let allPages = [];

  utilMkdir(path.join('./src/pages'), true);

  const p = t => path.join('./src/pages', t);
  for (let j = 0; j < numberOfPages; j++) {
    let i = j;
    if (j === 0) {
      i = 'index';
    }
    let page = `${i}.js`;
    utileWriteFile(
      p(page),
      generateRandomReactComp(i, parseInt(Math.random() * maxPageSentences)),
      true
    );
    allPages.push(page);
  }
  utileWriteFile(
    path.join('./src/', 'page-shell.js'),
    generatePageShell(allPages),
    true
  );
}

var args = argv
  .option([
    {
      name: 'numberOfPages',
      type: 'int'
    },
    {
      name: 'maxPageSentences',
      type: 'int'
    }
  ])
  .run();

const { options: { numberOfPages, maxPageSentences } } = args;

main(numberOfPages, maxPageSentences);
