    const INITIAL_INFRASTRUCTURES = [
      // Skyborn (Stability)
      { id: 'nobles', name: '귀족원 (House of Nobles)', faction: 'stability', attribute: 'order', ap: 0, desc: '스카이본 귀족으로 구성된 상원 의회. 전통 체제 통치력과 지배 규율을 의미합니다.' },
      { id: 'memorial', name: '창립자 기념관 (Founders Memorial)', faction: 'stability', attribute: 'ideology', ap: 0, desc: '건국 조상들과 다난 독립의 신성한 역사를 기리는 곳. 체제 정통성을 고취합니다.' },
      { id: 'academy', name: '사관학교 (Officer Academy)', faction: 'stability', attribute: 'order', ap: 0, desc: '스카이본의 미래 지휘관 생도들을 양성하는 군사 교육기관. 반복되는 훈련과 기강을 상징합니다.' },
      { id: 'admin', name: '행정청 (Administration)', faction: 'stability', attribute: 'welfare', ap: 0, desc: '기본 공공서비스 및 계획경제를 감독하는 최고 행정 기구. 민생 행정력을 나타냅니다.' },
      { id: 'guard', name: '근위사령부 (Guard Command)', faction: 'stability', attribute: 'force', ap: 0, desc: '티르 나 노이 치안 유지 및 방공 함대를 지휘하는 핵심 군사 기구. 무력 통제력의 상징.' },
      { id: 'society', name: '법학회 (Law Society)', faction: 'stability', attribute: 'ideology', ap: 0, desc: '새로운 법률 해석과 정의, 법전을 수호하고 판례를 연구하는 법조 연구 학회.' },

      // Whale (Revolution)
      { id: 'school', name: '웨일 학교 (Whale School)', faction: 'revolution', attribute: 'ideology', ap: 0, desc: '솔라스의 노동층 계층 자제들을 위한 실업·기술 학교. 지식을 통해 의식이 성장합니다.' },
      { id: 'union', name: '광산 노조 (Miners Union)', faction: 'revolution', attribute: 'order', ap: 0, desc: '스카이웨일 광산 노동자들의 권익과 안전, 자치 단결력을 대변하는 핵심 공동체.' },
      { id: 'community', name: '주민회관 (Community Center)', faction: 'revolution', attribute: 'welfare', ap: 0, desc: '웨일 계층이 모여 정보를 공유하고구호 활동을 조율하는 상생 생활관.' },
      { id: 'workshop', name: '증기 공방 (Steam Workshop)', faction: 'revolution', attribute: 'welfare', ap: 0, desc: '웨일 기술자들이 스팀 및 최신 기계 설비를 연구하고 정비하는 자립 기계공학 기지.' },
      { id: 'port', name: '아발론 항만 (Avalon Port)', faction: 'revolution', attribute: 'force', ap: 0, desc: '스카이웨일 선착장과 대규모 물류선, 무역 비공정이 입항하고 무장 투쟁력을 결집하는 항구.' },
      { id: 'crews', name: '청년 선원단 (Youth Sailors)', faction: 'revolution', attribute: 'force', ap: 0, desc: '도전적인 비공정 항로 개척과 지상 탐색을 수행하는 젊은 선원들의 활기차고 강력한 물리 행동 단체.' }
    ];

    const EVENT_TEMPLATES = [
      { id: 'festival', name: '[임시] 건국 기념제 (200주년)', season: 1, type: 'multiply', target: ['nobles', 'memorial'], multiplier: 1.5, desc: '창립자 기념관 및 귀족원 투자 효율 1.5배 상승' },
      { id: 'protest', name: '[임시] 민중 가로 시위', season: 1, type: 'multiply', target: ['union', 'community'], multiplier: 1.5, desc: '광산 노조 및 주민회관 투자 효율 1.5배 상승' },
      { id: 'light_verdict', name: '[임시] 라이트 강경 판결', season: 1, type: 'block', target: ['union'], multiplier: 0, desc: '광산 노조 강제 제재 조치로 인한 투자 일시 봉쇄' },
      { id: 'speech', name: '[임시] 공개 광장 연설', season: 1, type: 'multiply', target: ['school', 'society'], multiplier: 2.0, desc: '학술 선동 효과로 법학회 및 웨일학교 투자 효율 2배 상승' },
      
      { id: 'strike', name: '[임시] 총파업 결의령', season: 2, type: 'complex', target: [], multiplier: 0, desc: '광산 노조/청년 선원단 효율 2배 상승, 단 행정청 및 증기 공방 투자 완전 봉쇄' },
      { id: 'censorship', name: '[임시] 지하 언론 특별단속', season: 2, type: 'block', target: ['school', 'community'], multiplier: 0, desc: '웨일학교 및 주민회관 강제 휴교/폐쇄 조치로 투자 봉쇄' },
      { id: 'martial_law', name: '[임시] 계엄령 선포', season: 2, type: 'complex', target: [], multiplier: 0, desc: '근위사령부 효율 2배 상승, 단 주민회관/아발론 항만 투자 완전 봉쇄' }
    ];

    let isEditMode = false;
    let lastGeneratedScript = "";


    let stabilityMult = 1.0;
    let revolutionMult = 1.0;
    let s1StabMult = 1.0;
    let s1RevMult = 1.0;
    let s2StabMult = 1.0;
    let s2RevMult = 1.0;

    let state = {
      season: 1,
      day: 1,
      infrastructures: JSON.parse(JSON.stringify(INITIAL_INFRASTRUCTURES)),
      characters: [],
      activeEvents: [],
      logs: []
    };

    function getEventTemplates() {
      const custom = state.customEvents || [];
      return [...EVENT_TEMPLATES, ...custom];
    }

    function toggleEvtMultiplierField() {
      const type = document.getElementById("evt-type").value;
      const multGroup = document.getElementById("evt-mult-group");
      if (type === "block") {
        multGroup.style.opacity = "0.3";
        document.getElementById("evt-multiplier").disabled = true;
      } else {
        multGroup.style.opacity = "1.0";
        document.getElementById("evt-multiplier").disabled = false;
      }
    }

    function createNewEvent(e) {
      e.preventDefault();
      const name = document.getElementById("evt-name").value.trim();
      const desc = document.getElementById("evt-desc").value.trim();
      const target = document.getElementById("evt-target").value;
      const type = document.getElementById("evt-type").value;
      const multiplier = type === "multiply" ? parseFloat(document.getElementById("evt-multiplier").value) : 1.0;

      const newEvt = {
        id: "evt_custom_" + Date.now(),
        name: name,
        desc: desc,
        season: state.season,
        type: type,
        target: target === "ALL" ? ["nobles", "memorial", "academy", "society", "guard", "admin", "port", "crews", "union", "school", "community", "workshop"] : [target],
        multiplier: multiplier
      };

      if (!state.customEvents) state.customEvents = [];
      state.customEvents.push(newEvt);
      saveToLocalStorage();
      updateUI();
      
      document.getElementById("evt-name").value = "";
      document.getElementById("evt-desc").value = "";
      
      alert(`신규 이벤트 [${name}]가 현재 기수에 정상 등록되었습니다.`);
    }

    function deleteCustomEvent(evtId, e) {
      if (e) e.stopPropagation();
      if (!confirm("이 커스텀 이벤트를 삭제하시겠습니까?")) return;
      
      state.activeEvents = state.activeEvents.filter(id => id !== evtId);
      state.customEvents = (state.customEvents || []).filter(evt => evt.id !== evtId);
      
      saveToLocalStorage();
      updateUI();
    }

    function copyCustomEventCode(evtId, e) {
      if (e) e.stopPropagation();
      const evt = (state.customEvents || []).find(x => x.id === evtId);
      if (!evt) return;
      
      const payload = {
        name: evt.name,
        desc: evt.desc,
        season: evt.season,
        type: evt.type,
        target: evt.target,
        multiplier: evt.multiplier
      };
      
      try {
        const code = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
        navigator.clipboard.writeText(code).then(() => {
          alert(`이벤트 [${evt.name}]의 공유 코드가 클립보드에 복사되었습니다.\n다른 사람이 [가져오기] 입력칸에 붙여넣어 그대로 쓸 수 있습니다.`);
        }).catch(err => {
          alert("클립보드 복사 실패: " + err);
        });
      } catch (err) {
        alert("코드 생성에 실패했습니다: " + err);
      }
    }

    function importEventCode() {
      const codeInput = document.getElementById("import-evt-code");
      const code = codeInput.value.trim();
      if (!code) {
        alert("이벤트 공유 코드를 먼저 입력해 주세요.");
        return;
      }
      
      try {
        const jsonStr = decodeURIComponent(escape(atob(code)));
        const data = JSON.parse(jsonStr);
        
        if (!data.name || !data.desc || !data.type || !data.target) {
          throw new Error("올바르지 않은 공유 포맷");
        }
        
        const newEvt = {
          id: "evt_custom_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
          name: data.name,
          desc: data.desc,
          season: data.season || state.season,
          type: data.type,
          target: data.target,
          multiplier: data.multiplier || 1.0
        };
        
        if (!state.customEvents) state.customEvents = [];
        state.customEvents.push(newEvt);
        saveToLocalStorage();
        updateUI();
        
        codeInput.value = "";
        alert(`외부 이벤트 [${data.name}]를 성공적으로 수입하여 현재 기수 대장에 추가했습니다!`);
      } catch (err) {
        alert("올바르지 않은 이벤트 공유 코드입니다. 코드를 다시 확인해 주세요.");
      }
    }

    function toggleEditMode() {
      if (!isEditMode) {
        if (!confirm("[경고] GM 직접 수치 편집 모드에 진입하십니까?\n\n이 모드에서는 기반시설 카드의 수치를 즉각 조절할 수 있습니다.\n오입력이 없도록 유의바랍니다.")) {
          return;
        }
        isEditMode = true;
      } else {
        isEditMode = false;
      }
      updateUI();
    }

    function getPredictedEnding() {
      let totalStability = 0;
      let totalRevolution = 0;
      let totalForce = 0;
      let totalOrder = 0;
      let totalIdeology = 0;
      let totalWelfare = 0;

      state.infrastructures.forEach(infra => {
        let effectiveAP = getEffectiveAP(infra.id);
        if (infra.faction === "stability") totalStability += effectiveAP;
        if (infra.faction === "revolution") totalRevolution += effectiveAP;
        if (infra.attribute === "force") totalForce += effectiveAP;
        if (infra.attribute === "order") totalOrder += effectiveAP;
        if (infra.attribute === "ideology") totalIdeology += effectiveAP;
        if (infra.attribute === "welfare") totalWelfare += effectiveAP;
      });

      const totalAP = totalStability + totalRevolution;
      if (totalAP === 0) return "투자 데이터 기록 없음 (결산 대기)";

      const diff = Math.abs(totalStability - totalRevolution);
      const marginPercent = (diff / totalAP) * 100;

      if (marginPercent < 5) {
        return "⚠️ [파국] 영원한 긴 밤의 고착화";
      } 
      else if (totalStability > totalRevolution) {
        const sForce = getEffectiveAP("guard");
        const sOrder = getEffectiveAP("nobles") + getEffectiveAP("academy");
        const sIdeology = getEffectiveAP("memorial") + getEffectiveAP("society");
        const sWelfare = getEffectiveAP("admin");
        const sTotal = sForce + sOrder + sIdeology + sWelfare;

        if (sTotal < 150) return "⌛ [보수] 정체와 서서히 추락하는 하늘섬";
        if (sForce > sTotal * 0.45) return "🚨 [보수] 군사 계엄 및 철권 특별재판부";
        if (sOrder > sTotal * 0.45) return "🚨 [보수/규율] 관료제적 기계 통제국가";
        if (sWelfare + sIdeology > sTotal * 0.50) return "🏆 [보수/명예] 질서와 평화의 낙원";
        return "⚖️ [보수] 규율과 안정의 지속";
      } 
      else {
        const rForce = getEffectiveAP("port") + getEffectiveAP("crews");
        const rOrder = getEffectiveAP("union");
        const rIdeology = getEffectiveAP("school");
        const rWelfare = getEffectiveAP("community") + getEffectiveAP("workshop");
        const rTotal = rForce + rOrder + rIdeology + rWelfare;

        if (rTotal < 150) return "⌛ [혁명] 미완의 혁명과 군벌의 난립";
        if (rForce > rTotal * 0.45) return "🚨 [혁명] 단두대와 보복의 붉은 광장";
        if (rOrder > rTotal * 0.45) return "🚨 [혁명/규율] 통제된 조합주의 배급체제";
        if (rWelfare + rIdeology > rTotal * 0.50) return "🏆 [혁명/명예] 자유와 평등의 공화정";
        return "⚖️ [혁명] 새로운 지배 구도의 수립";
      }
    }

    function settleCurrentDay() {
      if (state.day >= 4) {
        alert(`DAY 4는 이번 시즌의 마지막 일차입니다.\n\n더 이상 하루 결산으로 다음 날로 진행할 수 없으며, ${state.season === 1 ? "2기 에버나이트로 전환" : "최종 혁명 결산하기"} 버튼을 통해 시즌을 마감해야 합니다.`);
        return;
      }

      const currentSeason = state.season;
      const currentDay = state.day;
      
      let stabTodayRaw = 0;
      let revTodayRaw = 0;
      let mostActiveInfra = null;
      let maxInfraAP = 0;
      let infraDailyMap = {};

      state.logs.forEach(log => {
        if (log.season === currentSeason && log.day === currentDay) {
          const infra = state.infrastructures.find(i => i.id === log.infraId);
          if (infra) {
            if (infra.faction === "stability") stabTodayRaw += log.ap;
            else revTodayRaw += log.ap;
            infraDailyMap[infra.name] = (infraDailyMap[infra.name] || 0) + log.ap;
          }
        }
      });

      for (const [name, ap] of Object.entries(infraDailyMap)) {
        if (ap > maxInfraAP) {
          maxInfraAP = ap;
          mostActiveInfra = name;
        }
      }

      const activeEvts = state.activeEvents.map(evtId => {
        const template = getEventTemplates().find(t => t.id === evtId);
        return template ? template.name : null;
      }).filter(n => n !== null);

      const predictedEnding = getPredictedEnding();

      const content = document.getElementById("settle-modal-content");
      document.getElementById("settle-modal-title").innerText = `📅 ${currentSeason}기 DAY ${currentDay} 하루 결산 보고서`;
      content.innerHTML = `
        <div style="background: rgba(0,0,0,0.03); padding: 12px; border-radius: 6px; border: var(--card-border); margin-bottom: 15px;">
          <strong style="color: var(--primary-color);">📊 오늘(DAY ${currentDay})의 활동 통계 (보정 적용 전 raw AP)</strong>
          <ul style="margin-left: 20px; margin-top: 6px; list-style-type: square; display: flex; flex-direction: column; gap: 4px;">
            <li>보수 진영 투입: <strong>${stabTodayRaw} AP</strong></li>
            <li>혁명 진영 투입: <strong>${revTodayRaw} AP</strong></li>
            <li>오늘 총 투입량: <strong>${stabTodayRaw + revTodayRaw} AP</strong></li>
          </ul>
        </div>

        <div style="background: rgba(0,0,0,0.03); padding: 12px; border-radius: 6px; border: var(--card-border); margin-bottom: 15px;">
          <strong style="color: var(--secondary-color);">⚙️ 오늘의 요약 특이사항</strong>
          <ul style="margin-left: 20px; margin-top: 6px; list-style-type: square; display: flex; flex-direction: column; gap: 4px;">
            <li>오늘 최대 집중 투자 기반시설: <span style="font-weight: 700;">${mostActiveInfra ? `${mostActiveInfra} (${maxInfraAP} AP)` : "없음"}</span></li>
            <li>오늘 작동 중인 이벤트 모디파이어: <span style="font-weight: 700; color: var(--danger-color);">${activeEvts.length > 0 ? activeEvts.join(", ") : "없음"}</span></li>
          </ul>
        </div>

        <div style="background: rgba(212, 175, 55, 0.08); padding: 12px; border-radius: 6px; border: 1px dashed var(--primary-color);">
          <strong style="color: var(--primary-color);">🔮 현재 추이 기준 예측 엔딩</strong>
          <p style="margin-top: 4px; font-weight: 800; font-size: 0.95rem; text-shadow: 0 0 1px rgba(0,0,0,0.2);">
            ${predictedEnding}
          </p>
          <span style="font-size: 0.78rem; color: var(--text-muted);">* 남은 일차 동안의 추가 기입 및 배율 변동에 의해 결산 엔딩은 바뀔 수 있습니다.</span>
        </div>

        <p style="margin-top: 15px; font-weight: 700; color: var(--danger-color); text-align: center;">
          ⚠️ 정말로 오늘 일차를 마감하고 내일(DAY ${currentDay + 1})로 진행하시겠습니까?
        </p>
      `;

      openModal("settle-modal");
    }

    function confirmDayIncrement() {
      closeModal("settle-modal");
      state.day = Math.min(4, state.day + 1);
      saveToLocalStorage();
      updateUI();
      alert(`성공적으로 DAY ${state.day} 일차로 전환되었습니다.`);
    }

    function showRandomScriptPopup(infraId, charName, baseAP, finalAP) {
      const infra = state.infrastructures.find(i => i.id === infraId);
      if (!infra) return;
      const scriptSetObj = RANDOM_SCRIPTS[infraId];
      if (!scriptSetObj) return;

      const list = state.season === 1 ? scriptSetObj.season1 : scriptSetObj.season2;
      const randIdx = Math.floor(Math.random() * list.length);
      const chosenScript = list[randIdx];

      lastGeneratedScript = `[${state.season}기 Day ${state.day}] ${charName} 캐릭터 ➔ ${infra.name} 투자 활동 결과:\n\n"${chosenScript}"`;

      document.getElementById("script-popup-text").innerHTML = `
        <strong>캐릭터명</strong>: ${charName}<br>
        <strong>투자 기반시설</strong>: ${infra.name}<br>
        <strong>소모한 행동력</strong>: ${baseAP} AP (반영: ${finalAP} AP)<br>
        <hr style="border: 0; border-top: 1px dashed rgba(125, 114, 96, 0.2); margin: 10px 0;">
        <span style="font-style: italic; color: var(--text-main); font-weight:700;">"${chosenScript}"</span>
      `;
      openModal("script-popup-modal");
    }

    function copyPopupScript() {
      const txt = lastGeneratedScript;
      const tempInput = document.createElement("textarea");
      tempInput.value = txt;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      alert("스크립트가 성공적으로 클립보드에 복사되었습니다!");
    }

    function getDisplayAP(infraId) {
      let sum = 0;
      state.logs.forEach(log => {
        if (state.season === 1) {
          if (log.season === 1 && log.day <= state.day) {
            if (log.infraId === infraId) sum += log.ap;
          }
        } else {
          if (log.season === 1) {
            if (log.infraId === infraId) sum += log.ap;
          } else if (log.season === 2 && log.day <= state.day) {
            if (log.infraId === infraId) sum += log.ap;
          }
        }
      });
      return sum;
    }

    function getEffectiveAP(infraId) {
      const infra = state.infrastructures.find(i => i.id === infraId);
      if (!infra) return 0;

      // 1. Season 1 raw AP
      let s1Raw = 0;
      state.logs.forEach(log => {
        if (log.infraId === infraId && log.season === 1) {
          if (state.season === 1) {
            if (log.day <= state.day) s1Raw += log.ap;
          } else {
            s1Raw += log.ap;
          }
        }
      });
      const s1Mult = infra.faction === 'stability' ? s1StabMult : s1RevMult;
      const s1Effective = s1Raw * s1Mult;

      // 2. Season 2 raw AP
      let s2Raw = 0;
      if (state.season === 2) {
        state.logs.forEach(log => {
          if (log.infraId === infraId && log.season === 2 && log.day <= state.day) {
            s2Raw += log.ap;
          }
        });
      }
      const s2Mult = infra.faction === 'stability' ? s2StabMult : s2RevMult;
      const s2Effective = s2Raw * s2Mult;

      return s1Effective + s2Effective;
    }



    function loadFromLocalStorage() {
      const saved = localStorage.getItem('tirnanog_state');
      if (saved) {
        try {
          state = JSON.parse(saved);
          if (!state.infrastructures || state.infrastructures.length !== INITIAL_INFRASTRUCTURES.length) {
            state.infrastructures = JSON.parse(JSON.stringify(INITIAL_INFRASTRUCTURES));
          }
          if (!state.customEvents) state.customEvents = [];
        } catch (e) {
          console.error("LocalStorage load error: ", e);
        }
      }
      const savedRoomKey = localStorage.getItem('tirnanog_cloud_key');
      if (savedRoomKey) {
        document.getElementById('cloud-room-input').value = savedRoomKey;
      }
    }

    function saveToLocalStorage() {
      localStorage.setItem('tirnanog_state', JSON.stringify(state));
      updateUI();
      pushToRealtime();
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
      
      document.getElementById(tabId).classList.add('active');
      const btn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (btn) btn.classList.add('active');
    }

    function openModal(modalId) {
      document.getElementById(modalId).style.display = 'flex';
    }

    function closeModal(modalId) {
      document.getElementById(modalId).style.display = 'none';
    }

    // 모달 바깥(어두운 배경) 클릭 시 닫기
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
          closeModal(overlay.id);
        }
      });
    });

    // ESC 키로 현재 열려있는 모달 닫기
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
          if (overlay.style.display === 'flex') {
            closeModal(overlay.id);
          }
        });
      }
    });

    function getAPModifier(infraId) {
      let multiplier = 1.0;
      let blocked = false;

      state.activeEvents.forEach(evtId => {
        const template = getEventTemplates().find(t => t.id === evtId);
        if (!template) return;

        if (template.type === 'multiply' && template.target.includes(infraId)) {
          multiplier *= template.multiplier;
        } else if (template.type === 'block' && template.target.includes(infraId)) {
          blocked = true;
        } else if (template.type === 'complex') {
          if (template.id === 'strike') {
            if (infraId === 'union' || infraId === 'crews') multiplier *= 2.0;
            if (infraId === 'admin' || infraId === 'workshop') blocked = true;
          }
          if (template.id === 'martial_law') {
            if (infraId === 'guard') multiplier *= 2.0;
            if (infraId === 'community' || infraId === 'port') blocked = true;
          }
        }
      });

      return { multiplier, blocked };
    }

    function updateUI() {
      document.body.setAttribute('data-season', state.season);
      
      const badgeText = state.season === 1 ? '1기 에버라이트' : '2기 에버나이트';
      document.getElementById('season-badge-text').innerText = badgeText;
      
      const logoIcon = document.getElementById('logo-icon');
      const transBtn = document.getElementById('btn-season-trans');
      if (state.season === 1) {
        logoIcon.className = 'fa-solid fa-cloud-sun';
        transBtn.innerHTML = '<i class="fa-solid fa-hourglass-half"></i> 2기 에버나이트로 전환';
        transBtn.setAttribute('onclick', 'triggerSeasonTransition()');
        transBtn.className = 'btn btn-primary';
      } else {
        logoIcon.className = 'fa-solid fa-eye-radiation';
        transBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> 1기 에버라이트로 복귀';
        transBtn.setAttribute('onclick', 'revertToSeason1()');
        transBtn.className = 'btn';
      }

      document.getElementById('current-day-label').innerText = `DAY ${state.day}`;

      // Calculate active faction counts for Season 1
      let countS1Stability = 0;
      let countS1Revolution = 0;
      state.characters.forEach(char => {
        if (char.startClass === 'Skyborn') countS1Stability++;
        if (char.startClass === 'Whale') countS1Revolution++;
      });

      s1StabMult = 1.0;
      s1RevMult = 1.0;
      if (countS1Stability > 0 && countS1Revolution > 0) {
        if (countS1Stability < countS1Revolution) {
          s1StabMult = Math.min(5.0, countS1Revolution / countS1Stability);
        } else if (countS1Revolution < countS1Stability) {
          s1RevMult = Math.min(5.0, countS1Stability / countS1Revolution);
        }
      }

      // Calculate active faction counts for Season 2
      let countS2Stability = 0;
      let countS2Revolution = 0;
      state.characters.forEach(char => {
        if (char.sec2Faction === 'Skyguard') countS2Stability++;
        if (char.sec2Faction === 'Nightwalker') countS2Revolution++;
      });

      s2StabMult = 1.0;
      s2RevMult = 1.0;
      if (countS2Stability > 0 && countS2Revolution > 0) {
        if (countS2Stability < countS2Revolution) {
          s2StabMult = Math.min(5.0, countS2Revolution / countS2Stability);
        } else if (countS2Revolution < countS2Stability) {
          s2RevMult = Math.min(5.0, countS2Stability / countS2Revolution);
        }
      }

      // For legacy interface compatibility
      stabilityMult = state.season === 1 ? s1StabMult : s2StabMult;
      revolutionMult = state.season === 1 ? s1RevMult : s2RevMult;

      // Update correction label in UI
      const corrInfo = document.getElementById('correction-ratio-info');
      if (corrInfo) {
        if (stabilityMult > 1.0 || revolutionMult > 1.0) {
          corrInfo.style.display = 'block';
          corrInfo.innerHTML = `<i class="fa-solid fa-circle-info"></i> 인원수 보정 활성화 (보수 배율: x${stabilityMult.toFixed(2)} / 혁명 배율: x${revolutionMult.toFixed(2)})`;
        } else {
          corrInfo.style.display = 'none';
        }
      }

      // 1. Season 1 calculations
      let s1Stability = 0;
      let s1Revolution = 0;
      let totalForce = 0;
      let totalOrder = 0;
      let totalIdeology = 0;
      let totalWelfare = 0;
      
      state.infrastructures.forEach(infra => {
        let s1Raw = 0;
        state.logs.forEach(log => {
          if (log.infraId === infra.id && log.season === 1) {
            if (state.season === 1) {
              if (log.day <= state.day) s1Raw += log.ap;
            } else {
              s1Raw += log.ap;
            }
          }
        });
        const mult = infra.faction === 'stability' ? s1StabMult : s1RevMult;
        const effectiveS1 = s1Raw * mult;
        if (infra.faction === 'stability') s1Stability += effectiveS1;
        else s1Revolution += effectiveS1;

        // Add to attribute totals
        if (infra.attribute === 'force') totalForce += effectiveS1;
        if (infra.attribute === 'order') totalOrder += effectiveS1;
        if (infra.attribute === 'ideology') totalIdeology += effectiveS1;
        if (infra.attribute === 'welfare') totalWelfare += effectiveS1;
      });

      const s1Total = s1Stability + s1Revolution;
      let s1StabPct = 50, s1RevPct = 50;
      if (s1Total > 0) {
        s1StabPct = (s1Stability / s1Total) * 100;
        s1RevPct = (s1Revolution / s1Total) * 100;
      }

      // 2. Season 2 calculations
      let s2Stability = 0;
      let s2Revolution = 0;
      
      if (state.season === 2) {
        state.infrastructures.forEach(infra => {
          let s2Raw = 0;
          state.logs.forEach(log => {
            if (log.infraId === infra.id && log.season === 2 && log.day <= state.day) {
              s2Raw += log.ap;
            }
          });
          const mult = infra.faction === 'stability' ? s2StabMult : s2RevMult;
          const effectiveS2 = s2Raw * mult;
          if (infra.faction === 'stability') s2Stability += effectiveS2;
          else s2Revolution += effectiveS2;

          // Add to attribute totals
          if (infra.attribute === 'force') totalForce += effectiveS2;
          if (infra.attribute === 'order') totalOrder += effectiveS2;
          if (infra.attribute === 'ideology') totalIdeology += effectiveS2;
          if (infra.attribute === 'welfare') totalWelfare += effectiveS2;
        });
      }

      const s2Total = s2Stability + s2Revolution;
      let s2StabPct = 50, s2RevPct = 50;
      if (s2Total > 0) {
        s2StabPct = (s2Stability / s2Total) * 100;
        s2RevPct = (s2Revolution / s2Total) * 100;
      }

      // 3. Combined calculations
      const totalStability = s1Stability + s2Stability;
      const totalRevolution = s1Revolution + s2Revolution;
      const totalAP = totalStability + totalRevolution;

      let totalStabPct = 50, totalRevPct = 50;
      if (totalAP > 0) {
        totalStabPct = (totalStability / totalAP) * 100;
        totalRevPct = (totalRevolution / totalAP) * 100;
      }

      // Update S1 Gauge DOM
      document.getElementById('s1-stability-fill').style.width = `${s1StabPct}%`;
      document.getElementById('s1-revolution-fill').style.width = `${s1RevPct}%`;
      document.getElementById('s1-stability-val').innerText = `${Math.round(s1Stability)} AP (${s1StabPct.toFixed(1)}%)`;
      document.getElementById('s1-revolution-val').innerText = `${Math.round(s1Revolution)} AP (${s1RevPct.toFixed(1)}%)`;

      // Update S2 Gauge DOM
      document.getElementById('s2-stability-fill').style.width = `${s2StabPct}%`;
      document.getElementById('s2-revolution-fill').style.width = `${s2RevPct}%`;
      document.getElementById('s2-stability-val').innerText = `${Math.round(s2Stability)} AP (${s2StabPct.toFixed(1)}%)`;
      document.getElementById('s2-revolution-val').innerText = `${Math.round(s2Revolution)} AP (${s2RevPct.toFixed(1)}%)`;

      // Update Combined Gauge DOM
      document.getElementById('total-stability-fill').style.width = `${totalStabPct}%`;
      document.getElementById('total-revolution-fill').style.width = `${totalRevPct}%`;
      document.getElementById('total-stability-val').innerText = `${Math.round(totalStability)} AP (${totalStabPct.toFixed(1)}%)`;
      document.getElementById('total-revolution-val').innerText = `${Math.round(totalRevolution)} AP (${totalRevPct.toFixed(1)}%)`;

      // Radar graph math
      document.getElementById('val-force').innerText = Math.round(totalForce);
      document.getElementById('val-order').innerText = Math.round(totalOrder);
      document.getElementById('val-ideology').innerText = Math.round(totalIdeology);
      document.getElementById('val-welfare').innerText = Math.round(totalWelfare);

      const maxAttr = Math.max(totalForce, totalOrder, totalIdeology, totalWelfare, 50);
      const forceLen = (totalForce / maxAttr) * 80;
      const orderLen = (totalOrder / maxAttr) * 80;
      const welfareLen = (totalWelfare / maxAttr) * 80;
      const ideologyLen = (totalIdeology / maxAttr) * 80;

      const pForce = `100,${100 - forceLen}`;
      const pOrder = `${100 + orderLen},100`;
      const pWelfare = `100,${100 + welfareLen}`;
      const pIdeology = `${100 - ideologyLen},100`;

      document.getElementById('radar-poly').setAttribute('points', `${pForce} ${pOrder} ${pWelfare} ${pIdeology}`);

      // Refresh JSON strings
      document.getElementById('backup-json-textarea').value = JSON.stringify(state, null, 2);

      // Update Edit Mode panel in DOM
      const statusText = document.getElementById('edit-mode-status-text');
      const badge = document.getElementById('edit-mode-badge');
      const toggleBtn = document.getElementById('btn-toggle-edit-mode');
      const panel = document.getElementById('edit-mode-panel');

      if (statusText && badge && toggleBtn && panel) {
        if (isEditMode) {
          statusText.innerText = "🔓 편집 모드 (수치 직접 수정 가능)";
          badge.style.display = "inline-block";
          toggleBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> GM 편집 모드 끄기';
          toggleBtn.className = "btn btn-success";
          toggleBtn.style.color = "#000";
          toggleBtn.style.background = "var(--primary-color)";
          toggleBtn.style.borderColor = "var(--primary-color)";
          panel.style.background = "rgba(169, 68, 66, 0.08)";
          panel.style.borderColor = "var(--danger-color)";
        } else {
          statusText.innerText = "🔒 보기 모드 (수치 직접 수정 불가)";
          badge.style.display = "none";
          toggleBtn.innerHTML = '<i class="fa-solid fa-lock"></i> GM 편집 모드 켜기';
          toggleBtn.className = "btn";
          toggleBtn.style.color = "var(--danger-color)";
          toggleBtn.style.background = "transparent";
          toggleBtn.style.borderColor = "var(--danger-color)";
          panel.style.background = "rgba(0,0,0,0.03)";
          panel.style.borderColor = "var(--card-border)";
        }
      }

      // Render components
      renderInfrastructureGrids();
      populateDropdowns();
      renderRecentLogs();
      renderCharacterTable();
      renderEventsGrid();

      // Show/hide 2기 elements
      const sec2Elements = document.querySelectorAll('.sec2-only-header');
      sec2Elements.forEach(el => {
        el.style.display = state.season === 2 ? 'table-cell' : 'none';
      });

      const factionHeader = document.getElementById('char-faction-header');
      if (factionHeader) {
        factionHeader.innerText = '1기 신분';
      }

      // Render header mini stepper timeline
      const miniTimeline = document.getElementById('header-mini-timeline');
      if (miniTimeline) {
        let html = '';
        for (let i = 1; i <= 4; i++) {
          const isDotActive = (i <= state.day);
          html += `<div class="timeline-dot ${isDotActive ? 'active' : ''}" title="Day ${i}"></div>`;
          if (i < 4) {
            const isLineActive = (i < state.day);
            html += `<div class="timeline-line ${isLineActive ? 'active' : ''}"></div>`;
          }
        }
        miniTimeline.innerHTML = html;
      }
    }

    function getKoreanAttribute(attr) {
      if (attr === 'force') return '무력 (Force)';
      if (attr === 'order') return '규율 (Order)';
      if (attr === 'ideology') return '이념 (Ideology)';
      if (attr === 'welfare') return '상생 (Welfare)';
      return attr;
    }

    function renderInfrastructureGrids() {
      const skybornGrid = document.getElementById('skyborn-grid');
      const whaleGrid = document.getElementById('whale-grid');
      
      skybornGrid.innerHTML = '';
      whaleGrid.innerHTML = '';

      state.infrastructures.forEach(infra => {
        const { multiplier, blocked } = getAPModifier(infra.id);
        const currentAP = getDisplayAP(infra.id);
        const effectiveAP = getEffectiveAP(infra.id);
        const cardHTML = `
          <div class="infra-card ${infra.faction} ${blocked ? 'blocked' : ''}">
            <div class="infra-tag ${infra.faction}">${getKoreanAttribute(infra.attribute)}</div>
            <div>
              <div class="infra-header">
                <i class="${getInfraIcon(infra.id)}"></i>
                <span class="infra-title">${infra.name}</span>
              </div>
              <div class="infra-desc">${infra.desc}</div>
            </div>
            
            <div>
              <div class="infra-progress-container">
                <div class="infra-progress-bar">
                  <div class="infra-progress-fill" style="width: ${Math.min((effectiveAP / 100) * 100, 100)}%;"></div>
                </div>
                <div class="infra-stats-row">
                  <span>누적 행동력: <strong>${currentAP} AP</strong>${Math.round(effectiveAP) !== currentAP ? ` <span style="color: var(--primary-color); font-weight:700;">(보정: ${Math.round(effectiveAP)})</span>` : ''}</span>
                  <span>${blocked ? '<strong style="color: var(--danger-color);"><i class="fa-solid fa-lock"></i> 봉쇄됨</strong>' : multiplier !== 1.0 ? `<strong style="color: var(--primary-color);">배율 x${multiplier}</strong>` : '상태 정상'}</span>
                </div>
              </div>
              <div class="infra-actions" style="opacity: ${isEditMode ? '1.0' : '0.45'}; pointer-events: ${isEditMode ? 'auto' : 'none'}; ${isEditMode ? 'border: 1px solid var(--danger-color); padding: 4px; border-radius: 6px; background: rgba(169, 68, 66, 0.04);' : ''}">
                <button class="btn" style="padding: 2px 8px; font-size: 0.8rem;" onclick="quickAdjustAP('${infra.id}', -1)" ${isEditMode ? '' : 'disabled'}>-1</button>
                <button class="btn" style="padding: 2px 8px; font-size: 0.8rem;" onclick="quickAdjustAP('${infra.id}', -5)" ${isEditMode ? '' : 'disabled'}>-5</button>
                <input type="number" class="form-control" style="flex-grow:1; height: 26px; padding: 0 4px; text-align:center;" value="${currentAP}" onchange="directSetAP('${infra.id}', this.value)" ${isEditMode ? '' : 'readonly'}>
                <button class="btn" style="padding: 2px 8px; font-size: 0.8rem;" onclick="quickAdjustAP('${infra.id}', 1)" ${isEditMode ? '' : 'disabled'}>+1</button>
                <button class="btn" style="padding: 2px 8px; font-size: 0.8rem;" onclick="quickAdjustAP('${infra.id}', 5)" ${isEditMode ? '' : 'disabled'}>+5</button>
              </div>
            </div>
          </div>
        `;

        if (infra.faction === 'stability') {
          skybornGrid.innerHTML += cardHTML;
        } else {
          whaleGrid.innerHTML += cardHTML;
        }
      });
    }

    function getInfraIcon(id) {
      const icons = {
        nobles: 'fa-solid fa-gavel',
        memorial: 'fa-solid fa-landmark',
        academy: 'fa-solid fa-graduation-cap',
        admin: 'fa-solid fa-building-user',
        guard: 'fa-solid fa-shield-halved',
        society: 'fa-solid fa-book-atlas',
        school: 'fa-solid fa-school',
        union: 'fa-solid fa-hand-fist',
        community: 'fa-solid fa-house-chimney-window',
        workshop: 'fa-solid fa-screwdriver-wrench',
        port: 'fa-solid fa-anchor',
        crews: 'fa-solid fa-helmet-safety'
      };
      return icons[id] || 'fa-solid fa-house';
    }

    function populateDropdowns() {
      const charSelect = document.getElementById('log-char-select');
      const infraSelect = document.getElementById('log-infra-select');
      
      const savedChar = charSelect.value;
      const savedInfra = infraSelect.value;

      charSelect.innerHTML = '<option value="">-- 캐릭터를 선택해 주세요 --</option>';
      state.characters.forEach(char => {
        let activeFaction = '';
        if (state.season === 1) {
          activeFaction = char.startClass === 'Skyborn' ? '스카이본' : '스카이웨일';
        } else {
          if (char.sec2Faction === 'Skyguard') activeFaction = '스카이가드';
          else if (char.sec2Faction === 'Nightwalker') activeFaction = '나이트워커';
          else activeFaction = '미지정';
        }
        const spentBase = state.logs
          .filter(l => l.charId === char.id && l.season === state.season)
          .reduce((sum, l) => sum + l.baseAP, 0);
        const remainingAP = Math.max(0, 10 - spentBase);
        const charFname = `${char.name} (${activeFaction}) [잔여: ${remainingAP} AP]`;
        charSelect.innerHTML += `<option value="${char.id}">${charFname}</option>`;
      });

      infraSelect.innerHTML = '<option value="">-- 기반시설을 선택해 주세요 --</option>';
      state.infrastructures.forEach(infra => {
        const prefix = infra.faction === 'stability' ? (state.season === 1 ? '스카이본' : '스카이가드') : (state.season === 1 ? '스카이웨일' : '나이트워커');
        infraSelect.innerHTML += `<option value="${infra.id}">[${prefix}] ${infra.name}</option>`;
      });

      charSelect.value = savedChar;
      infraSelect.value = savedInfra;
    }

    function renderRecentLogs() {
      const logsList = document.getElementById('recent-logs-list');
      logsList.innerHTML = '';
      if (state.logs.length === 0) {
        logsList.innerHTML = '<div class="log-entry" style="color: var(--text-muted);">기록된 행동이 없습니다.</div>';
        return;
      }

      function getLogPriority(log) {
        if (log.charId === 'SYSTEM') return 1.5;
        if (log.season === 1) return 1;
        if (log.season === 2) return 2;
        if (log.id.startsWith('log_s1_')) return 1;
        if (log.id.startsWith('log_s2_')) return 2;
        return 1;
      }

      // Sort logs strictly chronologically (ascending), then reverse for newest-first rendering
      const sortedLogs = state.logs.slice().sort((a, b) => {
        const pA = getLogPriority(a);
        const pB = getLogPriority(b);
        if (pA !== pB) return pA - pB;
        return a.day - b.day;
      });

      // Slice to maximum 50 recent logs and render newest first
      sortedLogs.reverse().slice(0, 50).forEach(log => {
        if (log.charId === 'SYSTEM') {
          // 시스템 이벤트는 타임라인 분기선 배너로 세련되게 렌더링
          logsList.innerHTML += `
            <div class="log-entry system-event-banner" style="border: 1px dashed var(--primary-color); background: rgba(66, 153, 225, 0.06); text-align: center; font-weight: bold; color: var(--primary-color); padding: 10px; border-radius: 8px; margin: 10px 0; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <i class="fa-solid fa-clock-rotate-left"></i>
              <span>${log.infraName}</span>
            </div>
          `;
          return;
        }

        // Determine season label (dynamic based on stored metadata or ID pattern)
        let seasonLabel = '';
        if (log.season) {
          seasonLabel = `${log.season}기 `;
        } else if (log.id.startsWith('log_s1_')) {
          seasonLabel = '1기 ';
        } else if (log.id.startsWith('log_s2_')) {
          seasonLabel = '2기 ';
        } else {
          // Fallback check against the sortedLogs array
          const transIdx = sortedLogs.findIndex(l => l.id === 'log_transition');
          const thisIdx = sortedLogs.indexOf(log);
          if (transIdx !== -1 && thisIdx !== -1) {
            seasonLabel = thisIdx < transIdx ? '1기 ' : '2기 ';
          } else {
            seasonLabel = state.season === 1 ? '1기 ' : '2기 ';
          }
        }

        logsList.innerHTML += `
          <div class="log-entry">
            <span>[${seasonLabel}Day ${log.day}] <strong>${log.charName}</strong>: ${log.infraName} 에 ${log.ap} AP 투자 
            <span style="color: var(--text-muted); font-size: 0.75rem;">(보정 전: ${log.baseAP} AP, 적용 배율: x${log.multiplier})</span></span>
            <button class="btn" style="padding: 0 4px; font-size: 0.7rem; border-color: var(--danger-color); color: var(--danger-color); flex-shrink: 0;" onclick="deleteLog('${log.id}')"><i class="fa-solid fa-trash"></i> 삭제</button>
          </div>
        `;
      });
    }

    function renderCharacterTable() {
      const tbody = document.getElementById('character-table-body');
      tbody.innerHTML = '';

      if (state.characters.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">등록된 캐릭터가 없습니다. 상단 등록 폼에서 추가해 주세요.</td></tr>`;
        return;
      }

      state.characters.forEach(char => {
        const totalContrib = state.logs
          .filter(l => l.charId === char.id)
          .reduce((sum, l) => sum + l.ap, 0);

        let factionDropdown = '';
        if (state.season === 2) {
          factionDropdown = `
            <select class="form-control" style="padding: 4px; font-size: 0.8rem; height: 30px;" onchange="updateCharFaction('${char.id}', this.value)">
              <option value="" ${!char.sec2Faction ? 'selected' : ''}>미지정</option>
              <option value="Skyguard" ${char.sec2Faction === 'Skyguard' ? 'selected' : ''}>스카이가드</option>
              <option value="Nightwalker" ${char.sec2Faction === 'Nightwalker' ? 'selected' : ''}>나이트워커</option>
            </select>
          `;
        }

        // Always display Season 1 origin class as a badge
        const s1BadgeText = char.startClass === 'Skyborn' ? '스카이본' : (char.startClass === 'Whale' ? '스카이웨일' : '없음');
        const s1BadgeClass = char.startClass === 'Skyborn' ? 'skyborn' : (char.startClass === 'Whale' ? 'whale' : 'unassigned');

        const spentBase = state.logs
          .filter(l => l.charId === char.id && l.season === state.season)
          .reduce((sum, l) => sum + l.baseAP, 0);
        const remainingAP = Math.max(0, 10 - spentBase);

        tbody.innerHTML += `
          <tr>
            <td style="font-weight: 700;">${char.name}</td>
            <td><span class="char-badge ${s1BadgeClass}">${s1BadgeText}</span></td>
            ${state.season === 2 ? `<td class="sec2-only-header">${factionDropdown}</td>` : ''}
            <td style="font-weight: 700; color: var(--primary-color);">${totalContrib} AP</td>
            <td style="font-weight: 700; color: var(--secondary-color);">${remainingAP} AP</td>
            <td>
              <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.75rem;" onclick="deleteCharacter('${char.id}')"><i class="fa-solid fa-user-minus"></i> 삭제</button>
            </td>
          </tr>
        `;
      });
    }

    function renderEventsGrid() {
      const grid = document.getElementById("event-toggle-grid");
      if (!grid) return;
      grid.innerHTML = "";
      
      const filteredTemplates = getEventTemplates().filter(t => t.season === state.season);

      if (filteredTemplates.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 1rem 0;">등록된 이벤트가 없습니다.</div>`;
        return;
      }

      filteredTemplates.forEach(evt => {
        const isActive = state.activeEvents.includes(evt.id);
        const isCustom = evt.id.startsWith("evt_custom_");
        const copyBtnHTML = isCustom ? `<button class="btn" style="padding: 2px 6px; font-size: 0.75rem; margin-right: 4px; height: 24px; display: inline-flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.06); border: var(--card-border); color: var(--text-main);" onclick="copyCustomEventCode('${evt.id}', event)" title="이벤트 공유코드 복사"><i class="fa-solid fa-copy"></i></button>` : "";
        const deleteBtnHTML = isCustom ? `<button class="btn btn-danger" style="padding: 2px 6px; font-size: 0.75rem; margin-right: 6px; height: 24px; display: inline-flex; align-items: center; justify-content: center;" onclick="deleteCustomEvent('${evt.id}', event)"><i class="fa-solid fa-trash"></i></button>` : "";

        grid.innerHTML += `
          <div class="event-item ${isActive ? "active" : ""}" style="padding: 6px 10px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
            <div class="event-info" style="flex-grow: 1; min-width: 0;">
              <span class="event-name" style="font-weight: 700; font-size: 0.8rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${evt.name}</span>
              <span class="event-effect" style="font-size: 0.72rem; color: var(--text-muted); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${evt.desc}</span>
            </div>
            <div style="display: flex; align-items: center; flex-shrink: 0;">
              ${copyBtnHTML}
              ${deleteBtnHTML}
              <label class="switch" style="width: 34px; height: 18px; margin: 0;">
                <input type="checkbox" ${isActive ? "checked" : ""} onchange="toggleEvent('${evt.id}', this.checked)">
                <span class="slider" style="border-radius: 18px;"></span>
              </label>
            </div>
          </div>
        `;
      });
    }

    // Add character
    function addCharacter(e) {
      e.preventDefault();
      const name = document.getElementById('char-name').value.trim();
      const startClass = document.getElementById('char-class').value;

      if (!name) return;

      const newChar = {
        id: 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name,
        startClass,
        sec2Faction: ''
      };

      state.characters.push(newChar);
      document.getElementById('add-char-form').reset();
      saveToLocalStorage();
    }

    function deleteCharacter(charId) {
      if (confirm("정말로 이 캐릭터를 삭제하시겠습니까? 기록된 기여 내역은 보존됩니다.")) {
        state.characters = state.characters.filter(c => c.id !== charId);
        saveToLocalStorage();
      }
    }

    function updateCharFaction(charId, faction) {
      const char = state.characters.find(c => c.id === charId);
      if (char) {
        char.sec2Faction = faction;
        saveToLocalStorage();
      }
    }

    // Logger submit
    function submitAPLog(e) {
      e.preventDefault();
      const charId = document.getElementById('log-char-select').value;
      const infraId = document.getElementById('log-infra-select').value;
      const baseAP = parseInt(document.getElementById('log-ap-input').value);

      if (!charId || !infraId || isNaN(baseAP) || baseAP <= 0) return;

      const char = state.characters.find(c => c.id === charId);
      const infra = state.infrastructures.find(i => i.id === infraId);

      if (!char || !infra) return;

      const { multiplier, blocked } = getAPModifier(infraId);
      
      if (blocked) {
        alert("선택하신 기반시설은 현재 활성화된 이벤트에 의해 임시 봉쇄 상태입니다.");
        return;
      }

      const finalAP = Math.round(baseAP * multiplier);

      const logEntry = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        season: state.season,
        day: state.day,
        charId,
        charName: char.name,
        infraId,
        infraName: infra.name,
        baseAP,
        multiplier,
        ap: finalAP
      };

      infra.ap += finalAP;
      state.logs.push(logEntry);

      document.getElementById('log-ap-input').value = 3;
      document.getElementById('log-char-select').value = '';
      document.getElementById('log-infra-select').value = '';
      saveToLocalStorage();
      updateUI();
      showRandomScriptPopup(infraId, char.name, baseAP, finalAP);
    }

    function deleteLog(logId) {
      const logIdx = state.logs.findIndex(l => l.id === logId);
      if (logIdx === -1) return;

      const log = state.logs[logIdx];
      const infra = state.infrastructures.find(i => i.id === log.infraId);
      
      if (infra) {
        infra.ap = Math.max(0, infra.ap - log.ap);
      }

      state.logs.splice(logIdx, 1);
      saveToLocalStorage();
    }

    // Direct card adjustments
    function quickAdjustAP(infraId, delta) {
      if (!isEditMode) return;
      const infra = state.infrastructures.find(i => i.id === infraId);
      if (infra) {
        const currentAP = getDisplayAP(infraId);
        const newAP = Math.max(0, currentAP + delta);
        const actualDelta = newAP - currentAP;
        if (actualDelta === 0) return;

        state.logs.push({
          id: "log_gm_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
          season: state.season,
          day: state.day,
          charId: "GM",
          charName: "🔧 GM 수치 조정",
          infraId: infra.id,
          infraName: infra.name,
          baseAP: actualDelta,
          multiplier: 1.0,
          ap: actualDelta
        });
        saveToLocalStorage();
        updateUI();
      }
    }

    function directSetAP(infraId, value) {
      if (!isEditMode) return;
      const val = parseInt(value);
      if (isNaN(val) || val < 0) return;
      const infra = state.infrastructures.find(i => i.id === infraId);
      if (infra) {
        const currentAP = getDisplayAP(infraId);
        if (currentAP === val) return;

        const delta = val - currentAP;
        state.logs.push({
          id: "log_gm_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
          season: state.season,
          day: state.day,
          charId: "GM",
          charName: "🔧 GM 수치 조정",
          infraId: infra.id,
          infraName: infra.name,
          baseAP: delta,
          multiplier: 1.0,
          ap: delta
        });
        saveToLocalStorage();
        updateUI();
      }
    }

    function toggleEvent(evtId, isChecked) {
      if (isChecked) {
        if (!state.activeEvents.includes(evtId)) {
          state.activeEvents.push(evtId);
        }
      } else {
        state.activeEvents = state.activeEvents.filter(id => id !== evtId);
      }
      saveToLocalStorage();
    }

    function adjustDay(delta) {
      const targetDay = state.day + delta;
      if (targetDay < 1 || targetDay > 4) return;

      const confirmMsg = delta < 0 
        ? `정말로 Day ${targetDay}로 돌아가시겠습니까?\n\n(주의: Day ${state.day}에 기입했던 모든 행동력 로그와 시뮬레이션 데이터가 영구 삭제되고 Day ${targetDay} 데이터로 리셋됩니다!)`
        : `정말로 Day ${targetDay}로 강제 이동하시겠습니까?\n\n(주의: 하루 결산(EOD) 마감 없이 날짜를 이동하는 경우, 이동 과정에서 새 날짜의 기존 로그들이 초기화될 수 있습니다.)`;

      if (!confirm(confirmMsg)) return;

      // Physically delete logs of the current season that are in the future of targetDay
      const currentSeason = state.season;
      
      // Filter out future logs
      state.logs = state.logs.filter(log => {
        if (log.season !== currentSeason) return true;
        return log.day <= targetDay;
      });

      // Update state.day
      state.day = targetDay;

      // Sync infra.ap with remaining logs
      state.infrastructures.forEach(infra => {
        let sum = 0;
        state.logs.forEach(log => {
          if (log.infraId === infra.id) {
            sum += log.ap;
          }
        });
        infra.ap = sum;
      });

      saveToLocalStorage();
      updateUI();
    }

    function resetWholeSystem() {
      if (confirm("정말로 데이터베이스를 전면 초기화하시겠습니까?")) {
        state = {
          season: 1,
          day: 1,
          infrastructures: JSON.parse(JSON.stringify(INITIAL_INFRASTRUCTURES)),
          characters: [],
          activeEvents: [],
          customEvents: [],
          logs: []
        };
        isEditMode = false;
        saveToLocalStorage();
        switchTab('tab-dashboard');
      }
    }

    function runInstantSimulation() {
      if (state.day === 4) {
        alert("이미 현재 시즌의 최종일(Day 4) 상태입니다. 더 이상 모의 시뮬레이션을 중복 실행할 수 없습니다.\n\n(새로운 시뮬레이션 테스트를 원하실 경우 '시스템 즉시 리셋'을 통해 초기화하거나 다음 기수로 전환하여 진행해 주세요.)");
        return;
      }

      if (state.season === 1) {
        if (!confirm("1기 에버라이트 4일차(최종일) 상태로 시뮬레이션 데이터를 주입하시겠습니까?\n(현재 대시보드의 모든 캐릭터 및 데이터가 초기화되고 1기 40인 테스트 데이터가 주입됩니다.)")) {
          return;
        }

        state = {
          season: 1,
          day: 4,
          infrastructures: [
            { id: "nobles", name: "귀족원 (House of Nobles)", faction: "stability", attribute: "order", ap: 140, desc: "스카이본 귀족으로 구성된 상원 의회. 전통 체제 통치력과 지배 규율을 의미합니다." },
            { id: "memorial", name: "창립자 기념관 (Founders Memorial)", faction: "stability", attribute: "ideology", ap: 130, desc: "건국 조상들과 다난 독립의 신성한 역사를 기리는 곳. 체제 정통성을 고취합니다." },
            { id: "academy", name: "귀족 아카데미 (Noble Academy)", faction: "stability", attribute: "order", ap: 120, desc: "스카이본 자제들의 정규 엘리트 아카데미. 문화와 관습을 교육합니다." },
            { id: "admin", name: "행정청 (Administration)", faction: "stability", attribute: "welfare", ap: 160, desc: "기본 공공서비스 및 계획경제를 감독하는 최고 행정 기구. 민생 행정력을 나타냅니다." },
            { id: "guard", name: "근위사령부 (Guard Command)", faction: "stability", attribute: "force", ap: 130, desc: "티르 나 노이 치안 유지 및 방공 함대를 지휘하는 핵심 군사 기구. 무력 통제력의 상징." },
            { id: "society", name: "왕립학회 (Royal Society)", faction: "stability", attribute: "ideology", ap: 120, desc: "기술 절제주의 이념과 공식 지적 유산을 연구하고 검열하는 학술 기구." },
            { id: "school", name: "웨일 학교 (Whale School)", faction: "revolution", attribute: "ideology", ap: 80, desc: "솔라스의 노동층 계층 자제들을 위한 실업·기술 학교. 지식을 통해 의식이 성장합니다." },
            { id: "union", name: "노동조합 (Labor Union)", faction: "revolution", attribute: "order", ap: 80, desc: "스카이웨일 노동자들의 권익과 자치 단결력을 대변하는 노동 핵심 공동체." },
            { id: "community", name: "주민회관 (Community Center)", faction: "revolution", attribute: "welfare", ap: 80, desc: "웨일 계층이 모여 정보를 공유하고구호 활동을 조율하는 상생 생활관." },
            { id: "workshop", name: "공방 (Workshop)", faction: "revolution", attribute: "welfare", ap: 70, desc: "웨일 기술자들이 아날로그 수공예 및 최신 효율 장비를 유지 관리하는 자립 경제 거점." },
            { id: "port", name: "항만노조 (Port Union)", faction: "revolution", attribute: "force", ap: 70, desc: "스카이웨일 작업선 선원들이 소속된 최대 운송 노조. 해양 및 공중 물류 무력을 장악." },
            { id: "crews", name: "작업반 (Work Crews)", faction: "revolution", attribute: "force", ap: 70, desc: "가장 험난한 지상 환경 자원 채굴을 수행하는 거친 현장 인력들의 실질적 물리 투쟁력." }
          ],
          characters: [],
          activeEvents: [],
          logs: []
        };

        const mockNames = [
          "Aria", "Bastian", "Cecile", "Dante", "Elena", "Felix", "Giselle", "Hugo", "Iris", "Julian",
          "Kael", "Leon", "Mabel", "Noel", "Olivia", "Philip", "Quinn", "Ray", "Selene", "Tristan",
          "Uri", "Valerie", "Wyatt", "Xavier", "Yvaine", "Zachary", "Alina", "Bennet", "Chloe", "Dorian",
          "Elsie", "Fynn", "Grace", "Harvey", "Ivy", "Jasper", "Kira", "Lucas", "Maya", "Nathan"
        ];

        // Random bias for S1 to create varying faction sizes on each run
        const s1Bias = 0.15 + Math.random() * 0.70; // Bias between 15% and 85%

        // Generate characters with random class bias
        for (let i = 0; i < 40; i++) {
          state.characters.push({
            id: "char_mock_" + (i + 1).toString().padStart(2, '0'),
            name: mockNames[i],
            startClass: Math.random() < s1Bias ? "Skyborn" : "Whale",
            sec2Faction: ""
          });
        }

        const distribution = [
          { id: "nobles", name: "귀족원", count: 14 },
          { id: "memorial", name: "창립자 기념관", count: 13 },
          { id: "academy", name: "사관학교", count: 12 },
          { id: "admin", name: "행정청", count: 16 },
          { id: "guard", name: "근위사령부", count: 13 },
          { id: "society", name: "법학회", count: 12 },
          { id: "school", name: "웨일 학교", count: 8 },
          { id: "union", name: "광산 노조", count: 8 },
          { id: "community", name: "주민회관", count: 8 },
          { id: "workshop", name: "증기 공방", count: 7 },
          { id: "port", name: "아발론 항만", count: 7 },
          { id: "crews", name: "청년 선원단", count: 7 }
        ];

        let logPool = [];
        distribution.forEach(target => {
          for (let c = 0; c < target.count; c++) {
            logPool.push({ infraId: target.id, infraName: target.name });
          }
        });

        logPool.sort(() => Math.random() - 0.5);

        let logIdCounter = 1;
        for (let day = 1; day <= 4; day++) {
          for (let slice = 0; slice < 32; slice++) {
            const logInfo = logPool.pop();
            if (!logInfo) break;
            const charIdx = (logIdCounter - 1) % 40;
            state.logs.push({
              id: `log_s1_d${day}_` + logIdCounter.toString().padStart(3, '0'),
              season: 1,
              day: day,
              charId: state.characters[charIdx].id,
              charName: state.characters[charIdx].name,
              infraId: logInfo.infraId,
              infraName: logInfo.infraName,
              baseAP: 10,
              multiplier: 1.0,
              ap: 10
            });
            logIdCounter++;
          }
        }

        let countSkyborn = 0;
        let countWhale = 0;
        state.characters.forEach(char => {
          if (char.startClass === 'Skyborn') countSkyborn++;
          else countWhale++;
        });

        saveToLocalStorage();
        switchTab('tab-dashboard');

        let ratio = 1.0;
        if (countSkyborn > 0 && countWhale > 0) {
          ratio = countSkyborn < countWhale ? (countWhale / countSkyborn) : (countSkyborn / countWhale);
        }
        alert(`1기 에버라이트 모의 시뮬레이션 데이터가 정상적으로 생성되었습니다!\n\n- 현재 상태: 1기 DAY 4\n- Roster: 스카이본 ${countSkyborn}명 vs 스카이웨일 ${countWhale}명 (인원 편중 배율: x${ratio.toFixed(2)})\n- 누적 AP: 1,250 AP`);
      } 
      else {
        // Season 2 Simulation
        if (!confirm("현재 데이터를 유지한 채로, 2기 에버나이트 4일차(최종일) 테스트 데이터를 추가 기입하시겠습니까?\n(캐릭터의 2기 진영 소속이 무작위 배정되며, 2기 투자 로그가 추가 생성됩니다.)")) {
          return;
        }

        // 1. Ensure we have characters. If completely empty, generate them first!
        if (state.characters.length === 0) {
          const mockNames = [
            "Aria", "Bastian", "Cecile", "Dante", "Elena", "Felix", "Giselle", "Hugo", "Iris", "Julian",
            "Kael", "Leon", "Mabel", "Noel", "Olivia", "Philip", "Quinn", "Ray", "Selene", "Tristan",
            "Uri", "Valerie", "Wyatt", "Xavier", "Yvaine", "Zachary", "Alina", "Bennet", "Chloe", "Dorian",
            "Elsie", "Fynn", "Grace", "Harvey", "Ivy", "Jasper", "Kira", "Lucas", "Maya", "Nathan"
          ];
          const startClassBias = 0.15 + Math.random() * 0.70;
          for (let i = 0; i < 40; i++) {
            state.characters.push({
              id: "char_mock_" + (i + 1).toString().padStart(2, '0'),
              name: mockNames[i],
              startClass: Math.random() < startClassBias ? "Skyborn" : "Whale",
              sec2Faction: ""
            });
          }
        }

        // 2. Assign 2기 factions to any unassigned characters with random bias
        const s2Bias = 0.15 + Math.random() * 0.70;
        let countSkyguard = 0;
        let countNightwalker = 0;
        state.characters.forEach(char => {
          if (!char.sec2Faction) {
            char.sec2Faction = Math.random() < s2Bias ? "Skyguard" : "Nightwalker";
          }
          if (char.sec2Faction === "Skyguard") countSkyguard++;
          if (char.sec2Faction === "Nightwalker") countNightwalker++;
        });

        // 3. Ensure historical event log exists
        if (!state.logs.some(l => l.id === "log_transition")) {
          state.logs.push({
            id: "log_transition",
            day: 1,
            charId: "SYSTEM",
            charName: "⚠️ 역사적 사건",
            infraId: "ALL",
            infraName: "기계 판사 라이트(LIGHT) 파괴 사건 및 대숙청 발발",
            baseAP: 0,
            multiplier: 1.0,
            ap: 0
          });
        }

        // 4. Set season and day to 2기 Day 4
        state.season = 2;
        state.day = 4;

        // 5. Clean up previous S2 simulation logs and restore infrastructure AP to Season 1 base
        state.logs = state.logs.filter(l => !l.id.startsWith('log_s2_sim_'));
        const s1APMap = {};
        state.infrastructures.forEach(inf => s1APMap[inf.id] = 0);
        state.logs.forEach(l => {
          if (l.id.startsWith('log_s1_')) {
            s1APMap[l.infraId] = (s1APMap[l.infraId] || 0) + l.ap;
          }
        });
        state.infrastructures.forEach(inf => {
          inf.ap = s1APMap[inf.id] || 0;
        });

        // 6. Simulate 2기 logs randomly (fully shuffles both target infrastructures and AP amounts!)
        // Generate between 35 and 60 random log entries for S2
        const s2LogCount = 35 + Math.floor(Math.random() * 25);
        let s2LogCounter = 1;
        for (let idx = 1; idx <= s2LogCount; idx++) {
          const char = state.characters[Math.floor(Math.random() * state.characters.length)];
          const infra = state.infrastructures[Math.floor(Math.random() * state.infrastructures.length)];
          const baseAP = 5 + Math.floor(Math.random() * 3) * 5; // 5, 10, or 15 AP
          
          state.logs.push({
            id: `log_s2_sim_` + Date.now() + `_` + s2LogCounter,
            season: 2,
            day: Math.floor(Math.random() * 4) + 1, 
            charId: char.id,
            charName: char.name,
            infraId: infra.id,
            infraName: infra.name,
            baseAP: baseAP,
            multiplier: 1.0,
            ap: baseAP
          });

          infra.ap += baseAP;
          s2LogCounter++;
        }

        saveToLocalStorage();
        switchTab('tab-dashboard');
        alert(`2기 에버나이트 4일차 시뮬레이션 데이터가 추가로 주입되었습니다!\n\n- 현재 상태: 2기 DAY 4\n- Roster: 보수 ${countSkyguard}명 vs 혁명 ${countNightwalker}명\n- 2기 투자처 및 AP 기입량 완전 무작위 셔플 가동 완료!`);
      }
    }

    // Transition
    // Transition
    function triggerSeasonTransition() {
      if (state.season === 2) return;

      if (state.day < 4) {
        alert("1기 4일차 최종 결산이 완료된 후에 2기로 전환할 수 있습니다.\n\n(상단의 '+' 버튼을 눌러 Day 4로 이동한 뒤 진행해 주세요.)");
        return;
      }

      if (!confirm("정말로 2기 에버나이트 시즌으로 전환하시겠습니까?\n\n(주의: 1기 최종 수치들은 모두 고정 상수로 보존 처리됩니다.)")) {
        return;
      }

      state.season = 2;
      state.day = 1;
      
      // Safety initialize
      state.characters.forEach(char => {
        if (!char.sec2Faction) char.sec2Faction = "";
      });

      saveToLocalStorage();
      updateUI();
      alert("성공적으로 2기 에버나이트 시즌으로 전환되었습니다!\n\n(행동력 기입기에서 2기 소속 캐릭터들을 지정해 운영하세요.)");
      switchTab('tab-dashboard');
    }

    function getEndingProjection() {
      let totalStability = 0;
      let totalRevolution = 0;
      let totalForce = 0;
      let totalOrder = 0;
      let totalIdeology = 0;
      let totalWelfare = 0;

      state.infrastructures.forEach(infra => {
        let effectiveAP = getEffectiveAP(infra.id);

        if (infra.faction === 'stability') totalStability += effectiveAP;
        if (infra.faction === 'revolution') totalRevolution += effectiveAP;

        if (infra.attribute === 'force') totalForce += effectiveAP;
        if (infra.attribute === 'order') totalOrder += effectiveAP;
        if (infra.attribute === 'ideology') totalIdeology += effectiveAP;
        if (infra.attribute === 'welfare') totalWelfare += effectiveAP;
      });

      const totalAP = totalStability + totalRevolution;
      
      if (totalAP === 0) {
        return {
          title: '판도 분석 불가능',
          desc: '누적 데이터가 없어 결산할 수 없습니다.',
          totalStability: 0,
          totalRevolution: 0,
          totalForce: 0,
          totalOrder: 0,
          totalIdeology: 0,
          totalWelfare: 0,
          totalAP: 0,
          marginPercent: 0
        };
      }

      let endingTitle = '';
      let endingDesc = '';

      const diff = Math.abs(totalStability - totalRevolution);
      const marginPercent = (diff / totalAP) * 100;

      const stabPercent = (totalStability / totalAP) * 100;
      const revPercent = (totalRevolution / totalAP) * 100;

      if (marginPercent < 5) {
        endingTitle = '⚠️ [파국] 영원한 긴 밤의 고착화 (Anarchy & Long Night)';
        endingDesc = '1기 동안 축적된 해묵은 갈등과 2기의 유혈 투쟁이 완전히 호각을 이루었습니다. 나이트워커는 하늘섬의 국가망을 전복할 수준의 강력한 화력을 갖췄으나, 스카이가드 역시 완고하게 철권 감시망을 풀지 않았습니다. 티르 나 노이는 양대 세력 간의 끝없는 도심 소모전으로 번져 기어코 인공 부유도 군도 전체가 서서히 가라앉는 아비규환의 아포칼립스로 직행합니다.';
      } 
      else if (totalStability > totalRevolution) {
        const sForce = getEffectiveAP('guard');
        const sOrder = getEffectiveAP('nobles') + getEffectiveAP('academy');
        const sIdeology = getEffectiveAP('memorial') + getEffectiveAP('society');
        const sWelfare = getEffectiveAP('admin');
        const sTotal = sForce + sOrder + sIdeology + sWelfare;

        if (sTotal < 150) {
          endingTitle = '⌛ [보수] 정체와 서서히 추락하는 하늘섬 (Stagnation & Decay)';
          endingDesc = '체제 수호 진영이 승리하였으나 그를 지탱할 의지나 인프라가 극히 저조했습니다. 개혁도 완전한 진압도 없이 고위 관료들과 귀족들의 사리사욕만 가득 찼으며, 공동체의 정통성은 바닥을 칩니다. 공중도시는 엔진 노후와 갈등 고착화로 인해 세대를 거치며 동력을 잃고 지상을 향해 침묵 속에 추락해 갑니다.';
        } else if (sForce > sTotal * 0.45) {
          endingTitle = '🚨 [보수] 군사 계엄 및 철권 특별재판부 (Iron-fisted Dictatorship)';
          endingDesc = '체제를 지키기 위해 무력(근위사령부)에 압도적인 행동력이 실렸습니다. 혁명군 혐의자는 즉각 교수형에 처해지고 군정이 선포되어 거리는 삼엄한 스카이가드의 순찰선과 감시 카메라로 도배됩니다. 의회는 사실상 기능을 상실하였으며, 하늘섬은 아름다운 아날로그 가치를 상실한 냉혹한 수용소형 군사 감시국가로 퇴색합니다.';
        } else if (sOrder > sTotal * 0.45) {
          endingTitle = '🚨 [보수/규율] 관료제적 기계 통제국가 (Surveillance Technocracy)';
          endingDesc = '보수 진영이 의회와 사관학교를 중심으로 강력한 규율 체제를 확보했습니다. 모든 시민의 일거수일투족이 엄격한 행정 전산과 기계적 감시 통제망 아래 놓이게 되며, 개인의 자유는 철저히 말살된 차갑고 효율적인 관료제 감시 국가가 도래합니다.';
        } else if (sWelfare + sIdeology > sTotal * 0.50) {
          endingTitle = '🏆 [보수/명예] 질서와 평화의 낙원 (Harmony & Clean Order)';
          endingDesc = '안정적이고 교양 있는 체제 수호의 이상향입니다. 비록 질서는 유지되지만 복지(행정청)와 건국의 명분(기념관)에 투자된 압도적인 힘으로, 정부는 웨일 계층의 불만을 흡수하는 대대적인 참정권 개혁과 민생 복지를 단행했습니다. 유혈 학살 없이 스카이본과 웨일이 서로 질서 속에 공존하며 다시 낙원의 빛을 회복합니다.';
        } else {
          endingTitle = '⚖️ [보수] 규율과 안정의 지속 (Traditional Status Quo)';
          endingDesc = '전형적인 티르 나 노이의 체제 존속입니다. 혁명 조직 나이트워커는 진압되었고 의회와 상원은 건재하지만, 1기와 마찬가지로 신분 간의 암묵적인 편견과 차별은 해결되지 않은 채, 200년 동안 지속해 온 모순을 안고 아슬아슬한 평화를 지켜 나갑니다.';
        }
      } 
      else {
        const rForce = getEffectiveAP('port') + getEffectiveAP('crews');
        const rOrder = getEffectiveAP('union');
        const rIdeology = getEffectiveAP('school');
        const rWelfare = getEffectiveAP('community') + getEffectiveAP('workshop');
        const rTotal = rForce + rOrder + rIdeology + rWelfare;

        if (rTotal < 150) {
          endingTitle = '⌛ [혁명] 미완의 혁명과 군벌의 난립 (Anarchy & Mob Rule)';
          endingDesc = '혁명에 극적으로 성공해 귀족원을 전복했으나 이를 통치하고 안정시킬 만한 규율이나 기반이 심각하게 모자랐습니다. 중심을 잃은 아발론은 무법지대로 전락했고, 군부 일부와 거친 광산 작업반, 생존자들이 무장을 갖추고 패권 다툼을 벌이며 지상 세계와 같은 아수라장의 지배권 분쟁에 돌입합니다.';
        } else if (rForce > rTotal * 0.45) {
          endingTitle = '🚨 [혁명] 단두대와 보복의 붉은 광장 (Reign of Terror)';
          endingDesc = '오직 물리적 투쟁/파괴(항만/작업반)를 동반한 유혈 혁명의 결과입니다. 권력을 잡은 급진파 나이트워커는 스카이본 가문 전체를 반역자로 선포해 대대적인 숙청과 숙청을 단행했습니다. 보족의 악순환이 꼬리를 물며 지식인들도 불순분자로 수감되는 공포 정치가 도래합니다.';
        } else if (rOrder > rTotal * 0.45) {
          endingTitle = '🚨 [혁명/규율] 통제된 조합주의 배급체제 (Controlled Command)';
          endingDesc = '혁명 세력이 승리한 후 광산 노조를 위시로 한 극단적인 감시 및 통제 규율을 선포했습니다. 모든 산업 시설과 배급 체계가 조합 위원회에 의해 통제되며, 혁명의 대의에 어긋나는 일탈은 묵과되지 않는 경직된 조합주의적 통제 배급 체제가 성립됩니다.';
        } else if (rWelfare + rIdeology > rTotal * 0.50) {
          endingTitle = '🏆 [혁명/명예] 자유와 평등의 공화정 (Idealistic New Era)';
          endingDesc = '교육(웨일학교)과 민생(주민회관/공방)의 성장이 빚어낸 아름다운 새 시대입니다. 나이트워커의 승리 이후 보복적인 유혈 진압 대신 온건파가 득세하여 귀족 계급을 폐지하고, 전 국민(스카이본과 웨일 전원)에게 참정권을 전면 보장하는 진정한 민주 공화정을 수립하는 역사적 성과를 이룩합니다.';
        } else {
          endingTitle = '⚖️ [혁명] 새로운 지배 구도의 수립 (New Regime Status Quo)';
          endingDesc = '혁명군 나이트워커가 정권을 장악하여 새로운 정부를 수립했습니다. 스카이본 귀족원은 전복되고 노동자 중심의 체제로 재편되었으나, 행정 능력의 부재 및 사후 처리 과정에서 새로운 기득권층이 된 혁명 수뇌부가 또 다른 권위주의적인 지배 계층을 형성하게 됩니다.';
        }
      }

      return {
        title: endingTitle,
        desc: endingDesc,
        totalStability: totalStability,
        totalRevolution: totalRevolution,
        totalForce: totalForce,
        totalOrder: totalOrder,
        totalIdeology: totalIdeology,
        totalWelfare: totalWelfare,
        totalAP: totalAP,
        marginPercent: marginPercent
      };
    }

    // Ending calculation
    function calculateFinalEnding() {
      const projection = getEndingProjection();
      
      if (projection.title === "판도 분석 불가능") {
        alert("누적 데이터가 없어 결산할 수 없습니다.");
        return;
      }

      const stabPercent = (projection.totalStability / projection.totalAP) * 100;
      const revPercent = (projection.totalRevolution / projection.totalAP) * 100;

      const modalContent = document.getElementById('ending-result-content');
      modalContent.innerHTML = `
        <div class="ending-title">${projection.title}</div>
        <div class="ending-desc">${projection.desc}</div>
        
        <div style="margin-top: 1.5rem;">
          <h4 style="font-weight: 700; margin-bottom: 6px;">최종 정량 데이터 합산 결과</h4>
          <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 6px; font-family: monospace; font-size: 0.85rem;">
            * 총 투입 행동력: ${Math.round(projection.totalAP)} AP<br>
            * [보수 세력 (스카이본[1기] / 스카이가드[2기])] 수치: ${Math.round(projection.totalStability)} AP (${stabPercent.toFixed(1)}%)<br>
            * [혁명 세력 (스카이웨일[1기] / 나이트워커[2기])] 수치: ${Math.round(projection.totalRevolution)} AP (${revPercent.toFixed(1)}%)<br>
            * 격차 배분도: ${projection.marginPercent.toFixed(1)}% (교착 기준: 5% 미만)<br>
            ------------------------------------<br>
            [속성 균형 분석]<br>
            - 무력(Force) 지수: ${Math.round(projection.totalForce)} AP<br>
            - 규율(Order) 지수: ${Math.round(projection.totalOrder)} AP<br>
            - 이념(Ideology) 지수: ${Math.round(projection.totalIdeology)} AP<br>
            - 상생(Welfare) 지수: ${Math.round(projection.totalWelfare)} AP
          </div>
        </div>
      `;

      openModal('ending-modal');
    }

    // Ending calculation
    function copyEndingSummary() {
      let totalStability = 0;
      let totalRevolution = 0;
      let totalForce = 0;
      let totalOrder = 0;
      let totalIdeology = 0;
      let totalWelfare = 0;

      state.infrastructures.forEach(infra => {
        let effectiveAP = getEffectiveAP(infra.id);

        if (infra.faction === 'stability') totalStability += effectiveAP;
        if (infra.faction === 'revolution') totalRevolution += effectiveAP;
        if (infra.attribute === 'force') totalForce += effectiveAP;
        if (infra.attribute === 'order') totalOrder += effectiveAP;
        if (infra.attribute === 'ideology') totalIdeology += effectiveAP;
        if (infra.attribute === 'welfare') totalWelfare += effectiveAP;
      });

      const totalAP = totalStability + totalRevolution;
      const title = document.querySelector('.ending-title').innerText;
      const desc = document.querySelector('.ending-desc').innerText;

      const summaryText = `[에버라이트 / 에버나이트 최종 시나리오 결산 보고서]

■ 최종 도출 엔딩
${title}

■ 시나리오 요약 묘사
${desc}

■ 정량 지표 데이터 (총 누계: ${Math.round(totalAP)} AP)
- 보수 세력 (스카이본[1기] / 스카이가드[2기]): ${Math.round(totalStability)} AP (인원 보정 배율: x${stabilityMult.toFixed(2)})
- 혁명 세력 (스카이웨일[1기] / 나이트워커[2기]): ${Math.round(totalRevolution)} AP (인원 보정 배율: x${revolutionMult.toFixed(2)})

■ 4대 속성 분포도 (인원수 비율 보정 반영)
- 무력 (Force): ${Math.round(totalForce)} AP
- 규율 (Order): ${Math.round(totalOrder)} AP
- 이념 (Ideology): ${Math.round(totalIdeology)} AP
- 상생 (Welfare): ${Math.round(totalWelfare)} AP

* 본 결산은 1기와 2기 기간 동안 러너들이 투자한 모든 행동 기록에 세력별 실시간 등록 인원수 비율 보정을 반영하여 계산된 공식 결말입니다. 
티르 나 노이의 역사에 발자취를 남겨 주신 모든 러너분들께 감사드립니다.`;

      navigator.clipboard.writeText(summaryText)
        .then(() => alert("공지글 복사 완료!"))
        .catch(err => alert("복사 실패: " + err));
    }

    // JSON Syncs
    function copyBackupToClipboard() {
      const txt = document.getElementById('backup-json-textarea');
      txt.select();
      navigator.clipboard.writeText(txt.value)
        .then(() => alert("클립보드 복사 성공!"))
        .catch(err => alert("복사 실패: " + err));
    }

    function triggerFileInput() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `tir_na_nog_backup_day${state.day}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    function importSystemData() {
      const jsonText = document.getElementById('import-json-textarea').value.trim();
      if (!jsonText) return;

      try {
        const parsed = JSON.parse(jsonText);
        
        if (parsed.season === undefined || !Array.isArray(parsed.infrastructures) || !Array.isArray(parsed.characters)) {
          alert("백업 파일 구조가 맞지 않습니다.");
          return;
        }

        if (confirm("정말로 전달받은 백업 데이터로 덮어쓰시겠습니까?")) {
          state = parsed;
          saveToLocalStorage();
          document.getElementById('import-json-textarea').value = '';
          alert("동기화 완료!");
        }
      } catch (e) {
        alert("JSON 에러: " + e.message);
      }
    }

    // ============================================================
    // Firebase Realtime Database 기반 실시간 클라우드 동기화 시스템
    // ============================================================
    let firebaseApp = null;
    let firebaseDB = null;
    let roomRef = null;
    let syncDebounceTimer = null;
    let suppressNextPush = false; // 원격 수신 직후의 재전송(피드백 루프) 방지 플래그

    function getClientId() {
      let id = localStorage.getItem('tirnanog_client_id');
      if (!id) {
        id = 'client_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
        localStorage.setItem('tirnanog_client_id', id);
      }
      return id;
    }

    function updateSyncStatus(status) {
      const el = document.getElementById('sync-status-badge');
      if (!el) return;
      const map = {
        connected:    ['🟢 실시간 연결됨',       '#2e7d32'],
        synced:       ['🟢 저장 완료',           '#2e7d32'],
        received:     ['🔵 실시간 업데이트 수신', 'var(--primary-color)'],
        error:        ['🔴 연결 오류',           'var(--danger-color)'],
        disconnected: ['⚪ 미연결',              'var(--text-muted)'],
        nofirebase:   ['⚠️ Firebase 설정 필요',  'var(--danger-color)']
      };
      const [text, color] = map[status] || map.disconnected;
      el.innerText = text;
      el.style.color = color;
    }

    function initFirebase() {
      if (firebaseDB) return true;
      if (typeof FIREBASE_CONFIG === 'undefined' || !FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.includes('YOUR_')) {
        updateSyncStatus('nofirebase');
        return false;
      }
      try {
        firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        firebaseDB = firebase.database();
        return true;
      } catch (e) {
        console.error("[Everafter] Firebase 초기화 실패:", e);
        updateSyncStatus('error');
        return false;
      }
    }

    // 로컬 상태를 실시간 방에 업로드 (자동 호출, 디바운스 적용)
    function pushToRealtime() {
      if (!roomRef) return;
      if (suppressNextPush) { suppressNextPush = false; return; }
      clearTimeout(syncDebounceTimer);
      syncDebounceTimer = setTimeout(() => {
        roomRef.set({
          data: state,
          updatedBy: getClientId(),
          updatedAt: Date.now()
        }).then(() => {
          updateSyncStatus('synced');
        }).catch(err => {
          console.error("[Everafter] 실시간 저장 실패:", err);
          updateSyncStatus('error');
        });
      }, 500);
    }

    // 즉시(디바운스 없이) 강제 업로드
    function pushToRealtimeNow() {
      if (!roomRef) return Promise.reject(new Error("연결된 방이 없습니다."));
      return roomRef.set({
        data: state,
        updatedBy: getClientId(),
        updatedAt: Date.now()
      });
    }

    // 특정 방에 연결 + 실시간 수신 리스너 등록
    function connectToRoom(roomKey, opts) {
      opts = opts || {};
      if (!roomKey) {
        if (!opts.silent) alert("방 키를 입력해 주세요.");
        return false;
      }
      if (!firebaseDB && !initFirebase()) {
        if (!opts.silent) alert("Firebase 설정이 되어있지 않습니다.\nEverafter_firebase-config.js 파일에 프로젝트 값을 입력했는지 확인해 주세요.");
        return false;
      }

      if (roomRef) roomRef.off(); // 기존 리스너 해제

      roomRef = firebaseDB.ref('rooms/' + roomKey);
      localStorage.setItem('tirnanog_cloud_key', roomKey);
      const input = document.getElementById('cloud-room-input');
      if (input) input.value = roomKey;

      roomRef.on('value', (snapshot) => {
        const payload = snapshot.val();
        if (!payload || !payload.data) return;
        if (payload.updatedBy === getClientId()) return; // 내가 방금 쓴 값은 무시 (루프 방지)
        suppressNextPush = true;
        state = payload.data;
        localStorage.setItem('tirnanog_state', JSON.stringify(state));
        updateUI();
        updateSyncStatus('received');
      }, (err) => {
        console.error("[Everafter] 실시간 수신 오류:", err);
        updateSyncStatus('error');
      });

      updateSyncStatus('connected');
      return true;
    }

    function generateCloudRoom() {
      if (!confirm("새로운 실시간 동기화 방을 생성하시겠습니까?\n생성 즉시 현재 대시보드 데이터가 그 방의 초기값으로 업로드됩니다.")) return;

      if (!firebaseDB && !initFirebase()) {
        alert("Firebase 설정이 되어있지 않습니다.\nEverafter_firebase-config.js 파일에 프로젝트 값을 입력했는지 확인해 주세요.");
        return;
      }

      const roomKey = 'TN-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      if (!connectToRoom(roomKey, { silent: true })) return;

      pushToRealtimeNow()
        .then(() => {
          alert(`새 동기화 방이 생성되었습니다!\n방 키: ${roomKey}\n\n이 키를 다른 운영진에게 전달하고, 각자 방 키를 입력한 뒤 "이 방에 연결" 버튼을 누르면 실시간으로 데이터가 공유됩니다.`);
        })
        .catch(err => alert("초기 업로드 실패: " + err.message));
    }

    // 이미 발급된 방 키로 합류 (다른 운영진용)
    function joinCloudRoom() {
      const roomKey = document.getElementById('cloud-room-input').value.trim();
      if (!roomKey) {
        alert("전달받은 방 키를 입력해 주세요.");
        return;
      }
      if (!connectToRoom(roomKey)) return;
      alert(`동기화 방 [${roomKey}]에 연결되었습니다.\n이제부터 변경사항이 실시간으로 자동 공유됩니다.`);
    }

    // 수동 강제 업로드 (비상용)
    function uploadToCloud() {
      const roomKey = document.getElementById('cloud-room-input').value.trim();
      if (!roomKey) {
        alert("저장할 클라우드 방 키가 없습니다. 먼저 방을 생성하거나 전달받은 방 키를 입력하세요.");
        return;
      }
      if (!roomRef || roomRef.key !== roomKey) {
        if (!connectToRoom(roomKey, { silent: true })) return;
      }

      const btn = document.querySelector('[onclick="uploadToCloud()"]');
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 저장 중...';
      btn.disabled = true;

      pushToRealtimeNow()
        .then(() => alert("클라우드 저장 성공! 현재 대시보드 판도가 실시간 방에 즉시 반영되었습니다."))
        .catch(err => alert("서버 저장 실패: " + err.message))
        .finally(() => {
          btn.innerHTML = origText;
          btn.disabled = false;
        });
    }

    // 수동 강제 다운로드 (비상용)
    function downloadFromCloud() {
      const roomKey = document.getElementById('cloud-room-input').value.trim();
      if (!roomKey) {
        alert("불러올 클라우드 방 키가 없습니다. 연동할 방 키를 입력해 주세요.");
        return;
      }
      if (!firebaseDB && !initFirebase()) {
        alert("Firebase 설정이 되어있지 않습니다.\nEverafter_firebase-config.js 파일에 프로젝트 값을 입력했는지 확인해 주세요.");
        return;
      }

      const btn = document.querySelector('[onclick="downloadFromCloud()"]');
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> 동기화 중...';
      btn.disabled = true;

      firebaseDB.ref('rooms/' + roomKey).get()
        .then(snapshot => {
          const payload = snapshot.val();
          if (payload && payload.data) {
            if (confirm("클라우드에서 최신 데이터를 불러와 현재 대시보드를 덮어쓰시겠습니까?")) {
              suppressNextPush = true;
              state = payload.data;
              saveToLocalStorage();
              if (!roomRef || roomRef.key !== roomKey) connectToRoom(roomKey, { silent: true });
              alert("동기화 성공! 클라우드의 최신 판도로 대시보드가 성공적으로 동기화되었습니다.");
            }
          } else {
            alert("불러온 데이터가 비어 있거나 손상되었습니다. 방에 데이터가 업로드되었는지 확인해 주세요.");
          }
        })
        .catch(err => alert("불러오기 실패: " + err.message))
        .finally(() => {
          btn.innerHTML = origText;
          btn.disabled = false;
        });
    }

    window.onload = function() {
      loadFromLocalStorage();
      updateUI();

      // Firebase 실시간 동기화 초기화 및 자동 재연결
      initFirebase();
      const savedRoomKey = localStorage.getItem('tirnanog_cloud_key');
      if (savedRoomKey && firebaseDB) {
        connectToRoom(savedRoomKey, { silent: true });
      } else if (!firebaseDB) {
        updateSyncStatus('nofirebase');
      } else {
        updateSyncStatus('disconnected');
      }

      // Show welcome modal once per session
      if (!sessionStorage.getItem('tirnanog_welcome_shown')) {
        openModal('welcome-modal');
        sessionStorage.setItem('tirnanog_welcome_shown', 'true');
      }
    };

