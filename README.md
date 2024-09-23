自己アピール:
熱中し、学び、創造することが強みであり、喜びです。6から18まではサッカー、21からはブロックチェーンを中心としてテクノロジーにおいて、この強みを発揮しています。
3年前に独学で技術を学び始め、そこから常に興味や必要性に合わせて勉強を続けています。学んだことを活かして、現在まで合計3社でインターンを経験することができました。個人開発やハッカソンにも積極的に参加し、8月にあったEthTokyoでは、一つプライズも獲得することができました。
また、金融や暗号経済理論などを勉強しながら、DAOのdelegate Platformに参画するなど、開発以外にも視野を広げて活動しています。


開発経験：
ブロックチェーンのみならず、AIを含めて多くの開発経験があります。２年前から合計で3社でインターンをしています。1社目ではwebクローラーの開発(Node.js, python)、2社目ではデジタルフォレンジックシステムの開発(Nuxt.js, Node.js, Python)、現在も参加している3社目では、NFTマーケットプレイスの開発(Next.js, Djangom, Solidity)とAIのプロジェクト(Next.js, Python, langchain.py, LlamaIndex)にリードエンジニアとして携わってきました。実務での開発に加えて、個人開発やハッカソンにも積極的に参加しています。最近では、MEV特化の開発機関の研究に理論の実証という点で参加し、Ethereumのより深い層、プロトコル層への理解を深めています。

やりたいこと：
僕は常に大小たくさんのアイデアがあり、また、増え続けているので、それらを積極的に提案し、多くに人と力を合わせることで、世界で戦えるようなプロトコルやアプリケーションを作りたいです。
とめどない進化を見せるAIによって、ブロックチェーン、特にDefiとSocialは、その必要性を急激に増していると考えています。そのため、暗号屋が、この好機に飛躍できるように尽力したも考えています。




共有した画像はあなたに作ってもらいたいwebサイトを示しています。以下に記す情報を参考にして、webサイトを完成させてください。

<info>
この画面は、mainAreaというコンポーネントを最上位として、そのmainAreaに、introductionとtokensという２つのコンポーネントが横並びに配置されています。
また、画面全体は、背景が画像で、"/aaveng.png"を使用してください。

<mainArea>
mainAreaは画面の上下左右の中心に配置され、以下のスタイルが使用できます。
<mainAreaStyle>
width: 1177px;
height: 510px;
flex-shrink: 0;
</mainAreaStyle>
</mainArea>

<introduction>
introductionは、mainAreaの中の左側に配置され、上から[tabs, display, detailTexts, btn]の4つが縦並びで配置されています。

<introductionStyle>
width: 549px;
height: 339px;
flex-shrink: 0;
</introductionStyle>

<tabs>
introductionの中に縦に並んで配置されるコンポーネントの一番上に配置されるコンポーネントで、tabBtnというコンポーネントとして[about, AAVE, aAAVE, stkAAVE]という４つが横並びで配置されている。
<tabsStyle>
width: 319px;
height: 40px;
</tabsStyle>
<tabBtn>
color: #FFF;
text-align: center;
font-family: Alef;
font-size: 20px;
font-style: normal;
font-weight: 700;
line-height: normal;
</tabBtn>
</tabs>

<display>
displayはtabsの一つ下に配置されている。"SaucyBlock"という文字列を表示している。
<displayTitle>
width: 525px;
height: 139px;
color: #FFF;
font-family: "IBM Plex Sans";
font-size: 110px;
font-style: normal;
font-weight: 200;
line-height: normal;
letter-spacing: -6.6px;
</displayTitle>

</display>

<detailTexts>
displayの一つ下に配置されており、文章を表示している。
<content>
Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange—Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange—
</content>
<detailTextStyle>
width: 474px;
height: 42px;
color: #4E4E4E;
font-family: "IBM Plex Sans";
font-size: 11px;
font-style: normal;
font-weight: 300;
line-height: 16px; /* 145.455% */
</detailTextStyle>
</detailTexts>

<btn>
detailTextsの一つ下に配置される。枠の中に文字列が配置されいる。
<btnStyle>
width: 222.902px;
height: 45px;
border-radius: 15px;
background: rgba(22, 22, 22, 0.20);
</btnStyle>
<btnInnerText>
display: flex;
width: 118.742px;
height: 33px;
flex-direction: column;
justify-content: center;
flex-shrink: 0;
color: #FFF;
text-align: center;
font-family: "IBM Plex Sans";
font-size: 24px;
font-style: normal;
font-weight: 700;
line-height: normal;
</btnInnerText>
</btn>

</introduction>

<tokens>
tokensは、mainAreaの右側に配置されるコンポーネントで、tokenというコンポーネントが3つ縦に並んで配置される。
<tokensStyle>
width: 548px;
height: 510px;
</tokensStyle>

<token>
tokensを構成するコンポーネントで、上下の２つで構成される。上部はmainで下部はinfoです。

<main>
mainは2つのコンポーネントが横並びに並んで配置されます。[iconTitle, delegateBtn]です。
<mainStyle>
width: 548px;
height: 92px;
</mainStyle>
<iconTitle>
iconはmainの内部コンポーネントで、iconとtokenTitleの2つの要素が横並びで配置されいます。
<iconTitleStyle>
width: 246px;
height: 92px;
</iconTitleStyle>
<icon>
iconは円形の画像で、iconTitleの中に配置されます。
<iconStyle>
width: 70px;
height: 70px;
background: url(<path-to-image>) lightgray 50% / cover no-repeat;
</iconStyle>
</icon>

<tokenTitle>
iconの横に配置される文字列を表示するコンポーネントです。
<tokenTitleStyle>
width: 142px;
height: 92px;
color: #FFF;
font-family: "IBM Plex Sans";
font-size: 60px;
font-style: normal;
font-weight: 200;
line-height: normal;
letter-spacing: -3.6px;
</tokenTitleStyle>

</tokenTitle>

</iconTitle>

<delegateBtn>
mainの内部のiconTitleの横に配置されるコンポーネントで、ボタンの機能を果たします。outerとinnerで構成され、outerは外枠、innerは内側の文字列を示します。
<outer>
width: 147px;
height: 45px;
border-radius: 15px;
background: rgba(22, 22, 22, 0.20);
</outer>

<inner>
display: flex;
height: 33px;
flex-direction: column;
justify-content: center;
flex-shrink: 0;
color: #FFF;
font-family: "IBM Plex Sans";
font-size: 14px;
font-style: normal;
font-weight: 600;
line-height: normal;
</inner>

</delegateBtn>
</main>

</token>

</tokens>



</info>
