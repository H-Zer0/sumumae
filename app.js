// ==========================================
// スムマエ｜住む。前に。答え合わせ
// アプリケーションロジック
// ==========================================

// 状態管理
const state = {
    currentScreen: 'top',
    currentQuestionIndex: 0,
    answers: {},
    result: null
};

// LocalStorageキー
const STORAGE_KEY = 'sumumae_diagnosis_result';

// ==========================================
// 初期化
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    loadSavedResult();
});

function initializeApp() {
    // 画面遷移イベント
    document.getElementById('start-diagnosis-btn')?.addEventListener('click', () => {
        navigateToScreen('diagnosis');
    });
    // 診断開始ボタン
    const startBtn = document.getElementById('start-diagnosis-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            state.answers = {};
            state.currentQuestionIndex = 0;
            navigateToScreen('diagnosis');
        });
    }

    // 診断画面のナビゲーション
    document.getElementById('prev-btn')?.addEventListener('click', previousQuestion); // Assuming previousQuestion is defined elsewhere
    document.getElementById('next-btn')?.addEventListener('click', nextQuestion); // Assuming nextQuestion is defined elsewhere

    // ホームに戻るボタン（各画面）
    ['diagnosis', 'result', 'knowledge', 'guide'].forEach(screen => {
        const btnId = `home-from-${screen}-btn`;
        document.getElementById(btnId)?.addEventListener('click', () => navigateToScreen('top'));
    });

    // ボトムナビゲーション
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            // クリックされたボタンのdata-screenを取得（アイコンクリック時も親を参照）
            const target = e.currentTarget;
            const screen = target.dataset.screen;
            if (screen) navigateToScreen(screen);
        });
    });

    // ヘッダーナビゲーション (PC用)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const screen = link.dataset.screen;
            if (screen) navigateToScreen(screen);
        });
    });

    // 用語解説・ガイドの初期化
    renderKnowledgeBase();
    renderInspectionGuide();

    // 初期画面のボトムナビ状態を更新
    updateBottomNav();
}

// ==========================================
// 画面遷移
// ==========================================
function navigateToScreen(screenName) {
    // すべての画面を非表示
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // 指定された画面を表示
    const targetScreen = document.getElementById(`${screenName}-screen`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        state.currentScreen = screenName;

        // 画面ごとの処理
        if (screenName === 'diagnosis') {
            renderQuestion();
        } else if (screenName === 'result') {
            renderResult();
        }

        // ボトムナビの状態を更新
        updateBottomNav();
        updateHeaderNav();

        // 【重要】スクロール位置を最上部にリセット（スマホ対策）
        window.scrollTo(0, 0);
    }
}

// ボトムナビゲーションのアクティブ状態を更新
function updateBottomNav() {
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        const screen = item.dataset.screen;
        // activeクラスの切り替え
        // SVGアイコンの色変更はCSSで制御（.bottom-nav-item.active .bottom-nav-icon { color: ... }）
        if (screen === state.currentScreen) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateHeaderNav() {
    document.querySelectorAll('.nav-link').forEach(link => {
        const screen = link.dataset.screen;
        if (screen === state.currentScreen) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==========================================
// 診断フロー
// ==========================================
function renderQuestion() {
    const question = DIAGNOSIS_QUESTIONS[state.currentQuestionIndex];
    if (!question) return;

    const container = document.getElementById('question-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    // プログレスバー更新
    const progress = ((state.currentQuestionIndex + 1) / DIAGNOSIS_QUESTIONS.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `質問 ${state.currentQuestionIndex + 1} / ${DIAGNOSIS_QUESTIONS.length}`;

    // 質問レンダリング
    let html = `
    <div class="card fade-in">
      <h2 class="card-title">${question.question}</h2>
  `;

    if (question.type === 'slider') {
        const currentValue = state.answers[question.id] || question.default;
        html += `
      <div class="slider-container">
        <input 
          type="range" 
          class="slider" 
          id="${question.id}"
          min="${question.min}" 
          max="${question.max}" 
          step="${question.step}" 
          value="${currentValue}"
        />
        <span class="slider-value numeric" id="${question.id}-value">
          ${formatSliderValue(currentValue, question)}
        </span>
      </div>
    `;

        if (question.labels) {
            html += `<div class="text-small text-center mt-lg">`;
            html += `<div style="display: flex; justify-content: space-between;">`;
            html += `<span>${question.labels[0]}</span>`;
            html += `<span>${question.labels[question.labels.length - 1]}</span>`;
            html += `</div></div>`;
        }

        if (question.advice) {
            html += `<p class="text-small" style="margin-top: 16px;">💡 ${question.advice}</p>`;
        }

    } else if (question.type === 'number') {
        const currentValue = state.answers[question.id] || '';
        html += `
        <div class="form-group">
            <div style="position: relative;">
                <input 
                    type="number" 
                    class="form-input" 
                    id="${question.id}" 
                    placeholder="${question.placeholder || ''}"
                    value="${currentValue}"
                    min="0"
                />
                ${question.unit ? `<span style="position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--color-text-secondary);">${question.unit}</span>` : ''}
            </div>
        </div>
        `;
        if (question.advice) {
            html += `<p class="text-small" style="margin-top: 8px;">💡 ${question.advice}</p>`;
        }

    } else if (question.type === 'select') {
        html += `<div class="radio-group">`;
        question.options.forEach((option, index) => {
            const isSelected = state.answers[question.id] === option.value;
            html += `
        <label class="radio-option ${isSelected ? 'selected' : ''}" data-value="${option.value}">
          <input 
            type="radio" 
            name="${question.id}" 
            value="${option.value}"
            ${isSelected ? 'checked' : ''}
          />
          <span>${option.label}</span>
        </label>
      `;
        });
        html += `</div>`;

    } else if (question.type === 'checkbox') {
        html += `<div class="radio-group">`;
        question.options.forEach((option) => {
            const currentAnswers = state.answers[question.id] || [];
            const isSelected = currentAnswers.includes(option.value);
            html += `
        <label class="radio-option ${isSelected ? 'selected' : ''}" data-value="${option.value}" data-type="checkbox">
          <input 
            type="checkbox" 
            name="${question.id}" 
            value="${option.value}"
            ${isSelected ? 'checked' : ''}
          />
          <span>${option.label}</span>
        </label>
      `;
        });
        html += `</div>`;

    } else if (question.type === 'multiInput') {
        html += `<div class="form-group">`;
        question.fields.forEach(field => {
            const value = state.answers[question.id]?.[field.id] || '';
            html += `
        <div style="margin-bottom: 16px;">
          <label class="form-label">${field.label}</label>
          <input 
            type="text" 
            class="form-input" 
            id="${question.id}-${field.id}"
            placeholder="${field.placeholder}"
            value="${value}"
          />
        </div>
      `;
        });
        html += `</div>`;
        if (question.optional) {
            html += `<p class="text-small">※ この質問は任意です。スキップも可能です。</p>`;
        }
    }

    // すべてのタイプ共通で、任意フラグがあれば表示（multiInput以外でも表示されるようにする）
    // 上記のmultiInput内の処理と重複しないよう、上記は削除し、
    // ここで統一的に処理する形に変更します。
    if (question.optional && question.type !== 'multiInput') {
        html += `<p class="text-small" style="margin-top: 12px;">※ この質問は任意です。スキップも可能です。</p>`;
    }

    html += `</div>`;
    container.innerHTML = html;

    // イベントリスナー設定
    attachQuestionEventListeners(question);

    // ナビゲーションボタンの表示制御
    updateNavigationButtons();
}

function attachQuestionEventListeners(question) {
    if (question.type === 'slider') {
        const slider = document.getElementById(question.id);
        const valueDisplay = document.getElementById(`${question.id}-value`);

        slider?.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            state.answers[question.id] = value;
            valueDisplay.textContent = formatSliderValue(value, question);
        });

    } else if (question.type === 'number') {
        const input = document.getElementById(question.id);
        input?.addEventListener('input', (e) => {
            const val = e.target.value;
            // 数値変換。空文字なら保存しないか、空文字のまま保存
            state.answers[question.id] = val === '' ? '' : Number(val);
        });

    } else if (question.type === 'select') {
        const radioOptions = document.querySelectorAll('.radio-option');
        radioOptions.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                state.answers[question.id] = value;

                // 選択状態を更新
                radioOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                // ラジオボタンもチェック
                const radio = option.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
            });
        });

    } else if (question.type === 'checkbox') {
        const checkboxes = document.querySelectorAll(`input[name="${question.id}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.value;
                const isChecked = e.target.checked;
                let currentAnswers = state.answers[question.id] || [];

                // 選択状態の更新ロジック
                if (value === 'none') {
                    if (isChecked) {
                        // 「特になし」を選択：他をすべて解除
                        checkboxes.forEach(cb => {
                            if (cb.value !== 'none') {
                                cb.checked = false; // DOMの状態更新
                                cb.closest('.radio-option').classList.remove('selected'); // 見た目の更新
                            }
                        });
                        currentAnswers = ['none'];
                    } else {
                        currentAnswers = [];
                    }
                } else {
                    if (isChecked) {
                        // 通常選択：「特になし」が選択されていたら解除
                        const noneCb = document.querySelector(`input[name="${question.id}"][value="none"]`);
                        if (noneCb && noneCb.checked) {
                            noneCb.checked = false;
                            noneCb.closest('.radio-option').classList.remove('selected');
                            currentAnswers = currentAnswers.filter(v => v !== 'none');
                        }
                        // 重複を防いで追加
                        if (!currentAnswers.includes(value)) {
                            currentAnswers.push(value);
                        }
                    } else {
                        currentAnswers = currentAnswers.filter(v => v !== value);
                    }
                }

                // State更新
                state.answers[question.id] = currentAnswers;

                // 自身の見た目を更新（他要素の見た目更新は上のロジックで行っている）
                if (isChecked) {
                    checkbox.closest('.radio-option').classList.add('selected');
                } else {
                    checkbox.closest('.radio-option').classList.remove('selected');
                }
            });
        });

    } else if (question.type === 'multiInput') {
        question.fields.forEach(field => {
            const input = document.getElementById(`${question.id}-${field.id}`);
            input?.addEventListener('input', (e) => {
                if (!state.answers[question.id]) {
                    state.answers[question.id] = {};
                }
                state.answers[question.id][field.id] = e.target.value;
            });
        });
    }
}

function formatSliderValue(value, question) {
    if (question.unit === '円') {
        return `${value.toLocaleString()}${question.unit}`;
    }
    if (question.labels) {
        return question.labels[value - 1] || value;
    }
    return `${value}${question.unit || ''}`;
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // 前へボタン
    if (state.currentQuestionIndex === 0) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
    }

    // 次へボタンのテキスト
    if (state.currentQuestionIndex === DIAGNOSIS_QUESTIONS.length - 1) {
        nextBtn.textContent = '診断結果を見る';
    } else {
        nextBtn.textContent = '次へ';
    }
}

function previousQuestion() {
    if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    const currentQuestion = DIAGNOSIS_QUESTIONS[state.currentQuestionIndex];

    // バリデーション（任意でない質問は回答必須）
    if (!currentQuestion.optional && !state.answers[currentQuestion.id]) {
        alert('この質問への回答をお願いします。');
        return;
    }

    if (state.currentQuestionIndex < DIAGNOSIS_QUESTIONS.length - 1) {
        state.currentQuestionIndex++;
        renderQuestion();
    } else {
        // 診断完了
        calculateResult();
        saveResult();
        navigateToScreen('result');
    }
}

// ==========================================
// 診断ロジック
// ==========================================
function calculateResult() {
    const answers = state.answers;

    // 1. 生活リズムシミュレーション
    const lifeRhythm = simulateLifeRhythm(answers);

    // 2. 金銭シミュレーション
    const moneySim = simulateMoney(answers);

    // 3. 安全・行動シミュレーション
    const safetySim = simulateSafety(answers);

    // 4. 一般的な注意点と対策
    const { cautions, advice } = generateCautionsAndAdvice(answers);

    state.result = {
        conditions: answers,
        simulation: {
            rhythm: lifeRhythm,
            money: moneySim,
            safety: safetySim
        },
        cautions,
        advice,
        timestamp: Date.now()
    };
}

// === シミュレーションロジック ===

function simulateLifeRhythm(answers) {
    // 通勤・通学時間（往復 + 準備60分）
    const commuteOneWay = answers.commuteTime || 0;
    const commuteCount = answers.commuteCount ? parseInt(answers.commuteCount) : 5;
    const dailyCommuteLoss = (commuteOneWay * 2) + 60; // 往復+準備
    const monthlyCommuteHours = (dailyCommuteLoss * commuteCount * 4) / 60; // 月間拘束時間（時間）

    // 睡眠タイプ判定
    let sleepComment = "";
    if (answers.sleepType === 'morning') {
        sleepComment = "朝型なので、日当たりの良い東向き・南向きの部屋だと快適に起きられます。";
    } else if (answers.sleepType === 'night') {
        sleepComment = "夜型生活になりがちなので、遮光カーテンや防音性が睡眠の質を左右します。";
    } else {
        sleepComment = "標準的な生活リズムです。";
    }

    return {
        dailyLoss: dailyCommuteLoss,
        monthlyLoss: Math.round(monthlyCommuteHours),
        sleepType: answers.sleepType,
        comment: sleepComment
    };
}

function simulateMoney(answers) {
    const rentLimit = answers.rentLimit || 60000;
    const income = answers.income ? (answers.income * 10000) : 200000; // デフォルト20万

    // 固定費計算ルール: 家賃 + 管理費(仮5000) + 光熱費(仮10000)
    // ユーザー入力が「家賃(管理費込)」なので、管理費は内包とみなすか別途加算するか？
    // 設問が「家賃（管理費込）の上限」なので、rentLimitをそのまま使用。
    // 光熱費・通信費等の概算として +1.5万しておく
    const estimatedUtilities = 15000;
    const totalFixedCost = rentLimit + estimatedUtilities;

    const disposable = Math.max(0, income - totalFixedCost);
    const ratio = Math.round((totalFixedCost / income) * 100);

    let comment = "";
    if (ratio > 40) {
        comment = "一般的に固定費は手取りの30%前後が目安です。少し生活費の工夫が必要になるかもしれません。";
    } else if (ratio < 25) {
        comment = "余裕のある資金計画です。趣味や貯金に回せる金額が多くなります。";
    } else {
        comment = "バランスの取れた資金計画と言えます。";
    }

    return {
        totalFixedCost,
        disposable,
        ratio,
        comment
    };
}

function simulateSafety(answers) {
    const nightReturn = answers.nightReturn;
    const securityAnxiety = answers.securityAnxiety;

    let advice = [];

    if (nightReturn === 'daily' || nightReturn === '3-4times') {
        advice.push("夜間の帰宅が多いため、駅からのルートに街灯があるか、人通りがあるかが重要になります。");
    }

    if (securityAnxiety === 'high') {
        advice.push("防犯意識が高いため、2階以上やオートロック、モニター付きインターホンがあると安心感が違います。");
    }

    return {
        nightFreq: nightReturn,
        anxiety: securityAnxiety,
        advice: advice
    };
}

function generateCautionsAndAdvice(answers) {
    const cautions = [];
    const advicePoints = [];

    // --- 構造・防音 ---
    if (answers.propertyConditions && answers.propertyConditions.structure) {
        const str = answers.propertyConditions.structure;
        const soundScore = answers.soundproofing || 3;

        if ((str.includes('木造') || str.includes('軽量鉄骨')) && soundScore >= 4) {
            cautions.push({
                title: '防音性と構造のギャップ',
                text: '木造や軽量鉄骨は、一般的にRC造に比べて音が響きやすいと言われています。音に敏感な場合は、内見時に隣の音の響きを確認することをお勧めします。'
            });
        }
    }

    // --- 階数・虫・防犯 ---
    if (answers.propertyConditions && answers.propertyConditions.floor) {
        const floor = parseInt(answers.propertyConditions.floor);
        const constitution = answers.constitution || [];

        if (floor === 1) {
            if (constitution.includes('bugs')) {
                cautions.push({
                    title: '1階と虫対策',
                    text: '1階は地面に近いため、上層階に比べると虫と遭遇する可能性が高いと言われています。防虫対策をしっかり行うのがお勧めです。'
                });
            }
            if (constitution.includes('cold')) {
                cautions.push({
                    title: '1階の冷気',
                    text: '1階は地面からの冷気が伝わりやすい傾向があります。厚手のカーペットなどで底冷え対策をすると快適に過ごせます。'
                });
            }
            if (answers.securityAnxiety === 'high') {
                cautions.push({
                    title: '1階の防犯',
                    text: '防犯面を重視される場合、1階は外からの視線が気になることがあります。遮光カーテンやシャッターの有無を確認すると安心です。'
                });
            }
        }
    }

    // --- 自炊 ---
    if (answers.cookingFrequency === 'daily') {
        advicePoints.push({
            title: '自炊派のキッチン選び',
            text: '料理を頻繁にする場合、コンロ数や調理スペースの広さが満足度に直結します。まな板を置くスペースがあるか確認すると良いでしょう。'
        });
    }

    // --- 立地 ---
    if (answers.locationConditions && answers.locationConditions.stationDist) {
        const dist = parseInt(answers.locationConditions.stationDist);
        if (dist >= 15) {
            cautions.push({
                title: '駅徒歩15分以上の距離',
                text: '特に雨の日や荷物が多い日は、移動が大変に感じることがあるかもしれません。自転車の利用も検討すると良いでしょう。'
            });
        }
    }

    // --- プロパンガス ---
    if (answers.locationConditions && answers.locationConditions.gas && answers.locationConditions.gas.includes('プロパン')) {
        cautions.push({
            title: 'プロパンガスのコスト',
            text: 'プロパンガスは都市ガスに比べて基本料金が高くなる傾向があります。冬場のガス代などは少し多めに見積もっておくと安心です。'
        });
    }

    return { cautions, advice: advicePoints };
}

// ==========================================
// 結果表示
// ==========================================
// ==========================================
// 結果表示
// ==========================================
function renderResult() {
    if (!state.result) return;

    const container = document.getElementById('result-container');
    if (!container) return;

    const { conditions, simulation, cautions, advice } = state.result;

    // ヘッダー: あなたの条件 (シンプルに整理)
    let html = `
        <div class="card fade-in">
            <h2>あなたの条件整理</h2>
            <div style="background: var(--color-bg-page); padding: 16px; border-radius: 8px;">
                <ul style="list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <li><strong>家賃上限:</strong> ${conditions.rentLimit ? conditions.rentLimit.toLocaleString() : '---'}円</li>
                    <li><strong>月収:</strong> ${conditions.income ? (conditions.income + '万円') : '20万円(仮)'}</li>
                    <li><strong>通勤時間:</strong> ${conditions.commuteTime || '---'}分</li>
                    <li><strong>出社頻度:</strong> 週${conditions.commuteCount || 5}日</li>
                </ul>
            </div>
        </div>
    `;

    // 2. この物件を選んだ場合の生活イメージ
    html += `
        <div class="card fade-in">
            <h2>この物件での生活イメージ</h2>
            
            <div style="margin-bottom: 24px;">
                <h3 style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">⏰</span> 生活リズム・可処分時間
                </h3>
                <p>1ヶ月あたりの通学・通勤拘束時間（準備時間含）は約 <strong class="numeric" style="font-size:1.2em; color:var(--color-accent-a);">${simulation.rhythm.monthlyLoss}</strong> 時間です。</p>
                <p class="text-small">${simulation.rhythm.comment}</p>
            </div>

            <div style="margin-bottom: 24px;">
                <h3 style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">💰</span> 金銭面のシミュレーション
                </h3>
                <p>固定費（家賃＋光熱費等目安）は月収の 約 <strong class="numeric" style="font-size:1.2em; ${simulation.money.ratio > 40 ? 'color:var(--color-accent-b);' : 'color:var(--color-accent-a);'}">${simulation.money.ratio}%</strong> を占める計算です。</p>
                <p>自由に使えるお金（可処分所得）は目安として月 <strong>¥${simulation.money.disposable.toLocaleString()}</strong> 程度となります。</p>
                <p class="text-small">${simulation.money.comment}</p>
            </div>

            <div>
                <h3 style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:20px;">🛡️</span> 日常行動・安心感
                </h3>
                ${simulation.safety.advice.length > 0
            ? simulation.safety.advice.map(text => `<p class="text-small" style="margin-bottom:8px;">・${text}</p>`).join('')
            : '<p class="text-small">特段の懸念事項はありませんが、周辺環境はしっかり確認しましょう。</p>'}
            </div>
        </div>
    `;

    // 3. 条件から分かる一般的な注意点
    html += `
        <div class="card fade-in">
            <h2>条件から分かる一般的な注意点</h2>
            <p class="text-small">あなたの条件において、一般的に挙げられる注意点です。</p>
            ${cautions.length > 0
            ? cautions.map(c => `
                    <div style="margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--color-divider);">
                        <strong style="display:block; margin-bottom:4px;">${c.title}</strong>
                        <span class="text-small">${c.text}</span>
                    </div>`).join('')
            : '<p class="text-small">現時点で目立った注意点は検出されませんでした。</p>'}
        </div>
    `;

    // 4. 工夫すれば許容できるポイント
    html += `
        <div class="card fade-in">
            <h2>工夫すれば許容できるポイント</h2>
            <p class="text-small">少し視点を変えると、選択肢が広がるポイントです。</p>
             ${advice.length > 0
            ? advice.map(a => `
                    <div style="margin-bottom:12px; padding:12px; background:var(--color-bg-page); border-radius:8px;">
                        <strong style="display:block; margin-bottom:4px; color:var(--color-accent-a);">💡 ${a.title}</strong>
                        <span class="text-small">${a.text}</span>
                    </div>`).join('')
            : '<p class="text-small">現在の条件でバランス良く探せそうです。</p>'}
        </div>
    `;

    container.innerHTML = html;
}

// 古いヘルパー関数（削除またはダミー化）
function getSeverityColor(severity) { return ''; }
function renderMeter(containerId, score, label) { }
function getSeverityIcon(severity) { return ''; }

// ==========================================
// 用語解説
// ==========================================
function renderKnowledgeBase() {
    const container = document.getElementById('knowledge-accordion');
    if (!container) return;

    let html = '';

    Object.keys(KNOWLEDGE_BASE).forEach(category => {
        // カテゴリタイトルは除去してフラットにするか、デザインを変える
        // ここではカテゴリごとにまとまりを作る
        html += `<h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 14px; color: var(--color-text-secondary);">${category}</h3>`;

        KNOWLEDGE_BASE[category].forEach((item, index) => {
            const itemId = `${category}-${index}`;
            html += `
        <div class="accordion-item" data-id="${itemId}">
          <div class="accordion-header">
            <span class="accordion-title">${item.term}</span>
            <span class="accordion-icon">
                <svg width="20" height="20"><use href="#icon-file-text"></use></svg>
            </span>
          </div>
          <div class="accordion-content">
            <div class="accordion-body">
              <p><strong>説明:</strong> ${item.explanation}</p>
              <p style="margin-top: 12px;"><strong>💡 アドバイス:</strong> ${item.tip}</p>
            </div>
          </div>
        </div>
      `;
        });
    });

    container.innerHTML = html;
    setupAccordion(container);
}

// ==========================================
// 内見完全ガイドレンダリング（デザインを用語解説に統一）
// ==========================================
function renderInspectionGuide() {
    const container = document.getElementById('inspection-guide-list');
    if (!container || typeof INSPECTION_GUIDE_DATA === 'undefined') return;

    let html = '';

    INSPECTION_GUIDE_DATA.forEach((guide, index) => {
        const guideId = `guide-${index}`;
        // アコーディオン形式に変更
        html += `
            <div class="accordion-item" data-id="${guideId}">
                <div class="accordion-header">
                    <span class="accordion-title" style="font-weight: bold;">${guide.title}</span>
                    <span class="accordion-icon">
                         <svg width="20" height="20"><use href="#icon-map"></use></svg>
                    </span>
                </div>
                <div class="accordion-content">
                    <div class="accordion-body">
                        ${guide.description ? `<p style="margin-bottom: 24px; color: var(--color-text-secondary);">${guide.description}</p>` : ''}
                        
                        ${guide.isChecklist ? renderChecklistItems(guide.items) : renderGuideSections(guide.sections)}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    setupAccordion(container);
}

// アコーディオンのセットアップ関数（改良版）
function setupAccordion(container) {
    const headers = container.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');

            // 開閉切り替え
            item.classList.toggle('open');

            if (item.classList.contains('open')) {
                // コンテンツの高さを計算して設定
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = null;
            }
        });
    });
}

function renderGuideSections(sections) {
    if (!sections) return '';

    return sections.map(section => `
        <div class="guide-section" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--color-divider);">
            <h3 style="margin-bottom: 16px; color: var(--color-text-primary); font-weight: bold;">${section.subtitle}</h3>
            ${section.description ? `<p style="margin-bottom: 16px;">${section.description}</p>` : ''}
            
            ${renderGuideContent(section)}
        </div>
    `).join('');
}

function renderGuideContent(section) {
    if (section.type === 'checklist' || section.type === 'check-point') {
        return `
            <ul class="warning-list">
                ${section.items.map(item => {
            // マークダウン的な太字記法 (**text**) をHTMLに変換
            const formattedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return `
                    <li class="warning-item" style="border-left-color: var(--color-accent-b);">
                        <span class="warning-icon text-primary">✓</span>
                        <div class="warning-content">
                            <p class="warning-text" style="color: var(--color-text-primary); font-size: 15px;">${formattedItem}</p>
                        </div>
                    </li>
                `}).join('')}
            </ul>
        `;
    } else if (section.type === 'list' || section.type === 'text-list') {
        return `
            <ul style="list-style: none; padding-left: 0;">
                ${section.items.map(item => {
            const formattedItem = item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            return `
                    <li style="margin-bottom: 12px; padding-left: 1.5em; position: relative;">
                        <span style="position: absolute; left: 0; color: var(--color-text-primary);">•</span>
                        ${formattedItem}
                    </li>
                `}).join('')}
            </ul>
        `;
    } else if (section.type === 'comparison') {
        return section.content.map(block => `
            <div style="background: var(--color-bg-page); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="font-weight: bold; margin-bottom: 8px;">${block.heading}</h4>
                <div style="margin-bottom: 8px;">
                    <strong>メリット:</strong>
                    <ul style="list-style: disc; padding-left: 20px; font-size: 14px;">
                        ${block.merits.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
                <div>
                    <strong>チェックポイント:</strong>
                    <ul style="list-style: disc; padding-left: 20px; font-size: 14px;">
                        ${block.checkpoints.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    }
    return '';
}

function renderChecklistItems(items) {
    // カテゴリごとにグループ化
    const grouped = {};
    items.forEach(item => {
        if (!grouped[item.category]) grouped[item.category] = [];
        grouped[item.category].push(item.label);
    });

    return Object.keys(grouped).map(category => `
        <div style="margin-bottom: 24px;">
            <h4 style="margin-bottom: 12px; border-bottom: 2px solid var(--color-text-primary); display: inline-block;">${category}</h4>
            <div style="display: grid; gap: 12px;">
                ${grouped[category].map(label => `
                    <div style="display: flex; align-items: start; gap: 8px;">
                        <div style="width: 20px; height: 20px; border: 2px solid var(--color-border); border-radius: 4px; flex-shrink: 0;"></div>
                        <span>${label}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ==========================================
// LocalStorage
// ==========================================
function saveResult() {
    const data = {
        timestamp: state.result.timestamp,
        answers: state.answers,
        result: state.result
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedResult() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // 24時間以内の結果のみ復元
            if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                state.answers = data.answers;
                state.result = data.result;
            }
        } catch (e) {
            console.error('Failed to load saved result:', e);
        }
    }
}

function resetDiagnosis() {
    state.answers = {};
    state.result = null;
    state.currentQuestionIndex = 0;
    localStorage.removeItem(STORAGE_KEY);
}
