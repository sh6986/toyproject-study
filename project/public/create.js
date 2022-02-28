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
    /**
     * 수정페이지일시
     */
    // 모집글 제목
    // document.getElementById('srTitle').value = '수정title';
    // // 스터디명
    // document.getElementById('sgName').value = '수정스터디명';

    // const sgCnt = document.getElementById('sgCnt').querySelectorAll('option');

    
    // 카테고리
    // document.getElementById('sgCategory').value = '002';
    // 기술스택
    // document.getElementById('stCode').value = ['004', '006'];
    // 스터디설명
    // document.getElementById('srContent').value = '수정스터디설명';
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 만들기버튼 클릭시 -> 스터디 생성
     */
    document.getElementById('createBtn').addEventListener('click', (e) => {
        const srTitle = document.getElementById('srTitle').value;       // 제목
        const sgName = document.getElementById('sgName').value;         // 스터디명
        const sgCnt = document.getElementById('sgCnt').value;           // 인원
        const sgCategory = document.getElementById('sgCategory').value; // 카테고리 (코드)
        const stCode = [];
        const srContent = document.getElementById('srContent').value;  // 내용

        const study = {
            srTitle, sgName, sgCnt, sgCategory, stCode, srContent
        };

        // 기술스택 선택한 값 반복문돌려서 가져오기
        document.getElementById('stCode').querySelectorAll('option').forEach((item, index, arr) => {
            if (item.selected) {
                stCode.push(item.value);
            }
        });

        createRecruit(study);
    });
}

/**
 * 스터디 / 스터디 모집글 생성
 */
function createRecruit(study) {
    axios.post('/recruit', study)
        .then(res => {
            console.log(res);
            // location.href = '/';
        })
        .catch(err => {
            console.error(err);
        });
}
