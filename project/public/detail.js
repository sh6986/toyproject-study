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
     * 스터디모집글 상세 조회
     */
     const sgId = document.getElementById('sgId').getAttribute('data-sgId');

     axios.get(`/recruit/${sgId}`)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err);
        });
};

/**
 * 이벤트 등록
 */
function setEventListener() {

};