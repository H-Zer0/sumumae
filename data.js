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
        },
        室内洗濯機置き場: {
            lifeRisk: '騒音が室内に響く可能性がありますが、洗濯機の劣化を防げます。',
            parentConcern: '冬場の寒さや防犯面で安心です。',
            severity: 'low'
        },
        室外洗濯機置き場: {
            lifeRisk: '洗濯機が雨風にさらされ劣化が早く、冬は寒く、下着泥棒のリスクもあります。',
            parentConcern: '防犯面（特に女性）や、冬の家事の負担が心配です。',
            severity: 'high'
        },
        ネット無料: {
            lifeRisk: '回線速度が遅く、夜間は動画が見られないレベルのことがあります。',
            parentConcern: '結局、自分で回線を引くことになり追加出費になる可能性があります。',
            severity: 'medium'
        },
        ペット可: {
            lifeRisk: '退去時の原状回復費用が高額になりがちです。物件の選択肢が激減します。',
            parentConcern: '退去時のトラブルや費用の高騰が懸念点です。',
            severity: 'medium'
        }
    },

    security: {
        モニター付きインターホン: {
            lifeRisk: '',
            parentConcern: '訪問者の顔が見えるため、不審者や不要なセールスを断りやすく安心です。',
            severity: 'low'
        },
        音声のみインターホン: {
            lifeRisk: '相手の顔が見えないため、不用意にドアを開けてしまうリスクがあります。',
            parentConcern: '防犯面で不安が残ります。TVモニター付きドアホンの後付け（工事不要）を検討すべきです。',
            severity: 'medium'
        },
        オートロック: {
            lifeRisk: '新聞勧誘などは防げますが、住民の後ろについて入られる「共連れ」には無力です。',
            parentConcern: 'ないよりは安心ですが、過信は禁物です。',
            severity: 'low'
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
    ],

    check_points: [
        {
            name: 'フリーレント',
            advice: '家賃が1〜2ヶ月無料になるが、「1年未満の解約は違約金」などの特約がついていることが多いので注意。',
            severity: 'medium'
        },
        {
            name: '敷金・礼金ゼロ',
            advice: '初期費用は安いが、退去時にクリーニング費用を高額請求されたり、家賃が相場より高く設定されていたりする場合がある。',
            severity: 'medium'
        },
        {
            name: '解約違約金',
            advice: '「1年以内の解約で家賃1ヶ月分」などのペナルティがないか、契約前に必ず特約事項を確認する。',
            severity: 'high'
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
    },
    {
        category: '玄関・動線',
        item: 'ドア・廊下',
        method: '玄関ドアの開く向き、廊下の幅、階段の手すりが家具搬入の邪魔にならないか（メジャー計測必須）。',
        importance: 'high'
    },
    {
        category: '収納',
        item: 'シューズボックス',
        method: '持っている靴が全部入るか。ブーツや長靴が入る高さがあるか。',
        importance: 'medium'
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
        id: 'rentLimit',
        question: '家賃（管理費込）の上限は？',
        type: 'slider',
        min: 30000,
        max: 150000,
        step: 5000,
        unit: '円',
        default: 60000,
        advice: '一般的に手取りの3分の1以下が目安と言われています。'
    },
    {
        id: 'income',
        question: '毎月の手取り月収（仕送り含む）は？',
        type: 'number',
        unit: '万円',
        placeholder: '例: 20',
        optional: true,
        advice: '未入力の場合は平均的な値（20万円）でシミュレーションします。'
    },
    {
        id: 'commuteTime',
        question: '学校・職場への「片道」通学・通勤時間は？',
        type: 'number',
        unit: '分',
        placeholder: '例: 45',
        advice: 'ドア・ツー・ドア（家を出てから着くまで）の時間で入力してください。'
    },
    {
        id: 'commuteCount',
        question: '週に何日通学・通勤しますか？',
        type: 'select',
        options: [
            { value: '3', label: '週3日以下' },
            { value: '4', label: '週4日' },
            { value: '5', label: '週5日' },
            { value: '6', label: '週6日以上' }
        ]
    },
    {
        id: 'nightReturn',
        question: '夜22時以降に帰宅する頻度は？',
        type: 'select',
        options: [
            { value: 'daily', label: 'ほぼ毎日' },
            { value: '3-4times', label: '週3-4回' },
            { value: '1-2times', label: '週1-2回' },
            { value: 'rarely', label: 'ほとんどない' }
        ]
    },
    {
        id: 'sleepType',
        question: 'あなたの起床・就寝タイプは？',
        type: 'select',
        options: [
            { value: 'morning', label: '朝型（早起きが得意）' },
            { value: 'normal', label: '普通' },
            { value: 'night', label: '夜型（深夜に活動しがち）' }
        ]
    },
    {
        id: 'cookingFrequency',
        question: '自炊の頻度は？（任意）',
        type: 'select',
        options: [
            { value: 'daily', label: '週3回以上（本格的に料理したい）' },
            { value: 'sometimes', label: '週1〜2回（簡単なものだけ）' },
            { value: 'rarely', label: 'ほぼしない（コンビニ・外食派）' }
        ],
        optional: true
    },
    {
        id: 'fixedCostPriority',
        question: '毎月の固定費（家賃＋光熱費）をどれくらい抑えたい？',
        type: 'select',
        options: [
            { value: 'high', label: '限界まで抑えたい（貯金重視）' },
            { value: 'medium', label: '普通（生活の質とのバランス重視）' },
            { value: 'low', label: '多少高くても快適さ重視' }
        ]
    },
    {
        id: 'soundproofing',
        question: 'お部屋の防音性はどれくらい重視する？',
        type: 'slider',
        min: 1,
        max: 5,
        step: 1,
        labels: ['気にしない', '少し気になる', '普通', 'かなり重視', '絶対必要'],
        default: 3
    },
    {
        id: 'securityAnxiety',
        question: '夜道や防犯への不安感は？',
        type: 'select',
        options: [
            { value: 'high', label: 'とても強い（少しでも不安要素を減らしたい）' },
            { value: 'medium', label: '普通（最低限の対策はしたい）' },
            { value: 'low', label: 'あまり気にならない' }
        ]
    },
    {
        id: 'parentInvolvement',
        question: '親の関与度は？',
        type: 'select',
        options: [
            { value: 'high', label: '高い（一緒に内見・契約に立ち会う）' },
            { value: 'medium', label: '普通（相談はするが最終判断は自分）' },
            { value: 'low', label: '低い（ほぼ自分で決める）' }
        ]
    },
    {
        id: 'constitution',
        question: '体質や生活で気になる点（任意・複数可）',
        type: 'checkbox',
        options: [
            { value: 'cold', label: '寒がり・冷え性' },
            { value: 'heat', label: '暑がり・汗かき' },
            { value: 'bugs', label: '虫がとにかく苦手' },
            { value: 'none', label: '特になし' }
        ],
        optional: true
    },
    {
        id: 'propertyConditions',
        question: '検討している物件の条件①（建物・設備）',
        type: 'multiInput',
        fields: [
            { id: 'age', label: '築年数', unit: '年', placeholder: '例: 15' },
            { id: 'structure', label: '構造', placeholder: '例: 木造、RC' },
            { id: 'floor', label: '階数', unit: '階', placeholder: '例: 2' },
            { id: 'elevator', label: 'エレベーター', placeholder: '例: 有、無' }
        ],
        optional: false
    },
    {
        id: 'locationConditions',
        question: '検討している物件の条件②（立地・設備）',
        type: 'multiInput',
        fields: [
            { id: 'stationDist', label: '駅徒歩', unit: '分', placeholder: '例: 10' },
            { id: 'gas', label: 'ガス種別', placeholder: '例: 都市ガス、プロパン' },
            { id: 'laundry', label: '洗濯機置き場', placeholder: '例: 室内、室外' }
        ],
        optional: false
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
        },
        {
            term: '新耐震基準',
            explanation: '1981年6月以降に建築確認を受けた建物。震度6〜7の地震でも倒壊しない基準。',
            tip: '安全性を重視するなら、築年数だけでなく「1981年6月以降」かをチェック。'
        }
    ],

    周辺環境: [
        {
            term: 'コンビニ・スーパー',
            explanation: '徒歩5分以内にあると便利だが、近すぎると騒音や害虫（ゴキブリ等）の原因になることも。',
            tip: '営業時間の確認と、物件との距離感（近すぎないか）をチェック。'
        },
        {
            term: '嫌悪施設',
            explanation: '騒音（幹線道路、線路、パチンコ）、臭い（飲食店）、治安（風俗店）に影響する施設。',
            tip: '地図だけでなく、実際に歩いて音や臭いを確認する。'
        },
        {
            term: '病院・公共施設',
            explanation: '内科、耳鼻科、郵便局、役所などが近くにあると、いざという時に非常に助かる。',
            tip: 'Googleマップで「内科」「郵便局」を検索して保存しておくと良い。'
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


// ==========================================
// 条件優先度ロジック
// ==========================================
const CONDITION_PRIORITY = {
    high_priority: [
        'バス・トイレ別',
        '2階以上（防犯・湿気対策）',
        '駐車場あり（車必須の場合）',
        'エアコン備え付け',
        '室内洗濯機置き場',
        'ペット相談可（飼育希望時）'
    ],
    compromise: [
        'メゾネット（冷暖房効率が悪い傾向）',
        'エレベーター（3階以下なら不要）',
        'フローリング（クッションフロアでも可）',
        '保証人不要（保証会社利用で代替）',
        'リノベーション済み（中身が綺麗なら築古でOK）',
        '宅配ボックス（置き配バッグで代用可）'
    ]
};

// ==========================================
// 内見完全ガイドデータ
// ==========================================
const INSPECTION_GUIDE_DATA = [
    {
        id: "preparation",
        title: "事前準備・持ち物",
        icon: "🎒",
        sections: [
            {
                subtitle: "【必須】内見に持っていくべき持ち物6点",
                items: [
                    "スマホ（カメラ・ライト・方位磁針アプリ・水平器アプリ）",
                    "メジャー（カーテンや家具スペースの計測用）",
                    "筆記用具、メモ帳",
                    "図面、間取り図のコピー（スマホやタブレットで代替可能）",
                    "コンパス（スマホアプリでOK）"
                ],
                type: "checklist"
            },
            {
                subtitle: "【あると便利】持ち物プラスα",
                items: [
                    "スリッパ：内見時に靴を脱ぐため、清潔に内見したい方におすすめ",
                    "懐中電灯：クローゼットや浴室など暗い場所の確認用（スマホのライトでも代用可）",
                    "ビー玉：床の傾きを確認（転がして傾斜をチェック）",
                    "家具の寸法メモ：持っている家具・家電のサイズを控えておく"
                ],
                type: "list"
            },
            {
                subtitle: "事前に整理しておくこと",
                description: "内見前に、以下の条件を自分の中で整理しておきましょう。",
                items: [
                    "**優先順位を決める**\n・絶対譲れない条件（例：通学時間15分以内、家賃7万円以下、オートロック付き）\n・できれば欲しい条件（例：バス・トイレ別、2階以上、収納広め）\n・妥協できる条件（例：築年数、駅徒歩距離）",
                    "**持っている家具・家電のサイズを確認**\n・ベッド（シングル：約97cm×195cm）\n・冷蔵庫（一人暮らし用：幅約50cm×奥行約60cm×高さ約120cm）\n・洗濯機（一人暮らし用：幅約55cm×奥行約59cm×高さ約88cm）\n・デスク、収納家具など"
                ],
                type: "text-list"
            },
            {
                subtitle: "内見の予約時に不動産会社に聞いておくこと",
                items: [
                    "内見可能な時間帯（昼・夕方・夜）",
                    "入居可能時期",
                    "初期費用の概算（敷金・礼金・仲介手数料など）"
                ],
                type: "list"
            }
        ]
    },
    {
        id: "timing",
        title: "内見の時間帯・タイミング",
        icon: "⏰",
        sections: [
            {
                subtitle: "内見の時間帯｜昼と夜、どちらが良い？",
                description: "内見は時間帯によって見るべきポイントが変わります。可能であれば、昼と夜の2回内見するのが理想です。",
                content: [
                    {
                        heading: "【昼の内見】おすすめ時間：10:00〜15:00",
                        merits: ["日当たり・明るさの確認", "共用部分の確認（清潔度）", "周辺施設の営業状況"],
                        checkpoints: ["窓からの日差しの入り方", "洗濯干し場の陽当たり", "昼間の騒音（工事音など）"]
                    },
                    {
                        heading: "【夜の内見】おすすめ時間：18:00〜20:00",
                        merits: ["治安・周辺環境の確認（街灯・人通り）", "騒音の確認（隣人の生活音）", "室内照明の明るさ"],
                        checkpoints: ["駅からの帰り道の安全性", "隣や上下階の生活音", "夜間の飲食店の騒音"]
                    }
                ],
                type: "comparison"
            },
            {
                subtitle: "【平日 と 週末】どちらが良い？",
                items: [
                    "**平日の内見**：通勤・通学時の交通状況、日常的な騒音レベルを確認できる",
                    "**週末の内見**：周辺環境（公園や商店街）の混雑具合、住民の在宅パターンを確認できる",
                    "おすすめ：平日昼 + 平日夜（または週末夜）の2回内見"
                ],
                type: "text-list"
            }
        ]
    },
    {
        id: "indoor_check",
        title: "【室内編】絶対チェックすべき15のポイント",
        icon: "🏠",
        description: "内見では、間取り図だけでは分からない細かい部分まで確認しましょう。優先度の高い順に解説します。",
        sections: [
            {
                subtitle: "1. 日当たり・採光（最重要）",
                items: [
                    "窓の方角を確認（南向き◎、東向き○、西向き△、北向き×）",
                    "実際に窓から外を見て、日光が入るか確認",
                    "前の建物が日光を遮っていないか",
                    "**スマホのタイマー撮影**：同じ場所で時間を空けて数枚撮影すると変化が分かります"
                ],
                type: "check-point"
            },
            {
                subtitle: "2. 収納スペース",
                items: [
                    "クローゼットを開けて広さ・奥行き・高さを確認",
                    "最低でも幅90cm×奥行60cm以上が理想",
                    "カビや湿気、臭いがないか",
                    "**メジャーで測定**：収納のサイズを記録しましょう"
                ],
                type: "check-point"
            },
            {
                subtitle: "3. 水回りの状態",
                items: [
                    "**キッチン**：コンロの種類、調理スペース、換気扇",
                    "**浴室**：広さ、水圧、カビ・水垢",
                    "**トイレ**：ウォシュレット、収納、換気",
                    "**【重要】排水口の臭い**を必ず確認！悪臭はトラブルの元"
                ],
                type: "check-point"
            },
            {
                subtitle: "4. 洗濯機置き場（見落とし注意！）",
                items: [
                    "洗濯機置き場のサイズ（防水パン）を測定",
                    "蛇口の位置・高さ、排水口の位置",
                    "一人暮らし用（5〜6kg）は幅約55cm×奥行約59cmが必要",
                    "**スマホで撮影**：サイズが合わないと設置できません"
                ],
                type: "check-point"
            },
            {
                subtitle: "5. コンセントの数と位置",
                items: [
                    "各部屋の数を数える（2〜3個は欲しい）",
                    "家具配置と干渉しないか確認",
                    "TV端子、LANポートの位置",
                    "**スマホで撮影**：配線計画に必須です"
                ],
                type: "check-point"
            },
            {
                subtitle: "6〜10. 構造・設備チェック",
                items: [
                    "**6. 壁・床・天井**：傷・汚れ・カビ（入居前に写真で記録）",
                    "**7. 窓・扉**：スムーズに開閉するか、鍵の施錠",
                    "**8. 防音性（超重要）**：壁を叩いて響くか（響かない＝音が抜ける＝防音低い）",
                    "**9. 天井高**：圧迫感がないか（2.3m以下は低い）",
                    "**10. 電波状況**：各部屋でスマホのアンテナを確認"
                ],
                type: "check-point"
            },
            {
                subtitle: "11〜15. その他設備・環境",
                items: [
                    "**11. エアコン**：位置と動作確認（古いと電気代が高い）",
                    "**12. ベランダ**：広さ、日当たり、プライバシー",
                    "**13. 玄関**：シューズボックスの容量",
                    "**14. ネット環境**：光回線か、速度は十分か",
                    "**15. 臭い**：部屋全体、特に排水口とクローゼット"
                ],
                type: "check-point"
            }
        ]
    },
    {
        id: "public_area",
        title: "【共用部・周辺】建物全体＆エリアチェック",
        icon: "🏢",
        sections: [
            {
                subtitle: "共用部分のチェックポイント",
                items: [
                    "**エントランス**：オートロックの有無、清掃状況",
                    "**ゴミ置き場**：汚れていると住民モラルが低い可能性大",
                    "**ポスト・宅配ボックス**：鍵の有無、空き状況",
                    "**駐輪場**：屋根の有無、料金、空き状況",
                    "**共用廊下**：私物が置かれていないか、照明の明るさ"
                ],
                type: "check-point"
            },
            {
                subtitle: "周辺環境のチェックポイント",
                items: [
                    "**駅から物件までの道のり**：実際に歩いて時間を計測、夜道の街灯",
                    "**周辺施設**：スーパー、コンビニ、ドラッグストアの距離",
                    "**治安・騒音**：飲食店やパチンコ店の有無、幹線道路の交通量"
                ],
                type: "check-point"
            },
            {
                subtitle: "現地確認不可の場合（遠方など）",
                items: [
                    "**不動産会社ヒアリング**：騒音トラブルの有無、ゴミ出しマナー、周辺の治安について担当者に具体的に質問する",
                    "**Googleストリートビュー活用**：物件周辺の雰囲気、街灯の多さ、隣接する建物の窓の位置などをバーチャル確認する"
                ],
                type: "list"
            }
        ]
    },
    {
        id: "checklist_print",
        title: "内見チェックリスト（印刷推奨）",
        icon: "📝",
        isChecklist: true,
        items: [
            { category: "室内", label: "日当たり・採光（方角、時間帯）" },
            { category: "室内", label: "収納スペース（サイズ、湿気）" },
            { category: "室内", label: "水回り（キッチン・浴室・トイレの水圧・臭い）" },
            { category: "室内", label: "洗濯機置き場のサイズ（要計測）" },
            { category: "室内", label: "コンセントの数と位置" },
            { category: "室内", label: "壁・床・天井の傷・汚れ・カビ" },
            { category: "室内", label: "窓・扉の立て付け・施錠" },
            { category: "室内", label: "防音性・遮音性（壁叩きチェック）" },
            { category: "室内", label: "天井高・圧迫感" },
            { category: "室内", label: "携帯電話の電波状況" },
            { category: "室内", label: "エアコンの位置・動作" },
            { category: "室内", label: "ベランダ・バルコニー" },
            { category: "室内", label: "玄関・シューズボックス" },
            { category: "室内", label: "インターネット環境" },
            { category: "室内", label: "臭い（部屋全体）" },
            { category: "共用部", label: "エントランス・オートロック" },
            { category: "共用部", label: "ゴミ置き場（清潔度・ルール）" },
            { category: "共用部", label: "ポスト・宅配ボックス" },
            { category: "共用部", label: "駐輪場・駐車場" },
            { category: "周辺", label: "駅から物件までの道のり（時間・夜道）" },
            { category: "周辺", label: "周辺施設（スーパー・コンビニ）" },
            { category: "周辺", label: "治安・騒音（近隣店舗・道路）" }
        ]
    }
];

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SPEC_RISK_TRANSLATOR,
        MONEY_CHECK,
        INSPECTION_CHECKLIST,
        FAILURE_STORIES,
        PARENT_SAFETY_WEIGHTS,
        DIAGNOSIS_QUESTIONS,
        KNOWLEDGE_BASE,
        CONDITION_PRIORITY,
        INSPECTION_GUIDE_DATA
    };
}
