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
    const sbId = document.getElementById('sbId').value;

    // 게시판 상세 조회
    getBoardDetail(sbId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;
    const sbId = document.getElementById('sbId').value;

    /**
     * 수정 버튼 클릭시
     */
    document.getElementById('modifyBtn').addEventListener('click', (e) => {
        location.href = `/board/modify/${sbId}`;
    });

    /**
     * 게시글 삭제확인 모달창 - 확인버튼 클릭시
     */
    document.getElementById('removeOkBtn').addEventListener('click', (e) => {
        removeBoard(sgId, sbId);
    });
};

/**
 * 게시판 상세 조회
 */
function getBoardDetail(sbId) {
    axios.get(`/manage/boardDetail/${sbId}`)
        .then(res => {
            const board = res.data;
            document.getElementById('sbTitle').innerHTML = board.SB_TITLE;              // 제목
            document.getElementById('userNickname').innerHTML = board.USER_NICKNAME;    // 닉네임
            document.getElementById('sbRegDate').innerHTML = board.SB_REG_DATE;         // 등록일시
            document.getElementById('sbViews').innerHTML = board.SB_VIEWS;              // 조회수
            document.getElementById('sbContent').innerHTML = board.SB_CONTENT;          // 내용
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 게시판 글 삭제
 */
function removeBoard(sgId, sbId) {
    axios.delete(`/manage/board/${sbId}`)
        .then(res => {
            location.href = `/boardList/${sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

