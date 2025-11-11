/*
============================================
★ 1. 설정 패널 기능 (글꼴, 너비, 테마)
============================================
*/
const settingsPanel = document.getElementById('settings-panel');
const bodyElement = document.body;
const htmlElement = document.documentElement; // <html> 태그

settingsPanel.addEventListener('change', (event) => {
    
    if (event.target.type === 'radio') {
        const settingName = event.target.name;
        const settingValue = event.target.value;

        if (settingName === 'font-size') {
            bodyElement.classList.remove('font-small', 'font-standard', 'font-large');
            bodyElement.classList.add(`font-${settingValue}`);
        
        } else if (settingName === 'layout-width') {
            bodyElement.classList.remove('width-standard', 'width-wide');
            bodyElement.classList.add(`width-${settingValue}`);
        
        } else if (settingName === 'theme') {
            
            // --- 👇 [수정됨] 테마 적용 및 localStorage 저장 ---
            let themeToApply = settingValue; // 'light', 'dark', 'auto'
            
            if (settingValue === 'auto') {
                themeToApply = 'light'; // 'auto'는 'light' 테마를 적용
            }
            
            // 1. <html> 태그에 즉시 적용
            htmlElement.setAttribute('data-theme', themeToApply);
            
            // 2. 사용자의 *선택*('auto', 'light', 'dark')을 localStorage에 저장
            localStorage.setItem('userThemeChoice', settingValue); 
            // --- 👆 [수정 완료] ---

        }
        }
    }
});

/*
============================================
★ 2. 검색창 필터링 기능
============================================
*/

// 1. 검색창과 모든 인물 프로필(article) 요소를 선택합니다.
const searchInput = document.getElementById('search-input');
const allProfiles = document.querySelectorAll('.person-profile');

// 2. 검색창에 'input'(키보드 입력) 이벤트가 발생할 때마다 함수를 실행합니다.
searchInput.addEventListener('input', (event) => {
    
    // 3. 사용자가 입력한 검색어를 가져와서, 비교하기 쉽도록 소문자로 바꿉니다.
    const searchTerm = event.target.value.toLowerCase();

    // 4. 모든 프로필을 하나씩 확인합니다 (forEach 반복문).
    allProfiles.forEach(profile => {
        
        // 5. 각 프로필의 <h1> 제목 텍스트를 가져와서 소문자로 바꿉니다.
        const titleElement = profile.querySelector('h1');
        const title = titleElement.textContent.toLowerCase();

        // 6. 제목(title)에 검색어(searchTerm)가 포함되어 있는지 확인합니다.
        if (title.includes(searchTerm)) {
            // 7. (포함 O) 프로필을 다시 보이게 합니다.
            profile.style.display = ''; // 'block'이나 'flex' 대신 ''로 기본값 복원
        } else {
            // 8. (포함 X) 프로필을 숨깁니다.
            profile.style.display = 'none';
        }
    });
});




/*
============================================
★ 3. 페이지 로드 시 UI 설정 (테마 버튼 동기화)
============================================
*/
// 페이지가 로드되었을 때 실행됩니다.
window.addEventListener('load', () => {
    
    // 1. 저장된 테마 선택값을 가져옵니다.
    const savedThemeChoice = localStorage.getItem('userThemeChoice');
    
    if (savedThemeChoice) {
        // 2. 저장된 값(예: 'dark')과 일치하는 라디오 버튼을 찾습니다.
        const themeRadio = document.querySelector(`#settings-panel input[name="theme"][value="${savedThemeChoice}"]`);
        
        if (themeRadio) {
            // 3. 일치하는 버튼을 'checked' 상태로 만듭니다.
            themeRadio.checked = true;
        }
    }
});
