window.onload = () => {
    // 화면 초기화
    initPage();

    // 이벤트 등록\
    setEventListener();
};

/**
 * 화면 초기화
 */
function initPage() {
    // 내 스터디 목록 조회
    getMyStudyList();
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 스터디 클릭시 -> 대시보드로 이동
     */
    document.getElementById('myStudyList').addEventListener('click', (e) => {
        if (e.target.closest('.recruitBox')) {
            const sgId = e.target.closest('.recruitBox').querySelector('.sgId').value;
            location.href = `/dashboard/${sgId}`;
        }  
    });
}

/**
 * 내 스터디 목록 조회
 */
function getMyStudyList() {
    axios.get('/user/myStudy')
        .then(res => {
            document.getElementById('myStudyList').innerHTML = common.studyRecruitList(res.data, true);
        })
        .catch(err => {
            console.error(err);
        });
}