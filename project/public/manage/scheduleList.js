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

    // 일정 목록 조회
    getScheduleList(sgId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    document.getElementById('scheduleList').addEventListener('click', (e) => {
        const sgId = document.getElementById('sgId').value;
        const ssId = e.target.closest('.scheduleDiv').querySelector('.ssId').value;
        location.href = `/schedule/detail/${sgId}/${ssId}`;
    });
}

/**
 * 일정 목록 조회
 */
function getScheduleList(sgId) {
    axios.get(`/manage/scheduleList/${sgId}`)
        .then(res => {
            const today = new Date();
            const curScheduleArr = [];
            const lashScheduleArr = [];

            res.data.forEach((item, index) => {
                const dateArr = item.SS_DATE.split('-');
                const ssDate = new Date(dateArr[0], Number(dateArr[1]) - 1, dateArr[2], item.SS_DATE_HOUR);
                item.ssDate = ssDate;

                if (today < ssDate) {       // 현재 투표진행중 일정
                    curScheduleArr.push(item);
                } else {                    // 지난 일정                    
                    lashScheduleArr.push(item);
                }
            });

            document.getElementById('curScheduleList').innerHTML = setGrid(curScheduleArr);
            document.getElementById('lashScheduleList').innerHTML = setGrid(lashScheduleArr);
        })
        .catch(err => {
            console.error(err);
        });
}

/**
 * 목록 그리기
 */
function setGrid(arr) {
    let innerHtml = ``;
    const btnElement = `
        <button class="btn btn-success notika-btn-success waves-effect">참석</button>
        <button class="btn btn-success notika-btn-success waves-effect">불참</button>
        <button class="btn btn-success notika-btn-success waves-effect">지각</button>
    `;

    arr.forEach((item, index) => {
        if ((index === 0) || ((index % 4) === 0)) {
            innerHtml += `
                <div class="contact-info-area mg-t-30">
                    <div class="container">
                        <div class="row">
            `;
        }

        innerHtml += `
            <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12 dbContent scheduleDiv">
                <input type="hidden" class="ssId" value="${item.SS_ID}">
                <div class="contact-inner dbContent">
                    <div class="contact-hd widget-ctn-hd">
                        <p>주제 : ${item.SS_TOPIC}</p>
                        <p>장소 : ${item.SS_PLACE}</p>
                        <p>날짜 : ${item.SS_DATE}</p>
                        <p>시간 : ${Number(item.SS_DATE_HOUR) < 12 ? '오전' : '오후'}${item.SS_DATE_HOUR}시 ~ ${Number(item.SS_END_DATE_HOUR) < 12 ? '오전' : '오후'}${item.SS_END_DATE_HOUR}시</p>
                        ${new Date() < item.ssDate ? btnElement : ''}
                    </div>
                </div>
            </div>
        `;
        
        if (index === (arr.length - 1) || ((index !== 0) && (index % 3) === 0)) {
            innerHtml += `
                        </div>
                    </div>
                </div>
            `;
        }
    });

    return innerHtml;
}