// 필요한 DOM 요소들
const video = document.getElementById('video');
const canvas = document.getElementById('overlay-canvas');
const expressionOutput = document.getElementById('expression-output');
const loadingMessage = document.getElementById('loading-message');
const displaySize = { width: video.width, height: video.height };
let isModelsLoaded = false; // 모델 로딩 상태

// 모델 로드 함수
async function loadModels() {
    // 모델 파일들이 위치한 경로를 지정 (GitHub Pages에 업로드할 'models' 폴더 기준)
    const MODEL_URL = './models'; 
    
    try {
        await faceapi.nets.tinyFaceDetector.load(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.load(MODEL_URL);
        await faceapi.nets.faceExpressionNet.load(MODEL_URL);
        console.log('Face-api.js 모델 로딩 완료');
        isModelsLoaded = true;
        loadingMessage.textContent = '웹캠 시작 중... 권한을 허용해주세요.';
        startVideo(); // 모델 로딩 후 웹캠 시작
    } catch (error) {
        console.error('모델 로딩 실패:', error);
        loadingMessage.textContent = '모델 로딩 실패! 콘솔을 확인해주세요.';
    }
}

// 웹캠 시작 함수
async function startVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            console.log('비디오 메타데이터 로드 완료');
            // 비디오 크기에 맞춰 캔버스 크기 조정
            displaySize.width = video.videoWidth;
            displaySize.height = video.videoHeight;
            faceapi.matchDimensions(canvas, displaySize);
            loadingMessage.style.display = 'none'; // 로딩 메시지 숨기기
            video.play(); // 비디오 재생
        };
    } catch (err) {
        console.error('웹캠 접근 실패:', err);
        loadingMessage.textContent = '웹캠 접근 실패! 카메라 권한을 허용했는지 확인해주세요.';
        alert('웹캠에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
}

// 표정 문구 매핑
const expressionMessages = {
    neutral: "무표정을 짓는 민지",
    happy: "기쁜 표정의 민지",
    sad: "슬픈 표정의 민지",
    angry: "화가 난 민지",
    fearful: "무서워하는 민지",
    disgusted: "불쾌해하는 민지",
    surprised: "깜짝 놀란 민지"
};

// 표정 감지 및 그리기 함수
video.addEventListener('play', () => {
    // 300ms(0.3초) 간격으로 얼굴 감지 및 표정 분석 반복
    const interval = setInterval(async () => {
        if (!isModelsLoaded) return; // 모델 로딩 전에는 실행하지 않음

        // 얼굴 감지 및 표정 분석 (TinyFaceDetector 사용)
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();

        // 캔버스 초기화
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (detections && detections.length > 0) {
            // 얼굴 감지 결과를 비디오 크기에 맞게 재조정
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            // 얼굴 박스 그리기
            // faceapi.draw.drawDetections(canvas, resizedDetections);
            // 얼굴 랜드마크 그리기 (예: 눈, 코, 입 위치)
            // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

            // 표정 분석 결과 처리
            resizedDetections.forEach(detection => {
                const expressions = detection.expressions;
                const sortedExpressions = Object.keys(expressions).sort((a, b) => expressions[b] - expressions[a]);
                const dominantExpression = sortedExpressions[0]; // 가장 지배적인 표정

                // 콘솔에 표정 확률 출력 (디버깅용)
                // console.log(expressions);

                // 화면에 표정 문구 출력
                expressionOutput.textContent = expressionMessages[dominantExpression] || "표정을 감지할 수 없습니다.";
            });
        } else {
            // 얼굴이 감지되지 않았을 때
            expressionOutput.textContent = "얼굴이 감지되지 않았습니다.";
        }
    }, 300); // 0.3초마다 반복
});

// 페이지 로드 시 모델 로딩 시작
window.addEventListener('load', loadModels);
