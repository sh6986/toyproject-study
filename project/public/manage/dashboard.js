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
        createScheduleAtndn('001');
    });

    /**
     * 일정 - 불참 버튼 클릭시
     */
    document.getElementById('absenceBtn').addEventListener('click', (e) => {
        createScheduleAtndn('002');
    });

    /**
     * 일정 - 지각 버튼 클릭시
     */
    document.getElementById('beingLateBtn').addEventListener('click', (e) => {
        createScheduleAtndn('003');
    });

    /**
     * 게시판 - 더보기 버튼 클릭시 -> 게시판목록으로 이동
     */
    document.getElementById('boardListBtn').addEventListener('click', (e) => {
        location.href = `/boardList/${sgId}`;
    });
}

/**
 * 스터디모집글 상세 조회
 */
function getDetail(sgId) {
    axios.get(`/recruit/detail/${sgId}`)
        .then(res => {
            const study = res.data;
            document.getElementById('sgName').innerHTML = study.SG_NAME;    // 스터디명
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
        })
        .catch(err => {
            console.error(err);
        });
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
 * 일정 출결 투표 등록
 */
function createScheduleAtndn(ssaStatus) {
    const scheduleAtndn = {
        ssId: document.getElementById('ssId').value,
        ssaStatus: ssaStatus
    };

    axios.post(`/manage/scheduleAtndn`, scheduleAtndn)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.error(err);
        });
}

