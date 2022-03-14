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
    const sgCategory = document.getElementById('sgCategory').value;
    const openYn = document.getElementById('openYn').checked;

    // 스터디모집글 조회
    getList(openYn, sgCategory);
}

/**
 * 이벤트 등록
 */
function setEventListener() {
    /**
     * 카테고리 메뉴 클릭
     */
    document.getElementById('category').addEventListener('click', (e) => {
        const sgCategory = e.target.getAttribute('data-sgCategory');
        const openYn = document.getElementById('openYn').checked;
        document.getElementById('sgCategory').value = sgCategory;

        // 스터디모집글 조회
        getList(openYn, sgCategory);
    });

    /**
     * 스터디모집글 클릭시 -> 상세페이지로 이동
     */
    document.getElementById('studyList').addEventListener('click', (e) => {
        if (e.target.closest('.recruitBox')) {
            const sgId = e.target.closest('.recruitBox').querySelector('.sgId').value;
            location.href = `/detail/${sgId}`;
        }   
    });

    /**
     * 모집중인 글만 보기 클릭시
     */
    document.getElementById('openYn').addEventListener('click', (e) => {
        const sgCategory = document.getElementById('sgCategory').value;
        const openYn = document.getElementById('openYn').checked;

        // 스터디모집글 조회
        getList(openYn, sgCategory);
    });
}

/**
 * 스터디모집글 조회
 */
function getList(openYn, sgCategory) {
    axios.get('/recruit')
        .then(res => {
            let innerHtml = ``;
            let study = res.data;

            if (openYn) {   // 모집중인 글만 보기
                study = study.filter((item, index) => {
                    return item.SG_OPEN_YN === 'Y';
                });
            }

            if (sgCategory !== 'all') {     // 전체아닌 카테고리 선택시
                study = study.filter((item, index) => {
                    return item.SG_CATEGORY === sgCategory;
                });
            }

            study.forEach((item, index, arr) => {
                if ((index === 0) || ((index % 4) === 0)) {
                    innerHtml += `
                        <div class="contact-info-area mg-t-15">
                            <div class="container">
                                <div class="row">
                    `;
                }

                innerHtml += `
                    <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12  mg-t-15">
                        <div class="contact-inner radiusDiv recruitBox ${item.SG_OPEN_YN === 'Y' ? 'hover-color' : 'closed'}">
                            <input type="hidden" class="sgId" value="${item.SG_ID}">
                            <div class="contact-hd widget-ctn-hd">
                                <a href="javascript:void(0);">
                                    <h2>${item.SR_TITLE}</h2>
                                    <p>${item.SG_NAME}</p>
                                    <p>
                                        <i class="fas fa-user-friends"></i> ${item.SM_CNT} / ${item.SG_CNT}
                                    </p>
                                    <p class="alignRight">
                                        <i class="fas fa-eye"></i> ${item.SR_VIEWS}&nbsp;&nbsp;
                                        <i class="fas fa-bookmark"></i> ${item.SRB_CNT}
                                    </p>
                                    <p>
                                        ${common.innerStName(item.ST_NAME_DESC)}
                                    </p>
                                </a>
                            </div>
                        </div>
                    </div>
                `;

                if (index === (study.length - 1) || ((index !== 0) && ((index + 1) % 4) === 0)) {
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


    