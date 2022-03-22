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
                                    <p class="text-right">
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
            const result = await axios.get(`/manage/detail/${sgId}`)
            return result.data;
        } catch (err) {
            console.error(err);
        }
    },

    /**
     * 대시보드 제목
     */
    dashBoardTitle: async (sgId) => {
        try {
            // const pathName = document.location.pathname;
            // const menuName = pathName.split('/')[1];
            const result = await common.getDetail(sgId);
            const innerHtml = `
                <div class="breadcomb-area margin0" style="background-color: white;">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                <div class="breadcomb-list">
                                    <div class="row">
                                        <div class="col-lg-12 col-md-6 col-sm-6 col-xs-12">
                                            <div class="text-center">
                                                <div class="breadcomb-ctn">
                                                    <a href="/dashboard/${sgId}" style="color: black;">
                                                        <h1 id="sgName">${result.SG_NAME}</h1>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="navbar">
                    <div class="navbar-inner backgroundColorWhite">
                        <div class="container-pro wizard-cts-st">
                            <ul class="nav nav-pills">
                                <li>
                                    <a href="/dashboard/${sgId}">대시보드</a>
                                </li>
                                <li>
                                    <a href="/scheduleList/${sgId}">일정</a>
                                </li>
                                <li>
                                    <a href="/boardList/${sgId}">게시판</a>
                                </li>
                                <li>
                                    <a href="/memberList/${sgId}">팀원목록</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('dashBoardTitle').innerHTML = innerHtml;

        } catch (err) {
            console.error(err);
        }
    },

    /**
     * 일정그리기
     */
    gridSchedule: (schedule) => {
        const hour = `${Number(schedule.SS_DATE_HOUR) < 12 ? '오전' : '오후'}${schedule.SS_DATE_HOUR}시 ~ ${Number(schedule.SS_END_DATE_HOUR) < 12 ? '오전' : '오후'}${schedule.SS_END_DATE_HOUR}시`;
        const innerHtml = `
            <div>
                <div style="float: left; width: 25px;">
                    <i class="notika-icon notika-checked"></i>
                </div> 
                <p style="font-weight: bold;">${schedule.SS_TOPIC}</p>
            </div>
            <div style="margin-top: 7px;">
                <div style="float: left; width: 25px;">
                    <i class="fas fa-map-marker-alt"></i>
                </div> 
                <p>${schedule.SS_PLACE}</p>
            </div>
            <div style="margin-top: 7px;">
                <div style="float: left; width: 25px;">
                    <i class="fas fa-calendar-check"></i>
                </div> 
                <p>${schedule.SS_DATE}</p>
            </div>
            <div style="margin-top: 7px;">
                <div style="float: left; width: 25px;">
                    <i class="fas fa-clock"></i>
                </div> 
                <p>${hour}</p>
            </div>
        `;

        return innerHtml;
    },
    
    /**
     * 일정 투표 여부에 따라 버튼 핸들링
     */
    voteYnBtn: (voteYn, ssaId, voteResult) => {
        if (voteYn) {   // 이미 투표 했을시
            document.getElementById('voteN').classList.add('noVisible');
            document.getElementById('ssaId').value = ssaId;
            document.getElementById('voteResult').innerHTML = voteResult + ' 예정';
            document.getElementById('voteY').classList.remove('noVisible');
        } else {        // 아직 안했을시, 다시투표하기일시
            document.getElementById('voteN').classList.remove('noVisible');
            document.getElementById('voteY').classList.add('noVisible');
        }
    },

    /**
     * 일정 출결 상세 조회
     */
    getScheduleAtndn: async (ssId) => {
        try {
            const result = await axios.get(`/manage/scheduleAtndn/${ssId}`);
            return result.data;
        } catch (err) {
            console.error(err);
        }
    },

    /**
     * 현재 진행중인 투표인지 아닌지 여부 검사
     */
    currentVoteYn: (schedule) => {
        const today = new Date();
        const dateArr = schedule.SS_DATE.split('-');
        const ssDate = new Date(dateArr[0], Number(dateArr[1]) - 1, dateArr[2], schedule.SS_DATE_HOUR);
        schedule.ssDate = ssDate;

        return today < ssDate;
    },

    /**
     * 일정 투표 여부
     */
    voteYn: (atndnList) => {
        for (let item of atndnList) {
            if (common.getSessionUserId() === String(item.USER_ID)) {
                return item.SSA_STATUS ? item : null;
            }
        }
    },

    /**
     * 일정 출결 투표 등록 / 수정
     */
    createScheduleAtndn: async (ssaStatus, sgId) => {
        const ssId = document.getElementById('ssId').value;
        const ssaId = document.getElementById('ssaId').value;
        const scheduleAtndn = {ssId, ssaStatus};

        try {
            if (ssaId) {        // 수정
                scheduleAtndn.ssaId = ssaId;
                await axios.put(`/manage/scheduleAtndn`, scheduleAtndn);

                if (sgId) {     // 대시보드일때
                    getScheduleNewOne(sgId);
                } else {
                    getScheduleDetail(ssId);
                    await scheduleAtndnList(ssId);
                }

            } else {            // 등록
                await axios.post(`/manage/scheduleAtndn`, scheduleAtndn);

                if (sgId) {     // 대시보드일때
                    getScheduleNewOne(sgId);
                } else {
                    getScheduleDetail(ssId);
                    await scheduleAtndnList(ssId);
                }
            }
        } catch (err) {
            console.error(err);
        }
    }
}