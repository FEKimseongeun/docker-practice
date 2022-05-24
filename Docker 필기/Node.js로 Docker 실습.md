Node.js를 이용하기 위해서는 당연히 Node.js가 설치되어 있어야한다.

Node.js가 설치되어 있어야 `npm install`, `npm init` 또는 `node server.js`와 같은 명령어를 사용할 수 있다. Node.js는 공식 홈페이지에서 쉽게 다운로드 받을 수 있다. 설치가 잘 되었는지 확인하기 위해서 `node -v` 명령어를 사용할 수 있다. 설치 버전이 나온다면 설치가 완료된 것이다.

![img_1.png](Docker 필기/img/img_1.png)

다음은 Node.js 어플리케이션을 구성할 디렉토리를 하나 만들고 디렉토리 안으로 이동해준다. 다음은 `npm init -y` 명령어를 입력해서 `package.json` 파일을 생성한다. `package.json` 파일은 종속성을 명시한 파일로 파이썬의 `requirements.txt` 파일과 비슷한 역할로 생각하면 된다.

자동 생성되는 `package.json` 파일을 약간 수정해준다. index.js를 server.js로 수정해주고 `express.js` 를 `dependencies`에 추가해준다.

`npm install express`와 `npm install redis`를 해주면 된다.

그러고 package.json을 확인해주자.

```json
{
  "name": "docker-practice",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1",
    "redis": "^3.0.2"
  }
}
```

그 후 server.js를 작성해준다.

```jsx
const express=require('express');

const PORT=8080;

const app=express();

app.get('/', (req, res) => {
    res.send("반갑습니다.");
})

app.listen(PORT, ()=>{
    console.log('Server is running');
})
```

## 도커파일 만들기

그 다음은 도커 파일을 작성한다.

```docker
FROM node:10

COPY ./ ./

RUN npm install

CMD ["node", "server.js"]
```

1. `FROM node:10` 은 베이스 이미지를 명시한다. node라는 이미지에 태그는 10인 이미지를 베이스 이미지로 사용한다.
2. `COPY ./ ./` 는 명령어 그대로 복사를 명시한다. `COPY <local file or directory> <image directory` 가 된다. 따라서 `COPY ./ ./` 는 local directory 의 `package.json` , `server.js` 를 그대로 image의 root directory에 복사한다.
3. `npm install` 은 설치된 Node.js를 이용해서 `package.json` 에 명시된 종속성을 웹에서 자동으로 다운로드 받는다. 도커 이미지가 `npm` 명령어를 사용한다는 것은 Node.js가 설치되어 있다는 뜻이다. 즉, `node:10` 베이스 이미지에 Node.js가 설치되어 있다.
4. `CMD ["node", "server.js"]` 는 `server.js`를 구동시킨다.

이제 Dockerfile을 이용해서 도커 이미지를 빌드해보자.

## **도커 이미지 빌드 및 실행**

> **docker build . -t <이미지 이름:태그>**
>

위의 명령어에서 `.` 은 현재 디렉토리를 의미한다. `-t` 는 도커 이미지의 이름과 태그를 명시하겠다는 의미이다. 이미지 이름과 태그를 명시하지 않으면 이름과 태그가 `<none>`으로 설정된다.

![img_2.png](Docker 필기/img/img_2.png)

그렇게 명령어를 치면 잘 나오는 것을 확인할 수 있고 내가 정한 이름의 nodeJs로 빌드가 된 것을 확인 할 수 있었다.

이미지가 빌드되었다.

## 도커 이미지를 실행해보자.

> **docker run -p 5000:8080 <이미지이름>**
>

`-p` 옵션은 포트 매핑을 의미한다. `server.js`는 포트 8080 번으로 소통한다. 로컬 네트워크와 컨테이너 네트워크는 격리되어 있으므로 로컬의 5000번 포트와 컨테이너의 8080포트를 연결해주는 포트 매핑이 필요하다.

![img_3.png](Docker 필기/img/img_3.png)

이렇게 server.js에서 콘솔로그로 설정해준 메세지가 잘 뜨는 거면 이미지를 실행시킨거라 보면 된다.

서버가 잘 돌아가고 있는지 `localhost:5000`으로 접속해서 확인해보자.

![img_4.png](Docker 필기/img/img_4.png)

# **WORKDIR 이용하기**

`WORKDIR` 은 도커 이미지 내에서 디렉토리를 이동할 때 사용한다. 즉 `cd` 와 같은 역할을 한다.

`WORKDIR` 을 사용해야 하는 주요한 이유는 덮어쓰기를 방지하기 위해서다. 만약 로컬에 `lib` 라는 디렉토리가 있고 도커 이미지 내부에도 `lib` 라는 디렉토리가 있는 상황에서 `COPY ./ ./` 를 명시하면 도커 안의 `lib`은 덮어씌워진다. 즉, 사라진다는 뜻이다. 그래서 `COPY`를 할 디렉토리를 이동시켜주는 `WORKDIR` 을 명시해주면 좋다.

우선 `WORKDIR`을 사용하지 않았을 때의 도커 컨테이너의 내부 모습을 보자.

![img_5.png](Docker 필기/img/img_5.png)

`Dockerfile`, `server.js`, `package.json`등이 컨테이너의 root directory에 들어가 있는 모습을 볼 수 있다. 이번에는 Dockerfile을 수정해서 다른 디렉토리에 `COPY`를 진행해보고 결과를 보자.

```docker
FROM node:10

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install

CMD ["node", "server.js"]
```

![img_6.png](Docker 필기/img/img_6.png)

확실히 WORKDIR을 추가안했을 때의 파일구조와 했을 때의 파일 구조가 확연히 다름을 알 수 있따.

그 이유가 바로 `WORKDIR`을 사용해서 디렉토리를 이동시켰기 때문이다. 현재 `c5353a37c500` 컨테이너의 디렉토리는 root 가 아닌 `/usr/src/app`다. 그래서 root 디렉토리에서 보여지는 파일과 폴더는 보이지 않고 Node.js 파일들과 Dockerfile 만 보이는 것이다. 이를 더 자세히 확인하고 싶을 때는 셸 스크립트로 접속해서 내부를 살펴볼 수 있다.

### **앱 소스코드 변경 시 재빌드를 효율적으로 하는 방법에 대해 살펴보자.**

> `**docker build -t nodej2**`
>
- 2번에서 살펴본 Dockerfile은 이미 효율적인 재빌드를 고려하여 작성된 것이다.
- 어떤 부분이 재빌드의 효율화가 적용된 것인지 짚어보자.
- Dockerfile에 COPY 키워드는 두 부분으로 나뉘어져 있다.
- 실제 위에서 진행했던 빌드 내용을 보면, RUN의 전후로 1번씩 COPY가 진행되었음을 확인할 수 있다.

![img_8.png](Docker 필기/img/img_8.png)

- 사실 RUN 이전에 ***COPY ./ ./*** 를 한번만 작성하더라도 이후 과정이 진행되는 데에 있어 무리가 없다.
- 그럼에도 굳이 COPY를 두 부분으로 나누어서 작성한 이유는 뭘까?
    - 이것이 바로 재빌드 과정에서의 효율화를 위한 안배인 것이다.
    - 빌드시에 RUN 커맨드가 실행되는 요건은 다음과 같다.
        - 첫째, 최초의 빌드일 때 -> 반드시 실행된다.
        - 둘째, 재빌드 일 때 -> 복사된 소스코드 파일들 중 단 하나라도 변경이 있으면 실행된다. (즉, 변동사항이 없으면 실행되지 않음)
    - 문제는 해당 명령어가 npm install이라는 것이다. 사실 package.json이 변화한 게 아니라면 굳이 npm install을 또 수행할 필요가 없다.
    - 허나 만약 다른 파일에 변동사항이 있다면, 해당 명령어가 강제되면서 모든 모듈(node_modules)을 다시 받는 문제가 생길 수밖에 없다.
    - 이를 해결하기 위해, RUN 이전에는 package.json만 COPY를 진행하고, RUN 이후에 나머지 다른 소스코드 파일을 COPY 함으로써 모듈 전체를 다시 받는 문제를 해결한 것이라 할 수 있다.

## **생성한 이미지로 Node.js 앱 컨테이너를 띄워보고 로컬에서 접속하는 방법을 이해해보자.**

> `**docker run -d -p 4000:8080 nodej2**`
>

> ***docker run -d -p {로컬 포트}:{컨테이너 포트} {이미지 이름}***
>
- 도커 환경에서 띄운 서버를 로컬에서 접속하기 위해선, 위와 같은 커맨드가 필요하다.

### 실습

***docker run -d -p 4000:8080 bakumando/docker-test1***

을 입력해보았다. 만들어 둔 bakumando/docker-test1 이미지를 토대로 컨테이너를 생성 및 실행하는 커맨드이다.

![img_9.png](Docker 필기/img/img_9.png)

- ***d***: detach 옵션으로서 컨테이너를 실행중인 상태로 두고 빠져나오는 것이다. 만약 붙이지 않으면 도커 내부에서 서버를 띄운 상태를 유지하게 된다.
- ***p***: 포트 부여 및 연결을 위한 옵션이다.
- ***{로컬 포트}:{컨테이너 포트}***: 도커 컨테이너에 띄워진 서버를 로컬에서 아무런 연결점 없이 접속하는 것은 불가능하다. 로컬 포트와 컨테이너 포트의 매핑이 필요하다. ***{로컬 포트}:{컨테이너 포트}*** 규칙에 맞게 기입하면 서로 간 연결이 이루어진다. 컨테이너 포트는 index.js에서 확인할 수 있듯이 8080으로 설정해두었고, 로컬 포트는 마음껏 지정해도 좋다. 여기선 4000으로 해보았다.

    ![img_10.png](Docker 필기/img/img_10.png)
- 접속이 정상적으로 이루어짐을 확인할 수 있다.
- 마지막엔 역시 ***{이미지 아이디}***가 들어가게 된다. 즉, ***docker run***과 ***{이미지 아이디}*** 사이에 포트 옵션을 넣으면 되는 것이다.

### 재빌드 효율화 테스트

- 현재 Dockerfile의 COPY 부분은 RUN 이전과 이후로 각각 나뉘어 있다. (RUN 이전: ***COPY package.json ./***, RUN 이후: ***COPY ./ ./***)
- 또한 index.js의 hello world를 -> hi world로 바꾸었다

즉, package.json이 아닌 다른 파일의 소스를 변경한 셈이다.

그리고 아래 커맨드를 수행하였다.

> ***docker build -t kse/docker-test ./***
>

![img_11.png](Docker 필기/img/img_11.png)

4번 스텝에서 npm install이 이루어지지 않고, 캐싱만 한 뒤 끝이 났음을 확인할 수 있다. RUN 이전에 복사된 파일이 이전 빌드와 달라진 게 없다면 RUN이 수행되지 않는 것이다.

![img_12.png](Docker 필기/img/img_12.png)

마지막으로 index.js의 소스코드가 변경된 결과가 반영되었는지도 포트 접속을 통해서 확인해보자.

![img_13.png](Docker 필기/img/img_13.png)

소스코드 변경이 정상적으로 이루어졌음이 확인되었다.

## **Docker Volume을 통해 로컬 디렉토리의 파일을 복사할 필요 없이, 컨테이너에서 직접 참조하는 방법을 이해한다.**

> `**docker run -p 4000:8000 -v /usr/src/app/node_modules -v $(pwd):/usr/src/app kse/docker-test**`
>
- 이전 챕터를 통해 Dockerfile의 COPY 구역을 RUN 이전과 이후로 나누어 줌으로써 재빌드 시에 불필요한 모듈 다운을 방지하는 방법에 대해 살펴보았다.
- 다만 아직도 ***불편한 점***이 있다면, 소스코드 변경시 마다 재빌드를 해주고 다시 컨테이너를 실행해줘야 변경된 소스가 반영된다는 점일 것이다.
- 이러한 방식은 시간적으로나 비용적으로나 비효율적이며, 이미지를 지속해서 많이 빌드하게 되는 문제점이 있다.
- 이를 해결하기 위해 사용되는 방법이 **Docker Volume**이다.

### Docker Volume

- Docker Volume은 도커 컨테이너에서 직접 로컬 디렉토리에 있는 파일들을 매핑(참조)해서 사용한다.
- 로컬 디렉토리의 파일을 도커 컨테이너에 복사할 필요가 없게 되는 것이다.
- 형식은 아래와 같다.

> **docker run -p 4000:8000 -v {매핑하지 않을 컨테이너 경로} -v $(pwd):{매핑할 컨테이너 경로} {이미지 아이디}**
>
- 첫번째 -v옵션: ***-v*** 뒤에, 로컬에서 ***{매핑하지 않을 컨테이너 경로}***를 넣는다. 보통 모듈 파일 경로를 여기에 적용한다. 그렇지 않으면 이어질 ***-v $(pwd):{매핑할 컨테이너 경로}***에서 로컬 경로의 모듈 파일도 매핑에 해당될 것이다. 문제는 로컬에선 npm install을 진행하지 않았기 때문에node_modules(모듈 파일)이 존재하지 않는다는 점이다.

**!!** 첫번째 -v옵션을 주지 않으면 아래와 같은 에러가 발생하게 된다

![img_14.png](Docker 필기/img/img_14.png)

따라서 첫번째 -v옵션을 적용함으로써 에러 발생을 방지하고, 컨테이너에 있는 모듈 파일을 활용할 수 있게 된다.

- 두 번째 -v옵션: ***`:(콜론)`*** 을 경계로***$(pwd)***와 **{매핑할 컨테이너 경로}**를 넣어주면 된다.
- ***pwd***는 로컬의 현재 경로 값을 뜻한다.
- ***:(콜론)***은 포트 연결에서도 확인했듯이 전후를 매핑할 때 쓰이는 키워드이다.
- 즉, ***pwd(로컬의 현재 경로)***에 있는 파일들이 ***{매핑할 컨테이너 경로}***에 있는 파일들을 대체해서 컨테이너가 실행되는 것이다.

- volume은 다 좋지만 아무래도 매핑 관계의 디테일한 설정을 해야하기 때문에 **커맨드가 굉장히 길어진다는 점은 단점이 있다.**
    - 나중에  배우지만 **`docker-compose`**와 **`yml`** 파일을 통해 이러한 단점을 해결할 수 있다.

### 실습

- server.js의 hi world를 hello hi world로 바꿔보았다.

```jsx
const express=require('express');

const PORT=8080;

const app=express();

app.get('/', (req, res) => {
    res.send("hello hi world");
})

app.listen(PORT, ()=>{
    console.log('Server is running');
})
```

- 그리고 아래 명령어를 실행해보았다.
- ***`docker run -p 5500:8080 -v /usr/src/app/node_modules -v ${pwd}:/usr/src/app kse/docker-test1`***

![img_15.png](Docker 필기/img/img_15.png)

![img_16.png](Docker 필기/img/img_16.png)

- hello hi world가 확인되었다.
- 재빌드하지 않았음에도 변경된 소스코드를 바탕으로 컨테이너를 실행하는데 성공한 것이다.