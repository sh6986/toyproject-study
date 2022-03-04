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
                        <td>${item.SB_TITLE}</td>
                        <td>
                            <a href="/board/detail/${item.SG_ID}/${item.SB_ID}">${item.SB_TITLE}</a>
                        </td>
                        <td>${item.USER_NICKNAME}</td>
                        <td>${item.SB_REG_DATE}</td>
                        <td>${item.SB_VIEWS}</td>
                        <td>${item.SB_NOTICE_YN}</td>
                    </tr>
                `;
            });

            document.getElementById('boardList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}