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

    // 일정 상세 조회
    getScheduleDetail(ssId);

    // 일정 출결 상세 조회
    getScheduleAtndn(ssId);
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
}

/**
 * 세션에 저장된 사용자ID 가져오기
 */
 function getSessionUserId() {
    const sessionUserId = document.getElementById('sessionUserId').value;
    return sessionUserId;
}

/**
 * 일정 상세 조회
 */
function getScheduleDetail(ssId) {
    axios.get(`/manage/schedule/${ssId}`)
        .then(res => {
            const schedule = res.data;
            const hour = `${Number(schedule.SS_DATE_HOUR) < 12 ? '오전' : '오후'}${schedule.SS_DATE_HOUR}시 ~ ${Number(schedule.SS_END_DATE_HOUR) < 12 ? '오전' : '오후'}${schedule.SS_END_DATE_HOUR}시`
            
            document.getElementById('ssTopic').innerHTML = schedule.SS_TOPIC;
            document.getElementById('ssContent').innerHTML = '내용 : ' + schedule.SS_CONTENT;
            document.getElementById('ssPlace').innerHTML = '장소 : ' + schedule.SS_PLACE;
            document.getElementById('ssDate').innerHTML = '날짜 : ' + schedule.SS_DATE;
            document.getElementById('ssDateTime').innerHTML = '시간 : ' + hour;

            // 수정, 모집완료 버튼 - 작성자만 보이게
            if (getSessionUserId() === String(schedule.SS_REG_ID)) {
                document.getElementById('modifyBtn').classList.remove('noVisible');
                document.getElementById('removeBtn').classList.remove('noVisible');
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

            document.getElementById('attend').innerHTML = '참석 : ' + attendArr.join(', ');
            document.getElementById('absence').innerHTML = '블참 : ' + absenceArr.join(', ');
            document.getElementById('beingLate').innerHTML = '지각 : ' + beingLateArr.join(', ');
            document.getElementById('noVote').innerHTML = '미투표 : ' + noVoteArr.join(', ');
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
