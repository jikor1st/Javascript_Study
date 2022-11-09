# REST (Representational State Transfer)

REST (Representational State Transfer)는 웹이 HTTP의 설계 상 우수성을 제대로 사용하지 못하고 있는 상황을 보고 웹의 장점을 최대한 활용할 수 있는 아키텍쳐로서 REST를 소개하였고 이는 HTTP 프로토콜을 의도에 맞게 디자인하도록 유도하고 있습니다. REST의 기본 원칙을 성실히 지킨 서비스 디자인을 "RESTful"이라고 표현합니다.

[reference] : https://poiemaweb.com/js-rest-api

## 1. REST API 중심 규칙

REST에서 가장 중요한 기본적인 규칙은 두가지 입니다. URI는 자원을 표현하는 데에 집중하고 행위에 대한 정의는 HTTP Method를 통해 하는 것이 REST한 API를 설계하는 중심 규칙입니다.

### 1. URI는 정보의 자원을 표현해야 합니다.

- 리소스명은 동사보다는 명사를 사용합니다. URI는 자원을 표현하는데 중점을 두어야합니다. get 같은 행위에 대한 표현이 들어가서는 안됩니다.

  ```code
  # bad
  GET /getTodos/1
  GET /todos/show/1

  # good
  GET /todos/1
  ```

### 2. 자원에 대한 행위는 HTTP Method(GET, POST, PUT, DELETE 등)으로 표현합니다.

```code
# bad
GET /todos/delete/1

# good
DELETE /todos/1
```

## 2. HTTP Method

주로 5가지 Method(GET, POST, PUT, PATCH, DELETE)를 사용하여 CURD를 구현합니다.

| Method | Action         | 역할                    | 페이로드 |
| ------ | -------------- | ----------------------- | :------: |
| GET    | index/retrieve | 모든/특정 리소스를 조회 |    x     |
| POST   | create         | 리소스를 생성           |    O     |
| PUT    | replace        | 리소스의 전체를 교체    |    O     |
| PATCH  | modify         | 리소스의 일부를 수정    |    O     |
| DELETE | delete         | 모든/특정 리소스를 삭제 |    x     |

## 3. REST API의 구성

REST API는 자원(Resource), 행위(Verb), 표현(Representations)의 3가지 요소로 구성됩니다. REST는 자체 표현 구조 (Self-descriptiveness)로 구성되어 REST API만으로 요청을 이해할 수 있습니다.

| 구성 요소       | 내용                    | 표현 방법             |
| --------------- | ----------------------- | --------------------- |
| Resource        | 자원                    | HTTP URI              |
| Verb            | 자원에 대한 행위        | HTTP Method           |
| Representations | 자원에 대한 행위의 내용 | HTTP Message Pay Load |

## 4. REST API의 Example

4.1 json-server

json-server를 사용하여 REST API를 사용하여 봅시다.

- rest-api-exam의 index.html 파일을 봅니다.
- GET, POST, PUT, PATCH, DELETE

```bash
# 세팅하기
$ mkdir rest-api-exam
$ cd rest-api-exam
$ npm init -y
$ npm install json-server

# db.json 파일을 아래와 같이 생성
{
  "todos": [
    { "id": 1, "content": "HTML", "completed": false },
    { "id": 2, "content": "CSS", "completed": true },
    { "id": 3, "content": "Javascript", "completed": false }
  ]
}

# npm script를 사용하여 json-server를 실행합니다.
# 아래와 같이 package.json을 수정합니다.
{
  "name": "rest-api-exam",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "start": "json-server --watch db.json --port 5000"
  },
  "dependencies": {
    "json-server": "^0.15.0"
  }
}

# json-server를 실행합니다. 포트는 5000을 사용합니다.
$ npm start
```
