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

// 【3. 内見チェック】「不動産屋は言わない」確認リスト（強化版）
const INSPECTION_CHECKLIST = [
    // --- 室内編 (15項目) ---
    {
        category: '室内・日当たり',
        item: '日当たり・採光（最重要）',
        method: '窓の方角と、実際に日光が入るかを確認。前の建物が遮っていないか。スマホで時間を空けて撮影すると変化がわかる。',
        importance: 'critical',
        details: '南向き◎、東向き○、西向き△、北向き×'
    },
    {
        category: '室内・収納',
        item: '収納スペース',
        method: '開けて広さ・奥行き・高さをメジャーで計測。カビや湿気、臭いがないか確認。',
        importance: 'high',
        details: '一人暮らしなら幅90cm×奥行60cm以上が理想。'
    },
    {
        category: '室内・水回り',
        item: '水回りの状態',
        method: '【キッチン】調理スペース、コンロ。【浴室】広さ、水圧。【トイレ】ウォシュレット、収納。排水口の臭いは必ず確認！',
        importance: 'critical',
        details: '排水口から悪臭がする場合、配管トラブルの可能性あり。'
    },
    {
        category: '室内・設備',
        item: '洗濯機置き場（見落とし注意）',
        method: '防水パンのサイズ（幅・奥行き）と蛇口の高さをメジャーで計測。',
        importance: 'critical',
        details: '一般的な一人暮らし用（5-6kg）：幅55cm×奥行59cm。入らないトラブル多発！'
    },
    {
        category: '室内・設備',
        item: 'コンセントの数と位置',
        method: '各部屋の数をカウント。家具配置と干渉しないか。TV端子・LANポートの位置もチェック。',
        importance: 'medium',
        details: '最低でも各部屋2〜3個は欲しい。延長コードだらけになるのを防ぐ。'
    },
    {
        category: '室内・状態',
        item: '傷・汚れ・カビ',
        method: '壁紙の剥がれ、床の傷、天井のシミ（雨漏り）をチェック。写真は必ず撮る。',
        importance: 'high',
        details: '入居前の傷は退去時のトラブル回避のために記録必須。'
    },
    {
        category: '室内・設備',
        item: '窓・扉の立て付け',
        method: '全て開閉してみる。スムーズか、施錠は問題ないか。',
        importance: 'medium',
        details: '固い場合は建物の歪みの可能性あり。'
    },
    {
        category: '室内・防音',
        item: '防音性・遮音性',
        method: '壁をコンコン叩く（響くと防音性高め）。部屋の中央で手を叩く。廊下の音を聞く。',
        importance: 'critical',
        details: '「ペチペチ」と軽い音がしたら壁が薄い可能性大。'
    },
    {
        category: '室内・構造',
        item: '天井高・圧迫感',
        method: '手を伸ばしてみる。2.3m以下だと圧迫感があり、背の高い家具が置けないことも。',
        importance: 'low',
        details: '標準は2.4m〜2.5m。'
    },
    {
        category: '室内・通信',
        item: 'スマホの電波',
        method: '部屋の奥、窓際、トイレ、浴室でアンテナを確認。',
        importance: 'high',
        details: '電波が弱いと生活に支障が出ます。'
    },
    {
        category: '室内・設備',
        item: 'エアコン',
        method: '位置（家具と干渉しないか）、備え付きか確認。可能なら試運転。',
        importance: 'high',
        details: 'ない場合は設置費用（5〜8万円）がかかります。'
    },
    {
        category: '室内・設備',
        item: 'ベランダ・バルコニー',
        method: '広さ、日当たり、隣との距離。排水口の詰まり。',
        importance: 'medium',
        details: '1階の場合は防犯面を要チェック。'
    },
    {
        category: '室内・玄関',
        item: '玄関・シューズボックス',
        method: '靴が何足入るか。玄関の広さ。',
        importance: 'low',
        details: ''
    },
    {
        category: '室内・通信',
        item: 'インターネット環境',
        method: '光回線対応か。無料ネットの場合は速度の評判を確認。',
        importance: 'high',
        details: '「ネット対応」と「ネット完備（無料）」は違います。'
    },
    {
        category: '室内・環境',
        item: '室内の臭い',
        method: '部屋に入った瞬間の臭い、クローゼット、水回りの臭い。',
        importance: 'high',
        details: 'カビ臭や下水臭は要注意。'
    },

    // --- 共用部 (5項目) ---
    {
        category: '共用部',
        item: 'エントランス・オートロック',
        method: 'オートロックの動作、清掃状況。',
        importance: 'high',
        details: '管理状態が良い＝住民の質も良い傾向。'
    },
    {
        category: '共用部',
        item: 'ゴミ置き場',
        method: '場所、清潔度。24時間ゴミ出し可能か。',
        importance: 'critical',
        details: '荒れている場合は住民トラブルのリスク大。'
    },
    {
        category: '共用部',
        item: 'ポスト・宅配ボックス',
        method: 'ポストにゴミが溜まっていないか。宅配ボックスはあるか。',
        importance: 'medium',
        details: ''
    },
    {
        category: '共用部',
        item: '駐輪場・駐車場',
        method: '空き状況、屋根の有無、料金。',
        importance: 'medium',
        details: ''
    },
    {
        category: '共用部',
        item: '廊下・階段',
        method: '私物が置かれていないか。照明は明るいか。',
        importance: 'medium',
        details: '私物放置は管理不全のサイン。'
    },

    // --- 周辺環境 (3項目) ---
    {
        category: '周辺環境',
        item: '駅からの道のり',
        method: '実際に歩いて時間を計測。夜道の明るさや人通りも確認。',
        importance: 'high',
        details: '不動産屋の「徒歩○分」は信号待ちを含みません。'
    },
    {
        category: '周辺環境',
        item: '周辺施設',
        method: 'スーパー、コンビニ、ドラッグストアへの距離。',
        importance: 'medium',
        details: ''
    },
    {
        category: '周辺環境',
        item: '治安・騒音',
        method: '近くに飲み屋、パチンコ店、幹線道路がないか。',
        importance: 'high',
        details: 'できれば昼と夜の2回確認するのがベスト。'
    }
];

// 【4. 失敗談】リアルな後悔パターン・データベース（追加統合）
const FAILURE_STORIES = [
    {
        title: '洗濯機が入らない',
        story: 'ドラム式洗濯機を買ったが、防水パンに入らなかった。',
        lesson: '防水パンのサイズだけでなく、搬入経路（ドア幅・廊下幅）も必ず計測する。',
        category: '設備'
    },
    {
        title: '夜の騒音が想定外',
        story: '昼は静かだったのに、夜になると隣の話し声や宴会騒ぎが丸聞こえ。',
        lesson: '壁の薄さは内見で「手を叩く」「壁を叩く」で確認。できれば夜にも現地へ行く。',
        category: '騒音'
    },
    {
        title: '日当たり詐欺',
        story: '写真では明るかったのに、実際は隣のビルに遮られて一日中暗い。',
        lesson: '「南向き」でも安心しない。実際に窓から空が見えるか確認。',
        category: '環境'
    },
    {
        title: 'コンセント地獄',
        story: 'TVを置きたい場所にコンセントがなく、部屋中延長コードだらけ。',
        lesson: '家具の配置をイメージしながらコンセント位置を確認する。',
        category: '設備'
    },
    {
        title: '夜道が怖すぎる',
        story: '駅から徒歩10分だが、街灯が少なく人通りもゼロで毎日怖い。',
        lesson: '昼だけでなく、必ず「夜の帰り道」を歩いてみる。',
        category: '立地'
    },
    {
        title: 'ネット無料の罠',
        story: '無料だが夜間は激遅。結局自分で月5,000円払って光回線を引いた。',
        lesson: 'ネット無料物件は速度を必ず確認。夜間に内見できればベスト。',
        category: '通信環境'
    },
    {
        title: '1階の湿気',
        story: '湿気がすごすぎて、お気に入りの革ジャンや靴が全部カビた。',
        lesson: '1階は湿気対策必須。除湿機・サーキュレーターは必需品。',
        category: '立地'
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

// 用語解説データ（内見ガイド追加）
const KNOWLEDGE_BASE = {
    内見準備: [
        {
            term: '必須の持ち物 6選',
            explanation: '1.スマホ (撮影・ライト・コンパス)\n2.メジャー (3m以上推奨)\n3.筆記用具・メモ帳\n4.図面・間取り図\n5.コンパス (スマホアプリ可)\n6.家具家電の寸法メモ',
            tip: 'その他、スリッパ、懐中電灯、ビー玉（傾き確認）があると便利です。'
        },
        {
            term: '便利なアプリ 4選',
            explanation: '1.AR測定アプリ (iOS計測など)\n2.RoomCo AR (家具配置シミュ)\n3.Smart Tools (騒音測定)\n4.Compass (方角確認)',
            tip: '事前にインストールしておきましょう。'
        },
        {
            term: '予約時に聞くこと',
            explanation: '・内見可能な時間帯（昼or夜）\n・入居可能時期\n・初期費用の概算（敷金・礼金など）',
            tip: '「初期費用の見積もりを出してほしい」と伝えるとスムーズです。'
        },
        {
            term: '事前の整理',
            explanation: '・優先順位（絶対条件 vs 妥協条件）\n・持っている家具のサイズ（ベッド、冷蔵庫、洗濯機）',
            tip: '冷蔵庫と洗濯機のサイズは、搬入経路（ドア幅）も含めて確認必須！'
        }
    ],

    内見のコツ: [
        {
            term: '時間帯の選び方',
            explanation: '【昼】日当たり、周辺施設の確認。\n【夜】街灯の明るさ、人通り、室内照明の確認。',
            tip: 'ベストは「平日昼 ＋ 平日夜（または週末夜）」の2回見ること。'
        },
        {
            term: '平日 vs 週末',
            explanation: '【平日】通勤通学の混雑具合、日常の騒音。\n【週末】近隣の公園の様子、休日の住民の生活音。',
            tip: '生活リズムに合わせて選びましょう。'
        },
        {
            term: '採光の方角',
            explanation: '南向き◎ (日当たり抜群)\n東向き○ (朝型向け)\n西向き△ (西日・夏暑い)\n北向き× (暗い・寒い・家賃安め)',
            tip: 'スマホを置いてタイマー撮影すると、日当たりの変化がわかります。'
        }
    ],

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
            tip: '友人が泊まる時に不便。湯船に浸かれないことによる健康管理への懸念。'
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
