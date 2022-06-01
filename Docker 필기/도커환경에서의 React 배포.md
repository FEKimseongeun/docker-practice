# 간단한 어플을 실제로 배포해보기 (개발부분)

- 개발 환경과 배포 과정

![](https://velog.velcdn.com/images/kansun12/post/c6d97600-5773-471d-99ea-90f7ce320694/image.png)


- **리액트 설치 방법**
    - `npx create-react-app <리액트를 설치하고자 하는 디렉토리 이름>`
- 리액트 어플리케이션을 실행할 때에는 아래 명령어를 입력하면 된다.
    - **개발 단계** : `npm run start`
    - **테스트 단계** : `npm run test`
    - **빌드 단계** : `npm run build`

→ 이렇게까지 하면 배포를 할 때 사용할 수 있는 **build 폴더**와 그 안에 많은 파일들이 생성된다.

![](https://velog.velcdn.com/images/kansun12/post/e024932e-4174-45ee-ad45-5ff6fec8a38f/image.png)

![](https://velog.velcdn.com/images/kansun12/post/724c7ad2-b4d1-49d6-acc7-01de1a3252af/image.png)

## 도커를 이용하여 개발단계에서 리액트 실행하기

- 도커로 어플을 실행하기 위해서

  ![](https://velog.velcdn.com/images/kansun12/post/9bd8b217-596e-41e8-b404-3327f7123eb0/image.png)


### Dockerfile.dev

![](https://velog.velcdn.com/images/kansun12/post/9a27f9af-0065-44bd-9e39-4be29f8e4716/image.png)

개발 환경에서의 도커 파일 작성은 현재까지 도커 파일 작성했던 것과 똑같이 해주면 된다

- `dockerfile.dev`를 작성해보자.

    ```docker
    FROM node:alpine
    
    WORKDIR /usr/src/app
    
    COPY package.json ./
    
    RUN npm install --
    
    COPY ./ ./
    
    CMD ["npm", "run", " start"]
    ```


이렇게 작성 후에 빌드를 시켜보면 된다.

빌드를 해보면 이런 에러가 발생한다.

![](https://velog.velcdn.com/images/kansun12/post/eef0e02f-a2b2-4833-a1f8-ed8e58a1bb64/image.png)

이미지를 빌드할 때 해당 디렉토리만 정해주면 dockerfile을 자동으로 찾아서 빌드하는데 현재는 dockerfile이 없고 `dockerfile.dev`밖에 없다. 따라서 자동으로 올바른 도커 파일을 찾지 못해 에러가 발생하게 되는 것이다.

### 해결책

임의로 build 할 때 어떤 파일을 참조할 것인지 알려주는 조건을추가하면 된다.

명령어로 `docker build -f[Dockerfile.dev](http://Dockerfile.dev)./` 이렇게 명령어를 입력해주면된다.

![](https://velog.velcdn.com/images/kansun12/post/7a8c963f-f598-4579-8850-26ea4c221601/image.png)

![](https://velog.velcdn.com/images/kansun12/post/f77d95e1-3cea-4977-aaa9-61a23a1d5eb1/image.png)

즉, 이런식으로 `-f` 옵션을 이용해서 해보면 개발 단계에서 리액트를 실행하게 해 줄 이미지 빌드가 가능해지는 것이다.


> 💡 현재 로컬 머신에 node_modules 폴더가 있을텐데 이곳에는 리액트 앱을 실행할 때 필요한 모듈들이 들어있지만 이미지를 빌드할 때 이미 npm install로 모든 모듈들을 도커 이미지에 다운 받기 때문에 굳이 로컬에서 **node_modules를 필요로하지 않는 강점이 존재 따라서 도커 환경에서는 node_modules를 지워줘도 됨!!!**
![](https://velog.velcdn.com/images/kansun12/post/aab6985b-56a2-4fdf-9654-fc4970f29674/image.png)

### 생성된 도커 이미지로 리액트 실행하기

`docker run [이미지 이름]` 명령어를 사용하면 된다.

이렇게 하면 localhost:3000에서 창이 뜨지 않는다. 이유는 예전에 했던 것과 같이 포트 매핑을 해줘야하는데 안 해줬기 때문!

![](https://velog.velcdn.com/images/kansun12/post/dbee0ff0-61ea-491f-aa0b-23baf618056c/image.png)

따라서, `**docker run -it -p 3000:3000 [이미지 이름]**`

![](https://velog.velcdn.com/images/kansun12/post/b04aafec-ed1b-4f6b-9966-82e4e02acbbf/image.png)

## COPY와 VOLUME의 차이

- COPY

  ![](https://velog.velcdn.com/images/kansun12/post/37190115-e286-40cd-a121-8571ca5b5be0/image.png)

- Volume

  ![](https://velog.velcdn.com/images/kansun12/post/09cea172-2067-43e1-ac00-6db8cbda68b0/image.png)


### Volume 사용해서 어플리케이션 실행하기

`**docker run -p 3000:3000 -v /usr/src/app/node_modules -v ${pwd}:/usr/src/app [이미지 아이디]**`

![](https://velog.velcdn.com/images/kansun12/post/c5e714a7-3c68-418c-9bed-da909fe6ddf3/image.png)

- 작동과정

  ![](https://velog.velcdn.com/images/kansun12/post/91e850ff-2767-4bfa-8254-d63e9c65b114/image.png)

- 이렇게 볼륨까지 설정했으면 소스를 변경해서 바로 변경된 것이 반영이 되는지 확인한다.

![](https://velog.velcdn.com/images/kansun12/post/935aa8c3-3179-4a0f-825a-c47399a1a483/image.png)

명령어를 입력하고 확인해봄ㄴ 브라우저에 잘 뜨는 것을 볼 수 있다.

![](https://velog.velcdn.com/images/kansun12/post/2c4d35ea-33ec-4377-8aa6-3a1a05de60db/image.png)

소스코드를 수정했을 때 실시간으로 반영이 되는 것도 확인하였다.

## 도커 컴포즈로 좀 더 간단하게 앱 실행

앞서 썼던 명령어가 너무 길었다.

그래서 docker compose를 이용해서 해결한다.

일단 docker-compose.yml 파일부터 생성시킨다.

```yaml
version: "3"
server:
  react:
    build:
      context: .
      dockerfile : Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - /usr/src/app/node_modules
      - ./:/usr/src/app
    stdin_open: true
```

![](https://velog.velcdn.com/images/kansun12/post/7c137c26-e1c8-44d0-ac2e-dd04afae986f/image.png)

이렇게 yaml 파일을 만들어준 후에 `**docker-compose up`** 명령어를 입력해주면 된다.

### 리액트 앱 테스트하기

- 보통 리액트 앱에서 테스트를 진행하려

  `npm run test` 를 사용하긴하는데

- 도커 환경에서는….
    - yaml 파일에서 추가 코드 생성

    ```yaml
    tests:
    	build:
    		context: .
    		dockerfile: Dockerfile.dev
    	volumes:
    	- /usr/src/app/node_modules
    	- ./:/usr/src/app
    	command: ["npm","run","test"]
    ```

    - test : 컨테이너 이름

  이렇게 만들어놓고 보면 기존에 있던 컨테이너와 테스트라는 컨테이너 두 개가 다 시작하게 된다.

  **`docker-compose up —build`** 를 입력해주면 된다.


## 운영환경을 위한 Nginx

- 필요한 이유
    - 우선 개발환경에서 리액트가 실행되는 과정을 보면 이런 구조를 갖고있다.

      ![](https://velog.velcdn.com/images/kansun12/post/cf997df1-569c-463b-8ea3-2dbca7ccefea/image.png)

    - 운영 환경에서는?

      ![](https://velog.velcdn.com/images/kansun12/post/8628d7e8-bef0-4980-a5ea-79caaade8629/image.png)

- 운영환경과 개발환경을 따로 써야하는 이유
    - 개발에서 사용하는 서버는 소스를 변경하면 자동으로 전체 앱을 다시 빌드해서 변경 소스를 반영해주는 것같이 개발 환경에 특화된 기능들이 있다.
    - 운영환경에서는 소스를 변경할 때 다시 반영해 줄 필요가 없으며 개발에 필요한 기능들이 필요하지 않기에 더 깔끔하고 빠른 Nginx를 웹서버로 많이 사용한다.

---

### 운영환경 도커 이미지를 위한 Dockerfile 작성하기

> Nginx를 포함하는 리액트 운영환경 이미지 생성해보기
>

그 전에 개발환경과 운영환경의 도커 구조 보기

![](https://velog.velcdn.com/images/kansun12/post/90e97c98-cd3d-42a5-9c0d-f0253bddb1aa/image.png)

- 개발 환경에서는 build를 할 필요가 없는데 운영환경에서는 build를 해줘야 하므로 cmd 에 npm run build로 빌드 파일들을 생성해주며 그 이후에 Nginx를 시작해줘야함.

**`Dockerfile`**

```docker
FROM node:alpine as builder
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
```

- builder를 nginx가 제공해줄 수 있는 파일 경로에 복사

![](https://velog.velcdn.com/images/kansun12/post/238b7486-c0a5-43a2-9e5c-654eaf022df4/image.png)

- **docker 이미지 생성**

`docker build -t 이미지이름 .`

- **이미지를 이용해 앱 실행**

`docker run -p 8080:80 이미지 이름` (nginx의 기본 사용포드가 **80**)