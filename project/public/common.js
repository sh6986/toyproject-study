const common = {
    /**
     * 세션에 저장된 사용자ID 가져오기
     */
    getSessionUserId: () => {
        const sessionUserId = document.getElementById('sessionUserId').value;
        return sessionUserId;
    },

    /**
     * 기술스택명 span 태그 만들기
     */
    innerStName: (stNameDesc) => {
        const stNameArr = stNameDesc.split(',');
        let innerStName = ``;

        stNameArr.forEach((stName, i) => {
            innerStName += `<span class="stNameStyle">${stName}</span>`;
        });

        return innerStName;
    },

    /**
     * 빈칸 체크
     */
    isEmpty: (value) => {
        if (value === '' || value === null || value === undefined || !value.length || ( typeof value === 'object' && !Object.keys(value).length )) {
            return true;
        }
        
        return false;
    },

    /**
     * 스터디 모집완료
     */
    modifyComplete: async (sgId) => {
        try {
            await axios.put(`/recruit/complete/${sgId}`);
        } catch (err) {
            console.error(err);
        }
    },

    /**
     * 유효성 검사 메세지
     */
    validateEm: (message) => {
        return `
            <div class="alert alert-success alert-dismissible validateEm" role="alert">
                <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true"><i class="notika-icon notika-close"></i></span></button> ${message}
            </div>
        `;
    },

    /**
     * 스터디모집글 목록 그리기
     */
    studyRecruitList: (studyList, myStudyListYn) => {
        let innerHtml = ``;

        studyList.forEach((item, index) => {
            if ((index === 0) || ((index % 4) === 0)) {
                innerHtml += `
                    <div class="contact-info-area mg-t-15">
                        <div class="container">
                            <div class="row">
                `;
            }

            innerHtml += `
                <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12 mg-t-15">
                    <div class="contact-inner radiusDiv recruitBox ${item.SG_OPEN_YN === 'Y' || myStudyListYn ? 'hover-color' : 'closed'}">
                        <input type="hidden" class="sgId" value="${item.SG_ID}">
                        <div class="contact-hd widget-ctn-hd">
                            <a href="javascript:void(0);">
                                <span class="label label-info backColorGreen">${item.SG_CATEGORY_DESC}</span>
                                <h2 class="mg-t-10">${myStudyListYn ? item.SG_NAME : item.SR_TITLE}</h2>
                                ${myStudyListYn ? `` : `
                                    <p>${item.SG_NAME}</p>
                                `}
                                <p>
                                    <i class="fas fa-user-friends" style="color:gray;"></i> ${item.SM_CNT} / ${item.SG_CNT}
                                </p>
                                ${myStudyListYn ? `` : `
                                    <p class="alignRight">
                                        <i class="fas fa-eye" style="color:gray;"></i> ${item.SR_VIEWS}&nbsp;&nbsp;
                                        <i class="fas fa-bookmark" style="color:darkgreen;"></i> ${item.SRB_CNT}
                                    </p>
                                `}
                                <p class="mg-t-10">
                                    ${item.SG_CATEGORY !== '004' ? common.innerStName(item.ST_NAME_DESC) : '&nbsp;'}
                                </p>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            if (index === (studyList.length - 1) || ((index !== 0) && ((index + 1) % 4) === 0)) {
                innerHtml += `
                            </div>
                        </div>
                    </div>
                `;
            }
        });

        return innerHtml;
    },

    /**
     * 스터디모집글 상세 조회
     */
    getDetail: async (sgId) => {
        try {
            const result = await axios.get(`/recruit/detail/${sgId}`)
            return result.data;
        } catch (err) {
            console.error(err);
        }
    },

    /**
     * 대시보드 제목
     */
    dashBoardTitle: (sgId) => {
        axios.get(`/recruit/detail/${sgId}`)
            .then(res => {
                const innerHtml = `
                    <div class="breadcomb-area margin0" style="background-color: white;">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                    <div class="breadcomb-list">
                                        <div class="row">
                                            <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                                                <div class="alignCenter">
                                                    <div class="breadcomb-ctn">
                                                        <h1 id="sgName">${res.data.SG_NAME}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                document.getElementById('dashBoardTitle').innerHTML = innerHtml;
            })
            .catch(err => {
                console.error(err);
            });
    }
}