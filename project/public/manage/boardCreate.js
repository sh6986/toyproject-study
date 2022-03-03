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
    const mode = document.getElementById('mode').value;

    if (mode === 'modify') {    // 수정일때
        const sbId = document.getElementById('sbId').value;
        
        // 게시판 상세 조회
        getBoardDetail(sbId);

    } 
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const mode = document.getElementById('mode').value;
    let board = {};

    if (mode === 'create') {    // 등록일때
        /**
         * 만들기 버튼 클릭시
         */
        document.getElementById('createBtn').addEventListener('click', (e) => {
            const sgId = document.getElementById('sgId').value;
            board = getValue();
            board.sgId = sgId;

            createBoard(board);
        });
    } else {                    // 수정일때
        /**
         * 수정하기 버튼 클릭시
         */
        document.getElementById('updateBtn').addEventListener('click', (e) => {
            const sbId = document.getElementById('sbId').value;
            board = getValue();
            board.sbId = sbId;

            modifyBoard(board);
        });
    }
}

/**
 * 각 입력값 가져오기
 */
function getValue() {
    const sbTitle = document.getElementById('sbTitle').value;
    const sbContent = document.getElementById('sbContent').value;
    const sbNoticeYn = 'N';     // [TODO] 게시판 글 생성시 공지여부 체크박스
    const board = {
        sbTitle,
        sbContent,
        sbNoticeYn
    };

    return board;
}

/**
 * 게시판 상세 조회
 */
function getBoardDetail(sbId) {
    axios.get(`/manage/boardDetail/${sbId}`)
        .then(res => {
            const board = res.data;
            document.getElementById('sbTitle').value = board.SB_TITLE;      // 제목
            document.getElementById('sbContent').value = board.SB_CONTENT;  // 본문
        })
        .catch(err => {
            console.error(err);
        }) 
}

/**
 * 게시판 글 생성
 */
function createBoard(board) {
    axios.post(`/manage/board`, board)
        .then(res => {
            location.href = `/board/${board.sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 게시판 글 수정
 */
function modifyBoard(board) {
    axios.put(`/manage/board`, board)
        .then(res => {
            // [TODO] 수정한 글 상세로 이동
        })
        .catch(err => {
            console.error(err);
        });
}
