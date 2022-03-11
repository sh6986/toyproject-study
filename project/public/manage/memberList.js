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
}

/**
 * 세션에 저장된 사용자ID 가져오기
 */
 function getSessionUserId() {
    const sessionUserId = document.getElementById('sessionUserId').value;
    return sessionUserId;
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

                    if (getSessionUserId() === String(leadUserID)) {
                        document.getElementById('modifyLeaderBtn').classList.remove('noVisible');
                        document.getElementById('radioBtn').classList.remove('noVisible');
                    }

                    memberList.data.forEach((item, index) => {
                        innerHtml += `
                            <tr>
                                ${getSessionUserId() === String(leadUserID) ? 
                                    `<td>
                                        ${String(leadUserID) !== String(item.USER_ID) ? `<input type="radio" value="${item.USER_ID}" name="memberRadio" class="i-checks">` : ''}
                                    </td>`
                                    : ''}
                                <td>${item.USER_NICKNAME}</td>
                                <td>${item.USER_EMAIL}</td>
                                <td>${item.SM_AUTH_DESC}</td>
                                <td>${item.SM_REG_DATE}</td>
                                <td>${item.ATTEND}</td>
                                <td>${item.ABSENCE}</td>
                                <td>${item.BEINGLATE}</td>
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
