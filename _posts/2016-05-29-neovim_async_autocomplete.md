---
layout: post
title:  "neovim과 비동기 자동완성"
date:   2016-05-29
categories: programing
---

 4달 전부터 neovim을 사용하고 있다. IDE보다 텍스트 에디터를 선호하게 된 이후로
vim, sublime text, atom 등의 텍스트 에디터를 써왔는데 지금은neovim에
무척만족하고 있고, 별다른 이슈가 없다면 neovim을 계속 사용할 생각이다.

 neovim의 [비전](https://neovim.io/charter/)에 공감이 가기도 했지만,
neovim을사용하게 된 직접적인 이유는 비동기 플러그인이 가능한[Plugin UI
architecture](https://github.com/neovim/neovim/wiki/Plugin-UI-architecture)를
가지고 있기 때문이었다.

 그동안 게임 개발을 위해 주로 Unity3d 엔진과 C#을 사용했는데, 기본 IDE인
MonoDevelop이 썩 마음에 들지 않았다. 미묘하게 반응성이 안 좋은 것도 그렇고,
전반적으로 내 입맛에 맞게 세팅해두고 사용하기도 어려웠다. Windows 환경에서
개발한다면 Visual Studio를 사용하는 방법도 있었지만, OSX를 사용하는 나에겐
적절한 대안이 아니었다. 당시에 주로 사용하던 sublime text를 사용하려고 했지만,
적어도 나에겐 C#은 자동완성 기능 없이 코딩하기에는 너무 고통스러운 언어였다.
그래서 찾았던 것이
[omnisharp-vim](https://github.com/OmniSharp/omnisharp-vim)이었다.
 
 omnisharp-vim은 vim을 C# IDE처럼 쓸 수 있게 해주는 플러그인이다. 다만 vim이
비동기 플러그인 제작이 어렵기 때문에, 자동완성 후보를 가져오는 동안 vim 자체가
blocking 되는 이슈가 있었다. 우리 프로젝트에서는 그 blocking 시간이 0.5~1초
정도 되었는데, 이래서는 텍스트 에디터를 쓰는 보람이 없었다. 훌륭하게도,
omnisharp-vim의 IDE 기능들은 OmniSharp server라는 서버로 나누어져 있었다.
이전에 sublime text 플러그인 중
[anaconda](https://github.com/DamnWidget/anaconda)라는 python IDE 플러그인이
서버-클라이언트 구조로 비동기 자동완성을 구현한 것을 본 적이 있었기 때문에
[omnisharp-sublime](https://github.com/OmniSharp/omnisharp-sublime)이라는
비동기 자동완성 플러그인을개발해서 사용했었다. 

 이런 경험을 하면서 아쉬웠던 것은 vim의 플러그인들이 동기 방식으로 동작한다는
점이었다. 이전부터 vim을 주력으로 쓰려고 시도할 때마다 걸렸던 것은 플러그인,
특히 자동 완성 플러그인을 사용하면 vim이 비약적으로 느려진다는 점이었다. 텍스트
에디터 역할 본연에만 집중하고 나머지는 shell을 활용하는 작업 흐름은 마음에
들었지만, IDE 환경에서 개발을 시작했던 나에겐 자동완성을 완전히 포기하기는
쉽지 않았다.

 neovim은 이 문제를 훌륭하게 해결했다. 그 뿐만 아니라, VimL이 아닌 python, lua,
nodejs, ruby 등 이미 익숙한 언어로 플러그인을 손쉽게 개발할 수 있게 해주었다.
neovim 플러그인 중, [deoplete](https://github.com/Shougo/deoplete.nvim)을
사용하면 간단하게 원하는 언어에 대한 비동기 자동완성을 구현할 수 있다. 실제로
급한데로 omnisharp-vim의 자동완성 부분만 deoplete를 통해 비동기자동완성을 하는
[플러그인](https://github.com/astralhpi/deoplete-omnisharp)을 짜서
사용했는데, vim으로 Unity C# 코딩을 원활하게 할 수 있었다.

 neovim에서는 그동안 vim으로는 어려웠던 무거운 자동완성 플러그인도 사용할 수
있게 되었다. 적어도 자동완성이 필요한 개발자가 vim을 외면하게 문제를
해결한 것이다. python, ruby, nodejs등으로 손쉽게 플러그인을 구현할 수 있는 점도
이슈가 생기면 플러그인을 개발해서 해결하면 된다는 안정감을 준다. 
