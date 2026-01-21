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

    document.getElementById('restart-btn')?.addEventListener('click', () => {
        resetDiagnosis();
        navigateToScreen('diagnosis');
    });

    document.getElementById('view-knowledge-btn')?.addEventListener('click', () => {
        navigateToScreen('knowledge');
    });

    // ホームからの用語解説ボタン
    document.getElementById('view-knowledge-from-top-btn')?.addEventListener('click', () => {
        navigateToScreen('knowledge');
    });

    document.getElementById('back-to-result-btn')?.addEventListener('click', () => {
        navigateToScreen('result');
    });

    // ホームに戻るボタン
    document.getElementById('home-from-diagnosis-btn')?.addEventListener('click', () => {
        navigateToScreen('top');
    });

    document.getElementById('home-from-result-btn')?.addEventListener('click', () => {
        navigateToScreen('top');
    });

    document.getElementById('home-from-knowledge-btn')?.addEventListener('click', () => {
        navigateToScreen('top');
    });

    // ボトムナビゲーション
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const screen = item.dataset.screen;
            if (screen === 'diagnosis') {
                // 診断画面は診断開始ボタンと同じ動作
                navigateToScreen('diagnosis');
            } else {
                navigateToScreen(screen);
            }
        });
    });

    // 診断フローの初期化
    renderQuestion();

    // ナビゲーションボタン
    document.getElementById('prev-btn')?.addEventListener('click', previousQuestion);
    document.getElementById('next-btn')?.addEventListener('click', nextQuestion);

    // 用語解説の初期化
    renderKnowledgeBase();
    renderInspectionGuide();
    initKnowledgeTabs();

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
            state.currentQuestionIndex = 0;
            renderQuestion();
        } else if (screenName === 'result') {
            renderResult();
        }

        // ボトムナビの状態を更新
        updateBottomNav();
    }
}

// ボトムナビゲーションのアクティブ状態を更新
function updateBottomNav() {
    document.querySelectorAll('.bottom-nav-item').forEach(item => {
        const screen = item.dataset.screen;
        if (screen === state.currentScreen) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
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

    // 親安心度の計算
    const parentSafetyScore = calculateParentSafety(answers);

    // 初心者適正度の計算
    const beginnerScore = calculateBeginnerScore(answers);

    // 注意点リストの生成
    const warnings = generateWarnings(answers);

    // おすすめ条件の生成
    const recommendations = generateRecommendations(answers);

    state.result = {
        parentSafetyScore,
        beginnerScore,
        warnings,
        recommendations,
        timestamp: Date.now()
    };
}

function calculateParentSafety(answers) {
    let score = 50; // ベーススコア

    // 夜間帰宅頻度
    const nightReturnScores = {
        'daily': -20,
        '3-4times': -10,
        '1-2times': 0,
        'rarely': 10
    };
    score += nightReturnScores[answers.nightReturn] || 0;

    // 親の関与度
    const parentInvolvementScores = {
        'high': 20,
        'medium': 10,
        'low': 0
    };
    score += parentInvolvementScores[answers.parentInvolvement] || 0;

    // 物件条件からの加点・減点
    if (answers.propertyConditions) {
        const conditions = answers.propertyConditions;

        // 階数
        if (conditions.floor) {
            const floor = parseInt(conditions.floor);
            if (floor === 1) score -= 20;
            else if (floor >= 3) score += 10;
        }

        // 構造
        if (conditions.structure) {
            if (conditions.structure.includes('RC') || conditions.structure.includes('SRC')) {
                score += 15;
            } else if (conditions.structure.includes('木造')) {
                score -= 10;
            }
        }

        // ガス種別
        if (conditions.gas) {
            if (conditions.gas.includes('都市')) score += 10;
            else if (conditions.gas.includes('プロパン')) score -= 5;
        }

        // 駅距離
        if (conditions.stationDist) {
            const dist = parseInt(conditions.stationDist);
            if (dist <= 5) score += 10;
            else if (dist >= 15) score -= 10;
        }
    }

    // 0-100の範囲に収める
    return Math.max(0, Math.min(100, score));
}

function calculateBeginnerScore(answers) {
    let score = 50; // ベーススコア

    // 家賃予算（適正範囲かどうか）
    const budget = answers.budget;
    if (budget >= 50000 && budget <= 80000) {
        score += 15; // 適正範囲
    } else if (budget < 40000) {
        score -= 20; // 安すぎる（リスク高）
    } else if (budget > 100000) {
        score -= 10; // 高すぎる（固定費負担大）
    }

    // 防音重視度
    const soundproofing = answers.soundproofing;
    if (soundproofing >= 4) {
        score += 10; // 防音を重視している
    }

    // 通勤時間
    const commuteScores = {
        '15min': 15,
        '30min': 10,
        '60min': 0,
        '60min+': -10
    };
    score += commuteScores[answers.commute] || 0;

    // 物件条件からの評価
    if (answers.propertyConditions) {
        const conditions = answers.propertyConditions;

        // 築年数
        if (conditions.age) {
            const age = parseInt(conditions.age);
            if (age <= 5) score += 10;
            else if (age >= 30) score -= 10;
        }

        // 構造
        if (conditions.structure) {
            if (conditions.structure.includes('RC')) score += 10;
            else if (conditions.structure.includes('木造')) score -= 5;
        }
    }

    return Math.max(0, Math.min(100, score));
}

function generateWarnings(answers) {
    const warnings = [];

    // 物件条件に基づく警告
    if (answers.propertyConditions) {
        const conditions = answers.propertyConditions;

        // 構造
        if (conditions.structure) {
            const structureKey = Object.keys(SPEC_RISK_TRANSLATOR.structure).find(key =>
                conditions.structure.includes(key)
            );
            if (structureKey) {
                const structureInfo = SPEC_RISK_TRANSLATOR.structure[structureKey];
                if (structureInfo.severity === 'high' || structureInfo.severity === 'critical') {
                    warnings.push({
                        title: `構造: ${structureKey}`,
                        risk: structureInfo.lifeRisk,
                        parentConcern: structureInfo.parentConcern,
                        severity: structureInfo.severity
                    });
                }
            }
        }

        // 階数
        if (conditions.floor) {
            const floor = parseInt(conditions.floor);
            const floorKey = floor === 1 ? 1 : floor === 2 ? 2 : '3以上';
            const floorInfo = SPEC_RISK_TRANSLATOR.floor[floorKey];
            if (floorInfo && (floorInfo.severity === 'high' || floorInfo.severity === 'critical')) {
                warnings.push({
                    title: `階数: ${floor}階`,
                    risk: floorInfo.lifeRisk,
                    parentConcern: floorInfo.parentConcern,
                    severity: floorInfo.severity
                });
            }
        }

        // ガス種別
        if (conditions.gas && conditions.gas.includes('プロパン')) {
            const gasInfo = SPEC_RISK_TRANSLATOR.gas['プロパン'];
            warnings.push({
                title: 'ガス: プロパンガス',
                risk: gasInfo.lifeRisk,
                parentConcern: gasInfo.parentConcern,
                severity: gasInfo.severity
            });
        }

        // 駅距離
        if (conditions.stationDist) {
            const dist = parseInt(conditions.stationDist);
            let distKey;
            if (dist <= 5) distKey = '5分以内';
            else if (dist <= 10) distKey = '10分以内';
            else if (dist <= 15) distKey = '15分以内';
            else distKey = '15分以上';

            const distInfo = SPEC_RISK_TRANSLATOR.stationDistance[distKey];
            if (distInfo && distInfo.severity === 'high') {
                warnings.push({
                    title: `駅徒歩: ${dist}分`,
                    risk: distInfo.lifeRisk,
                    parentConcern: distInfo.parentConcern,
                    severity: distInfo.severity
                });
            }
        }
    }

    // 夜間帰宅頻度に基づく警告
    if (answers.nightReturn === 'daily' || answers.nightReturn === '3-4times') {
        warnings.push({
            title: '夜間帰宅が多い傾向',
            risk: '夜道の安全性を重視する傾向があります。街灯が多いルート、交番が近い物件を検討されることをおすすめします。',
            parentConcern: '親が心配されやすいポイントです。内見時に夜の雰囲気も確認されると安心です。',
            severity: 'high'
        });
    }

    // 予算に基づく警告
    if (answers.budget < 40000) {
        warnings.push({
            title: '家賃が低めの設定',
            risk: '極端に安い物件は、築年数が古い、設備が不十分、立地が悪いなどの傾向があります。',
            parentConcern: '安全性や生活環境について、より慎重な確認が必要な場合があります。',
            severity: 'medium'
        });
    }

    return warnings;
}

function generateRecommendations(answers) {
    const recommendations = [];

    // 防音重視度に基づく推奨
    if (answers.soundproofing >= 4) {
        recommendations.push({
            title: 'RC造・SRC造を選ぶ',
            reason: '防音性が高く、隣人の生活音が気になりにくい。'
        });
    }

    // 夜間帰宅頻度に基づく推奨
    if (answers.nightReturn === 'daily' || answers.nightReturn === '3-4times') {
        recommendations.push({
            title: '2階以上 + オートロック',
            reason: '防犯面で安心。親も納得しやすい。'
        });
        recommendations.push({
            title: '駅徒歩10分以内',
            reason: '夜道が短く、安全性が高い。'
        });
    }

    // 予算に基づく推奨
    if (answers.budget >= 60000) {
        recommendations.push({
            title: '都市ガス物件',
            reason: 'ランニングコストを抑えられる。プロパンガスの2〜3倍の差。'
        });
    }

    // 親の関与度に基づく推奨
    if (answers.parentInvolvement === 'high') {
        recommendations.push({
            title: '大手管理会社の物件',
            reason: '親の信頼を得やすい。トラブル対応も安心。'
        });
    }

    return recommendations;
}

// ==========================================
// 結果表示
// ==========================================
function renderResult() {
    if (!state.result) return;

    const { parentSafetyScore, beginnerScore, warnings, recommendations } = state.result;

    // スコア表示
    renderMeter('parent-safety-meter', parentSafetyScore, '親安心度');
    renderMeter('beginner-score-meter', beginnerScore, '初心者適正度');

    // 注意点リスト
    const warningsContainer = document.getElementById('warnings-list');
    if (warnings.length === 0) {
        warningsContainer.innerHTML = '<p class="text-center">特に大きな注意点は見つかりませんでした。</p>';
    } else {
        warningsContainer.innerHTML = warnings.map(warning => `
      <div class="warning-item ${warning.severity}">
        <div class="warning-icon">${getSeverityIcon(warning.severity)}</div>
        <div class="warning-content">
          <div class="warning-title">${warning.title}</div>
          <div class="warning-text"><strong>生活リスク:</strong> ${warning.risk}</div>
          <div class="warning-text"><strong>親の懸念:</strong> ${warning.parentConcern}</div>
        </div>
      </div>
    `).join('');
    }

    // おすすめ条件
    const recommendationsContainer = document.getElementById('recommendations-list');
    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<p class="text-center">現在の条件で問題ありません。</p>';
    } else {
        recommendationsContainer.innerHTML = recommendations.map(rec => `
      <div class="card">
        <h3 style="margin-bottom: 8px;">✓ ${rec.title}</h3>
        <p class="text-small">${rec.reason}</p>
      </div>
    `).join('');
    }
}

function renderMeter(containerId, score, label) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
    <div class="meter-label">
      <span class="meter-title">${label}</span>
      <span class="meter-score numeric">${score}<span style="font-size: 16px; font-family: var(--font-jp);">/100</span></span>
    </div>
    <div class="meter-bar">
      <div class="meter-fill" style="width: ${score}%"></div>
    </div>
  `;
}

function getSeverityIcon(severity) {
    const icons = {
        critical: '🚨',
        high: '⚠️',
        medium: '💡',
        low: '✓'
    };
    return icons[severity] || '💡';
}

// ==========================================
// 用語解説
// ==========================================
// ==========================================
// 用語解説
// ==========================================
function renderKnowledgeBase() {
    const container = document.getElementById('knowledge-accordion');
    if (!container) return;

    let html = '';

    Object.keys(KNOWLEDGE_BASE).forEach(category => {
        html += `<h2 style="margin-top: 32px; margin-bottom: 16px;">${category}</h2>`;

        KNOWLEDGE_BASE[category].forEach((item, index) => {
            const itemId = `${category}-${index}`;
            html += `
        <div class="accordion-item" data-id="${itemId}">
          <div class="accordion-header">
            <span class="accordion-title">${item.term}</span>
            <span class="accordion-icon">▼</span>
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

    // アコーディオンのイベントリスナー
    const headers = container.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            item.classList.toggle('open');
        });
    });
}

// ==========================================
// 内見完全ガイドレンダリング
// ==========================================
function renderInspectionGuide() {
    const container = document.getElementById('inspection-guide-list');
    if (!container || typeof INSPECTION_GUIDE_DATA === 'undefined') return;

    let html = '';

    INSPECTION_GUIDE_DATA.forEach(guide => {
        html += `
            <div class="card" style="margin-bottom: 32px;">
                <h2 style="display: flex; align-items: center; gap: 8px;">
                    <span>${guide.icon}</span>
                    <span>${guide.title}</span>
                </h2>
                ${guide.description ? `<p style="margin-bottom: 24px;">${guide.description}</p>` : ''}
                
                ${guide.isChecklist ? renderChecklistItems(guide.items) : renderGuideSections(guide.sections)}
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderGuideSections(sections) {
    if (!sections) return '';

    return sections.map(section => `
        <div class="guide-section" style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--color-divider);">
            <h3 style="margin-bottom: 16px; color: var(--color-accent-a);">${section.subtitle}</h3>
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
                    <li class="warning-item" style="border-left-color: var(--color-accent-a);">
                        <span class="warning-icon">✓</span>
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
                        <span style="position: absolute; left: 0; color: var(--color-accent-a);">•</span>
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
            <h4 style="margin-bottom: 12px; border-bottom: 2px solid var(--color-accent-b); display: inline-block;">${category}</h4>
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

// タブ切り替え初期化
function initKnowledgeTabs() {
    const tabKnowledge = document.getElementById('tab-knowledge');
    const tabGuide = document.getElementById('tab-guide');
    const sectionKnowledge = document.getElementById('knowledge-section');
    const sectionGuide = document.getElementById('guide-section');

    if (!tabKnowledge || !tabGuide) return;

    function switchTab(target) {
        if (target === 'knowledge') {
            tabKnowledge.className = 'btn btn-primary btn-block';
            tabGuide.className = 'btn btn-secondary btn-block';
            sectionKnowledge.classList.remove('hidden');
            sectionGuide.classList.add('hidden');
        } else {
            tabKnowledge.className = 'btn btn-secondary btn-block';
            tabGuide.className = 'btn btn-primary btn-block';
            sectionKnowledge.classList.add('hidden');
            sectionGuide.classList.remove('hidden');
        }
    }

    tabKnowledge.addEventListener('click', () => switchTab('knowledge'));
    tabGuide.addEventListener('click', () => switchTab('guide'));
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
