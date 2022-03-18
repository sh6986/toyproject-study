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
    const sgCategory = document.getElementById('sgCategory').value;
    const openYn = document.getElementById('openYn').checked;

    // 스터디모집글 조회
    getList(openYn, sgCategory);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 카테고리 메뉴 클릭
     */
    document.getElementById('category').addEventListener('click', (e) => {
        const sgCategory = e.target.getAttribute('data-sgCategory');
       
        if (sgCategory) {
            const openYn = document.getElementById('openYn').checked;
            document.getElementById('sgCategory').value = sgCategory;

            // 스터디모집글 조회
            getList(openYn, sgCategory);
        }
    });

    /**
     * 스터디모집글 클릭시 -> 상세페이지로 이동
     */
    document.getElementById('studyList').addEventListener('click', (e) => {
        if (e.target.closest('.recruitBox')) {
            const sgId = e.target.closest('.recruitBox').querySelector('.sgId').value;
            location.href = `/detail/${sgId}`;
        }   
    });

    /**
     * 모집중인 글만 보기 클릭시
     */
    document.getElementById('openYn').addEventListener('click', (e) => {
        const sgCategory = document.getElementById('sgCategory').value;
        const openYn = document.getElementById('openYn').checked;

        // 스터디모집글 조회
        getList(openYn, sgCategory);
    });
}

/**
 * 스터디모집글 조회
 */
function getList(openYn, sgCategory) {
    axios.get('/recruit')
        .then(res => {
            let studyList = res.data;

            if (openYn) {   // 모집중인 글만 보기
                studyList = studyList.filter(item => {
                    return item.SG_OPEN_YN === 'Y';
                });
            }

            if (sgCategory !== 'all') {     // 전체아닌 카테고리 선택시
                studyList = studyList.filter(item => {
                    return item.SG_CATEGORY === sgCategory;
                });
            }

            document.getElementById('studyList').innerHTML = common.studyRecruitList(studyList);
        })
        .catch(err => {
            console.error(err);
        });
}


// /**
//  * context path 구하기
//  */
//  function getContextPath() {
//     const hostIndex = location.href.indexOf(location.host) + location.host.length;
//     const contextPath = location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));

//     console.log(contextPath);
    
//     return contextPath;
// }


    