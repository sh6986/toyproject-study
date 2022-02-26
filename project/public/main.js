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
    /**
     * 스터디모집글 조회
     */
    axios.get('/recruit')
        .then(res => {
            
            let study = res.data;
            let innerHtml = ``;

            study.forEach((item, index, arr) => {

                if ((index === 0) || (index === 4)) {
                    innerHtml += `
                        <div class="contact-info-area mg-t-30">
                            <div class="container">
                                <div class="row">
                    `;
                }

                innerHtml += `
                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 recruitBox" data-sgId="${item.SG_ID}">
                        <div class="contact-inner">
                            <div class="contact-hd widget-ctn-hd">
                                <h2>${item.SR_TITLE}</h2>
                                <p>${item.ST_NAME}</p>
                            </div>
                        </div>
                    </div>
                `;

                if ((index === (study.length - 1)) || (index === 3)) {
                    innerHtml += `
                                </div>
                            </div>
                        </div>
                    `;
                }
            });
            document.getElementById('studyList').innerHTML = innerHtml;
        })
        .catch(err => {
            console.error(err);
        });
}


/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 스터디모집글 상세페이지로 이동
     */
    document.getElementById('studyList').addEventListener('click', (e) => {
        const sgId = e.target.closest('.recruitBox').getAttribute('data-sgId');
        location.href = `/detail/${sgId}`;
    });
}


// /**
//  * context path 구하기
//  */
//  function getContextPath() {
//     const hostIndex = location.href.indexOf(location.host) + location.host.length;
//     const contextPath = location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));

//     console.log(contextPath);
    
//     return contextPath;
// }


    