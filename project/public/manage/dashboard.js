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

    // 스터디모집글 상세 조회
    getDetail(sgId);

    // 최근 일정1건 조회
    getScheduleNewOne(sgId);

    // 게시판 목록 조회
    getDashBordBoardList(sgId);

    // 팀원 목록 조회
    getMemberList(sgId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

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
    document.getElementById('attendBtn').addEventListener('click', async () => {
        try {
            await common.createScheduleAtndn('001', sgId);
        } catch (err) {
            console.error(err);
        }
    });

    /**
     * 일정 - 불참 버튼 클릭시
     */
    document.getElementById('absenceBtn').addEventListener('click', async () => {
        try {
            await common.createScheduleAtndn('002', sgId);
        } catch (err) {
            console.error(err);
        }
    });

    /**
     * 일정 - 지각 버튼 클릭시
     */
    document.getElementById('beingLateBtn').addEventListener('click', async () => {
        try {
            await common.createScheduleAtndn('003', sgId);
        } catch (err) {
            console.error(err);
        }
    });

    /**
     * 일정 - 다시투표하기
     */
    document.getElementById('reVoteBtn').addEventListener('click', (e) => {
        common.voteYnBtn(false);
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
 * 스터디모집글 상세 조회
 */
function getDetail(sgId) {
    axios.get(`/recruit/detail/${sgId}`)
        .then(res => {
            const study = res.data;
            
            if (common.getSessionUserId() === String(study.LEAD_USER_ID)) {    // 현재 사용자가 팀장일때
                study.SG_RULE ? ruleYn(study.SG_RULE) : ruleYn();
            } else {
                if (study.SG_RULE) {
                    ruleYn(study.SG_RULE);
                    document.getElementById('modifyRuleBtn').classList.add('noVisible');
                    document.getElementById('removeRuleBtn').classList.add('noVisible');
                    document.getElementById('ruleTitle').classList.remove('floatLeft');
                }
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
        document.getElementById('ruleText').value = sgRule;                   // 입력창 규칙 값 넣어주기, 등록 시에는 빈칸
        document.getElementById('ruleY').classList.add('noVisible');
        document.getElementById('ruleN').classList.add('noVisible');
        document.getElementById('createRule').classList.remove('noVisible');
    } else {            // 규칙 조회 창 일때(입력 폼 아닐때)
        if (sgRule) {   // 규칙있을시
            document.getElementById('ruleContent').innerHTML = sgRule;         // 규칙 값 넣어주기
            document.getElementById('ruleY').classList.add('noVisible');
            document.getElementById('ruleN').classList.remove('noVisible');
            document.getElementById('createRule').classList.add('noVisible');
        } else {        // 규칙없을시
            document.getElementById('ruleY').classList.remove('noVisible');
            document.getElementById('ruleN').classList.add('noVisible');
            document.getElementById('createRule').classList.add('noVisible');
        }
    }
}

/**
 * 스터디 규칙 등록 / 수정
 */
function modifyStudyRule(study) {
    axios.put(`/manage/studyRule`, study)
        .then(() => {
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
        .then(async (res) => {
            const schedule = res.data[0];

            if (!schedule) {     // 최근일정 없을시
                document.getElementById('scheduleN').classList.remove('noVisible');
                document.getElementById('scheduleY').classList.add('noVisible');
            } else {
                document.getElementById('ssId').value = schedule.SS_ID;
                document.getElementById('scheduleDiv').innerHTML = common.gridSchedule(schedule);
                
                try {
                    // 일정 출결 상세 조회
                    const atndnList = await common.getScheduleAtndn(schedule.SS_ID);  

                    if (common.currentVoteYn(schedule)) {           // 현재 투표진행중 일정
                        // 투표했는지 여부에 따라 버튼 핸들링
                        const atndn = common.voteYn(atndnList);
                        atndn ? common.voteYnBtn(true, atndn.SSA_ID, atndn.CC_DESC) : common.voteYnBtn(false);
                    } else {                                        // 이미 지난 일정일때
                        document.getElementById('voteN').classList.add('noVisible');
                        document.getElementById('voteY').classList.add('noVisible');
                        document.getElementById('pastVote').classList.remove('noVisible');
                    } 
                } catch (err) {
                    console.error(err);
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

            res.data.forEach((item) => {
                innerHtml += `
                    <tr>
                        <td style="padding: 10px 5px;">${item.ROWNUM}</td>
                        <td style="padding: 10px 10px;">${item.SB_NOTICE_YN === 'Y' ? `<span class="label label-warning">공지</span>` : ''}</td>
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
            let innerLeader = ``;
            let innerMember = ``;

            res.data.forEach(item => {
                if (item.SM_AUTH === '001') {       // 팀장
                    innerLeader += `<span class="stNameStyle">${item.USER_NICKNAME}</span>`;
                } else {                            // 팀원
                    innerMember += `<span class="stNameStyle">${item.USER_NICKNAME}</span>`;
                }
            });

            document.getElementById('leaderNick').innerHTML = innerLeader;
            document.getElementById('memberNick').innerHTML = innerMember;
        })
        .catch(err => {
            console.error(err);
        });
}

