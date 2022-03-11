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

    // 팀원 목록 조회
    getStudyMember(sgId);
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
     * 일정 - 모든일정보기
     */
    document.getElementById('scheduleList').addEventListener('click', (e) => {
        location.href = `/scheduleList/${sgId}`;
    });

    /**
     * 일정 - 일정만들기 버튼 클릭시
     */
    document.getElementById('createScheduleBtn').addEventListener('click', (e) => {
        location.href = `/schedule/create/${sgId}`;
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
        voteYn(false);
    }); 

    /**
     * 게시판 - 더보기 버튼 클릭시 -> 게시판목록으로 이동
     */
    document.getElementById('boardListBtn').addEventListener('click', (e) => {
        location.href = `/boardList/${sgId}`;
    });

    /**
     * 팀원목록 - 출결현황 버튼 클릭시
     */
    document.getElementById('scheduleAtndnList').addEventListener('click', () => {
        location.href = `/scheduleAtndnList/${sgId}`;
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
 * 스터디모집글 상세 조회
 */
function getDetail(sgId) {
    axios.get(`/recruit/detail/${sgId}`)
        .then(res => {
            const study = res.data;
            document.getElementById('sgName').innerHTML = study.SG_NAME;        // 스터디명

            if (getSessionUserId() === String(study.LEAD_USER_ID)) {    // 현재 사용자가 팀장일때
                if (study.SG_RULE) {        // 규칙 수정
                    ruleYn(study.SG_RULE);
                } else {                    // 규칙 등록
                    ruleYn();
                }
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
function getScheduleNewOne(sgId) {
    axios.get(`/manage/scheduleList/${sgId}`)
        .then(res => {
            const schedule = res.data[0];
            const hour = `${Number(schedule.SS_DATE_HOUR) < 12 ? '오전' : '오후'}${schedule.SS_DATE_HOUR}시 ~ ${Number(schedule.SS_END_DATE_HOUR) < 12 ? '오전' : '오후'}${schedule.SS_END_DATE_HOUR}시`;

            document.getElementById('ssId').value = schedule.SS_ID;
            document.getElementById('ssTopic').innerHTML = '주제 : ' + schedule.SS_TOPIC;
            document.getElementById('ssPlace').innerHTML = '장소 : ' + schedule.SS_PLACE;
            document.getElementById('ssDate').innerHTML = '날짜 : ' + schedule.SS_DATE;
            document.getElementById('ssDateTime').innerHTML = '시간 : ' + hour;

            
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
                            if (getSessionUserId() === String(item.USER_ID)) {
                                if (item.SSA_STATUS) {  // 이미 한 투표일때
                                    voteYn(true, item.SSA_ID, item.CC_DESC);
                                } else {                // 투표 안했을시
                                    voteYn(false);
                                }
                            }
                        });
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 투표 여부
 */
 function voteYn(voteYn, ssaId, voteResult) {
    if (voteYn) {   // 이미 투표 했을시
        document.getElementById('attendBtn').classList.add('noVisible');
        document.getElementById('absenceBtn').classList.add('noVisible');
        document.getElementById('beingLateBtn').classList.add('noVisible');

        document.getElementById('ssaId').value = ssaId;
        document.getElementById('voteResult').innerHTML = '[' + voteResult + ' 예정]';
        document.getElementById('voteResult').classList.remove('noVisible');
        document.getElementById('reVoteBtn').classList.remove('noVisible');
    } else  {   // 아직 안했을시, 다시투표하기일시
        document.getElementById('attendBtn').classList.remove('noVisible');
        document.getElementById('absenceBtn').classList.remove('noVisible');
        document.getElementById('beingLateBtn').classList.remove('noVisible');

        document.getElementById('voteResult').classList.add('noVisible');
        document.getElementById('reVoteBtn').classList.add('noVisible');
    }
}

/**
 * 팀원 목록 조회
 */
function getStudyMember(sgId) {
    axios.get(`/manage/member/${sgId}`)
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index, arr) => {
                innerHtml += `
                    <p>[${item.CC_DESC}] ${item.USER_NICKNAME}</p>
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

