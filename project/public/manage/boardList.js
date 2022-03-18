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

    // 게시판 목록 조회
    getBoardList(sgId);

    // 대시보드 제목
    common.dashBoardTitle(sgId);
};

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

    /**
     * 글쓰기 버튼 클릭
     */
    document.getElementById('createBtn').addEventListener('click', (e) => {
        location.href = `/board/create/${sgId}`;
    });

    /**
     * 대시보드 버튼 클릭 -> 대시보드로 이동
     */
    document.getElementById('goDashBoard').addEventListener('click', () => {
        location.href = `/dashboard/${sgId}`;
    });
}

/**
 * 게시판 목록 조회
 */
function getBoardList(sgId) {
    axios.get(`/manage/boardList/${sgId}`)
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index) => {
                innerHtml += `
                    <tr>
                        <td>${item.ROWNUM}</td>
                        <td>${item.SB_NOTICE_YN === 'Y' ? `<span class="label label-warning">공지</span>` : ''}</td>
                        <td class="text-left">
                            <a href="/board/detail/${item.SG_ID}/${item.SB_ID}">${item.SB_TITLE}</a>
                        </td>
                        <td>${item.USER_NICKNAME}</td>
                        <td>${item.SB_REG_DATE}</td>
                        <td>${item.SB_VIEWS}</td>
                    </tr>
                `;
            });

            document.getElementById('boardList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}