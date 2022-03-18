window.onload = () => {
    // 화면 초기화
    initPage();

    // 이벤트 등록
    setEventListener();
};

/**
 * 화면 초기화
 */
async function initPage() {
    const mode = document.getElementById('mode').value;
    const sgId = document.getElementById('sgId').value;

    // 대시보드 제목
    common.dashBoardTitle(sgId);

    if (mode === 'modify') {    // 수정일때
        const sbId = document.getElementById('sbId').value;
        
        // 게시판 상세 조회
        getBoardDetail(sbId);
    } 

    try {
        // 스터디모집글 상세 조회
        const study = await common.getDetail(sgId);

        if (common.getSessionUserId() === String(study.LEAD_USER_ID)) {         // 현재 사용자가 팀장일때
            document.getElementById('noticeYn').classList.remove('noVisible');  // 공지등록 체크박스
        }
    } catch (err) {
        console.error(err);
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
            board = getValue();
            
            if (checkBoard(board)) {
                createBoard(board);
            }
        });
    } else {                    // 수정일때
        /**
         * 수정하기 버튼 클릭시
         */
        document.getElementById('updateBtn').addEventListener('click', (e) => {
            const sbId = document.getElementById('sbId').value;
            
            board = getValue();
            board.sbId = sbId;

            if (checkBoard(board)) {
                modifyBoard(board);
            }
        });
    }

    /**
     * 취소버튼 클릭시 -> 생성 - 리스트로 이동, 수정 - 해당글 상세로 이동
     */
    document.getElementById('cancelBtn').addEventListener('click', () => {
        const sgId = document.getElementById('sgId').value;
        const sbId = document.getElementById('sbId').value;

        location.href = mode === 'create' ? `/boardList/${sgId}` : `/board/detail/${sgId}/${sbId}`;
    });
}

/**
 * 각 입력값 가져오기
 */
function getValue() {
    const sgId = document.getElementById('sgId').value;
    const sbTitle = document.getElementById('sbTitle').value;
    const sbContent = document.getElementById('sbContent').value;
    const sbNoticeYn = document.getElementById('sbNoticeYn').checked ? 'Y' : 'N';
    const board = {sgId, sbTitle, sbContent, sbNoticeYn};

    return board;
}

/**
 * 유효성 검사
 */
function checkBoard(board) {
    const result = false;

    // 제목또는 내용을 입력하지 않았을 때
    if (common.isEmpty(board.sbTitle) || common.isEmpty(board.sbContent)) {
        document.getElementById('validate').innerHTML = common.validateEm('빈칸 없이 입력해 주세요.');
        return result;
    }

    return true;
}

/**
 * 게시판 상세 조회
 */
function getBoardDetail(sbId) {
    axios.get(`/manage/boardDetail/${sbId}`)
        .then(res => {
            const board = res.data;

            document.getElementById('sbNoticeYn').checked = board.SB_NOTICE_YN === 'Y';     // 공지등록
            document.getElementById('sbTitle').value = board.SB_TITLE;                      // 제목
            document.getElementById('sbContent').value = board.SB_CONTENT;                  // 본문
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
            const sbId = res.data.sbId;
            location.href = `/board/detail/${board.sgId}/${sbId}`;
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
            location.href = `/board/detail/${board.sgId}/${board.sbId}`;
        })
        .catch(err => {
            console.error(err);
        });
}
