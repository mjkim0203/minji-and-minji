/* --- script.js: 설정 패널 기능 + 검색 기능 --- */

document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // 1. 기존 오른쪽 패널 기능 (수정 없음)
    // =======================================================
    
    const body = document.body;
    const rightPanel = document.getElementById('settings-panel');
    
    // (이전 코드...)
    // 이 부분은 사용자님의 기존 패널 스크립트가 이미 있다고 가정합니다.
    // 만약 코드가 없다면, 이전 대화에서 드린 패널 코드를 여기에 붙여넣으세요.
    if (rightPanel) {
        rightPanel.addEventListener('change', (event) => {
            const target = event.target;
            
            if (target.name === 'font-size') {
                // 글자 크기 변경
                const newFont = 'font-' + target.value;
                body.classList.remove('font-small', 'font-standard', 'font-large');
                body.classList.add(newFont);
            } else if (target.name === 'layout-width') {
                // 너비 변경
                const newWidth = 'width-' + target.value;
                body.classList.remove('width-standard', 'width-wide');
                body.classList.add(newWidth);
            } else if (target.name === 'theme') {
                // 색상 테마 변경
                const newTheme = target.value;
                if (newTheme === 'dark') {
                    body.setAttribute('data-theme', 'dark');
                } else {
                    body.setAttribute('data-theme', 'light');
                }
            }
        });
    }


    // =======================================================
    // 2. [⭐ 새로 추가된 검색 기능]
    // =======================================================
    
    const searchInput = document.getElementById('search-input');
    // 검색 버튼은 id가 없으므로, input의 다음 형제 요소로 선택
    const searchButton = searchInput ? searchInput.nextElementSibling : null; 
    
    // 메인 콘텐츠 영역(#content-area)에 있는 모든 기사(article)를 선택
    const allArticles = document.querySelectorAll('#content-area .person-profile');

    // 검색을 수행하는 함수
    function performSearch() {
        // 1. 검색창에서 키워드를 가져와 소문자로 변경 (공백 제거)
        const searchTerm = searchInput.value.toLowerCase().trim();

        // 2. 모든 기사(article)를 순회
        allArticles.forEach(article => {
            const titleElement = article.querySelector('h1');
            
            if (titleElement) {
                // 3. 기사의 제목(h1) 텍스트를 가져와 소문자로 변경
                const title = titleElement.textContent.toLowerCase();
                
                // 4. 제목에 검색어가 포함되어 있는지 확인
                if (title.includes(searchTerm)) {
                    article.style.display = 'block'; // 포함되면 보여주기
                } else {
                    article.style.display = 'none'; // 포함되지 않으면 숨기기
                }
            }
        });
    }

    // --- 이벤트 연결 ---

    // 1. 검색 버튼을 클릭했을 때
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // 2. 검색창에서 Enter 키를 눌렀을 때
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }

}); // DOMContentLoaded 끝
