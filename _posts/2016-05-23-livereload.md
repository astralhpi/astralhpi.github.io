---
layout: post
title:  "Browersync+cocos2d-x로 live reload 구성하기"
date:   2016-05-23 15:28:45
categories: book
---
# 목적
 대부분의 개발에서 코딩과 결과물을 확인하는 주기를 짧게 하는 것은있게 생산성에 도움이 될 뿐만 아니라 좀 더 즐거운 개발이 가능하게 합니다. 작성한 코드로 결과물이 발전해나가는 것을 빠르게 확인하고, 목표를 작게 자르고 달성해나가는 것은 정말 즐겁고 보람있습니다.

 이 글의 목적은 cocos2d-x(jsb) 와 browsersync를 활용하여, 코드 저장 즉시 결과물을 확인할 수 있는 live reload를 구성하는 것입니다. live reload는 코딩과 결과물까지의 확인까지의 주기를 매우 짧게 해주며, 이를 통해 빠르고 즐겁게 게임 개발을 할 수 있게 도와줍니다.

# 소개
## cocos2d-x (javascript)
cocos2d-x는 2D 게임 개발을 위한 오픈소스 멀티 플랫폼 프레임워크입니다.  유니티를 제외하면 2D 모바일 게임 개발을 위해 가장 흔히 선택되는 프레임워크이기도 합니다. cocos2d-x를 사용할 때에는 개발 언어로 C++, lua, javascript 중 하나를 선택할 수 있습니다. 구조는 아래와 같습니다.

 ![cocos2d-x의 아키텍쳐](/assets/cocos2dx.png)

이중, 이번에 사용할 것은 javascript API입니다. javascript API를 사용하면, 엔진으로 웹에서는 Cocos2d Javascript 엔진을, 네이티브 플랫폼에서는 C++ engine을 사용할 수 있습니다. 모든 API가 완벽하게 호환되는 것은 아니지만, 대부분의 API가 호환되며, javascript로 게임을 개발하면 하나의 소스로 Web, Android, iOS등 다양한 플랫폼을 타겟으로 빌드를 할 수 있습니다.

## Browsersync
 Browsersync를 사용하면 웹 개발에서 live reload를 구성할 수 있습니다. 적절하게 세팅해주면, 코드 및 리소스가 변화하는 즉시 브라우저에 반영됩니다. Browersync는 gulp와 grunt 등의 node용 빌드 툴들과 통합될 수 있습니다.

# 구성하기
## requirements
- node

## cocos2d-x 설치
https://github.com/cocos2d/cocos2d-x
를 참고하여 cocos2d-x를 설치합니다.

## 프로젝트 생성
터미널에서 아래와 같이 명령어를 입력해줍니다. (boilerplate는 프로젝트 이름입니다.)

    $ cocos new -l js boilerplate

## 프로젝트 실행해보기
cocos의 기본 기능으로 web에서 프로젝트를 실행해봅니다.

     $ cocos run -p web

## npm 프로젝트 시작하기

    $ npm init

## gulp와 browsersync 설치하기
https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md

     $ npm install --global gulp-cli
     $ npm install --save-dev gulp browser-sync

## gulpfile 만들기
실질적으로 이 부분이 프로젝트를 live reload 되도록 구성하는 부분입니다. 프로젝트 루트 경로에 gulpfile.js를 아래와 같이 만들어 줍니다.

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch("src/*.js").on('change', browserSync.reload);
    gulp.watch("./index.html").on('change', browserSync.reload);
});

## 실행 및 테스트

     $ gulp browser-sync

를 실행하면 웹브라우저에서 위에서 실행해봤던 Hello World 화면이 뜰 것입니다. 이 상태에서 src/app.js 파일을 수정하고 저장하면, 해당 내용이 웹브라우저에 자동으로 반영되는 것을 확인할 수 있을 겁니다.

# 나아가서
본 포스트에서는 cocos2d-x (javascript)와 browsersync, gulp를 사용하여 live reload를 구성해봤습니다. gulp를 사용하기 때문에 나아가, 자신의 환경과 문제에 맞춰 다양한 빌드 프로세스와 live reload를 연동할 수 있습니다. 예를 들어,

* browserify나 webpack으로 CommonJS 스타일로 모듈 사용하기
* babel을 연동하여, ECMAScript 6 사용하기
* javascript 대신 coffeescript 사용하기
* 리소스 빌드 파이프라인 추가하기

등 여러가지 방식으로 응용할 수 있습니다.
