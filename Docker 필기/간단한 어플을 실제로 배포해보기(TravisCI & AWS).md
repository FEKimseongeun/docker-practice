## Travis CI란?

[Travis CI](https://travis-ci.org/) 는 [Github](https://github.com/) 에서 진행되는 오픈소스 프로젝트를 위한 지속적인 **통합(Continuous Integration)** 서비스이다.

2011년에 설립되어 2012년에 급성장하였으며 `Ruby언어`만 지원하였지만 현재 대부분의 개발 언어를 지원하고 있다.

Travis CI를 이용하면 Github repository에 있는 프로젝트를 특정 이벤트에 따라 자동으로 테스트, 빌드하거나 배포할 수 있다. Private repository는 유료로 일정 금액을 지불하고 사용할 수 있다.

### **Travis CI의 흐름**

> 로컬 Git → Github → Travis Cl → AWS

## **Travis CI 이용 순서**

깃헙에 소스를 올렸을 때 Travis CI에서 그 소스를 가져가야 하기에 깃헙과 Travis CI가 연결되어 있어야 한다.

> Travis Cl 사이트로 이동 : [https://travis-ci.org/](https://travis-ci.org/)

> Travis CI에 로그인 할때 깃헙 아이디로 로그인
>
>
> ![](https://velog.velcdn.com/images/kansun12/post/4e0e89ba-3cb0-4023-88b6-6f6dcabb7f13/image.png)
>

> Settings 페이지로 이동 후 깃헙에 올린 도커 레파지토리 찾기
>
> ![](https://velog.velcdn.com/images/kansun12/post/ce8699cc-f0ac-41b6-87fe-f68978ba26e9/image.png)
>

> Dashboard로 이동하면 뜨는 화면
>
> ![](https://velog.velcdn.com/images/kansun12/post/d65f8113-7964-4d47-b6cd-43fc784d266b/image.png)
>

---

- Github에서 Travis CI로 소스를 어떻게 전달시킬 거며 전달받은 것을 어떻게 Test 하며 그 테스트가 성공했을 때 어떻게 AWS에 전달해서 배포를 할 것인지를 설정해주어야 한다.
- 이러한 설정을 위해서는 **Docker에서는 docker-compose.yml**에 무엇을 할지를 작성해줬다면 **Travis CI에서는 .travise.yml** 파일에서 해준다.

![](https://velog.velcdn.com/images/kansun12/post/69fe4f95-1006-4511-9a5c-5dfd29fb97a5/image.png)

---

## **.travis.yml 파일 작성하기 (테스트까지)**

> Travis CI를 이용해서 테스트 코드를 실행하고 애플리케이션을 배포까지 해주어야 하는데 그러기 위해서는 travis.yml파일을 작성해 주어야 한다.

![](https://velog.velcdn.com/images/kansun12/post/59313685-af84-4ccc-83ea-84eb9c8bfada/image.png)

### .travis.yml 코드

![](https://velog.velcdn.com/images/kansun12/post/2b16b04d-900a-42b1-971e-53d2d324807f/image.png)

- `sudo` : 관리자 권한 갖기
- `language` : 언어(플랫폼)을 선택
- `services` : 도커 환경 구성
- `before_install` : 스크립트를 실행할수 있는 환경 구성
- `script` : 실행할 스크립트(테스트 실행)
    - `CI= true` 해줘야 에러가 안남
    - `coverage`  : 테스트 한 것을 더 상세하게 보여줌.
- `after_success` : 테스트 성공 후 할 일

### travis에서 뜨는 화면

![](https://velog.velcdn.com/images/kansun12/post/581b1c13-8206-408a-9bde-0ba37afedb9d/image.png)

![](https://velog.velcdn.com/images/kansun12/post/3f4a006c-e14a-4347-a0c4-1d19be75fba2/image.png)

아래 job config를 쭉 확인해보면 내가 설정한대로 잘 나왔음을 확인할 수 있다.

---

# **AWS 알아보기**

![](https://velog.velcdn.com/images/kansun12/post/1475d6ba-9852-43a6-9fb0-b9479b85113c/image.png)

### 배포하는 순서

> AWS 사이트로 가기 : [https://aws.amazon.com/](https://aws.amazon.com/)

> 회원 가입하기 : 신용 카드 등록을 해야 함

> AWS Dashboard로 오기

> Elastic BeanStalk 검색


### EC2란 무엇인가? (Elastic Compute Cloud)
![](https://velog.velcdn.com/images/kansun12/post/08c84f42-199e-4965-b5d2-7794c7b4bdfb/image.png)

<aside>
💡 Amazon Elastic Compute Cloud(Amazon EC2)는 Amazon Web Services(AWS) 클라우드에서 확장식 컴퓨팅을 제공합니다. Amazon EC2를 사용하면 하드웨어에 선투자할 필요가 없어 더 빠르게 애플리케이션을 개발하고 배포할 수 있습니다. Amazon EC2를 통해 원하는 만큼 가상 서버를 구축하고 보안 및 네트워크 구성과 스토리지 관리가 가능합니다. 또한 Amazon EC2는 요구 사항이나 갑작스러운 인기 증대 등 변동 사항에 따라 신속하게 규모를 확장하거나 축소할 수 있어 서버 트래픽 예측 필요성이 줄어듭니다.

</aside>

**=> 한 대의 컴퓨터를 임대한다고 생각하면 됨**. 그리고 그 컴퓨터에 OS를 설치하고 웹서비스를 위한 프로그램들(웹서버, DB)을 설치해서 사용  하면 된다. 1대의 컴퓨터를 하나의 EC2 인스턴스라고 부릅니다.


### EB란 무엇인가 ? (Elastic BeanStalk)

![](https://velog.velcdn.com/images/kansun12/post/c56a83db-ea3e-45d1-b1b0-8ccbe75d4706/image.png)
<aside>
💡 AWS Elastic Beanstalk는 Apache, Nginx 같은 친숙한 서버에서 Java, NET, PHP, Node.js, Python, Ruby, Go 및 Docker와 함께 개발된 웹 응용 프로그램 및 서비스를 배포하고 확장하기 쉬운 서비스입니다.아래서 보는 도표와 같이 Elastic Beanstalk은 EC2 인스턴스나 데이터베이스 같이 많은 것들을 포함한 "환경"을 구성하며 만들고 있는 소프트웨어를 업데이트할 때마다 자동으로 이 환경을 관리해줍니다.

</aside>

⇒ 환경이고 이 환경 안에서 많은 것들을 관리할 수 있다고 보면 됨.
![](https://velog.velcdn.com/images/kansun12/post/c74d11ce-0fe9-4d14-9503-23df341474e8/image.png)


---

## **Elastic Beanstalk에서 애플리케이션 만들기**

### **새로운 Elastic Beanstalk 환경 만드는 순서**

> Create Application 버튼 클릭

> 어플리케이션 이름 정하기
>
![](https://velog.velcdn.com/images/kansun12/post/b611a736-d3bd-41c6-95aa-bab640f29ad1/image.png)
>

> 어플리케이션 플랫폼 선택
>
![](https://velog.velcdn.com/images/kansun12/post/e4983ee8-b4bb-40ad-9802-7e7639ab3ca5/image.png)
>

> Create Application 버튼 눌러서 생성하기

> 앱 생성중이 뜸

> 다 생성 후
>
![](https://velog.velcdn.com/images/kansun12/post/b095f210-82f2-4632-9013-ab82dafa4614/image.png)
>

### **현재 상황 보고 가기**

![](https://velog.velcdn.com/images/kansun12/post/bf103b02-d3d7-4f19-9307-05c0f9a91961/image.png)

**트래픽이 많지 않을때**

![](https://velog.velcdn.com/images/kansun12/post/6da1ac5c-4e26-4504-8520-85b5c836bbb6/image.png)

**트래픽이 많아 질때**

![](https://velog.velcdn.com/images/kansun12/post/e9085916-4f78-48e6-af04-8ca7b8b0b5b3/image.png)

- EC2 인스턴스 하나로 트래픽이 많아졌을 때의 요청을 다 감당할 수 없기 때문에 하나 더 이용이 되면서 잘 연결될 수 있도록 하는 것이 **로드 밸런서**라고 보면 된다

---

## **.travis.yml 파일 작성하기 (배포 부분)**

현재는 도커 이미지를 생성 후 어플을 실행하여 테스트하는 부분까지 travis 설정을 하였는데,

이제는 테스트에 성공한 소스를 AWS Elastic Beanstalk에 자동으로 배포하는 부분을 travis 파일에 넣어줄 차례

```yaml
deploy:
  provider: elasticbeanstalk
  region: "us-west-2"
  app: "docker-react-app"
  env: "Dockerreactapp-env"
  bucket_name: "elasticbeanstalk-us-west-2-896153392792"
  bucket_path: "docker-react-app"
  on:
    branch: master
```

- `provider` :  외부 서비스 표시 (s3, elasticbeanstalk, firebase 등)
- `region` : 현재 사용하고 있는 AWS 의 물리적 장소 (종류가 굉장히 많음)

  ![](https://velog.velcdn.com/images/kansun12/post/14f33483-02da-470e-af9d-23139f4f062f/image.png)

- `app` : 생성한 애플리케이션의 이름
- `env` :

  ![](https://velog.velcdn.com/images/kansun12/post/eed10e6b-7b15-4587-936d-eedb4978c30f/image.png)

- `bucket_name` : 해당 일래스틱 빈스톡을 위한 s3 버킷 이름

  > `Travis CI` - `travis 에서 가지고 있는 파일을 압축해서 S3에 보낸다`. → `S3`
  >
  > - `S3` : 파일들을 안에 저장해두는 서비스
  > - 엘라스틱 빈스톡을 생성할 때 자동적으로 S3가 생성 됨 → 자동으로 S3 버켓이 생성되는 것.
  >![](https://velog.velcdn.com/images/kansun12/post/447112d5-3c90-46be-a96c-933f61b99207/image.png)
  >
  > - **이 빈스톡 안에 travis CI에서 파일을 보내면 그 파일들을 저장하게 되는 것임!**
- `bucket_path` : 애플리케이션의 이름과 동일
- `on`
    - `branch` : 어떤 브랜치에 푸시할 때 AWS에 배포할 것인지 설정

> 하지만 이렇게 아무런 인증 없이는 Travis CI에서 마음대로 AWS에 파일을 전송할 수는 없다. 그래서 이제는 Travis CI가 AWS에 접근할 수 있게 해 주는 방법을 알아보자.

---

## **Travis CI의 AWS접근을 위한 API 생성**

### **소스 파일을 전달하기 위한 접근 요건**

- `깃허브`
    - Travis CI 에  로그인하는 과정에서 깃허브 계정을 연동함으로써 인증 완료
- `Travis CI`
    - AWS에서 제공하는 액세스 키와 비밀 액세스 키를 Travis yml 파일에다가 적어주면 됨
- `AWS`

> 인증을 위해서는 API Key가 필요.

### **Secret, Access API Key 받는 순서**

1. **IAM USER 생성**
    - `IAM은 무엇인가 ? (Identity and Access Management)`

        💡 AWS 리소스에 대한 액세스를 안전하게 제어할 수 있는 웹 서비스입니다. IAM을 사용하여 리소스를 사용하도록 인증(로그인) 및 권한 부여(권한 있음)된 대상을제어합니다.
    ![](https://velog.velcdn.com/images/kansun12/post/69deace1-943a-4e23-b6b2-32eca4e424fb/image.png)
    
    - 루트 사용자가 보안상 좋지 않음. 그래서 IAM사용자에게 엘라스틱 빈스톡을 사용할 권한을 제공
    
    > **Dashbord → IAM검색 → 사용자 클릭 → 사용자 추가클릭 → 사용자 세부 정보 설정 →사용자 권한 설정 → 계정 생성 성공**


2. **API키를 Travis yml 파일에 적어주기**
    - 직접 API 키를 Travis yml 파일에 적어 주면 노출이 되기 때문에 다른 곳에 적고 그것을 가져와줘야 한다.
    - Travis 웹사이트 해당 저장소 대시보드에 오기
    - 설정 클릭(More oprions)

      ![](https://velog.velcdn.com/images/kansun12/post/b1539120-ddf2-4188-a043-7d9ee735a816/image.png)

    - AWS에서 받은 API 키들을 NAME과 VALUE에 적어서 넣어준다. 이곳에 넣어 주면 외부에서 접근을 할 수 없어 더욱 안전함.

      ![](https://velog.velcdn.com/images/kansun12/post/b3533892-3f23-4315-82d0-a9f54c5d4beb/image.png)

    - Travis CI 웹사이트에서 보관 중인 Key를 로컬 환경에서 가지고 올 수 있게 travis yml 파일에서 설정을 해줍니다. 이렇게 추가해주면 된다.

        ```yaml
        access_key_id: $AWS_ACCESS_KEY
        secret_access_key: $AWS_SECRET_ACCESS_KEY
        ```



> 이렇게 하고 다시 빈스톡으로 가도 에러가 발생하는데 그 이유는 포트맵핑을 안해줘서 그럼

```yaml
EXPOSE 80
```