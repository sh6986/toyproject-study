window.onload = () => {
    // 화면 초기화
    initPage();

    // 이벤트 등록
    setEventListener();
};

/**
 * 화면 초기화
 */
function initPage() {
    
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const mode = document.getElementById('mode').value;
    let study = {};

    if (mode == 'create') {     // 생성일때
        /**
         * 만들기버튼 클릭시 -> 스터디 생성
         */
        document.getElementById('createBtn').addEventListener('click', (e) => {
            study = getValue();
            createRecruit(study);
        });

    } else {                    // 수정일때
        /**
         * 수정하기버튼 클릭시 -> 스터디 수정
         */
        document.getElementById('updateBtn').addEventListener('click', (e) => {
            study = getValue();
            study.sgId = document.getElementById('sgId').value;
            modifyRecruit(study);
        });
    }
}

/**
 * 각 입력값 가져오기
 */
function getValue() {
    const srTitle = document.getElementById('srTitle').value;       // 제목
    const sgName = document.getElementById('sgName').value;         // 스터디명
    const sgCnt = document.getElementById('sgCnt').value;           // 인원
    const sgCategory = document.getElementById('sgCategory').value; // 카테고리 (코드)
    const srContent = document.getElementById('srContent').value;   // 내용
    const stCode = [];                                              // 기술스택
    document.getElementById('stCode').querySelectorAll('option').forEach((item, index, arr) => {    // 기술스택 선택한 값 반복문돌려서 가져오기
        if (item.selected) {
            stCode.push(item.value);
        }
    });
    const study = {srTitle, sgName, sgCnt, sgCategory, stCode, srContent};

    return study;
}

/**
 * 스터디 / 스터디 모집글 생성
 */
function createRecruit(study) {
    axios.post('/recruit', study)
        .then(res => {
            const sgId = res.data.sgId;
            location.href = `/detail/${sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 / 스터디 모집글 수정
 */
function modifyRecruit(study) {
    axios.put('/recruit', study)
        .then(res => {
            const sgId = res.data.sgId;
            location.href = `/detail/${sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}
