
function arrayFrom(){
  /*
  Array.from()
  유사배열, 반복 가능한 객체로부터 새로운 Array 인스턴스를 생성합니다.
  */
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const arr2 = Array.from(arr);

  arr2.push(11);

  console.log(arr);
  // arr 결과 : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  console.log(arr);
  // arr2 결과 : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
}

function arrayIsArray(){
  /*
  Array.isArray()
  매개변수가 배열이면 true(참)을 아니면 false(거짓)를 반환합니다.
  */
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const fakeArr = {0:[], 1:[]};


  console.log(Array.isArray(arr));
  // arr 결과 : true
  console.log(Array.isArray(fakeArr));
// fakeArr 결과 : false
}

