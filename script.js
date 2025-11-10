document.addEventListener('DOMContentLoaded', () => {

    // 1. === [수정된 기능] 상단 알림 배너 닫기 ===
    const noticeBanner = document.getElementById('site-notice');
    const closeNoticeBtn = document.getElementById('close-notice-btn');
    // [추가] 헤더 요소를 가져옵니다.
    const mainHeader = document.querySelector('.main-header'); 
    
    if (noticeBanner && closeNoticeBtn && mainHeader) { // mainHeader가 있는지 확인
        closeNoticeBtn.addEventListener('click', () => {
            
            // [추가] 1. 배너를 숨기기 *전에* 실제 높이를 가져옵니다.
            const bannerHeight = noticeBanner.offsetHeight;

            // [추가] 2. 가져온 높이만큼을 main-header의 margin-top으로 설정합니다.
            mainHeader.style.marginTop = bannerHeight + 'px';

            // [기존] 3. 배너를 숨깁니다.
            noticeBanner.classList.add('hidden');
        });
    }

    // 2. 좌측 사이드바 토글 (변경 없음)
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const leftSidebar = document.getElementById('left-sidebar');

    if (sidebarToggleBtn && leftSidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
            leftSidebar.classList.toggle('show');
        });
    }

    // 3. 테마 변경 (변경 없음)
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const theme = e.target.value;
            if (theme === 'dark') {
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
            } else {
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
            }
        });
    });
    
    // 4. '보기' 메뉴 숨기기/복원 로직 (변경 없음)
    const hideAppearanceBtn = document.getElementById('hide-appearance-btn');
    const appearanceSidebar = document.getElementById('appearance-sidebar');
    const appearanceMovedNotice = document.getElementById('appearance-moved-notice');
    const appearanceNoticeText = document.getElementById('appearance-notice-text');
    const appearanceIconButton = document.getElementById('appearance-icon-button');
    const appearanceDropdown = document.getElementById('appearance-dropdown');
    const moveToSidebarBtn = document.getElementById('move-to-sidebar-btn');
    let noticeTimer = null;

    if (hideAppearanceBtn) {
        hideAppearanceBtn.addEventListener('click', (e) => {
            e.preventDefault(); 
            appearanceSidebar.classList.add('hidden');
            appearanceMovedNotice.classList.add('show');
            appearanceNoticeText.classList.remove('hidden');
            if (noticeTimer) clearTimeout(noticeTimer);
            noticeTimer = setTimeout(() => {
                appearanceNoticeText.classList.add('hidden');
            }, 5000);
        });
    }
    if (appearanceIconButton) {
        appearanceIconButton.addEventListener('click', () => {
            appearanceDropdown.classList.toggle('show');
        });
    }
    if (moveToSidebarBtn) {
        moveToSidebarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            appearanceDropdown.classList.remove('show');
            appearanceMovedNotice.classList.remove('show');
            appearanceSidebar.classList.remove('hidden');
            if (noticeTimer) clearTimeout(noticeTimer);
            appearanceNoticeText.classList.remove('hidden');
        });
    }

    // 5. & 6. 필터링 기능 (변경 없음)
    const searchForm = document.querySelector('.search-area form');
    const searchInput = searchForm.querySelector('input');
    const allFilterButtons = document.querySelectorAll('.filter-btn');
    const allPersonProfiles = document.querySelectorAll('.person-profile');

    function filterProfiles(filterName) {
        allPersonProfiles.forEach(profile => {
            profile.classList.remove('show');
        });
        allFilterButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        if (filterName === "all") {
            allPersonProfiles.forEach(profile => {
                profile.classList.add('show');
            });
        } else if (filterName) {
            const targetProfile = document.querySelector(`.person-profile[data-name="${filterName}"]`);
            if (targetProfile) {
                targetProfile.classList.add('show');
            }
        }

        const activeButtons = document.querySelectorAll(`.filter-btn[data-filter-name="${filterName}"]`);
        activeButtons.forEach(btn => {
            btn.classList.add('active');
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const searchTerm = searchInput.value.trim();
            filterProfiles(searchTerm);
        });
    }

    allFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const filterName = button.dataset.filterName;
            filterProfiles(filterName);

            if (filterName !== "all") {
                searchInput.value = filterName;
            } else {
                searchInput.value = ""; 
            }
            
            if (appearanceDropdown.classList.contains('show')) {
                appearanceDropdown.classList.remove('show');
            }
        });
    });

    filterProfiles(''); // '백색 페이지'로 시작

});
