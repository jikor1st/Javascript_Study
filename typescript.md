# 타입스크립트

우아한테크세미나를 통해서 공부

reference : https://www.youtube.com/watch?v=ViS8DLd6o-E
reference : https://slides.com/woongjae/woowahan-ts

---

- ## 목표
  TypeScript로 타이핑을 잘하면, 런타임 전에 미리 알 수 있는 오류도 있다.

---

- ## noImplicitAny

  옵션을 켜면 타입을 명시적으로 지정하지 않은 경우, 타입스크립트가 추론중 "any" 라고 판단하게 되면, 컴파일 에러를 발생시켜 명시적으로 지정하도록 유도한다.

  ```typescript
  // 다음과 깉이 type을 지정하지 않아서 문제가 발생하지 않도록 합니다.
  function test(a) {
    return a * 48;
  }

  console.log(test("test")); // NAN
  ```

- ## strictNullChecks

  옵션을 켜면 모든 타입에 자동으로 포함되어 있는 "null" 과 "undefined" 를 제거해줍니다.

  ```typescript
  // 다음과 같이 조건이 맞지않아 undefined가 배출될때를 대비해줍니다.
  function test(a: number) {
    if (a > 0) {
      return a * 38;
    }
    // 조건에 맞지 않을경우 undefined
  }

  console.log(test(-5)); // undefined
  ```

- ## strictFunctionTypes

  옵션을 켜면 함수의 매개변수 타입만 같거나 슈퍼타입이 아닌 경우, 에러를 통해 경고한다

- ## strictPropertyInitialization

  옵션을 켜면 Class의 Property가 생성자 혹은 선언에서 값이 지정되지 않으면, 컴파일 에러를 발생시켜 주의를 준다.

  ```typescript
  // --------------------------
  // 선언만 하고 타입지정 안한경우
  class Car {
    size;
  }
  // size는 any가 지정됩니다.

  // --------------------------
  // 타입은 지정했지만 값이 지정되지 않은경우
  class Car1 {
    size: number;
  }
  // size는 컴파일 단계에서는 number라고 판단되지만, 런타임에서는 undefined가 출력됩니다.

  // ------------------------------
  // strictPropertyInitialization 옵션을 키면 위 두 상황에서 타입에러가 표시됩니다.
  class Car2 {
    size: number = 100;
  }

  // 또는 생성자에서 초기화
  class Car3 {
    size: number;
    constructor(initSize: number) {
      this.size = initSize;
    }
  }

  // v4.0.2 버전부터는 생성자에 의해 타입이 추론됩니다.
  class Car4 {
    size;
    constructor(initSize: number) {
      this.size = initSize;
    }
  }

  // 여전히 생성자를 벗어나면 추론되지 않습니다.
  class Car {
    size!: number; // ! 로 의도를 표현해야 합니다.
    constructor(initSize: number) {
      this.initialize(initSize);
    }
    initialize(size: number) {
      this.size = size;
    }
  }
  ```

---

## 공변

같거나 서브타입인 경우, 할당이 가능하다.

## 반병

함수의 매개변수 타입만 같거나 슈퍼타입인 경우, 할당이 가능하다

---

## any 대신 unknown

```typescript
function funcAny(a: any): number | string | void {
  a.toString(); // 실행이 될때도 있지만 오류가 날 수도 있다.
}

// unknown이 더 안전하다.
function funknown(a: unknown): number | string | void {
  a.toString(); // error!

  if (typeof a === "number") {
    return a * 38;
  } else if (typeof a === "string") {
    return a + ": wow";
  }
}
```

## conditional types

- 간단하게 T가 string이면 StringContainer를, 아니면 NumberContainer 타입을 쓰고 싶을때 사용합니다.

  ```typescript
  interface StringContainer {
    value: string;
    format(): string;
    split(): string[];
  }
  interface NumberContainer {
    value: number;
    nearestPrime(): number;
    round(): number[];
  }

  type Item<T> = {
    id T;
    container: T extends string ? StringContainer : NumberContainer;
  }

  const item2: Item<string> = {
    id:"aaaaa",
    container:null // type error
  }

  ```

- `item<T>`

  T 가 string이면 StringContainer
  T 가 number 면 NumberContainer
  아니면 사용 불가

  ```typescript
  type Item<T> = {
    id: T extends string | number ? T : never;
    container: T extends string
      ? StringContainer
      : T extends number
      ? NumberContainer
      : never;
  };

  const item3: Item<boolean> = {
    id: true, // type error
    container: null, // type error
  };
  ```

## `ArrayFilter<T>`

```typescript
// T extends any[] => "T가 Array형태이면"
type ArrayFilter<T> = T extends any[] ? T : never;

type StringOrNumbers = ArrayFilter<string | number | string[] | number[]>;

// 1. string | number | string[] | number[]
// never은 사라집니다.
// 2. never | never | string[] | number[]
// 3. string[] | number[]
```

### conditional type으로 제약사항 걸기

예제

```typescript
interface Table {
  id: string;
  chairs: string[];
}
interface Dino {
  id: number;
  legs: number;
}

interface World {
  getItem<T extends string | number>(id: T): T extends string ? Table : Dino;
}

let world: World = null as any;

const dino = world.getItem(10);
const what = world.getItem(true); // type error
// boolean은 string | number 타입으로 지정불가능
```

## `Flatten<T>`

```typescript
type Flatten<T> = T extends any[]
  ? T[number]
  : T extends object
  ? T[keyof T]
  : T;

const numbers = [1, 2, 3];
type NumbersArrayFlattend = Flatten<typeof numbers>;
// 1. number[]
// 2. number

const person = {
  name: "Mark",
  age: 38,
};
type SomeObjectFlattend = Flatten<typeof person>;
// 1. keyof T --> "id" | "name"
// 2. T["id" | "name"] --> T["id"] | T["name"] --> number | string

const isMale = true;
type SomeBooleanFlattend = Flatten<typeof isMale>;
// true
```

## infer

infer은 타입을 추론하는 키워드 입니다.
주로 infer R과 같이 사용하여 조건에 따라 타입을 conditional하게 사용합니다.

- 예제 1

  ```typescript
  type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;
  const promises = [Promise.resolve("Mark"), Promise.resolve(38)];

  type Expected = UnpackPromise<typeof promises>; // string | number;
  ```

- 함수의 리턴 타입 알아내기

  ```typescript
  function plus1(seed: number): number {
    return seed + 1;
  }

  // T extends (...args:any)=> any // => 만약 T가 함수면 // T가 함수여야한다는 제약사항
  type MyReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
  ) => infer R
    ? R
    : any;

  type Id = MyReturnType<typeof plus1>;

  lookupEntity(plus1(10));

  function lookupEntity(id: Id) {
    // query DB for entity by ID
  }
  ```

## 내장 conditional types (1)

- ### Exclude

  ```typescript
  // - Exclude 구현부
  // type Exclude<T, U> = T extends U ? never : T;
  // 첫번째인자의 타입중 두번째 인자로 넣은것을 제외한것을 얻어냄
  // 즉 T중 U와 겹치는 타입을 제외한 타입을 반환

  // ( string | number ) - string = number
  type Excluded = Exclude<string | number, string>; // number - diff
  ```

- ### Extract

  ```typescript
  // - Extract 구현부
  // type Extract<T, U> = T extends U ? T : never;
  // 첫번째인자의 타입중 두번째 인자와 겹치는 타입을 할당
  // 즉 T에 대하여 U중에 할당 가능한 타입을 할당

  // string, number / 필터 string => string
  type Extracted = Extract<string | number, string>; // string - filter
  ```

- ### Pick

  ```typescript
  // - Pick 구현부
  /*
    type Pick<T, K extends keyof T> = {
      [P in K]:T[P];
    }
  */
  // 첫번째인자의 타입 내에서 두번째 인자의 key값만 추출해서 사용

  type Picked = Pick<{ name: string; age: number }, "name">;
  // Picked => { name:string }
  ```

- ### Omit

  ```typescript
  // - Omit 구현부
  // type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
  // Pick과 반대로 첫번째인자의 타입 내에서 두번째 인자의 key값을 빼서 사용

  type Omited = Omit<{ name: string; age: number }, "name">;
  // Omited => { age:number }
  ```

- ### NonNullable

  ```typescript
  // - NonNullable 구현부
  // type NonNullable<T> = T extends null | undefined ? never : T;
  // 인자가 null과 undefined가 아닌지 판단해 타입을 반환
  // null또는 undefined이면 never을 반환하여 아닌 타입들만 남게됨

  type NonNullabled = NonNullable<string | number | null | undefined>;
  // NonNullabled => string | number;
  ```

  ## 내장 conditional types (2)

- ### ReturnType

  ```typescript
  // - ReturnType 구현부
  /*
    type ReturnType<T extends (...args: any) => any> = T extends (
      ...args: any
    ) => infer R
      ? R
      : any;
   */
  // 첫번째 인자가 함수일때 함수의 반환 타입을 infer를 통해 추론가능한 타입이면 해당 타입을 반환하고 추론못한다면 any를 반환합니다
  ```

- ### Parameters

  ```typescript
  // - Parameters 구현부
  /*
  type Parameters<T extends (...args: any) => any> = T extends (
    ...args: infer P
  ) => any
    ? P
    : never;
  */
  // 첫번째 인자가 함수일 때 함수의 인자 타입을 추론하여 반환해줍니다.
  type MyParameters = Parameters<(name: string, age: number) => void>;
  // [name:string, age:number]
  ```

## 내장 conditional types (3)

- ### ConstructorParameters

  ```typescript
  // - ConstructorParameters 구현부
  /*
  type ConstructorParameters<T extends new (...args: any) => any> =
    T extends new (...args: infer P) => any ? P : never;
  */
  // 클래스의 생성자 함수 파라미터를 반환해줍니다.

  interface Constructor {
    new (name: string, age: number): string;
  }
  type MyConstructorParameters = ConstructorParameters<Constructor>;
  // [name: string, age: number]
  ```

- ### InstanceType

  ```typescript
  // - InstanceType 구현부
  /*
  type InstanceType<T extends new (...args: any) => any> = T extends new (
    ...args: any
  ) => infer R
    ? R
    : any;
  */
  // 클래스의 인스턴스 리턴 타입을 반환해줍니다

  interface Constructor {
    new (name: string, age: number): string;
  }
  type MyInstanceType = InstanceType<Constructor>; // string
  ```

---

## Function 인 프로퍼티 찾기

```typescript
// 함수 프로퍼티 네임
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// 함수 프로퍼티
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

// 함수가 아닌 프로퍼티 네임
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

// 사용부
interface Person {
  id: number;
  name: string;
  hello(message: string): void;
}

type T1 = FunctionPropertyNames<Person>; // "hello"
type T2 = NonFunctionPropertyNames<Person>; // "id" | "name"
type T3 = FunctionProperties<Person>; // { hello(message:string):void }
type T4 = NonFunctionProperties<Person>; // { id:number, name:string }
```

---

## 오버로딩

- ### 오버로딩이 불가능한 자바스크립트에 타입을 붙이는 경우

  - 오버로딩을 활용 안한경우

    - 제약사항을 안거는 경우

      ```typescript
      function shuffle(value: string | any[]): string | any[] {
        if (typeof value === "string")
          return value
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        return value.sort(() => Math.random() - 0.5);
      }

      console.log(shuffle("Hello, Mark!")); // string | any[]
      console.log(shuffle(["Hello", "Mark", "long", "time", "no", "see"])); // string | any[]
      console.log(shuffle([1, 2, 3, 4, 5])); // string | any[]
      ```

    - 제약사항을 건 경우

      ```typescript
      // value에 제약사항을 걸음
      function shuffle<T extends string | any>(value: T) {
        if (typeof value === "string")
          return value
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        return value.sort(() => Math.random() - 0.5);
      }

      shuffle("Hello, Mark!"); // string;
      shuffle(["Hello", "Mark", "long", "time", "no", "see"]); // string[]
      shuffle([1, 2, 3, 4, 5]); // number[]
      //
      shuffle(1); // type error
      ```

  - 오버로딩을 활용한 경우

  ```typescript
  // 의미가 있는 두 함수
  function shuffle(value: string): string;
  function shuffle<T>(value: T[]): T[];
  // 구현부의 타입은 의미가 없지만 위에 두 함수가 받을 수 있는 타입이여야 함
  function shuffle(value: string | any[]): string | any[] {
    if (typeof value === "string")
      return value
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    return value.sort(() => Math.random() - 0.5);
  }

  shuffle("Hello, Mark!"); // string;
  shuffle(["Hello", "Mark", "long", "time", "no", "see"]); // string[]
  shuffle([1, 2, 3, 4, 5]); // number[]
  ```

  - 클래스의 메서드 오버로딩 : 작성자

  ```typescript
  // 구현부
  class ExportLibraryModal {
    public openComponentsToLibrary(
      libraryId: string,
      componentIds: string[]
    ): void;
    public openComponentsToLibrary(componentIds: string[]): void;
    public openComponentsToLibrary(
      libraryIdOrComponentIds: string | string[],
      componentIds?: string[]
    ): void {
      if (typeof libraryIdOrComponentIds === "string") {
        if (componentIds !== undefined) {
          // 이건 좀 별로
          // 첫번째 시그니처
          libraryIdOrComponentIds;
          componentIds;
        }
      }

      if (componentIds !== undefined) {
        // 이건 좀 별로
        // 두번째 시그니처
        libraryIdOrComponentIds;
      }
    }
  }

  // 사용부
  const modal = new ExportLibraryModal();

  modal.openComponentsToLibrary("library-id", [
    "component-id-1",
    "component-id-1",
  ]);

  modal.openComponentsToLibrary(["component-id-1", "component-id-1"]);
  ```

---

## `ReadonlyArray<T>` 와 as const

```typescript
class Layer {
  id!: string;
  name!: string;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
}

const LAYER_DATA_INITIALIZE_INCLUDE_KEYS: ReadonlyArray<keyof Layer> = [
  "x",
  "y",
  "width",
  "height",
];

const x = LAYER_DATA_INITIALIZE_INCLUDE_KEYS[0]; // "id" | "name" | "x" | "y" | "width" | "height"
const LAYER_DATA_INITIALIZE_EXCLUDE_KEYS = ["id", "name"] as const;
const id = LAYER_DATA_INITIALIZE_EXCLUDE_KEYS[0]; // "id"
```

---

## Mapped Types

다음과 같이 순회를 돌면서 타입을 변경해주는 것을 Mapped Types라고 합니다.

```typescript
interface IPerson {
  name: string;
  age: number;
}

type ReadonlyPerson = Readonly<IPerson>;

const person: ReadonlyPerson = Object.freeze<IPerson>({
  name: "Mark",
  age: 38,
});

person.name = "Hanna"; // error!
person.age = 27; // error!
```

- Typescript 내장 Mapped Types

  - ### Partial

    전달된 모든 프로퍼티를 optional로 바꿔줍니다.

  ```typescript
  type Partial<T> = {
    [P in keyof T]?: T[P];
  };
  ```

  - ### Required

    전달된 모든 프로퍼티의 optional을 제거해줍니다.

  ```typescript
  type Required<T> = {
    [P in keyof T]-?: T[P];
  };
  ```

  - ### Readonly

    전달된 모든 프로퍼티에 readonly를 붙여줍니다.

    ```typescript
    type Readonly<T> = {
      readonly [P in keyof T]: T[P];
    };
    ```

    - readonly의 제한점

    ```typescript
    interface Book {
      title: string;
      author: string;
    }

    interface IRootState {
      book: {
        books: Book[];
        loading: boolean;
        error: Error | null;
      };
    }

    type IReadonlyRootState = Readonly<IRootState>;
    let state1: IReadonlyRootState = {} as IReadonlyRootState;
    const book1 = state1.book.books[0];
    book1.title = "new"; // 에러가 발생하지 않습니다.
    // 뎁스가 넘어가면서 readonly가 붙여지지 않았기 때문입니다.
    ```

    - Custom DeepReadonly

    ```typescript
    type DeepReadonly<T> = T extends (infer E)[]
      ? ReadonlyArray<DeepReadonlyObject<E>>
      : T extends object
      ? DeepReadonlyObject<T>
      : T;

    type DeepReadonlyObject<T> = {
      readonly [K in keyof T]: DeepReadonly<T[K]>;
    };

    interface Book {
      title: string;
      author: string;
    }

    interface IRootState {
      book: {
        books: Book[];
        loading: boolean;
        error: Error | null;
      };
    }

    type IDeepReadonlyRootState = DeepReadonly<IRootState>;

    let state2: IDeepReadonlyRootState = {} as IDeepReadonlyRootState;
    const book2 = state2.book.books[0];
    book2.title = "new"; // type error
    ```

    - readonly keyword in return type

    ```typescript
    // 반환되는 Array의 index에 다시 값 할당 가능
    function freturn1(): string[] {
      return ["readonly"];
    }

    const fr1 = freturn1();
    fr1[0] = "hello";

    // 반환값에 readonly를 붙여 값 할당 제한
    function freturn2(): readonly string[] {
      return ["readonly"];
    }

    const fr2 = freturn2();
    fr2[0] = "hello"; // type error // readonly
    ```

  - ### Pick

  첫번째 인수로 전달된 모든 프로퍼티에서 두번째 인수로 전달된 프로퍼티의 값만 뽑아냅니다.

  ```typescript
  type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
  };
  ```

  - ### Record
    첫번째인수의 키값과 가진 두번째 인수의 타입으로 인터페이스를 생성합니다.

  ```typescript
  type Record<K extends keyof any, T> = {
    [P in K]: T;
  };
  ```

---

## optional type 보단 Union Type을 사용하자

- case1. optional type

```typescript
type Result1<T> = {
  data?: T;
  error?: Error;
  loading: boolean;
};

declare function getResult1(): Result1<string>;

const r1 = getResult1();
r1.data; // string | undefined
r1.error; // Error | undefined
r1.loading; / boolean

// r1의 data가 undefined 일때에 error와 loading 컨트롤 애매
if(r1.data){
  r1.error; // Error | undefined
  r1.loading; // boolean
}
```

- case2. Union type
  타입을 명확하게 분리해줄 수 있다.

```typescript
type Result2<T> =
  | { loading: true }
  | { data: T; loading: false }
  | { error: Error; loading: false };

declare function getResult2(): Result2<string>;

const r2 = getResult2();

r2.data; // type error
r2.error; // type error
r2.loading; // boolean

if ("data" in r2) {
  r2.error; // data가 있을때는 error가 없으므로 type error
  r2.loading; // false
}
```

- case2-1. 프로퍼티 값을 통한 타입가드

```typescript
type Result3<T> =
  | { type: "pending"; loading: true }
  | { type: "success"; data: T; loading: false }
  | { type: "fail"; error: Error; loading: false };

declare function getResult3(): Result3<string>;

const r3 = getResult3();

if (r3.type === "success") {
  r3; // { type:'success'; data:string; loading:false; }
}
if (r3.type === "pending") {
  r3; // { type:'pending'; loading:true; }
}
if (r3.type === "fail") {
  r3; // { type:'fail'; error:Error; loading:false; }
}
```

- case2-2. 리터럴 타입 가드

```typescript
interface Dog {
  kind: "dog";
  eat: () => string;
}

interface Cat {
  kind: "cat";
  jump: () => string;
}

interface Cow {
  kind: "cow";
  milk: () => string;
}

type Pet = Dog | Cat | Cow;

function stringifyPaymentMethod(pet: Pet): string {
  switch (pet.kind) {
    case "dog":
      return pet.cat();
    case "cat":
      return pet.jump();
    case "cow":
      return pet.milk();
  }
}
```

---

## never 활용하기

```tsx
// 타입 선언부
enum ToastType {
    AFTER_SAVED,
    AFTER_PUBLISHED,
    AFTER_RESTORE,
}

interface Toast {
  type:ToastType,
  createdAt:string
}

const toasts: Toast[] = [...];

// - 상황 1 : Bad
// toastNodes1 => (JSX.Element | undefined)[]
// jsx가 나올수도 undefined가 나올수도 있는 타입 지정
const toastNodes1 = toasts.map((toast)=>{
  if(toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast/>
      </div>
    );
  else if(toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast/>
      </div>
    );
  else if(toast.type === ToastType.AFTER_RESTORE)
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast/>
      </div>
    );
})

// - 상황 2 : Bad
// toastNodes1 => JSX.Element[]
// undefined가 리턴되지 않지만 상황이 추가되는 경우 작성자가 확인이 어려운 문제가 있음
const toastNodes1 = toasts.map((toast)=>{
  if(toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast/>
      </div>
    );
  else if(toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast/>
      </div>
    );
  else
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast/>
      </div>
    );
})
// - 상황 3 : GOOD
// toastNodes1 => JSX.Element[]
// 작성자로 하여금 모든 case를 확인할 수 있음
const toastNodes1 = toasts.map((toast)=>{
  if(toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast/>
      </div>
    );
  else if(toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast/>
      </div>
    );
  else if(toast.type === ToastType.AFTER_RESTORE)
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast/>
      </div>
    );
    else return neverExpected(toast.types);
})
// if로 해도됨
const toastNodes1 = toasts.map((toast)=>{
  if(toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast/>
      </div>
    );
  if(toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast/>
      </div>
    );
  if(toast.type === ToastType.AFTER_RESTORE)
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast/>
      </div>
    );

  return neverExpected(toast.types);
})

// switch문으로 해도됨
const toastNodes1 = toasts.map((toast)=>{
  switch(toast.type){
    case ToastType.AFTER_SAVED:
      return (
      <div key={toast.createdAt}>
        <AfterSavedToast/>
      </div>
    );
    case ToastType.AFTER_PUBLISHED:
      return (
      <div key={toast.createdAt}>
        <AfterPublishedToast/>
      </div>
    );
    case ToastType.AFTER_RESTORE:
      return (
      <div key={toast.createdAt}>
        <AfterRestoredToast/>
      </div>
    );
    default:
      return neverExpected(toast.types)
  }
})

function neverExpected(value:never):never{
  throw new Error(`Unexpected value : ${value}`);
}

```
