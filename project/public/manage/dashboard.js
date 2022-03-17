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
    getDetail(sgId);

    // 최근 일정1건 조회
    getScheduleNewOne(sgId);

    // 게시판 목록 조회
    getDashBordBoardList(sgId);

    // 팀원 목록 조회
    getMemberList(sgId);

    // 대시보드 제목
    common.dashBoardTitle(sgId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

    /**
     * 스터디 탈퇴 확인 모달 - 확인 버튼 클릭시
     */
    document.getElementById('scsnOkBtn').addEventListener('click', (e) => {
        removeStudyMember(sgId);
    }); 

    /**
     * 스터디 폐쇄 확인 모달 - 확인 버튼 클릭시
     */
    document.getElementById('closeOkBtn').addEventListener('click', (e) => {
        removeSchedule(sgId);
    }); 

    /**
     * 스터디 규칙 - 등록 버튼 클릭시
     */
    document.getElementById('createRuleBtn').addEventListener('click', (e) => {
        ruleYn(null, true);
    });

    /**
     * 스터디 규칙 - 수정 버튼 클릭시
     */
    document.getElementById('modifyRuleBtn').addEventListener('click', (e) => {
        const sgRule = document.getElementById('ruleContent').innerHTML;
        ruleYn(sgRule, true);
    });

    /**
     * 스터디 규칙 등록 / 수정 - 확인 버튼 클릭시
     */
    document.getElementById('confirmBtn').addEventListener('click', (e) => {
        const sgRule = document.getElementById('ruleText').value;
        const study = {sgId, sgRule};
        modifyStudyRule(study);
    });

    /**
     * 스터디 규칙 등록 / 수정 - 취소 버튼 클릭시
     */
    document.getElementById('cancelBtn').addEventListener('click', (e) => {
        getDetail(sgId);
    });

    /**
     * 스터디 규칙 삭제확인 모달 - 확인 버튼 클릭시
     */
    document.getElementById('removeRuleOkBtn').addEventListener('click', (e) => {
        const study = {sgId, sgRule: null};
        modifyStudyRule(study);
    });

    /**
     * 일정 클릭시
     */
    document.getElementById('scheduleDetail').addEventListener('click', (e) => {
        const ssId = document.getElementById('ssId').value;
        location.href = `/schedule/detail/${sgId}/${ssId}`;
    });

    /**
     * 일정 - 일정만들기 버튼 클릭시
     */
     document.getElementById('createScheduleBtn').addEventListener('click', (e) => {
        const sgId = document.getElementById('sgId').value;
        location.href = `/schedule/create/${sgId}`;
    });

    /**
     * 일정 - 모든일정보기
     */
    document.getElementById('scheduleList').addEventListener('click', (e) => {
        location.href = `/scheduleList/${sgId}`;
    });

    /**
     * 일정 - 참석 버튼 클릭시
     */
    document.getElementById('attendBtn').addEventListener('click', (e) => {
        createScheduleAtndn('001', sgId);
    });

    /**
     * 일정 - 불참 버튼 클릭시
     */
    document.getElementById('absenceBtn').addEventListener('click', (e) => {
        createScheduleAtndn('002', sgId);
    });

    /**
     * 일정 - 지각 버튼 클릭시
     */
    document.getElementById('beingLateBtn').addEventListener('click', (e) => {
        createScheduleAtndn('003', sgId);
    });

    /**
     * 일정 - 다시투표하기
     */
    document.getElementById('reVoteBtn').addEventListener('click', (e) => {
        common.voteYn(false);
    }); 

    /**
     * 게시판 - 더보기 버튼 클릭시 -> 게시판목록으로 이동
     */
    document.getElementById('boardListBtn').addEventListener('click', (e) => {
        location.href = `/boardList/${sgId}`;
    });

    /**
     * 팀원 목록 - 팀원 상세 버튼 클릭시
     */
    document.getElementById('memberListBtn').addEventListener('click', (e) => {
        location.href = `/memberList/${sgId}`;
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

/**
 * 스터디모집글 상세 조회
 */
function getDetail(sgId) {
    axios.get(`/recruit/detail/${sgId}`)
        .then(res => {
            const study = res.data;
            
            if (common.getSessionUserId() === String(study.LEAD_USER_ID)) {    // 현재 사용자가 팀장일때
                if (study.SG_RULE) {        // 규칙 수정
                    ruleYn(study.SG_RULE);
                } else {                    // 규칙 등록
                    ruleYn();
                }

                document.getElementById('closeBtn').classList.remove('noVisible');   // 스터디 폐쇄하기 버튼
            } else {
                document.getElementById('scsnBtn').classList.remove('noVisible');   // 스터디 탈퇴하기 버튼
                document.getElementById('ruleContent').innerHTML = study.SG_RULE;   // 규칙 값 넣어주기
            }
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 규칙 등록 여부에 따라 요소 활성/비활성
 */
// [TODO] DIV 사용해서 묶어가지고 리팩토링 해보기
function ruleYn(sgRule, inputYn) {
    if (inputYn) {      // 입력 폼 일때
        document.getElementById('createRuleBtn').classList.add('noVisible');            // 등록 버튼
        document.getElementById('modifyRuleBtn').classList.add('noVisible');            // 수정 버튼
        document.getElementById('removeRuleBtn').classList.add('noVisible');            // 삭제 버튼
        document.getElementById('ruleText').value = sgRule;                             // 입력창 규칙 값 넣어주기, 등록 시에는 빈칸
        document.getElementById('ruleText').classList.remove('noVisible');              // 입력창 ruleText
        document.getElementById('ruleContent').classList.add('noVisible');              // 규칙 조회 ruleContent
        document.getElementById('confirmBtn').classList.remove('noVisible');            // 입력창 - 확인 버튼
        document.getElementById('cancelBtn').classList.remove('noVisible');             // 입력창 - 취소 버튼

    } else {            // 규칙 조회 창 일때(입력 폼 아닐때)
        document.getElementById('ruleText').classList.add('noVisible');                 // 입력창 ruleText
        document.getElementById('confirmBtn').classList.add('noVisible');               // 입력창 - 확인 버튼
        document.getElementById('cancelBtn').classList.add('noVisible');                // 입력창 - 취소 버튼

        if (sgRule) {   // 이미 등록 한 규칙 존재할때
            document.getElementById('createRuleBtn').classList.add('noVisible');        // 등록 버튼
            document.getElementById('modifyRuleBtn').classList.remove('noVisible');     // 수정 버튼
            document.getElementById('removeRuleBtn').classList.remove('noVisible');     // 삭제 버튼
            document.getElementById('ruleContent').innerHTML = sgRule;                  // 규칙 값 넣어주기
            document.getElementById('ruleContent').classList.remove('noVisible');       // 규칙 조회 ruleContent

        } else {        // 첫 규칙 등록일때
            document.getElementById('createRuleBtn').classList.remove('noVisible');     // 등록 버튼
            document.getElementById('modifyRuleBtn').classList.add('noVisible');        // 수정 버튼
            document.getElementById('removeRuleBtn').classList.add('noVisible');        // 삭제 버튼
            document.getElementById('ruleContent').classList.add('noVisible');          // 규칙 조회 ruleContent
        }
    }
}

/**
 * 스터디 규칙 등록 / 수정
 */
function modifyStudyRule(study) {
    axios.put(`/manage/studyRule`, study)
        .then(res => {
            getDetail(study.sgId);
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 최근 일정1건 조회
 */
// [TODO] axios 2번이상 부를때 결과값 변수 둘다 res로 받음.. 수정필요
function getScheduleNewOne(sgId) {
    axios.get(`/manage/scheduleList/${sgId}`)
        .then(res => {
            const schedule = res.data[0];

            if (!schedule) {     // 최근일정 없을시
                document.getElementById('scheduleN').classList.remove('noVisible');
                document.getElementById('scheduleY').classList.add('noVisible');
            } else {
                document.getElementById('ssId').value = schedule.SS_ID;
                document.getElementById('scheduleDiv').innerHTML = common.gridSchedule(schedule);

                // 현재 진행중인 투표인지 아닌지 여부 검사
                const today = new Date();
                const dateArr = schedule.SS_DATE.split('-');
                const ssDate = new Date(dateArr[0], Number(dateArr[1]) - 1, dateArr[2], schedule.SS_DATE_HOUR);
                schedule.ssDate = ssDate;

                if (today < ssDate) {       // 현재 투표진행중 일정
                    // [TODO] async await 적용
                    // 일정 투표 여부 조회
                    axios.get(`/manage/scheduleAtndn/${schedule.SS_ID}`)
                        .then(res => {
                            res.data.forEach((item, index) => {
                                if (common.getSessionUserId() === String(item.USER_ID)) {
                                    if (item.SSA_STATUS) {  // 이미 한 투표일때
                                        common.voteYn(true, item.SSA_ID, item.CC_DESC);
                                    } else {                // 투표 안했을시
                                        common.voteYn(false);
                                    }
                                }
                            });
                        })
                        .catch(err => {
                            console.error(err);
                        });
                }

                document.getElementById('scheduleN').classList.add('noVisible');
                document.getElementById('scheduleY').classList.remove('noVisible');
            }
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 게시판 목록 조회
 */
function getDashBordBoardList(sgId) {
    axios.get(`/manage/dashBoard/boardList/${sgId}`)
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index) => {
                innerHtml += `
                    <tr>
                        <td style="padding: 10px 10px;">${item.SB_NOTICE_YN}</td>
                        <td style="padding: 10px 5px;">1</td>
                        <td class="text-left" style="padding: 10px 20px;">
                            <a href="/board/detail/${item.SG_ID}/${item.SB_ID}">${item.SB_TITLE}</a>
                        </td>
                        <td style="padding: 10px 20px;">${item.USER_NICKNAME}</td>
                    </tr>
                `;
            });

            document.getElementById('boardList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 팀원 목록 조회
 */
function getMemberList(sgId) {
    axios.get(`/manage/getMemberList/${sgId}`)
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index, arr) => {
                innerHtml += `
                    <p>[${item.SM_AUTH_DESC}] ${item.USER_NICKNAME}</p>
                `;
            });

            document.getElementById('memberList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 출결 투표 등록 / 수정
 */
function createScheduleAtndn(ssaStatus, sgId) {
    const scheduleAtndn = {
        ssId: document.getElementById('ssId').value,
        ssaStatus: ssaStatus
    };
    const ssaId = document.getElementById('ssaId').value;

    if (ssaId) {        // 수정
        scheduleAtndn.ssaId = ssaId;
        axios.put(`/manage/scheduleAtndn`, scheduleAtndn)
            .then(res => {
                getScheduleNewOne(sgId);
            })
            .catch(err => {
                console.error(err);
            });

    } else {            // 등록
        axios.post(`/manage/scheduleAtndn`, scheduleAtndn)
            .then(res => {
                getScheduleNewOne(sgId);
            })
            .catch(err => {
                console.error(err);
            });
    }
}

