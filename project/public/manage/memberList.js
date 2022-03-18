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

    // 대시보드 제목
    common.dashBoardTitle(sgId);

    // 팀원 목록 조회
    getMemberList(sgId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

    /**
     * 팀장 변경 확인 모달 - 확인 버튼 클릭시
     */
    document.getElementById('modifyLeaderOkBtn').addEventListener('click', (e) => {
        let member = {sgId};
        const memberRadio = document.getElementsByName('memberRadio');

        memberRadio.forEach((item, index) => {
            if (item.checked) {
                member.memberId = item.value;
                modifyModifyAuth(member);
            }
        });
    });

    /**
     * 대시보드 버튼 클릭 -> 대시보드로 이동
     */
    document.getElementById('goDashBoard').addEventListener('click', () => {
        location.href = `/dashboard/${sgId}`;
    });

    /**
     * 스터디 탈퇴 확인 모달 - 확인 버튼 클릭시
     */
    document.getElementById('scsnOkBtn').addEventListener('click', () => {
        removeStudyMember(sgId);
    }); 

    /**
     * 스터디 폐쇄 확인 모달 - 확인 버튼 클릭시
     */
    document.getElementById('closeOkBtn').addEventListener('click', () => {
        removeSchedule(sgId);
    }); 
}

/**
 * 팀원 목록 조회
 */
function getMemberList(sgId) {
    axios.get(`/manage/getMemberList/${sgId}`)
        .then(memberList => {
            let innerHtml = ``;
            
            // [TODO] async await 적용
            // 스터디모집글 상세 조회
            axios.get(`/recruit/detail/${sgId}`)
                .then(study => {
                    const leadUserID = study.data.LEAD_USER_ID;   // 팀장ID

                    if (common.getSessionUserId() === String(leadUserID)) {
                        document.getElementById('modifyLeaderBtn').classList.remove('noVisible');
                        document.getElementById('radioBtn').classList.remove('noVisible');
                        document.getElementById('closeBtn').classList.remove('noVisible');   // 스터디 폐쇄하기 버튼
                    } else {
                        document.getElementById('scsnBtn').classList.remove('noVisible');    // 스터디 탈퇴하기 버튼
                    }

                    memberList.data.forEach((item, index) => {
                        innerHtml += `
                            <tr>
                                ${common.getSessionUserId() === String(leadUserID) ? 
                                    `<td>
                                        ${String(leadUserID) !== String(item.USER_ID) ? `<input type="radio" value="${item.USER_ID}" name="memberRadio" class="i-checks">` : ''}
                                    </td>`
                                    : ''}
                                <td>${item.USER_NICKNAME}</td>
                                <td>${item.USER_EMAIL}</td>
                                <td>${item.SM_AUTH_DESC}</td>
                                <td>${item.SM_REG_DATE}</td>
                                <td>${item.ATTEND}</td>
                                <td>${item.BEINGLATE}</td>
                                <td>${item.ABSENCE}</td>
                            </tr>
                        `;
                    });
        
                    document.getElementById('memberList').innerHTML = innerHtml;
                })
                .catch(err => {
                    console.error(err);
                });
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 권한 수정
 */
function modifyModifyAuth(member) {
    axios.put(`/manage/memberAuth`, member)
        .then(res => {
            location.reload();
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 멤버 삭제
 */
 function removeStudyMember(sgId) {
    axios.delete(`/manage/member/${sgId}`)
        .then(res => {
            location.href = `/myStudy`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 스터디 삭제 (폐쇄)
 */
 function removeSchedule(sgId) {
    axios.delete(`/manage/study/${sgId}`)
        .then(res => {
            location.href = `/myStudy`;
        })
        .catch(err => {
            console.error(err);
        });
}