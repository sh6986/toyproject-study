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
    
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const mode = document.getElementById('mode').value;
    const sgId = document.getElementById('sgId').value;
    let schedule = {};

    // 대시보드 제목
    common.dashBoardTitle(sgId);

    if (mode == 'create') {     // 생성일때
        /**
         * 만들기 버튼 클릭시
         */
        document.getElementById('createBtn').addEventListener('click', (e) => {
            schedule = getValue();
            if (checkSchedule(schedule)) {
                createSchedule(schedule);
            }
        });
        
    } else {                    // 수정일때
        /**
         * 수정하기 버튼 클릭시
         */
        document.getElementById('updateBtn').addEventListener('click', (e) => {
            schedule = getValue();
            schedule.ssId = document.getElementById('ssId').value;
            if (checkSchedule(schedule)) {
                modifySchedule(schedule);
            }
        });
    }

    /**
     * 취소버튼 클릭시 -> 생성 - 리스트로 이동, 수정 - 해당글 상세로 이동
     */
    document.getElementById('cancelBtn').addEventListener('click', () => {
        location.href = mode === 'create' ? `/scheduleList/${sgId}` : `/schedule/detail/${sgId}/${ssId}`;
    });
}

/**
 * 각 입력값 가져오기
 */
function getValue() {
    const sgId = document.getElementById('sgId').value;
    const ssTopic = document.getElementById('ssTopic').value;           // 주제
    const ssContent = document.getElementById('ssContent').value;       // 내용
    const ssPlace = document.getElementById('ssPlace').value;           // 장소
    const ssTime = document.getElementById('ssTime').value;             // 시간(소요시간)
    let ssDate = document.querySelectorAll('.ssDate');                  // 날짜, 오전/오후, 시간
    const dateArr = ssDate[0].value.split('/');
    const hour = ssDate[2].value === 'AM' ? ssDate[4].value : Number(ssDate[4].value) + 12;
    
    ssDate = new Date(dateArr[2], dateArr[0] - 1, dateArr[1], hour);
    ssDate = `${ssDate.getFullYear()}-${ssDate.getMonth() + 1}-${ssDate.getDate()} ${ssDate.getHours().length === 1 ? ('0' + ssDate.getHours()) : ssDate.getHours()}:00:00`;
    
    const schedule = {sgId, ssTopic, ssContent, ssPlace, ssDate, ssTime};

    return schedule;
}

/**
 * 유효성 검사
 */
function checkSchedule(schedule) {
    const result = false;

    // 입력하지 않은 값이 있을때
    for (let k of Object.keys(schedule)) {
        if (common.isEmpty(schedule[k])) {
            document.getElementById('validate').innerHTML = common.validateEm('빈칸 없이 입력해 주세요.');
            return result;
        }
    }

    return true;
}

/**
 * 일정 등록
 */
function createSchedule(schedule) {
    axios.post(`/manage/schedule`, schedule)
        .then(res => {
            location.href = `/schedule/detail/${schedule.sgId}/${res.data.ssId}`;
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 일정 수정
 */
function modifySchedule(schedule) {
    axios.put(`/manage/schedule`, schedule)
        .then(res => {
            location.href = `/schedule/detail/${schedule.sgId}/${schedule.ssId}`;
        })
        .catch(err => {
            console.error(err);
        });
}