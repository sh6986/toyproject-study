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

    // 대시보드 제목
    common.dashBoardTitle(sgId);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    const sgId = document.getElementById('sgId').value;

    /**
     * 대시보드 버튼 클릭 -> 대시보드로 이동
     */
     document.getElementById('goDashBoard').addEventListener('click', () => {
        location.href = `/dashboard/${sgId}`;
    });

    /**
     * 일정 - 일정만들기 버튼 클릭시
     */
    document.getElementById('createScheduleBtn').addEventListener('click', (e) => {
        location.href = `/schedule/create/${sgId}`;
    });

    /**
     * 일정클릭시 - 일정상세로 이동
     */
    document.getElementById('scheduleList').addEventListener('click', (e) => {
        if (e.target.closest('.scheduleDiv')) {
            const ssId = e.target.closest('.scheduleDiv').querySelector('.ssId').value;
            location.href = `/schedule/detail/${sgId}/${ssId}`; 
        }
    });
}

/**
 * 일정 목록 조회
 */
function getScheduleList(sgId) {
    axios.get(`/manage/scheduleList/${sgId}`)
        .then(res => {
            const scheduleList = res.data;
            const today = new Date();
            let innerHtml = ``;

            scheduleList.forEach((item, index) => {
                const dateArr = item.SS_DATE.split('-');
                const ssDate = new Date(dateArr[0], Number(dateArr[1]) - 1, dateArr[2], item.SS_DATE_HOUR);
                item.ssDate = ssDate;

                if ((index === 0) || ((index % 4) === 0)) {
                    innerHtml += `
                        <div class="contact-info-area mg-t-15">
                            <div class="container">
                                <div class="row">
                    `;
                }
            
                innerHtml += ` 
                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 mg-t-15">
                        <div class="contact-inner radiusDiv scheduleDiv ${today < ssDate ? 'hover-color' : 'closed'}">
                            <input type="hidden" class="ssId" value="${item.SS_ID}">    
                            <div class="contact-hd widget-ctn-hd">
                                <a href="javascript:void(0);">
                                    <table id="calenderTb" class="table" style="border: none; margin-bottom: 5px; margin-top: 10px;">
                                        <tbody>
                                            <tr class="fontWeightBold">
                                                <td style="width: 20%; text-align: right;"><i class="notika-icon notika-checked"></i></td>
                                                <td style="width: 80%;">${item.SS_TOPIC}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><i class="fas fa-map-marker-alt"></i></td>
                                                <td>${item.SS_PLACE}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><i class="fas fa-calendar-check"></i></td>
                                                <td>${item.SS_DATE}</td>
                                            </tr>
                                            <tr>
                                                <td style="text-align: right;"><i class="fas fa-clock"></i></td>
                                                <td>${Number(item.SS_DATE_HOUR) < 12 ? '오전' : '오후'}${item.SS_DATE_HOUR}시 ~ ${Number(item.SS_END_DATE_HOUR) < 12 ? '오전' : '오후'}${item.SS_END_DATE_HOUR}시</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                    
                if (index === (scheduleList.length - 1) || ((index !== 0) && ((index + 1) % 4) === 0)) {
                    innerHtml += `
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            document.getElementById('scheduleList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}
