function arrayFrom() {
  /*
  Array.from()
  유사배열, 반복 가능한 객체로부터 새로운 Array 인스턴스를 생성합니다.
  이때 생성될 땐 얕게 복사해서 Array 객체를 만듭니다.
  */
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const arr2 = Array.from(arr);

  arr2.push(11);

  console.log(arr);
  // arr 결과 : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  console.log(arr);
  // arr2 결과 : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

  /* 타입별 테스트 */
  console.log(Array.from({ test: 0, test: 1 }));
  // []
  console.log(Array.from(10));
  // []
  console.log(Array.from(true));
  // []
  // console.log(Array.from(undefined))
  // TypeError
  // console.log(Array.from(null))
  // TypeError

  /* String에서 배열 만들기 */
  const textArr = Array.from("Array.from");

  console.log(textArr);
  // 결과 : ['A', 'r', 'r', 'a', 'y', '.', 'f', 'r', 'o', 'm']
}

function arrayIsArray() {
  /*
  Array.isArray()
  매개변수가 배열이면 true(참)을 아니면 false(거짓)를 반환합니다.
  */
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const fakeArr = { 0: [], 1: [] };

  console.log(Array.isArray(arr));
  // arr 결과 : true
  console.log(Array.isArray(fakeArr));
  // fakeArr 결과 : false
}

function arrayOf() {
  /*
  Array.of()
  인자의 수나 유형에 관계없이 가변 인자를 갖는 새 Array 인스턴스를 만듭니다.
  말 그대로  Array.of(7)은 [7]의 배열을 생성하지만 Array(7)은 length속성(길이가 7인)이 7인 빈 배열을 생성합니다.
  */
  console.log(Array.of(7));
  // [7]
  console.log(Array.of(7, 10, 2));
  // [7, 10, 2]
  console.log(Array(7));
  // [ , , , , , , ]
}

function ArrayLength() {
  /*
  Array.prototype.length
  Array 인스턴스의 length 속성은 배열의 길이를 반환합니다.
   */
  const arr = [0, 1, 2, 3, 4, 5, 6, 7];

  console.log(arr.length);
  // 결과 : 8

  /*
  length의 설명
  length 속성의 값은 양의 정수이며 2^32 미만의 값을 가진다고 합니다.
  즉 2의 32제곱 = 4,294,967,296 보다 작은 길이만 가질 수 있습니다.
  - 2^32 미만의 값을 가질 수 있음
  - 양의 정수만 가질 수 있음
  */
  // const arr1 = new Array(4294967296);
  // const arr11 = new Array(4294967295);
  // const arr2 = new Array(-100);

  // console.log(arr1);
  // 결과 : Uncaught RangeError: Invalid array length
  // console.log(arr11);
  // 결과 : [empty × 4294967295] length: 4294967295

  // console.log(arr2);
  // 결과 : Uncaught RangeError: Invalid array length

  const lengthModify = [0, 1, 2];

  console.log(lengthModify);
  // [0, 1, 2] length : 3

  lengthModify.length = 4;
  console.log(lengthModify);
  // [0, 1, 2, empty] length : 4

  lengthModify.length = 3;
  console.log(lengthModify);
  // [0, 1, 2] length : 3
}
ArrayLength();

function ArrayUnscropables() {
  /*
  Array.prototype[@@unscopables]
  */
  // 해당 내용 공부 진행 예정
  const keys = [0, 1, 2];

  const test = Object.keys(Array.prototype[Symbol.unscopables]);
  console.log(test);
}

function ArrayAt() {
  /*
  Array.prototype.at()
  at() 메서드는 정수 값을 받아서 해당 배열에서 받은 정수 값의 인덱스 요소를 반환합니다.

  양수와 음수 모두 값을 넣을 수 있는데, 양수의 경우엔 해당 인덱스 요소를 음수인 경우엔 배열의 뒤에서부터 인덱스를 세어 요소를 반환합니다.

  MDN 문서에서는 at()메서드가 대괄호 표기법 ( array[0] )를 부정하는것은 아니라고 합니다.

  다만 맨 마지막 요소를 반환할 때 array[array.length - 1]을 사용하는 대신 짧게 array.at(-1)을 사용할 수 있도록 한다고 합니다.
   */

  const arr = [0, 1, 2, 3, 4];

  console.log(arr.at(0));
  // 결과 : 0
  console.log(arr.at(-1));
  // 결과 : 4
  console.log(arr.at(5));
  // 결과 : undefined
}

function ArrayConcat() {
  const arr1 = [0, 1, 2];
  const arr2 = [3, 4, 5];
  const arr3 = arr1.concat(arr2);

  console.log(arr3);
  // 결과 : [0, 1, 2, 3, 4, 5]
}
// ArrayConcat();
