const video = document.getElementById('video');
const videoContainer = document.getElementById('videoContainer');
const loadingMessage = document.getElementById('loadingMessage');
let canvas;
let displaySize;
let ctx; 

// [⭐ 중요]
// 이 스크립트는 'find.html'과 같은 폴더에 있는
// 'models' 폴더를 참조합니다.
const MODEL_URL = './models'; 

let faceDetections = [];

let currentMessage = "카메라를 바라보세요";
let messageTimer;

// 1. 모델 로드 (SSD + 표정)
async function loadModels() {
    console.log("모델 로딩 시작...");
    loadingMessage.style.display = 'block'; 

    try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("얼굴 탐지 모델(SSD) 및 표정 모델 완료!");
        
        console.log("모든 모델 로드 완료!");
    } catch (error) {
        console.error("모델 로드 실패:", error);
        loadingMessage.innerText = "모델 로드에 실패했습니다. (필수 모델 파일 확인)";
    } finally {
        loadingMessage.style.display = 'none'; 
    }
}

// 2. 웹캠 시작 (구형 호환 .then() 사용)
function startVideo() {
    console.log("웹캠 시작 시도...");
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(function(stream) {
            console.log("웹캠 스트림 확보 성공.");
            video.srcObject = stream;
        })
        .catch(function(err) {
            console.error("웹캠 접근 오류:", err);
            loadingMessage.style.display = 'block';
            loadingMessage.innerText = "웹캠 권한을 허용해주세요.";
        });
}

// 3. 실시간 감지 시작 (성능 최적화: 200ms)
function startDetection() {
    canvas = faceapi.createCanvasFromMedia(video);
    videoContainer.append(canvas);
    displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    ctx = canvas.getContext('2d', { willReadFrequently: true }); 

    // 0.2초(200ms)에 한 번씩만 얼굴 감지
    setInterval(detectFaces, 200); 

    // 그리기는 0.1초(100ms)마다 실행 (더 부드럽게)
    setInterval(drawLoop, 100); 

    // 문구 갱신은 3초마다
    messageTimer = setInterval(updateMessage, 3000); 
}

// 3-1. 감지 루프 (표정 감지 추가)
async function detectFaces() {
    if (video.readyState < 3) { 
        return; 
    }

    const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
                                .withFaceExpressions(); // 표정 감지 추가
    
    console.log('얼굴 감지 루프 실행 중... 찾은 얼굴:', detections.length);
                                
    faceDetections = faceapi.resizeResults(detections, displaySize);
}


// 4. 안내 문구 갱신 (표정 인식 로직)
function updateMessage() {
    if (faceDetections.length > 0 && faceDetections[0].expressions) {
        const expressions = faceDetections[0].expressions;
        const happyProb = expressions.happy || 0;
        const sadProb = expressions.sad || 0;
        const neutralProb = expressions.neutral || 0;

        // 'happy' 또는 'sad'가 'neutral'보다 10% 이상 높으면 문구 변경
        if (happyProb > neutralProb + 0.1) {
            currentMessage = '웃고 있는 민지';
        } else if (sadProb > neutralProb + 0.1) {
            currentMessage = '슬픈 민지';
        } else {
            // 그 외 (무표정, 애매한 표정 등)
            const time = getFormattedTime();
            currentMessage = `${time}분의 민지`; 
        }
    } else {
        // 얼굴이 감지되지 않으면 기본 메시지
        currentMessage = "카메라를 바라보세요";
    }
}


// 5. 그리기 루프 (.detection 경로 수정됨)
function drawLoop() {
    if (!ctx || (loadingMessage && loadingMessage.style.display === 'block')) return; 
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (faceDetections.length > 0) {
        // .withFaceExpressions()를 사용하면 .detection 경로가 필요
        const box = faceDetections[0].detection.box; 
        
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        ctx.fillRect(box.x - 10, box.y - 40, box.width + 20, 35);
        ctx.fillStyle = "#FFFF00"; 
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentMessage, box.x + box.width / 2, box.y - 15);

    } else { 
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("카메라를 바라보세요", canvas.width / 2, canvas.height / 2); 
    }
}

// --- 헬퍼 함수 (Helper Functions) ---

function getFormattedTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// --- 스크립트 실행 (구형 호환) ---
function main() {
    video.addEventListener('play', function() {
        console.log("Video is playing. Starting model load...");
        
        loadModels().then(function() {
            if (!loadingMessage || loadingMessage.style.display === 'none') { 
                startDetection();
                console.log("Detection started.");
            }
        });
    });
    
    startVideo(); 
}

main();
