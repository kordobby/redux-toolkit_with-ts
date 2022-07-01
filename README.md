# redux-toolkit with TS

```
yarn add react-redux @reduxjs/toolkit
```

### TypeScript things

- `ReturnType<typeof fn>`

  ```javascript
  type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
  ```

  - `typeof`

    - reducer로 전달되는 Action은 Action 생성 함수에서 반환됨
    - Action 타입은 Action 생성함수의 ReturnType 으로 정의

    ```javascript
    export const increase = () => ({ type: INCREASE });
    export const decrease = () => ({ type: DECREASE });
    export const increaseBy = (diff: number) => ({
      type: INCREASE_BY,
      payload: diff,
    });

    type CounterAction =
      | ReturnType<typeof increase>
      | ReturnType<typeof decrease>
      | ReturnType<typeof increaseBy>;
    ```

- `infer` ? 필요한 타입을 추론하여 사용할 수 있음
- 제네릭 T는 함수형태의 Type을 extends 하는데, 그 함수의 리턴값의 type을 추론가능하다면 그 type을 반환해준다는 의미
- T? 제네릭을 선언할 때 관용적으로 사용되는 식별자로 타입 파라미터(Type Parameter)라고 함
- 제네릭?
  - 타입을 마치 함수의 파라미터처럼 사용하는 것을 의미함
  - 생성 시점에 타입을 명시해서 하나의 타입만이 아닌 다양한 타입을 사용할 수 있도록 하는 기법
  - 한번의 선언으로 다양한 타입에 재사용이 가능하다는 장점이 있음

* 제네릭... 알아보자

  - 제네릭이란 마치 함수의 파라미터처럼 사용하는 것을 의미

  ```javascript
  /* #1. text 라는 parameter를 넘겨받아 text를 반환 */
  function getText(text) {
    return text;
  }

  getText("hi"); // 'hi'
  getText(10); // 10
  getText(true); // true
  ```

  ```javascript
  /* 2. 제네릭을 살펴보자 */
  // 제네릭 기본 문법이 적용된 함수
  function getText<T>(text: T): T {
    return text;
  }

  // 함수를 호출할 때 아래와 같이 함수 안에서 사용할 타입을 넘길 수 있음
  getText < string > "hi";
  getText < number > 10;
  getText < boolean > true;

  // getText<string>('hi') 를 호출했을 때 제네릭이 동작하는 방법
  function getText<string>(text: T): T {
    return text;
  }
  getText<string>();
  getText<string>('hi');
  function getText<string>(text: string): string {
    return text;
  }
  ```

  - 뭔소리인지 1도 이해가 안감. 그래서 더 찾아봄

  #### 다시, 제네릭이란????????/

  - 데이터 타입을 일반화(generalize)한다는 뜻
  - 자료형을 정하지 않고 여러 타입을 사용할 수 있게 해줌
  - 그렇기 때문에 선언 시점이 아니라 생성 시점에 타입을 명시해 하나의 타입만이 아닌 다양한 타입을 사용할 수 있도록 하는 기법이라 할 수 있음
  - 한 번의 선언으로 다양한 타입에 '재사용'이 가능함

  ```javascript
  const identify = <T>(arg: T): T => {
    return arg;
  };
  ```

  - `<T>(arg: T):T` 여기서 `<T>`는 Type의 약자로 제네릭을 선언할 때 T를 관용적으로 사용
  - 이 identify 함수는 T라는 타입 변수를 갖게 됨
  - argument와 return의 type은 T 라는 타입변수로 동일함

  ```javascript
  const identify = <T>(arg: T[]): T[] => {
    console.log(arg.length);
    return arg;
  };
  ```

  - 이 함수는 T라는 변수타입을 받고, 인자로는 배열 형태의 T를 받음
  - `identify([1, 2, 3])`과 같은 형태로 사용
    https://velog.io/@edie_ko/TypeScript-Generic-%EC%A0%9C%EB%84%A4%EB%A6%AD-feat.-TypeScript-%EB%91%90-%EB%8B%AC%EC%B0%A8-%ED%9B%84%EA%B8%B0
    잠오니까 내일...

### [ step #1 ] store 생성

- `createStore` 로 store 생성
- `configureStore` 로 간단하게 store setting이 가능한데, `reducer` 필드는 필수적으로 전달해야 함
  - 추가적으로 `middleware` 등을 추가해줄 수 있음
- 기존처럼 `combineReducers` 로 reducer들을 결합하지 않아도 자동적으로 reducer들을 결합해주며, `redux-thunk` 미들웨어를 디폴트로 포함하고 있음

```javascript
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    // reducer 추가하는 공간
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- RootState?
  - 함수의 반환 유형으로 구성된 유형을 구성
  - `getState()`
    - 애플리케이션의 현재 상태트리를 반환
    - 스토어의 리듀서가 마지막으로 반환한 값과 동일함
    - 반환 : (any) 애플리케이션의 현재 상태 트리

```javascript
export type RootState = ReturnType<typeof store.getState>;
// store.getState => 현재 스토어에 있는 데이터를 반환
// 그럼 해석하면 state를 가져오는데, type을 지정해주는거네?
```

- AppDispatch
  - `dispatch(action)`
    - action을 보냄
    - 상태 변경을 일으키기 위한 유일한 방법
    - 스토어의 리듀싱 함수는 `getState()`의 현재 결과와 주어진 액션과 함께 동기적으로 호출됨
    - 반환된 값이 다음 상태가 되어 이제부터 `getState()`에서 반환될 것이고, 상태 변경 리스너들은 즉시 알림을 받음

```javascript
export type AppDispatch = typeof store.dispatch;
// store.dispatch => 상태값을 수정할 때 사용되는 메서드, 인수로는 action 전달
```

```javascript
* TypedUseSelectorHook ???????????
: useSelector를 assign하고 TypedUseSelectorHook에 Generic Type을 받음

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
// useSelector를 사용할 때마다 ReduxState와 반환값의 타입을 입력하는게 번거롭기 때문에
// ReduxState 타입이 미리 입력된 훅 만들기
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// const age = useSelector<ReduxState, string>((state) => state.person.age);
// const age = useAppSelector((state) => state.person.age);
```

```javascript
interface Obj<T> {
  name: T;
}

interface State {
  state: {
    date: string,
    loading: boolean,
  };
}

const obj: Obj<State> = {
  name: {
    state: {
      data: "abcd",
      loading: false,
    },
  },
};
```
