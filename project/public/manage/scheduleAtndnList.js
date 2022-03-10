window.onload = () => {
    //
    initPage();

    //
    setEventListener();
}

/**
 * 
 */
function initPage() {
    const sgId = document.getElementById('sgId').value;
    
    // 일정 출결 목록 조회
    getScheduleAtndnList(sgId);
}

/**
 * 
 */
function setEventListener() {

}

/**
 * 일정 출결 목록 조회
 */
function getScheduleAtndnList(sgId) {
    axios.get(`/manage/getScheduleAtndnList/${sgId}`)
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index) => {
                innerHtml += `
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <div class="nk-int-mk sl-dp-mn">
                                <h2>${item.USER_NICKNAME}</h2>
                                <p>참석 : ${item.ATTEND}</p>
                                <p>불참 : ${item.ABSENCE}</p>
                                <p>지각 : ${item.BEINGLATE}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            document.getElementById('atndnList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}