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
    const ssId = document.getElementById('ssId').value;
    const sgId = document.getElementById('sgId').value;

    // 일정 상세 조회
    getScheduleDetail(ssId);

    // 일정 출결 상세 조회
    getScheduleAtndn(ssId);

    // 대시보드 제목
    common.dashBoardTitle(sgId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const ssId = document.getElementById('ssId').value;
    const sgId = document.getElementById('sgId').value;

    /**
     * 수정 버튼 클릭시
     */
    document.getElementById('modifyBtn').addEventListener('click', (e) => {
        location.href = `/schedule/modify/${ssId}`;
    });

    /**
     * 삭제 버튼 클릭시
     */
    document.getElementById('removeOkBtn').addEventListener('click', (e) => {
        removeSchedule(ssId, sgId);
    });

    /**
     * 참석 버튼 클릭시
     */
     document.getElementById('attendBtn').addEventListener('click', (e) => {
        createScheduleAtndn('001', sgId);
    });

    /**
     * 불참 버튼 클릭시
     */
    document.getElementById('absenceBtn').addEventListener('click', (e) => {
        createScheduleAtndn('002', sgId);
    });

    /**
     * 지각 버튼 클릭시
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
     * 목록 버튼 클릭 -> 일정 목록으로 이동
     */
    document.getElementById('goList').addEventListener('click', () => {
        location.href = `/scheduleList/${sgId}`;
    });
}

/**
 * 일정 상세 조회
 */
// [TODO] axios 2번이상 부를때 결과값 변수 둘다 res로 받음.. 수정필요
function getScheduleDetail(ssId) {
    axios.get(`/manage/schedule/${ssId}`)
        .then(res => {
            const schedule = res.data;

            document.getElementById('ssTopic').innerHTML = schedule.SS_TOPIC;
            document.getElementById('ssContent').innerHTML = '내용 : ' + schedule.SS_CONTENT;
            document.getElementById('scheduleDiv').innerHTML = common.gridSchedule(schedule);


            // 현재 진행중인 투표인지 아닌지 여부 검사
            const today = new Date();
            const dateArr = schedule.SS_DATE.split('-');
            const ssDate = new Date(dateArr[0], Number(dateArr[1]) - 1, dateArr[2], schedule.SS_DATE_HOUR);
            schedule.ssDate = ssDate;

            if (today < ssDate) {       // 현재 투표진행중 일정
                // 수정, 삭제 버튼 - 작성자만 보이게
                if (common.getSessionUserId() === String(schedule.SS_REG_ID)) {
                    document.getElementById('modifyBtn').classList.remove('noVisible');
                    document.getElementById('removeBtn').classList.remove('noVisible');
                } 

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
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 출결 상세 조회
 */
function getScheduleAtndn(ssId) {
    axios.get(`/manage/scheduleAtndn/${ssId}`)
        .then(res => {
            let attendArr = [];     // 참석
            let absenceArr = [];    // 불참
            let beingLateArr = [];  // 지각
            let noVoteArr = [];     // 미투표

            res.data.forEach((item, index) => {
                if (item.SSA_STATUS === '001') {
                    attendArr.push(item.USER_NICKNAME);
                } else if (item.SSA_STATUS === '002') {
                    absenceArr.push(item.USER_NICKNAME);
                } else if (item.SSA_STATUS === '003') {
                    beingLateArr.push(item.USER_NICKNAME);
                } else {
                    noVoteArr.push(item.USER_NICKNAME);
                }
            });

            document.getElementById('attend').innerHTML = attendArr.join(', ');
            document.getElementById('absence').innerHTML = absenceArr.join(', ');
            document.getElementById('beingLate').innerHTML = beingLateArr.join(', ');
            document.getElementById('noVote').innerHTML = noVoteArr.join(', ');
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 삭제
 */
function removeSchedule(ssId, sgId) {
    axios.delete(`/manage/schedule/${ssId}`)
        .then(res => {
            location.href = `/scheduleList/${sgId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 출결 투표 등록 / 수정
 */
function createScheduleAtndn(ssaStatus, sgId) {
    const ssId = document.getElementById('ssId').value;
    const scheduleAtndn = {
        ssId,
        ssaStatus
    };
    const ssaId = document.getElementById('ssaId').value;

    if (ssaId) {        // 수정
        scheduleAtndn.ssaId = ssaId;
        axios.put(`/manage/scheduleAtndn`, scheduleAtndn)
            .then(res => {
                getScheduleDetail(ssId);
                getScheduleAtndn(ssId);
            })
            .catch(err => {
                console.error(err);
            });

    } else {            // 등록
        axios.post(`/manage/scheduleAtndn`, scheduleAtndn)
            .then(res => {
                getScheduleDetail(ssId);
                getScheduleAtndn(ssId);
            })
            .catch(err => {
                console.error(err);
            });
    }
}
