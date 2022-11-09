# 비동기식 처리 모델과 Ajax

[reference] : https://poiemaweb.com/js-ajax

## 1. Ajax (Asynchronous JavaScript and XML)

브라우저에서 웹페이지를 요청하거나 링크를 클릭하면 화면 갱신이 발생합니다.
브라우저와 서버와의 통신에 의한 것입니다.

서버는 요청받은 페이지(HTML)를 반환하는데 이때 HTML에서 로드하는 CSS나 Javascript 파일들도 같이 반환됩니다. 클라이언트 요청에 따라 서버는 정적인 파일을 반환할 수도 있고 서버 사이드 프로그램이 만들어낸 파일이나 데이터를 반환할 수도 있습니다. 서버로부터 웹페이지가 반환되면 클라이언트(브라우저)는 이를 렌더링하여 화면에 표시합니다.

Ajax(Asynchronouse JavaScript and XML)는 자바스크립트를 이용해서 비동기적(Asynchronouse)으로 서버와 브라우저가 데이터를 교환할 수 있는 통신 방식을 의미합니다.

서버로부터 웹페이지가 반환되면 화면 전체를 갱신해야 하는데 페이지 일부만을 갱신하고도 동일한 효과를 볼 수 있도록 하는 것이 Ajax입니다. 페이지 전체를 로드하여 렌더링할 필요가 없고 갱신이 필요한 일부만 로드하여 갱신하면 되므로 빠른 퍼포먼스와 부드러운 화면 표시 효과를 기대할 수 있습니다.

## 2. JSON (Javascript Object Notation)

클라이언트와 서버 간에는 데이터 교환이 필요합니다. JSON(Javascript Object Notation)은 클라이언트와 서버 간 데이터 교환을 위한 규칙 즉 데이터 포맷을 말합니다.

JSON은 일반 텍스트 포맷보다 효과적인 데이터 구조화가 가능하며 XML 포맷보다 가볍고 사용하기 간편하며 가독성도 좋습니다.

자바스크립트의 객체 리터럴과 매우 흡사하지만 JSON은 순수한 텍스트로 구성된 규칙이 있는 데이터 구조입니다.

```json
{
  "name": "Lee",
  "gender": "male",
  "age": 20,
  "alive": true
}
```

키는 반드시 큰따옴표(작은따옴표 사용불가)로 둘러싸야 합니다.

### 2.1 JSON.stringify

JSON.stringify 메소드는 객체를 JSON 형식의 문자열로 변환합니다.

- 실습은 jsonStringify.html

### 2.2 JSON.parse

JSON.parse 메소드는 JSON 데이터를 가진 문자열을 객체로 변환합니다.

> 서버로부터 브라우저로 전송된 JSON 데이터는 문자열입니다. 이 문자열을 객체로서 사용하려면 객체화하여야 하는데 이를 역직렬화(Deserializing)이라 합니다. 역직렬화를 위해서 내장 객체 JSON의 static 메소드인 JSON.parse를 사용합니다.

- 실습은 jsonParse.html

## 3. XMLHttpRequest

브라우저는 XMLHttpRequest 객체를 이용하여 Ajax 요청을 생성하고 전송합니다. 서버가 브라우저의 요청에 대해 응답을 반환하면 같은 XMLHttpRequest 객체가 그 결과를 처리합니다.

### 3.1 Ajax request

다음 Ajax 요청 처리의 예입니다.

```javascript
// XMLHttpRequest 객체의 생성
const xhr = new XMLHttpRequest();
// 비동기 방식으로 Request를 오픈합니다
xhr.open("GET", "/users");
// Request를 전송합니다
xhr.send();
```

### 3.1.1 XMLHttpRequest.open

XMLHttpRequest 객체의 인스턴스를 생성하고 XMLHttpRequest.open 메소드를 사용하여 서버로의 요청을 준비합니다. XMLHttpRequest.open의 사용법은 아래와 같습니다.

```javascript
XMLHttpRequest.open(method, url[, async]);
```

| 매개변수 | 설명                                                                      |
| -------- | ------------------------------------------------------------------------- |
| method   | HTTP method ("GET", "POST", "PUT", "DELETE" 등)                           |
| url      | 요청을 보낼 URL                                                           |
| async    | 비동기 조작 여부. 옵션으로 default는 true이며 비동기 방식으로 동작합니다. |

### 3.1.2 XMLHttpRequest.send

XMLHttpRequest.send 메소드로 준비된 요청을 서버에 전달합니다.
기본적으로 서버로 전송하는 데이터는 GET, POST 메소드에 따라 그 전송 방식에 차이가 있습니다.

- GET 메소드의 경우, URL의 일부분인 쿼리문자열(query string)로 데이터를 서버로 전송합니다.
- POST 메소드의 경우, 데이터(페이로드)를 Request Body에 담아 전송합니다.

XMLHttpRequest.send 메소드에는 request body에 담아 전송할 인수를 전달할 수 있습니다.

```javascript
xhr.send(null);
// xhr.send('string');
// xhr.send(new Blob()); // 파일 업로드와 같이 바이너리 컨텐트를 보내는 방법
// xhr.send({ form:'data' });
// xhr.send(document);
```

만약 요청 메소드가 GET인 경우, send 메소드의 인수는 무시되고 request body는 null로 설정됩니다.

### 3.1.3 XMLHttpRequest.setRequestHeader

XMLHttpRequest.setRequestHeader 메소드는 HTTP Request Header의 값을 설정합니다. setRequestHeader 메ㅗ소드는 반드시 XMLHttpRequest.open 메소드 호출 이후에 호출합니다.

자주 사용하는 Request Header인 Content-type, Accept에 대해 살펴봅니다.

- Content-type

  Content-type은 request body에 담아 전송할 데이터의 MIME-type의 정보를 표현합니다. 자주 사용되는 MIME-type은 아래와 같습니다.

  | 타입                        | 서브타입                                           |
  | --------------------------- | -------------------------------------------------- |
  | text 타입                   | text/plain, text/html, text/css, text/javascript   |
  | Application 타입            | application/json, application/x-www-form-urlencode |
  | File을 업로드하기 위한 타입 | multipart/formed-data                              |

다음은 request body에 담아 서버로 전송할 데이터의 MIME-type을 지정하는 예이다.

```javascript
// json으로 전송하는 경우
xhr.open("POST", "/users");

// 클라이언트가 서버로 전송할 데이터의 MIME-type 지정: json
xhr.setRequestHeader("Content-type", "application/json");

const data = { id: 3, title: "Javascript", author: "Park", price: 5000 };

xhr.send(JSON.stringify(data));
```

```javascript
// x-www-form-urlencoded으로 전송하는 경우
xhr.open("POST", "/users");

// 클라이언트가 서버로 전송할 데이터의 MIME-type 지정: x-www-form-urlencoded
// aplication/w-form-urlencoded는 key=value&key=value...의 형태로 전송
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

const data = { title: "Javascript", author: "Park", price: 5000 };

xhr.send(
  Object.keys(data)
    .map((key) => `${key}=${data[key]}`)
    .join("&")
);
// escaping untrusted data
// xhr.send(Object.keys(data).map(key => `${key}=${encodeURIComponent(data[key])}`).join('&'));
```

Accept

HTTP 클라이언트가 서버에 요청할 때 서버가 센드백할 데이터의 MIME-type을 Accept로 지정할 수 있습니다.

다음은 서버가 센드백할 데이터의 MIME-type을 지정하는 예입니다.

```javascript
// 서버가 센드백할 데이터의 MIME-type 지정: json
xhr.setRequestHeader("Accept", "application/json");
```

만약 Accept 헤더를 설정하지 않으면, send 메소드가 호출될 때 Accept 헤더가 */*으로 전송됩니다.

## 3.2 Ajax response

다음은 Ajax 응답 처리의 예입니다.

```javascript
// XMLHttpRequest 객체의 생성
const xhr = new XMLHttpRequest();

// XMLHttpRequest.readyState 프로퍼티가 변경(이벤트 발생)될 때마다 onreadystatechange 이벤트 핸들러가 호출됩니다.
xhr.onreadystatechange = function (e) {
  // readyStates는 XMLHttpRequest의 상태(state)를 반환
  // readyState: 4 => DONE(서버 응답 완료)
  if (xhr.readyState !== XMLHttpRequest.DONE) return;

  // status는 response 상태 코드를 반환 : 200 => 정상 응답
  if (xhr.status === 200) {
    console.log(xhr.responseText);
  } else {
    console.log("Error!");
  }
};
```

XMLHttpRequest.send 메소드를 통해 서버에 Request를 전송하면 서버는 Response를 반환합니다. 하지만 언제 Response가 클라이언트에 도달할지는 알 수 없습니다.
XMLHttpRequest.onreadystatechange는 Response가 클라이언트에 도달하여 발생된 이벤트를 감지하고 콜백 함수를 실행하여 줍니다. 이때 이벤트는 Request에 어떠한 변화가 발생한 경우 즉 XMLHttpRequest.readyState 프로퍼티가 변경된 경우 발생합니다.

```javascript
// XMLHttpRequest 객체의 생성
let xhr = new XMLHttpRequest();
// 비동기 방식으로 Request를 오픈합니다.
xhr.open("GET", "data/test.json");
// Request를 전송합니다
xhr.send();

// XMLHttpRequest.readyState 프로퍼티가 변경(이벤트 발생)될 때마다 콜백함수 (이벤트 핸들러)를 호출합니다.
xhr.onreadystatechange = function (e) {
  // 이 함수는 Response가 클라이언트에 도달하면 호출됩니다.
};
```

XMLHttpRequest 객체는 response가 클라이언트에 도달했는지를 추적할 수 있는 프로퍼티를 제공합니다. 이 프로퍼티가 바로 XMLHttpRequest.readyState입니다.
만일 XMLHttpRequest.readyState의 값이 4인 경우, 정상적으로 Response가 돌아온 경우입니다.

readXMLHttpRequest.readyState의 값은 아래와 같습니다.

| Value | State            | Description                                           |
| :---: | ---------------- | ----------------------------------------------------- |
|   0   | UNSENT           | XMLHttpRequest.open() 메소드 호출 이전                |
|   1   | OPENED           | XMLHttpRequest.open() 메소드 호출 완료                |
|   2   | HEADERS_RECEIVED | XMLHttpRequest.send() 메소드 호출 완료                |
|   3   | LOADING          | 서버 응답 중(XMLHttpRequest.responseText 미완성 상태) |
|   4   | DONE             | 서버 응답 완료                                        |

## Web Server

웹서버(Web Server)는 브라우저와 같은 클라이언트로부터 HTTP 요청을 받아들이고 HTML 문서와 같은 웹 페이지를 반환하는 컴퓨터 프로그램입니다.

- 웹 서버 테스트

```bash
$ git clone https://github.com/ungmo2/webserver-express.git
$ cd webserver-express
## install express
$ npm install
## create public folder
$ mkdir public

# start webserver
$ npm start
```

## Ajax 예제

### 5.1 Load HTML

Ajax를 이용하여 웹페이지에 추가하기 가장 손쉬운 데이터 형식은 HTML입니다. 별도의 작업없이 전송받은 데이터를 DOM에 추가하면 됩니다.

### 5.2 Load JSON

서버로부터 브라우저로 전송된 JSON 데이터는 문자열입니다. 이 문자열을 객체화하여야 하는데 이를 역직렬화(Deserializing)이라 합니다. 역직렬화를 위해서 내장 객체 JSON의 static 메소드인 JSON.parse()를 사용합니다.

### 5.3 Load JSONP

요청에 의해 웹페이지가 전달된 서버와 동일한 도메인의 서버로부터 전달된 데이터는 문제없이 처리할 수 있습니다. 하지만 보안상의 이유로 다른 도메인 (http와 https, 포트가 다르면 다른 도메인으로 간주합니다)으로의 요청(크로스 도메인 요청)은 제한됩니다. 이것을 동일출처원칙(Same-origin policy)이라고 합니다.

동일출처원칙을 우회하는 방법은 세가지 있습니다.

1. 웹서버의 프록시 파일

서버에 원격 서버로부터 데이터를 수집하는 별도의 기능을 추가하는 것입니다. 이를 프록시(Proxy)라 합니다.

2. JSONP

script 태그의 원본 주소에 대한 제약은 존재하지 않는데 이것을 이용하여 다른 도메인의 서버에서 데이터를 수집하는 방법입니다. 자신의 서버에 함수를 정의하고 다른 도메인의 서버에 얻고자 하는 데이터를 인수로 하는 함수 호출문을 로드하는 것입니다.

3. Cross-Origin Resource Sharing

HTTP 헤더에 추가적으로 정보를 추가하여 브라우저와 서버가 서로 통신해야 한다는 사실을 알게 하는 방법입니다. W3C 명세에 포함되어 있지만 최신 브라우저에서만 동작하며 서버에 HTTP 헤더를 설정해 주어야합니다.

Node.js로 구현한 서버의 경우, CORS package를 사용하면 간단하게 Cross-Origin Resource Sharing을 구현할 수 있습니다.

```javascript
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(80, function () {
  console.log("CORS-enabled web server listening on port 80");
});
```
