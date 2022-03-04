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
    
    // 스터디모집글 상세 조회
    getRecruitDetail(sgId);

    // 스터디모집글 상세 댓글 조회
    getRecruitComment(sgId);
};

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

    /**
     * 글 수정 버튼 클릭시
     */
    document.getElementById('modifyBtn').addEventListener('click', (e) => {
        // 수정페이지로 이동 (생성페이지에 상세 데이터가 담긴)
        location.href = `/update/${sgId}`;
    });

    /**
     * 댓글삭제확인 모달창 - 확인버튼 클릭시
     */
    document.getElementById('completeOkBtn').addEventListener('click', (e) => {
        modifyComplete(sgId);
    });
    
    /**
     * 댓글달기 버튼 클릭시
     */
    document.getElementById('createBtn').addEventListener('click', (e) => {
        const srcContent = document.getElementById('srcContent').value;
        const comment = {
            sgId: sgId,
            srcContent: srcContent,
        };
    
        createRecruitComment(comment);
        document.getElementById('srcContent').value = '';
    });

    /**
     * 댓글 수정 / 삭제 버튼 클릭시
     */
    document.getElementById('commentList').addEventListener('click', (e) => {
        const targetClassName = e.target.classList;
        const commentDtlElement = e.target.closest('.commentDtl');
        const srcId = commentDtlElement ? commentDtlElement.querySelector('.srcId').value : '';
        const comment = {
            srcId: srcId,
            sgId: sgId,
        };

        // 수정버튼 클릭시
        if (targetClassName[0] === 'commentModifyBtn') {
            // 댓글 수정 폼 그리기 - 스터디모집글 상세 댓글 조회
            getRecruitComment(comment.sgId, comment.srcId);
        }

        // 수정 폼 - 수정버튼 클릭시
        if (targetClassName.contains('modifyBtn')) {
            const modifySrcContent = commentDtlElement.querySelector('.modifySrcContent').value;
            
            comment.srcContent = modifySrcContent;
            modifyRecruitComment(comment);
        }

        // 수정 폼 - 취소버튼 클릭시
        if (targetClassName.contains('modifyCancleBtn')) {
            getRecruitComment(comment.sgId);
        }

        // 삭제버튼 클릭시
        if (targetClassName.contains('commentRemoveBtn')) {
            document.querySelector('.srcId').value = srcId;
        }
    });

    /**
     * 댓글삭제확인 모달창 - 확인버튼 클릭시
     */
    document.getElementById('removeCommentOkBtn').addEventListener('click', (e) => {
        const srcId = document.querySelector('.srcId').value;
        const comment = {
            srcId: srcId,
            sgId: sgId,
        };

        removeRecruitComment(comment);
    });
};

/**
 * 스터디모집글 상세 조회
 */
 function getRecruitDetail(sgId) {
    axios.get(`/recruit/detail/${sgId}`)
        .then(res => {
            const study = res.data;
            document.getElementById('srTitle').innerHTML = study.SR_TITLE;
            document.getElementById('userNickname').innerHTML = study.USER_NICKNAME;
            document.getElementById('sbRegDate').innerHTML = study.SG_REG_DATE;
            document.getElementById('sbViews').innerHTML = study.SR_VIEWS;
            document.getElementById('srbCnt').innerHTML = study.SRB_CNT;
            document.getElementById('srbYn').innerHTML = study.SRB_YN;
            document.getElementById('stNameDesc').innerHTML = study.ST_NAME_DESC;
            document.getElementById('srContent').innerHTML = study.SR_CONTENT;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디모집글 상세 댓글 조회
 */
function getRecruitComment(sgId, srcId) {
    axios.get(`/recruit/comment/${sgId}`)
        .then(res => {
            let innerHtml = ``;

            // [TODO] 관리자 혹은 댓글작성자한테만 수정, 삭제버튼 뜨게 
            res.data.forEach((item, index, arr) => {
                innerHtml += `
                    <div class="row commentDtl">
                        <input type="hidden" class="srcId" value="${item.SRC_ID}">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="nk-int-mk sl-dp-mn">
                                <div>
                                    <span>${item.USER_NICKNAME} (${item.SRC_REG_DATE})</span>
                                    <span class="commentModifyBtn">수정</span> | <span class="commentRemoveBtn" data-toggle="modal" data-target="#removeCommentModal">삭제</span>
                                </div>
                                <span>${item.SRC_CONTENT}</span>
                                <div class="commentModifyForm" ${Number(srcId) === item.SRC_ID ? '' : 'style="display:none;"'}>
                                    <textarea class="form-control modifySrcContent" rows="5">${item.SRC_CONTENT}</textarea>
                                    <div class="commentModifyBtnDiv">
                                        <button class="btn btn-default notika-btn-default waves-effect modifyCancleBtn">취소</button>
                                        <button class="btn btn-success notika-btn-success waves-effect modifyBtn">수정</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                `;
            });

            document.getElementById('commentList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 모집완료
 */
function modifyComplete(sgId) {
    axios.put(`/recruit/complete/${sgId}`)
        .then(res => {
            location.href = `/`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디모집글 댓글 등록
 */
function createRecruitComment(comment) {
    axios.post('/recruit/comment', comment)
        .then(res => {
            getRecruitComment(comment.sgId);
        })
        .catch(err => {
            console.error(err);
        });
};

/**
 * 스터디모집글 댓글 수정
 */
function modifyRecruitComment(comment) {
    axios.put('/recruit/comment', comment)
        .then(res => {
            getRecruitComment(comment.sgId);
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디모집글 댓글 삭제
 */
function removeRecruitComment(comment) {
    axios.delete(`/recruit/comment/${comment.srcId}`)
        .then(res => {
            getRecruitComment(comment.sgId);
        })
        .catch(err => {
            console.error(err);
        });
}