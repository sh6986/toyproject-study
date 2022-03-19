window.onload = () => {
    // 화면 초기화
    initPage();

    // 이벤트 등록
    setEventListener();
};

/**
 * 화면 초기화
 */
async function initPage() {
    const ssId = document.getElementById('ssId').value;
    const sgId = document.getElementById('sgId').value;

    // 일정 상세 조회
    getScheduleDetail(ssId);

    // 일정 출결 내역
    await scheduleAtndnList(ssId);

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
    document.getElementById('modifyBtn').addEventListener('click', () => {
        location.href = `/schedule/modify/${ssId}`;
    });

    /**
     * 삭제 버튼 클릭시
     */
    document.getElementById('removeOkBtn').addEventListener('click', () => {
        removeSchedule(ssId, sgId);
    });

    /**
     * 참석 버튼 클릭시
     */
    document.getElementById('attendBtn').addEventListener('click', async () => {
        try {
            await common.createScheduleAtndn('001');
        } catch (err) {
            console.error(err);
        }
    });

    /**
     * 불참 버튼 클릭시
     */
    document.getElementById('absenceBtn').addEventListener('click', async () => {
        try {
            await common.createScheduleAtndn('002');
        } catch (err) {
            console.error(err);
        }
    });

    /**
     * 지각 버튼 클릭시
     */
    document.getElementById('beingLateBtn').addEventListener('click', async () => {
        try {
            await common.createScheduleAtndn('003');
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
     * 목록 버튼 클릭 -> 일정 목록으로 이동
     */
    document.getElementById('goList').addEventListener('click', () => {
        location.href = `/scheduleList/${sgId}`;
    });
}

/**
 * 일정 상세 조회
 */
function getScheduleDetail(ssId) {
    axios.get(`/manage/schedule/${ssId}`)
        .then(async (res) => {
            const schedule = res.data;

            document.getElementById('scheduleDiv').innerHTML = common.gridSchedule(schedule);
            document.getElementById('ssContent').innerHTML = '      ' + schedule.SS_CONTENT;

            try {
                // 일정 출결 상세 조회
                const atndnList = await common.getScheduleAtndn(schedule.SS_ID);  

                if (common.currentVoteYn(schedule)) {           // 현재 투표진행중 일정
                    // 수정, 삭제 버튼 - 작성자만 보이게
                    if (common.getSessionUserId() === String(schedule.SS_REG_ID)) {
                        document.getElementById('modifyBtn').classList.remove('noVisible');
                        document.getElementById('removeBtn').classList.remove('noVisible');
                    } 

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
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 출결 내역
 */
async function scheduleAtndnList(ssId) {
    try {
        const atndn = await common.getScheduleAtndn(ssId);
        let attendHtml = ``;     // 참석
        let absenceHtml = ``;    // 불참
        let beingLateHtml = ``;  // 지각
        let noVoteHtml = ``;     // 미정

        atndn.forEach(item => {
            if (item.SSA_STATUS === '001') {
                attendHtml += `<span class="stNameStyle">${item.USER_NICKNAME}</span>`
            } else if (item.SSA_STATUS === '002') {
                absenceHtml += `<span class="stNameStyle">${item.USER_NICKNAME}</span>`
            } else if (item.SSA_STATUS === '003') {
                beingLateHtml += `<span class="stNameStyle">${item.USER_NICKNAME}</span>`
            } else {
                noVoteHtml += `<span class="stNameStyle">${item.USER_NICKNAME}</span>`
            }
        });

        document.getElementById('attend').innerHTML = attendHtml;
        document.getElementById('absence').innerHTML = absenceHtml;
        document.getElementById('beingLate').innerHTML = beingLateHtml;
        document.getElementById('noVote').innerHTML = noVoteHtml;
    } catch (err) {
        console.error(err);
    }
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

