---
layout: post
title: "Beautiful Soup와 Requests"
date: 2014-05-13
category: python
---

 요즘 문래빗에서는 "판타지x러너즈2"의 일본 출시를 준비하고 있는 중이다. 순조롭게 준비 중이지만 개인적으로는 한가지 불편한 점이 있었다. 퍼블리셔인 Nexon Japan에서 사용하는 BTS가 Noss라는 자체 제작한 것으로 보이는 웹 프로그램인데, 아래와 같은 문제점들이 있다.

 1. 담당자를 지정하는 기능이 없다.
 2. 검색 기능이 빈약하다. 옛날 게시판처럼, title/content/작성자등 타겟을 지정하고 검색하는 방식이다.
 3. 필터 기능이 빈약하다. 예를 들어 Complete된 이슈는 숨기고 남은 이슈들만 볼 수가 없다.

 이러한 문제들 때문에 내가 어떤 이슈를 처리해야하고, 남은 이슈가 어떤 것이 있는 지 파악하는 것이 무척이나 힘들다. 당장 임시로 매니징을 맡고 있는 나도 파악이 안되는데, 이슈에 대응해야하는 입장에서는 더욱 난감할 것 같았다. 새삼스럽게 redmine이 얼마나 좋은 툴이었는지 느낄 수 있었다.

 불편함이 있으면 개선이 필요한 법. Noss를 주기적으로 모니터링하면서 새로 작성되거나 변경된 이슈들을 기존에 사용하던 redbooth 쪽에 동기화해주는 python 스크립트를 작성하기로 했다.

# [requests](http://docs.python-requests.org/en/latest/)

 우선 시작은 Noss에서 데이터를 가져오는 것부터 시작하기로 했다. python의 urllib2를 사용해서 가져오려고 했으나, Noss가 계정 인증을 위해 쿠키를 사용하다보니 귀찮은 부분이 있었다. 그래서 편리하게 Noss에 로그인하고 데이터를 가져오는 방법을 찾아보기로 했다.

 그래서 찾은 것이 python 모듈인 '[requests](http://docs.python-requests.org/en/latest/)'이다. 'requests'는 'HTTP for Human'을 표방하는 HTTP 클라이언트 라이브러리이다. 실제로 python 기본 urllib 모듈 시리즈보다 사람이 직관적으로 사용하기 편리한 형태였다. 아래는 사용 예이다.

    >>> r = requests.get('https://api.github.com/user', auth=('user', 'pass'))
    >>> r.status_code
    200
    >>> r.headers['content-type']
    'application/json; charset=utf8'
    >>> r.encoding
    'utf-8'
    >>> r.text
    u'{"type":"User"...'
    >>> r.json()
    {u'private_gists': 419, u'total_private_repos': 77, ...}

 파라미터를 넣어 http request를 하는 것도 상당히 편리하다.

    >>> payload = {'key1': 'value1', 'key2': 'value2'}
    >>> r = requests.get("http://httpbin.org/get", params=payload)

 가장 마음에 드는 부분은 session object였다. session object는 같은 session object를 사용하는 request 전반에 헤더와 같은 파라미터들과 cookie를 유지시킬 수 있도록 도와준다.

    s = requests.Session()

    s.get('http://httpbin.org/cookies/set/sessioncookie/123456789')
    r = s.get("http://httpbin.org/cookies")

    print(r.text)
    # '{"cookies": {"sessioncookie": "123456789"}}'


 내 용도에 딱 맞는 기능이었다. 쿠키 유지시키는 등의 처리가 귀찮아서 편하게 사용할 모듈을 찾았던 것이니까. session object를 사용하면 마치 웹브라우저를 사용하듯이 http request에 대한 처리를 쉽게 짤 수 있었다.

# [Beautiful Soup](http://www.crummy.com/software/BeautifulSoup/bs4/doc/)

 http request를 하고, response를 받는 것까지는 requests를 사용하여 손쉽게 해결했다. 하지만, html을 분석하고 원하는 정보를 가져오는 것은 별도의 문제이다. 특히, Noss는 오래전에 개발되었는지 각 태그에 class 속성을 지정해주는 경우가 거의 없었다. 이런 상태라면 원하는 데이터만 가져오는 것도 상당히 귀찮은 문제가 될 것 같았다.

 당연히, 이런 상황에서 사용할만한 모듈이 있을 것이라는 생각에 구글링해보니까 바로 beautiful soup이 나왔다. [beautiful soup](http://www.crummy.com/software/BeautifulSoup/bs4/doc/)은 손쉽게 html과 xml 파일에서 원하는 부분을 검색하고, 수정할 수 있는 모듈이다. requests와 마찬가지로 지금 용도에는 딱 맞는 모듈이었다.

 예를 들어, input 태그 중 'idx'라는 name과 'hidden'이라는 type을 가진 태그를 찾으려면 아래와 같이 코딩하면 된다.

    soup.find('input', {'name': 'idx', 'type': 'hidden'})['value']

위와 같은 방식으로 쉽게 html 페이지로부터 원하는 정보만 가져올 수 있었다. 특히, Noss 같은 경우 HTML에 하드 코딩된 style들이 많았는데, beautiful soup에서는 아래처럼 편하게 검색이 가능했다.

    cell.find('td', style='border-right:#DEDEDE 2px solid;padding-top:5;', valign='top')

 만약 직접 html tree를 분석하는 경우에는 꽤나 귀찮았을 것이다.

 상당히 유명한 모듈인지, 지금 보니 [한국어 문서](http://coreapython.hosting.paran.com/etc/beautifulsoup4.html)도 있다.
