# Babel과 Webpack을 이용한 ES6 환경 구축

[reference] : https://poiemaweb.com/es6-babel-webpack-1

크롬, 사파리, 파이어폭스와 같은 에버그린 브라우저(Evergreen browser, 사용자의 업데이트 없이도 최신 버전으로 자동 업데이트를 수행하는 모던 브라우저)의 ES6지원 비율은 약 98%로 거의 대부분의 ES6 사양을 구현하고 있습니다.

하지만 인터넷 익스플로어(IE) 11의 ES6 지원 비율은 약 11%입니다 (2019년도 기준. 지금은 IE 브라우저의 지원 중단) 그리고 매년 새롭게 도입되는 ES6 이상의 버전 (ES6+)과 제안 단계에 있는 ES 제안 사양(ES NEXT)은 브라우저에 따라 지원 비율이 제각각입니다.

따라서 ES6+ 또는 ES NEXT의 ES 최신 사양을 사용하여 프로젝트를 진행하려면 최신 사양으로 작성된 코드를 경우에 따라 IE를 포함한 구형 브라우저에서 문제 없이 동작시키기 위한 개발 환경을 구축하는 것이 필요합니다. 특히 모듈의 경우, 모듈 로더가 필요합니다.

2019년 11월에, 모던 브라우저(Chrome 61, FF60, SF 10.1, Edge 16이상)에서 ES6 모듈을 사용할 수 있습니다. 단, 아래와 같은 이유로 아직까지는 브라우저가 지원하는 ES6 모듈 기능보다는 Webpack 등의 모듈 번들러를 사용하는 것이 일반적입니다.

- IE를 포함한 구형 브라우저는 ES6 모듈을 지원하지 않습니다.
- 브라우저의 ES6 모듈 기능을 사용하더라도 트랜스파일링이나 번들링이 필요합니다.
- 아직 지원하지 않는 기능 (Bare import등)이 있습니다.
- 점차 해결되고는 있지만 아직 몇가지 이슈가 있습니다.

트랜스파일러(Transpiler) Bable과 모듈 번들러(Module bundler) Webpack을 이용하여 ES6+ 개발환경을 구축하여 봅시다.

## Babel

### 1.2 Babel 이란?

아래 예제는 ES6의 화살표 함수와 ES7의 지수 연산자를 사용하고 있습니다.

```javascript
// ES6 화살표 함수와 ES7 지수 연산자
[1, 2, 3].map((n) => n ** n);
```

IE와 다른 구형 브라우저에서는 이 두가지 기능을 지원하지 않을 수 있습니다. Babel을 사용하면 위 코드를 아래와 같이 ES5 이하의 버전으로 변환할 수 있습니다.

```javascript
// ES5
"use strict";

[1, 2, 3].map(function (n) {
  return Math.pow(n, n);
});
```

이처럼 Babel는 최신 사양의 자바스크립트 코드를 IE나 구형 브라우저에서도 동작하는 ES5 이하의 코드로 변환(트랜스파일링)할 수 있습니다. Babel을 사용하기 위한 개발 환경을 구축해 봅니다.

### 1.2 Babel CLI 설치

npm을 사용하여 Babel CLI를 설치해 봅니다. 프로젝트에 따라 설정이 다를 수 있으므로 전역으로 설치하지 말고 로컬로 설치하도록 합니다.

```bash
mkdir es6-project
cd es6-project
npm init -y
npm i -D @babel/core @babel/cli
```

### 1.3 babelrc 설정 파일 작성

Babel을 사용하려면 @babel/preset-env를 설치해야 합니다. @babel/preset-env는 함께 사용되어야 하는 Babel 플러그인을 모아 둔 것으로 Babel 프리셋이라고 부릅니다. Babel이 제공하는 공식 Babel 프리셋(Official Preset)은 아래와 같습니다.

- @babel/preset-env
- @babel/preset-flow
- @babel/preset-react
- @babel/reset-typescript

@bable/preset-env도 공식 프리셋의 하나이며 필요한 플러그인 들을 프로젝트 지원 환경에 맞춰서 동적으로 결정해 줍니다. 프로젝트 지원 환경은 Browserslist 형식으로 .browserslistrc 파일에 상세히 설정할 수 있습니다. 프로젝트 지원 환경 설정 작업을 생략하면 기본값으로 설정됩니다.

우선 기본 설정으로 진행합니다. 기본 설정은 모든 ES6+ 코드를 변환합니다.

```bash
npm i -D @babel/preset-env
```

설치가 완료되었으면 프로젝트 루트에 .babelrc 파일을 생성하고 아래와 같이 작성합니다. 설치한 @babel/preset-env를 사용하겠다는 의미입니다.

```json
{
  "presets": ["@babel/preset-env"]
}
```

### 1.4 트랜스파일링

Babel을 사용하여 ES6+ 코드를 ES5 이하의 코드로 트랜스파일링하기 위해 Babel CLI 명령어를 사용할 수도 있으나 npm script를 사용하여 트랜스파일링 하는 방법에 대해 알아보도록 합니다.

package.json 파일에 scripts를 추가합니다.

```json
{
  //...
  "scripts": {
    "build": "babel src/js -w -d dist/js"
  }
  //...
}
```

npm script는 src/js 폴더(타깃 폴더)에 있는 모든 ES6+ 파일들을 트랜스파일링한 후, 그 결과물을 dist/js 폴더에 저장합니다. 사용한 옵션의 의미는 아래와 같습니다.

`-w` : 타깃 폴더에 있는 모든 파일들의 변경을 감지하여 자동으로 트랜스파일합니다. (--watch 옵션의 축약형)

`-d` : 트랜스파일링된 결과물이 저장될 폴더를 지정합니다. (--out-dir 옵션의 축약형)

트랜스파일링을 테스트하기 위해 ES6+ 파일을 작성해 봅니다. 프로젝트 루트에 src/js 폴더를 생성한 후 lib.js와 main.js를 추가합니다.

빌드 명령어를 통해서 빌드를 실행해 테스트 해봅니다.

```bash
npm run build
```

dist 폴더에 src/js 에 작성한 파일들이 트랜스파일링되어 빌드된 결과물을 확인할 수 있습니다.

### 1.5 Babel 플러그인

설치가 필요한 플러그인은 Babel 홈페이지에서 검색할 수 있습니다.
설치를 하면 .babelrc 파일에 추가해 주어야 합니다.

```bash
@babel/plugin-proposal-class-properties
```

```json
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

### 1.6 브라우저에서 모듈 로딩 테스트

앞에서 main.js와 lib.js 모듈을 트랜스파일링하여 ES5로 변환된 main.js을 실행한 결과, 문제없이 실행되는 것을 확인하였습니다.
ES6+에서 새롭게 추가된 기능은 물론 현재 제안 상태에 있는 "클래스 필드 정의 제안"도 ES5로 트랜스파일링되었고 ES6의 모듈의 import와 export 키워드도 트랜스파일링되어 모듈 기능도 정상적으로 동작하는 것을 확인하였습니다.

하지만 모듈 기능은 node.js 환경에서 동작한 것이고 Babel이 모듈을 트랜스파일링한 것도 node.js가 기본 지원하는 CommonJS 방식의 module loading system에 따른 것입니다.

브라우저는 CommonJS 방식의 module loading system(require 함수)을 지원하지 않으므로 require과 같이 트랜스파일링된 결과를 그대로 브라우저에서 실행하면 에러가 발생합니다.

CommonJS 방식을 브라우저에 실행하려 하면 require과 exports가 선언되지 않았다는 에러를 만나볼 수 있습니다.
브라우저의 ES6 모듈 기능을 사용하도록 Babel을 설정할 수도 있으나 앞서 설명한 바와 같이 브라우저의 ES6 모듈 기능을 사용하는 것은 문제가 있습니다.

# Webpack

## Webpack 이란?

Webpack은 의존 관계에 있는 모듈들을 하나의 자바스크립트 파일로 번들링하는 모듈 번들러입니다. Webpack을 사용하면 의존 모듈이 하나의 파일로 번들링되므로 별도의 모듈 로더가 필요없습니다. 그리고 다수의 자바스크립트 파일을 하나의 파일로 번들링하므로 html파일에서 script 태그로 다수의 자바스크립트 파일을 로드해야 하는 번거로움도 사라집니다.

Webpack과 Babel을 이용하여 ES6+ 개발 환경을 구축하여 봅시다. Webpack이 자바스크립트 파일을 번들링하기 전에 Babel을 로드하여 ES6+ 코드를 ES5 코드로 트랜스파일링하는 작업을 실행하도록 설정할 것입니다. 그리고 Sass를 사용하는 경우, Saas 트랜스파일링도 Webpack에서 관리하도록 할 것입니다.

## Webpack 설치

아래 명령으로 Webpack을 설치합니다.

```bash
npm i -D webpack webpack-cli
```

## babel-loader

Webpack이 모듈을 번들링할 때 Babel을 사용하여 ES6+ 코드를 ES5 코드로 트랜스파일링하도록 babel-loader를 설치합니다.

```bash
npm i -D babel-loader
```

설치 후 npm script를 변경하여 Babel 대신 Webpack을 실행하도록 수정합니다.

```json
{
  //...
  "scripts": {
    "build": "webpack -w"
  }
  //...
}
```

## webpack.config.js

webpack.config.js는 webpack이 실행될 때 참조하는 설정 파일입니다. 프로젝트 루트에 webpack.config.js 파일을 생성하고 아래와 같이 작성합니다.

```javascript
const path = require("path");

module.exports = {
  // enntry file
  entry: "./src/js/main.js",
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src/js")],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
    ],
  },
  devtool: "source-map",
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: "development",
};
```

- Webpack을 실행하여 트랜스파일링 및 번들링 실행

```bash
npm run build
```

실행 결과 dist/js 폴더에 bundle.js가 생성되었습니다. 이 파일은 main.js, lib.js 모듈이 하나로 번들링된 결과물 입니다.

html파일을 생성하고 dist의 bundle.js 스크립트를 로드하여 실행시켜보면 main.js, lib.js 모듈이 하나로 번들링된 bundle.js가 브라우저에서 문제없이 실행된 것을 확인할 수 있습니다.

## babel-polyfill

Babel을 사용하여 ES6+ 코드를 ES5 이하로 트랜스파일링하여도 브라우저가 지원하지 않는 코드가 남아 있을 수 있습니다. 예를 들어, ES6에서 추가된 Promise, Object.assign, Array.from 등은 ES5 이하로 트랜스파일링하여도 대체할 ES5 기능이 없기 때문에 그대로 남아 있습니다.

따라서 오래된 브라우저에서도 ES6+ 에서 새롭게 추가된 객체나 메소드를 사용하기 위해서는 @babel/polyfill을 설치해야 합니다.

```bash
npm i @babel/polyfill
```

babel-polyfill은 개발 환경에서만 사용하는 것이 아니라 실제 환경에서도 사용하여야 하므로 --save-dev 옵션으로 개발 설치를 하지 않도록 합니다.

ES6의 import를 사용하는 경우에는 진입점의 선두에서 먼저 폴리필을 로드하도록 합니다.

```javascript
// src/js/main.js
import "@babel/polyfill";
...
```

webpack을 사용하는 경우에는 위 방법을 대신 폴리필을 webpack.config.js 파일의 entry 배열에 추가합니다.

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  // entry files
  entry: ['@babel/polyfill', './src/js/main.js'],
  ...
```

npm run build로 빌드 후 dist/js/bundle.js를 확인해보면 polyfill이 추가된 것을 확인할 수 있습니다.

## Sass 파일

Webpack을 통해 Sass를 컴파일하는 방법에 대해 살펴봅니다. Sass를 컴파일한 결과물인 css를 bundle.js 파일에 포함시키는 방법과 별도의 css 파일로 분리하는 방법이 있습니다.

### 컴파일된 css를 bundle.js 파일에 포함시키는 방법

필요한 패키지를 설치합니다. node-sass는 node.js 환경에서 사용할 수 있는 Sass 라이브러리입니다. 실제로 Sass를 css로 컴파일하는것은 node-sass 입니다. style-loader, css-loader, sass-loader는 Webpack 플러그인입니다.

```bash
npm i node-sass style-loader css-loader sass-loader --save-dev
```

webpack.config.js 파일을 수정해줍니다

```
const path = require('path');

module.exports = {
  // entry files
  entry: ['@babel/polyfill', './src/js/main.js', './src/sass/main.scss'],
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader",   // translates CSS into CommonJS
          "sass-loader"   // compiles Sass to CSS, using Node Sass by default
        ],
        exclude: /node_modules/
      }
    ]
  },
  devtool: 'source-map',
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: 'development'
};
```

테스트를 위한 Sass 파일을 추가해줍니다

추가한 후에 npm run build 명령어로 빌드해줍니다.

컴파일된 CSS는 bundle.js에 포함되어 있습니다.

### 컴파일된 CSS를 별도의 CSS 파일로 분리하는 방법

Sass 파일이 방대해지면 자바스크립트 파일에서 분리하는 것이 효율적일 수 있습니다. bundle.js 파일에 컴파일된 css를 포함시키지 말고 별도의 css 파일로 분리해서 하나의 파일로 번들링해봅니다. 이때 사용하는 플러그인은 mini-css-extract-plugin 입니다.

> Webpack v4 이전 버전에서는 extract-text-webpack-plugin을 사용했습니다. Webpack v4부터 css와 관련한 파일 분리는 mini-css-extract-plugin을 사용하도록 변경되었습니다.

mini-css-extract-plugin을 설치합니다.

```bash
npm i -D mini-css-extract-plugin
```

webpack.config.js 파일을 수정합니다

```javascript
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // entry files
  entry: ["@babel/polyfill", "./src/js/main.js", "./src/sass/main.scss"],
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  plugins: [
    // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
    new MiniCssExtractPlugin({ filename: "css/style.css" }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, "src/js")],
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        exclude: /node_modules/,
      },
    ],
  },
  devtool: "source-map",
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: "development",
};
```

npm run build로 빌드를 하면 css폴더가 생성되고 style.css 파일이 저장됩니다. 컴파일되고 하나의 파일로 번들링된 css가 bundle.js 파일에 포함되지 않고 별도 파일로 분리된것입니다.
