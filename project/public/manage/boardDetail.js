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
    const sgId = document.getElementById('sgId').value;
    const sbId = document.getElementById('sbId').value;

    // 게시판 상세 조회
    getBoardDetail(sbId);

    // 대시보드 제목
    common.dashBoardTitle(sgId);
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
    document.getElementById('modifyBtn').addEventListener('click', () => {
        location.href = `/board/modify/${sgId}/${sbId}`;
    });

    /**
     * 게시글 삭제확인 모달창 - 확인버튼 클릭시
     */
    document.getElementById('removeOkBtn').addEventListener('click', () => {
        removeBoard(sgId, sbId);
    });

    /**
     * 목록 버튼 클릭 -> 게시글 목록으로 이동
     */
    document.getElementById('goList').addEventListener('click', () => {
        location.href = `/boardList/${sgId}`;
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
            document.getElementById('userInfo').innerHTML = `${board.USER_NICKNAME} (${board.USER_EMAIL})`;    // 닉네임 (이메일)
            document.getElementById('sbRegDate').innerHTML = board.SB_REG_DATE;         // 등록일시
            document.getElementById('sbViews').innerHTML = board.SB_VIEWS;              // 조회수
            document.getElementById('sbContent').innerHTML = board.SB_CONTENT;          // 내용
        
            // 수정, 모집완료 버튼 - 작성자만 보이게
            if (common.getSessionUserId() === String(board.SB_REG_ID)) {
                document.getElementById('modifyBtn').classList.remove('noVisible');
                document.getElementById('removeBtn').classList.remove('noVisible');
            } 
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

