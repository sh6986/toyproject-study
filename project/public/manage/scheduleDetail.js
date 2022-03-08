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
