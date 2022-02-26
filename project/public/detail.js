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
    
    const sgId = document.getElementById('recruitDetail').getAttribute('data-sgId');
    
    // 스터디모집글 상세 조회
    getRecruitDetail(sgId);

    // 스터디모집글 상세 댓글 조회
    getRecruitComment(sgId);
};

/**
 * 스터디모집글 상세 조회
 */
function getRecruitDetail(sgId) {
    let innerHtml = ``;

    axios.get(`/recruit/detail/${sgId}`)
        .then(res => {
            const study = res.data[0];

            innerHtml = `
                <div class="basic-tb-hd">
                    <h1>${study.SR_TITLE}</h1>
                    <h4>${study.USER_NICKNAME} | ${study.SG_REG_DATE} | 조회수 ${study.SR_VIEWS} | 북마크 ${study.SRB_CNT} ${study.SRB_YN}</h4>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="nk-int-mk sl-dp-mn">
                            <h2>${study.ST_NAME}</h2>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="nk-int-mk sl-dp-mn">
                            <h2>${study.SR_CONTENT}</h2>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('studyDetail').innerHTML = innerHtml;


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
                    <div class="row commentDtl" data-srcId="${item.SRC_ID}">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="nk-int-mk sl-dp-mn">
                                <div>
                                    <span>${item.USER_NICKNAME} (${item.SRC_REG_DATE})</span>
                                    <span class="commentModifyBtn">수정</span> | <span class="commentRemoveBtn">삭제</span>
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
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('recruitDetail').getAttribute('data-sgId');
    const srId = document.getElementById('recruitDetail').getAttribute('data-srId');
    
    /**
     * 댓글달기 버튼 클릭시
     */
    document.getElementById('createBtn').addEventListener('click', (e) => {
        const srcContent = document.getElementById('srcContent').value;

        const comment = {
            sgId: sgId,
            srId: srId,
            srcContent: srcContent,
        };
    
        // 스터디모집글 상세 댓글 등록
        createRecruitComment(comment);
    });

    /**
     * 댓글 수정 | 삭제 버튼 클릭시
     */
    document.getElementById('commentList').addEventListener('click', (e) => {
        const targetClassName = e.target.classList;
        const targetElement = e.target.closest('.commentDtl');
        const srcId = targetElement.getAttribute('data-srcId');

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
            comment.srcContent = '댓글수정테스트aaaaa111a';
            // 스터디모집글 상세 댓글 수정    
            modifyRecruitComment(comment);
        }

        // 수정 폼 - 취소버튼 클릭시

        // 삭제버튼 클릭시
        if (targetClassName[0] === 'commentRemoveBtn') {
            // 스터디모집글 상세 댓글 삭제
            removeRecruitComment(comment);
        }
    });
};

/**
 * 스터디모집글 상세 댓글 등록
 */
function createRecruitComment(comment) {
    axios.post('/recruit/comment', comment)
            .then(res => {
                // 스터디모집글 상세 댓글 조회
                getRecruitComment(comment.sgId);
            })
            .catch(err => {
                console.error(err);
            });
};

/**
 * 스터디모집글 상세 댓글 수정
 */
function modifyRecruitComment(comment) {
    axios.put('/recruit/comment', comment)
        .then(res => {
            // 스터디모집글 상세 댓글 조회
            getRecruitComment(comment.sgId);
        })
        .catch(err => {
            console.error(err);
        });
}


/**
 * 스터디모집글 상세 댓글 삭제
 */
function removeRecruitComment(comment) {
    axios.delete(`/recruit/comment/${comment.srcId}`)
        .then(res => {
            // 스터디모집글 상세 댓글 조회
            getRecruitComment(comment.sgId);
        })
        .catch(err => {
            console.error(err);
        });
}