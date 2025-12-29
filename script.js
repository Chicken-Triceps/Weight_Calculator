// === 1. 상태 관리 (Data) ===
let currentBarWeight = 20; // 현재 바벨 무게
let plates = []; // 현재 한쪽에 꽂힌 원판 무게들의 배열

// === 2. DOM 요소 참조 (References) ===
const leftSleeve = document.getElementById('sleeve-left');
const rightSleeve = document.getElementById('sleeve-right');
const totalText = document.getElementById('total-weight');
const barSelect = document.getElementById('bar-select');
const barImg = document.getElementById('bar-img');
const resetBtn = document.getElementById('reset-btn');
const undoBtn = document.getElementById('undo-btn'); // [추가] 제거 버튼
const addBtns = document.querySelectorAll('.add-btn');

// === 3. 이벤트 리스너 (Event Handlers) ===

// (1) 바벨 선택 변경 시
barSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    currentBarWeight = parseFloat(selectedOption.value);
    const imgFileName = selectedOption.dataset.img;
    
    // 바벨 이미지 교체
    barImg.src = `assets/${imgFileName}`;
    
    updateTotal();
});

// (2) 원판 추가 버튼 클릭 시
addBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const weight = parseFloat(btn.dataset.weight);
        addPlate(weight);
    });
});

// (3) 초기화 버튼 클릭 시
resetBtn.addEventListener('click', resetPlates);

// (4) [추가] 제거(화살표) 버튼 클릭 시
if (undoBtn) {
    undoBtn.addEventListener('click', removeLastPlate);
}


// === 4. 핵심 기능 함수 (Core Functions) ===

/**
 * 원판 추가 함수 (자동 정렬 포함)
 */
function addPlate(weight) {
    plates.push(weight);
    
    // [핵심] 무거운 원판이 항상 안쪽(앞쪽)에 오도록 내림차순 정렬
    plates.sort((a, b) => b - a);
    
    renderPlates();
    updateTotal();
}

/**
 * [추가] 가장 바깥쪽(마지막) 원판 제거 함수
 */
function removeLastPlate() {
    if (plates.length > 0) {
        // 정렬된 배열의 마지막 요소(가장 가벼운 것 = 가장 바깥쪽)를 제거
        plates.pop(); 
        renderPlates();
        updateTotal();
    }
}

/**
 * 특정 위치의 원판 삭제 (클릭 시)
 */
function removePlate(index) {
    plates.splice(index, 1);
    renderPlates();
    updateTotal();
}

/**
 * 초기화 함수
 */
function resetPlates() {
    plates = [];
    renderPlates();
    updateTotal();
}

/**
 * 화면 그리기 함수 (클래스 처리 수정)
 */
function renderPlates() {
    leftSleeve.innerHTML = '';
    rightSleeve.innerHTML = '';

    plates.forEach((weight, index) => {
        const imgFileName = `Plate${weight}Image.png`;

        // [수정] 5kg 등 특정 무게에 CSS 클래스를 적용하기 위한 식별자 생성
        // 예: 5 -> 'p-5', 2.5 -> 'p-2-5'
        const weightClass = `p-${String(weight).replace('.', '-')}`;

        // === 왼쪽 원판 생성 ===
        const leftImg = document.createElement('img');
        leftImg.src = `assets/${imgFileName}`;
        
        // [중요] 기존 'plate-img' 클래스(간격/비율)는 유지하고, 
        // 뒤에 weightClass(크기 조절용)를 추가합니다.
        leftImg.className = `plate-img ${weightClass}`; 
        
        leftImg.alt = `${weight}kg plate`;
        leftImg.onclick = () => removePlate(index);

        // === 오른쪽 원판 생성 ===
        const rightImg = document.createElement('img');
        rightImg.src = `assets/${imgFileName}`;
        rightImg.className = `plate-img ${weightClass}`; // 여기도 동일하게 적용
        rightImg.alt = `${weight}kg plate`;
        rightImg.onclick = () => removePlate(index);

        leftSleeve.appendChild(leftImg);
        rightSleeve.appendChild(rightImg);
    });
}

/**
 * 무게 합계 계산
 */
function updateTotal() {
    const plateSum = plates.reduce((sum, w) => sum + w, 0);
    const total = currentBarWeight + (plateSum * 2);
    totalText.innerText = `${total} kg`;
}

// 초기 실행
updateTotal();