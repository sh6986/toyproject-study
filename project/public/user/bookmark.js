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
    const openYn = document.getElementById('openYn').checked;

    // 내 북마크 목록 조회
    getBookMarkList(openYn);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 스터디 클릭시 -> 모집글로 이동
     */
    document.getElementById('studyBkmList').addEventListener('click', (e) => {
        if (e.target.closest('.recruitBox')) {
            const sgId = e.target.closest('.recruitBox').querySelector('.sgId').value;
            location.href = `/detail/${sgId}`;
        }   
    });

    /**
     * 모집중인 글만 보기 클릭시
     */
     document.getElementById('openYn').addEventListener('click', (e) => {
        const openYn = document.getElementById('openYn').checked;

        // 내 북마크 목록 조회
        getBookMarkList(openYn);
    });
}

/**
 * 내 북마크 목록 조회
 */
function getBookMarkList(openYn) {
    axios.get('/user/studyBkm')
        .then(res => {
            let studyList = res.data;

            if (openYn) {   // 모집중인 글만 보기
                studyList = studyList.filter((item, index) => {
                    return item.SG_OPEN_YN === 'Y';
                });
            }

            document.getElementById('studyBkmList').innerHTML = common.studyRecruitList(studyList);
        })
        .catch(err => {
            console.error(err);
        });
}
