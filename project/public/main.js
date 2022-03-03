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
    // 스터디모집글 조회
    getList();
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 스터디모집글 클릭시 -> 상세페이지로 이동
     */
    document.getElementById('studyList').addEventListener('click', (e) => {
        const sgId = e.target.closest('.recruitBox').getAttribute('data-sgId');
        location.href = `/detail/${sgId}`;
    });
}

/**
* 스터디모집글 조회
*/
function getList() {
    axios.get('/recruit')
        .then(res => {
            let innerHtml = ``;

            res.data.forEach((item, index, arr) => {
                if ((index === 0) || ((index % 4) === 0)) {
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
                                <p>${item.ST_NAME_DESC}</p>
                            </div>
                        </div>
                    </div>
                `;

                if (index === (res.data.length - 1) || ((index !== 0) && (index % 3) === 0)) {
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


// /**
//  * context path 구하기
//  */
//  function getContextPath() {
//     const hostIndex = location.href.indexOf(location.host) + location.host.length;
//     const contextPath = location.href.substring(hostIndex, location.href.indexOf('/', hostIndex + 1));

//     console.log(contextPath);
    
//     return contextPath;
// }


    