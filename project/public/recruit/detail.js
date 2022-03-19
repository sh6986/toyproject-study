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

    // 스터디 북마크 여부
    if (common.getSessionUserId()) {
        getStudyBkmYn(sgId);
    }
};

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

    /**
     * 글 수정 버튼 클릭시
     */
    document.getElementById('modifyBtn').addEventListener('click', () => {
        location.href = `/update/${sgId}`;
    });

    /**
     * 모집완료 모달창 - 확인버튼 클릭시
     */
    document.getElementById('completeOkBtn').addEventListener('click', async () => {
        try {
            await common.modifyComplete(sgId);      // 스터디 모집완료
            btnVisibleYn(true);
        } catch (err) {
            console.error(err);
        }
    });

    /**
     * 목록 버튼 클릭 -> 메인 (스터디모집글 목록) 으로 이동
     */
    document.getElementById('goList').addEventListener('click', () => {
        location.href = `/`;
    });

    /**
     * 스터디참여하기 버튼 클릭시
     */
    document.getElementById('joinBtn').addEventListener('click', () => {
        if (common.getSessionUserId()) {      // 로그인했을시
            const sMCnt = document.getElementById('sMCnt').value;
            const sgCnt = document.getElementById('sgCnt').value;
            const study = {sgId, sMCnt, sgCnt};
            createMember(study);
        } else {                // 비로그인시
            location.href = `/login`;
        }
    });

    /**
     * 북마크하기 아이콘 클릭시
     */
    document.getElementById('studyBkmN').addEventListener('click', () => {
        if (common.getSessionUserId()) {
            createStudyBkm(sgId);
        } else {
            location.href = `/login`;
        }
    });

    /**
     * 북마크취소 아이콘 클릭시
     */
    document.getElementById('studyBkmY').addEventListener('click', () => {
        modifyStudyBkm(sgId);
    });
    
    /**
     * 댓글달기 버튼 클릭시
     */
    document.getElementById('createBtn').addEventListener('click', () => {
        const srcContent = document.getElementById('srcContent').value;
        const comment = {sgId, srcContent};
    
        if (common.getSessionUserId()) {
            if (checkComment(comment)) {
                createRecruitComment(comment);
            }
        } else {
            location.href = `/login`;
        }

        document.getElementById('srcContent').value = '';
    });

    /**
     * 댓글 수정 / 삭제 버튼 클릭시
     */
    document.getElementById('commentList').addEventListener('click', (e) => {
        const targetClassName = e.target.classList;
        const commentDtlElement = e.target.closest('.commentDtl');
        const srcId = commentDtlElement ? commentDtlElement.querySelector('.srcId').value : '';
        const comment = {srcId, sgId};

        // 수정버튼 클릭시
        if (targetClassName.contains('commentModifyBtn')) {
            // 댓글 수정 폼 그리기 - 스터디모집글 상세 댓글 조회
            getRecruitComment(comment.sgId, comment.srcId);
        }

        // 수정 폼 - 수정버튼 클릭시
        if (targetClassName.contains('modifyBtn')) {
            const modifySrcContent = commentDtlElement.querySelector('.modifySrcContent').value;
            comment.srcContent = modifySrcContent;

            if (checkComment(comment)) {
                modifyRecruitComment(comment);
            }
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
    document.getElementById('removeCommentOkBtn').addEventListener('click', () => {
        const srcId = document.querySelector('.srcId').value;
        const comment = {srcId, sgId};
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
            document.getElementById('sgCategoryDesc').innerHTML = study.SG_CATEGORY_DESC;
            document.getElementById('srTitle').innerHTML = study.SR_TITLE;
            document.getElementById('userInfo').innerHTML = `${study.USER_NICKNAME} (${study.USER_EMAIL})`;
            document.getElementById('sbRegDate').innerHTML = study.SG_REG_DATE;
            document.getElementById('sbViews').innerHTML = study.SR_VIEWS;
            document.getElementById('srbCnt').innerHTML = study.SRB_CNT;
            document.getElementById('sMCnt').value = study.SM_CNT;
            document.getElementById('sgCnt').value = study.SG_CNT;
            document.getElementById('cnt').innerHTML = study.SM_CNT + '/' + study.SG_CNT;
            document.getElementById('srContent').innerHTML = study.SR_CONTENT;
            if (study.SG_CATEGORY !== '004') {
                document.getElementById('stNameDesc').innerHTML = common.innerStName(study.ST_NAME_DESC);
            }

            if (common.getSessionUserId()) {
                axios.get(`/manage/getMemberList/${sgId}`)
                    .then(res => {
                        const memberIdArr = res.data.map(item => String(item.USER_ID));
                        let allNoVisible;

                        if (common.getSessionUserId() === String(study.SG_REG_ID)) {  // 작성자일때 
                            allNoVisible = study.SG_OPEN_YN === 'N';
                            btnVisibleYn(allNoVisible, true);
                        } else {    // 작성자아닐때 
                            allNoVisible = memberIdArr.indexOf(common.getSessionUserId()) > -1;
                            btnVisibleYn(allNoVisible, false);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            } else {
                document.getElementById('joinBtn').classList.remove('noVisible');   // 스터디참여하기버튼 - 로그인하지 않아도 보이게
            }
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 작성자 여부, 상태여부에 따라 버튼 활성/비활성
 */
function btnVisibleYn(allNoVisible, regUserYn) {
    if (allNoVisible) {     // 모든 버튼 안보이게 (작성자 - 모집완료일시, 작성자x - 이미 참여중인 스터디일시)
        document.getElementById('joinBtn').classList.add('noVisible');              // 스터디참여하기버튼
        document.getElementById('modifyBtn').classList.add('noVisible');            // 수정버튼
        document.getElementById('completeBtn').classList.add('noVisible');          // 모집완료버튼
    } else {
        if (regUserYn) {    // 작성자일시
            document.getElementById('joinBtn').classList.add('noVisible');          // 스터디참여하기버튼
            document.getElementById('modifyBtn').classList.remove('noVisible');     // 수정버튼
            document.getElementById('completeBtn').classList.remove('noVisible');   // 모집완료버튼
        } else {        
            document.getElementById('joinBtn').classList.remove('noVisible');       // 스터디참여하기버튼
            document.getElementById('modifyBtn').classList.add('noVisible');        // 수정버튼
            document.getElementById('completeBtn').classList.add('noVisible');      // 모집완료버튼
        }
    }
}

/**
 * 스터디 멤버 생성
 */
function createMember(study) {
    axios.post(`/recruit/member`, study)
        .then(() => getRecruitDetail(study.sgId))
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 북마크 여부
 */
function getStudyBkmYn(sgId) {
    axios.get(`/user/studyBkm`)
        .then(res => {
            const bkmArr = res.data.map(item => String(item.SG_ID));

            if (bkmArr.indexOf(sgId) > -1) {
                document.getElementById('studyBkmN').classList.add('noVisible');
                document.getElementById('studyBkmY').classList.remove('noVisible');
            } else {
                document.getElementById('studyBkmY').classList.add('noVisible');
                document.getElementById('studyBkmN').classList.remove('noVisible');
            }
        })  
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 북마크 등록
 */
function createStudyBkm(sgId) {
    axios.post(`/recruit/studyBkm`, {sgId})
        .then(() => {
            getRecruitDetail(sgId);
            getStudyBkmYn(sgId);
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 북마크 취소
 */
function modifyStudyBkm(sgId) {
    axios.put(`/recruit/studyBkm`, {sgId})
        .then(() => {
            getRecruitDetail(sgId);
            getStudyBkmYn(sgId);
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

            res.data.forEach(item => {
                innerHtml += `
                    <blockquote class="commentDtl">
                        <input type="hidden" class="srcId" value="${item.SRC_ID}">
                        <p class="blockquote-nk marginBottom0">
                            ${item.USER_NICKNAME} (${item.SRC_REG_DATE})&nbsp;&nbsp;
                            <span class="modifyRemoveBtnBox ${common.getSessionUserId() === String(item.SRC_REG_ID) ? '' : 'noVisible'}">
                                <button class="btn btn-default btn-icon-notika waves-effect btn-xs commentModifyBtn">수정</button>
                                <button class="btn btn-default btn-icon-notika waves-effect btn-xs commentRemoveBtn" data-toggle="modal" data-target="#removeCommentModal">삭제</button>
                            </span> 
                            <br>
                            <span class="whiteSpace">${item.SRC_CONTENT}</span>
                        </p>
                        <div class="commentModifyForm" ${Number(srcId) === item.SRC_ID ? '' : 'style="display:none;"'}>
                            <div class="nk-int-st mg-b-15">
                                <textarea class="form-control modifySrcContent" rows="5" placeholder="내용을 입력해 주세요.">${item.SRC_CONTENT}</textarea>
                            </div>
                            <div class="modifyValidate">
                            </div>
                            <div class="commentModifyBtnDiv">
                                <button class="btn btn-default btn-icon-notika waves-effect modifyCancleBtn">취소</button>
                                <button class="btn btn-default btn-icon-notika waves-effect modifyBtn"><i class="notika-icon notika-checked"></i> 수정</button>
                            </div>
                        </div>
                    </blockquote>
                `;
            });

            document.getElementById('commentList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 댓글 유효성 검사
 */
function checkComment(comment) {
    let result = false;

    if (comment.srcId) {        // 수정일때
        if (common.isEmpty(comment.srcContent)) {
            const srcIdList = document.querySelectorAll('.srcId');

            srcIdList.forEach(item => {
                if (item.value === comment.srcId) {
                    item.closest('.commentDtl').querySelector('.modifyValidate').innerHTML = common.validateEm('내용을 입력해 주세요.');
                    return result;
                }
            });
        } else {
            document.getElementById('createValidate').innerHTML = ``;
            document.querySelectorAll('.modifyValidate').forEach(item => {  
                item.innerHTML = '';
            });
            
            return true;
        }

    } else {                    // 등록일때
        if (common.isEmpty(comment.srcContent)) {
            document.getElementById('createValidate').innerHTML = common.validateEm('내용을 입력해 주세요.');
            return result;
        } else {
            document.getElementById('createValidate').innerHTML = ``;
            return true;
        }
    }
}

/**
 * 스터디모집글 댓글 등록
 */
function createRecruitComment(comment) {
    axios.post('/recruit/comment', comment)
        .then(() => getRecruitComment(comment.sgId))
        .catch(err => {
            console.error(err);
        });
};

/**
 * 스터디모집글 댓글 수정
 */
function modifyRecruitComment(comment) {
    axios.put('/recruit/comment', comment)
        .then(() => getRecruitComment(comment.sgId))
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디모집글 댓글 삭제
 */
function removeRecruitComment(comment) {
    axios.delete(`/recruit/comment/${comment.srcId}`)
        .then(() => getRecruitComment(comment.sgId))
        .catch(err => {
            console.error(err);
        });
}
