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
    // 내 북마크 목록 조회
    getMyStudyList();
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 스터디 클릭시 -> 모집글로 이동
     */
     document.getElementById('studyBkmList').addEventListener('click', (e) => {
        const sgId = e.target.closest('.studyBkmDiv').querySelector('.sgId').value;
        location.href = `/detail/${sgId}`;
    });
}

/**
 * 내 북마크 목록 조회
 */
function getMyStudyList() {
    axios.get('/user/studyBkm')
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index) => {
                if ((index === 0) || ((index % 4) === 0)) {
                    innerHtml += `
                        <div class="contact-info-area mg-t-30">
                            <div class="container">
                                <div class="row">
                    `;
                }

                innerHtml += `
                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 studyBkmDiv">
                        <input type="hidden" class="sgId" value="${item.SG_ID}">
                        <div class="contact-inner">
                            <div class="contact-hd widget-ctn-hd">
                                <h2>${item.SR_TITLE}</h2>
                                <p>${item.ST_NAME_DESC}</p>
                            </div>
                        </div>
                    </div>
                `;
                
                if (index === (res.data.length - 1) || ((index !== 0) && ((index + 1) % 4) === 0)) {
                    innerHtml += `
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            document.getElementById('studyBkmList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}