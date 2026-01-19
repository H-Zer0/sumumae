// ==========================================
// スムマエ｜住む。前に。答え合わせ
// データベース・ナレッジベース
// ==========================================

// 【1. 翻訳エンジン】物件スペック ⇄ 生活リスク変換マスタ
const SPEC_RISK_TRANSLATOR = {
    structure: {
        木造: {
            lifeRisk: '隣人の生活音（会話・くしゃみ）が聞こえやすい傾向があります。断熱性が低く、夏は暑く冬は寒くなりやすいです。',
            parentConcern: '騒音トラブルや、冬の体調管理について心配される場合があります。',
            severity: 'high'
        },
        軽量鉄骨: {
            lifeRisk: '隣人の生活音（会話・くしゃみ）が聞こえやすい傾向があります。断熱性が低く、夏は暑く冬は寒くなりやすいです。',
            parentConcern: '騒音トラブルや、冬の体調管理について心配される場合があります。',
            severity: 'high'
        },
        RC: {
            lifeRisk: '木造より静かだが、夏は熱がこもりやすくエアコン代がかさむ傾向。',
            parentConcern: '耐震性・耐火性が高く、親を安心させやすいポイント。',
            severity: 'low'
        },
        SRC: {
            lifeRisk: '木造より静かだが、夏は熱がこもりやすくエアコン代がかさむ傾向。',
            parentConcern: '耐震性・耐火性が高く、親を安心させやすいポイント。',
            severity: 'low'
        }
    },

    floor: {
        1: {
            lifeRisk: '防犯リスクが高い傾向があります。外から見えやすく、虫の侵入率も高いです。',
            parentConcern: '空き巣、不審者など、親が最も心配されるポイントです。',
            severity: 'critical'
        },
        2: {
            lifeRisk: '防犯面では1階より安心ですが、虫の侵入リスクは残ります。',
            parentConcern: '1階よりは安心ですが、オートロックがあるとより良いです。',
            severity: 'medium'
        },
        '3以上': {
            lifeRisk: '防犯面・虫の侵入リスクが低いです。エレベーターなしだと買い物が大変な場合があります。',
            parentConcern: '防犯面で安心です。エレベーターの有無を確認されると良いです。',
            severity: 'low'
        }
    },

    features: {
        ロフト: {
            lifeRisk: '夏は熱気が溺まり冷房が効きにくい傾向があります。掃除が困難で、ハシゴが面倒で結局使わなくなるケースが多いです。',
            parentConcern: '転落事故や、掃除が行き届かず不衛生になる心配があります。',
            severity: 'medium'
        },
        '3点ユニット': {
            lifeRisk: 'トイレが常に湿気る傾向があります。友人が泊まった時に不便です。掃除は楽ですが、QOLは下がりやすいです。',
            parentConcern: '湯船に浸かれないことによる健康管理への懸念があります。',
            severity: 'medium'
        },
        角部屋: {
            lifeRisk: '隣室と接する面が少なく静かですが、外気の影響を受けやすく、結露・カビが発生しやすい傾向があります。',
            parentConcern: '光熱費の増大と、カビによる健康被害・退去費用の発生が懸念されます。',
            severity: 'medium'
        }
    },

    gas: {
        プロパン: {
            lifeRisk: '都市ガスの2〜3倍の料金。冬場はガス代だけで1.5万円超えもあり得る。',
            parentConcern: '固定費が高すぎて、仕送りやバイト代が圧迫される懸念。',
            severity: 'high'
        },
        都市ガス: {
            lifeRisk: 'ランニングコストが抑えられる。',
            parentConcern: '光熱費が安く、親の負担も軽減。',
            severity: 'low'
        }
    },

    stationDistance: {
        '5分以内': {
            lifeRisk: '通勤・通学が楽。夜道も短い。',
            parentConcern: '駅近で安心。',
            severity: 'low'
        },
        '10分以内': {
            lifeRisk: '許容範囲。雨の日は少し面倒。',
            parentConcern: 'まずまず安心。',
            severity: 'low'
        },
        '15分以内': {
            lifeRisk: '往復30分。雨の日や夏場は過酷。夜道が暗いルートになる可能性が高い。',
            parentConcern: 'バイト帰りや飲み会帰りの夜道の安全性。',
            severity: 'medium'
        },
        '15分以上': {
            lifeRisk: '往復30分以上。雨の日や夏場は過酷。夜道が暗いルートになる可能性が高い。',
            parentConcern: 'バイト帰りや飲み会帰りの夜道の安全性。',
            severity: 'high'
        }
    }
};

// 【2. マネー診断】初期費用・ランニングコスト判定マスタ
const MONEY_CHECK = {
    negotiable: [
        {
            name: '室内消毒・消火剤代',
            cost: '1.5〜3万円',
            advice: '任意。業者がスプレーを吹くだけの場合が多い。「自分でやる」でカット可能。',
            severity: 'medium'
        },
        {
            name: '24時間安心サポート',
            cost: '1〜2万円',
            advice: '任意加入。管理会社が直接対応する場合は不要なケースあり。',
            severity: 'medium'
        },
        {
            name: '簡易消火器',
            cost: '5,000円前後',
            advice: '自分でAmazonで購入（約5,000円）した方が圧倒的に安い。',
            severity: 'low'
        },
        {
            name: '仲介手数料',
            cost: '家賃1ヶ月分',
            advice: '法律上は原則0.5ヶ月。1ヶ月分請求されている場合は交渉の余地あり。',
            severity: 'high'
        }
    ],

    required: [
        {
            name: '保証会社利用料',
            cost: '家賃の0.5〜1ヶ月分',
            advice: '連帯保証人がいても必須のケースが多い。',
            severity: 'high'
        },
        {
            name: '火災保険料',
            cost: '1.5〜2万円/2年',
            advice: '必須だが、指定業者以外（ネット保険等）で安く済ませられる場合がある。',
            severity: 'medium'
        },
        {
            name: '更新料',
            cost: '家賃1ヶ月分/2年',
            advice: '2年ごとに家賃1ヶ月分。これを忘れて貯金が尽きる初心者が多い。',
            severity: 'critical'
        },
        {
            name: '町内会費',
            cost: '数千円〜',
            advice: '意外な盲点。2年分一括払いを求められることもある。',
            severity: 'low'
        }
    ]
};

// 【3. 内見チェック】「不動産屋は言わない」確認リスト
const INSPECTION_CHECKLIST = [
    {
        category: '防音性',
        item: '壁の厚さ',
        method: '壁を叩いて「コンコン」と高い音がしたら木造並みに薄い。',
        importance: 'high'
    },
    {
        category: '通信環境',
        item: 'スマホ電波',
        method: '部屋の奥、トイレ、ロフトで5G/4Gが入るか。',
        importance: 'high'
    },
    {
        category: '湿気・カビ',
        item: '収納の臭い',
        method: 'シンク下やクローゼットがカビ臭くないか（水漏れ・湿気の形跡）。',
        importance: 'high'
    },
    {
        category: '住人トラブル',
        item: '共用部掲示板',
        method: '「騒音注意」「ゴミ出しの苦情」の貼り紙がないか（＝トラブル発生中）。',
        importance: 'critical'
    },
    {
        category: '住人の質',
        item: 'ゴミ捨て場',
        method: '荒れていれば、住人の民度が低くトラブルに巻き込まれる可能性大。',
        importance: 'critical'
    },
    {
        category: 'プライバシー',
        item: '窓の外',
        method: '隣の家の窓やベランダが近すぎないか（プライバシーの欠如）。',
        importance: 'medium'
    },
    {
        category: '日当たり',
        item: '昼間の採光',
        method: '昼間に内見して、電気をつけずに明るいか確認。',
        importance: 'medium'
    },
    {
        category: '水回り',
        item: '水圧',
        method: 'シャワーと蛇口を全開にして水圧を確認。弱いと生活ストレス大。',
        importance: 'medium'
    },
    {
        category: '収納',
        item: '洗濯機置き場',
        method: '防水パンのサイズを測る。ドラム式は入らないことが多い。',
        importance: 'medium'
    },
    {
        category: 'コンセント',
        item: '数と位置',
        method: '家具配置をイメージして、コンセントが足りるか確認。',
        importance: 'low'
    }
];

// 【4. 失敗談】リアルな後悔パターン・データベース
const FAILURE_STORIES = [
    {
        title: 'ネット無料の罠',
        story: '無料だが夜間は激遅。結局自分で月5,000円払って光回線を引いた。',
        lesson: 'ネット無料物件は速度を必ず確認。夜間に内見できればベスト。',
        category: '通信環境'
    },
    {
        title: '搬入不可',
        story: 'ドラム式洗濯機を買ったが、防水パンに入らなかった / ドアを通らなかった。',
        lesson: '防水パンのサイズ、玄関・廊下の幅を測る。大型家電は要注意。',
        category: '設備'
    },
    {
        title: '1階の湿気',
        story: '湿気がすごすぎて、お気に入りの革ジャンや靴が全部カビた。',
        lesson: '1階は湿気対策必須。除湿機・サーキュレーターは必需品。',
        category: '立地'
    },
    {
        title: 'キッチンの限界',
        story: '1口コンロ＆作業スペースなし。自炊が嫌になり、コンビニ飯で激太り＋金欠。',
        lesson: '自炊するなら2口コンロ、まな板が置けるスペースは必須。',
        category: '設備'
    },
    {
        title: '隣人ガチャ',
        story: '大学至近の物件で、隣の部屋が溜まり場に。毎晩宅飲みでうるさくて不眠症。',
        lesson: '学生街は要注意。社会人向け物件や、ファミリー層が多い物件が無難。',
        category: '住人トラブル'
    },
    {
        title: '更新料の罠',
        story: '2年後の更新料（家賃1ヶ月分）を忘れてて、貯金が尽きた。',
        lesson: '更新料は契約時に確認。2年後の出費を計画に入れる。',
        category: 'お金'
    },
    {
        title: 'プロパンガス地獄',
        story: '冬場のガス代が2万円超え。都市ガスの物件にすればよかった。',
        lesson: 'プロパンガスは都市ガスの2〜3倍。固定費を甘く見ない。',
        category: 'お金'
    }
];

// 【5. 親目線】納得・安心獲得スコア
const PARENT_SAFETY_WEIGHTS = {
    security: {
        weight: 0.4,
        factors: {
            autoLock: 30,
            intercom: 20,
            floor2orAbove: 30,
            securityCamera: 20
        }
    },
    safety: {
        weight: 0.3,
        factors: {
            streetLights: 30,
            policeBox: 30,
            hazardMapSafe: 40
        }
    },
    reliability: {
        weight: 0.2,
        factors: {
            majorManagement: 50,
            landlordNearby: 50
        }
    },
    practical: {
        weight: 0.1,
        factors: {
            cityGas: 40,
            supermarketNearby: 30,
            hospitalNearby: 30
        }
    }
};

// 診断用の質問データ
const DIAGNOSIS_QUESTIONS = [
    {
        id: 'budget',
        question: '家賃の予算はどれくらいですか？',
        type: 'slider',
        min: 30000,
        max: 150000,
        step: 5000,
        unit: '円',
        default: 60000,
        advice: '一般的に手取りの3分の1以下が目安です。'
    },
    {
        id: 'commute',
        question: '通学・通勤時間はどれくらいまで許容できますか？',
        type: 'select',
        options: [
            { value: '15min', label: '15分以内', score: 100 },
            { value: '30min', label: '30分以内', score: 80 },
            { value: '60min', label: '1時間以内', score: 50 },
            { value: '60min+', label: '1時間以上でも可', score: 30 }
        ]
    },
    {
        id: 'soundproofing',
        question: '防音性はどれくらい重視しますか？',
        type: 'slider',
        min: 1,
        max: 5,
        step: 1,
        labels: ['気にしない', '少し気になる', '普通', 'かなり重視', '絶対必要'],
        default: 3
    },
    {
        id: 'nightReturn',
        question: '夜遅く（22時以降）に帰宅する頻度は？',
        type: 'select',
        options: [
            { value: 'daily', label: 'ほぼ毎日', risk: 'high' },
            { value: '3-4times', label: '週3-4回', risk: 'medium' },
            { value: '1-2times', label: '週1-2回', risk: 'low' },
            { value: 'rarely', label: 'ほとんどない', risk: 'none' }
        ]
    },
    {
        id: 'parentInvolvement',
        question: '親の関与度はどれくらいですか？',
        type: 'select',
        options: [
            { value: 'high', label: '高い（一緒に内見・契約に立ち会う）' },
            { value: 'medium', label: '普通（相談はするが最終判断は自分）' },
            { value: 'low', label: '低い（ほぼ自分で決める）' }
        ]
    },
    {
        id: 'propertyConditions',
        question: '検討中の物件条件を教えてください（任意）',
        type: 'multiInput',
        fields: [
            { id: 'age', label: '築年数', unit: '年', placeholder: '例: 10' },
            { id: 'floor', label: '階数', unit: '階', placeholder: '例: 2' },
            { id: 'structure', label: '構造', placeholder: '例: 木造、RC' },
            { id: 'stationDist', label: '駅徒歩', unit: '分', placeholder: '例: 10' },
            { id: 'gas', label: 'ガス種別', placeholder: '例: 都市ガス、プロパン' }
        ],
        optional: true
    }
];

// 用語解説データ
const KNOWLEDGE_BASE = {
    立地: [
        {
            term: '駅徒歩○分',
            explanation: '不動産広告では「80m = 1分」で計算。実際は信号待ちや坂道で+5分かかることも。',
            tip: '実際に歩いて確認するのがベスト。夜の雰囲気も要チェック。'
        },
        {
            term: 'ハザードマップ',
            explanation: '浸水・土砂災害のリスクを示す地図。自治体のサイトで確認可能。',
            tip: '1階の物件は特に要確認。浸水エリアは避けるのが無難。'
        }
    ],

    建物: [
        {
            term: '木造',
            explanation: '最も安いが、防音性・断熱性が低い。隣人の生活音が聞こえやすい。',
            tip: '防音重視なら避ける。家賃が安い代わりに生活ストレスは高め。'
        },
        {
            term: 'RC造（鉄筋コンクリート）',
            explanation: '耐震性・防音性が高い。ただし夏は熱がこもりやすい。',
            tip: '親を安心させやすい。エアコン代は木造より高くなる傾向。'
        },
        {
            term: 'オートロック',
            explanation: 'エントランスに鍵がかかっている。防犯性が高い。',
            tip: '親の安心度UP。ただし宅配便の受け取りは少し面倒。'
        }
    ],

    設備: [
        {
            term: '都市ガス vs プロパンガス',
            explanation: 'プロパンは都市ガスの2〜3倍の料金。冬場は特に差が出る。',
            tip: '固定費を抑えたいなら都市ガス一択。プロパンは要注意。'
        },
        {
            term: '3点ユニットバス',
            explanation: 'バス・トイレ・洗面が一体化。掃除は楽だがQOLは下がる。',
            tip: '友人が泊まる時に不便。湯船に浸かりたい人は避ける。'
        },
        {
            term: 'ロフト',
            explanation: '天井近くの収納スペース。夏は暑く、掃除が大変。',
            tip: '憧れるが実用性は低い。結局使わなくなるケースが多い。'
        }
    ],

    契約: [
        {
            term: '敷金・礼金',
            explanation: '敷金は退去時の原状回復費用。礼金は大家への謝礼（返ってこない）。',
            tip: '敷金・礼金ゼロ物件もあるが、退去費用が高額になることも。'
        },
        {
            term: '仲介手数料',
            explanation: '不動産会社への報酬。法律上は原則0.5ヶ月分。',
            tip: '1ヶ月分請求されている場合は交渉の余地あり。'
        },
        {
            term: '更新料',
            explanation: '2年ごとに家賃1ヶ月分を支払う。地域によっては不要。',
            tip: '忘れがちな出費。2年後の計画に入れておく。'
        }
    ]
};

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SPEC_RISK_TRANSLATOR,
        MONEY_CHECK,
        INSPECTION_CHECKLIST,
        FAILURE_STORIES,
        PARENT_SAFETY_WEIGHTS,
        DIAGNOSIS_QUESTIONS,
        KNOWLEDGE_BASE
    };
}
