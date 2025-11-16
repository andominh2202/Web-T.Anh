// Dữ liệu từ vựng
const vocabulary = [
    { word: 'Apple', vn: 'Quả táo', emoji: '🍎', pronunciation: '/ˈæp.əl/' },
    { word: 'Banana', vn: 'Quả chuối', emoji: '🍌', pronunciation: '/bəˈnæn.ə/' },
    { word: 'Cat', vn: 'Con mèo', emoji: '🐱', pronunciation: '/kæt/' },
    { word: 'Dog', vn: 'Con chó', emoji: '🐶', pronunciation: '/dɒɡ/' },
    { word: 'Elephant', vn: 'Con voi', emoji: '🐘', pronunciation: '/ˈel.ɪ.fənt/' },
    { word: 'Fish', vn: 'Con cá', emoji: '🐟', pronunciation: '/fɪʃ/' },
    { word: 'Grapes', vn: 'Quả nho', emoji: '🍇', pronunciation: '/ɡreɪps/' },
    { word: 'House', vn: 'Ngôi nhà', emoji: '🏠', pronunciation: '/haʊs/' },
    { word: 'Ice Cream', vn: 'Kem', emoji: '🍦', pronunciation: '/aɪs kriːm/' },
    { word: 'Jump', vn: 'Nhảy', emoji: '🦘', pronunciation: '/dʒʌmp/' }
    { word: 'Code', vn: 'Mã', emoji: '', pronunciation: '/dʒʌmp/' }
];

let score = 0;
let currentQuestion = null;

// Chuyển đổi tab
function showTab(tabName) {
    document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Hiển thị từ vựng
function renderVocabulary() {
    const grid = document.getElementById('vocabularyGrid');
    grid.innerHTML = '';
    
    vocabulary.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
            <div class="image-placeholder">${item.emoji}</div>
            <div class="word">${item.word}</div>
            <div class="pronunciation">${item.pronunciation}</div>
            <div style="color: #666; margin-bottom: 10px;">${item.vn}</div>
            <button class="play-btn" onclick="speak('${item.word}')">🔊 Phát âm</button>
            <button class="delete-btn" onclick="deleteWord(${index})">🗑️ Xóa</button>
        `;
        grid.appendChild(card);
    });
}

// Hiển thị form thêm từ
function showAddWordForm() {
    document.getElementById('addWordForm').style.display = 'block';
    document.getElementById('addWordForm').scrollIntoView({ behavior: 'smooth' });
}

// Ẩn form thêm từ
function hideAddWordForm() {
    document.getElementById('addWordForm').style.display = 'none';
    // Xóa dữ liệu trong form
    document.getElementById('newWord').value = '';
    document.getElementById('newWordVn').value = '';
    document.getElementById('newEmoji').value = '';
    document.getElementById('newPronunciation').value = '';
}

// Thêm từ mới
function addNewWord() {
    const word = document.getElementById('newWord').value.trim();
    const wordVn = document.getElementById('newWordVn').value.trim();
    const emoji = document.getElementById('newEmoji').value.trim();
    const pronunciation = document.getElementById('newPronunciation').value.trim();
    
    // Kiểm tra dữ liệu
    if (!word || !wordVn || !emoji) {
        alert('Vui lòng điền đầy đủ thông tin (Từ tiếng Anh, Nghĩa tiếng Việt và Emoji)!');
        return;
    }
    
    // Thêm từ vào danh sách
    const newVocab = {
        word: word,
        vn: wordVn,
        emoji: emoji,
        pronunciation: pronunciation || `/${word.toLowerCase()}/`
    };
    
    vocabulary.push(newVocab);
    
    // Cập nhật hiển thị
    renderVocabulary();
    hideAddWordForm();
    
    // Thông báo thành công
    alert(`✅ Đã thêm từ "${word}" thành công!`);
}

// Xóa từ
function deleteWord(index) {
    const word = vocabulary[index].word;
    if (confirm(`Bạn có chắc muốn xóa từ "${word}" không?`)) {
        vocabulary.splice(index, 1);
        renderVocabulary();
        alert(`✅ Đã xóa từ "${word}" thành công!`);
    }
}

// Phát âm từ
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
}

// Tạo câu hỏi mới
function generateQuestion() {
    const correctAnswer = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const wrongAnswers = vocabulary.filter(v => v !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    
    currentQuestion = {
        correct: correctAnswer,
        options: options
    };
    
    const gameContent = document.getElementById('gameContent');
    gameContent.innerHTML = `
        <div style="text-align: center; font-size: 2em; margin-bottom: 30px;">
            Tìm hình ảnh của từ: <strong style="color: #667eea;">${correctAnswer.word}</strong>
            <button class="play-btn" style="margin-left: 10px;" onclick="speak('${correctAnswer.word}')">🔊</button>
        </div>
        <div class="image-grid">
            ${options.map((opt, idx) => `
                <div class="image-card" onclick="checkAnswer('${opt.word}', this)">
                    <div class="image-placeholder">${opt.emoji}</div>
                    <div class="word">${opt.vn}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Kiểm tra câu trả lời
function checkAnswer(selected, element) {
    const options = document.querySelectorAll('#gameContent .image-card');
    options.forEach(opt => opt.style.pointerEvents = 'none');
    
    if (selected === currentQuestion.correct.word) {
        element.classList.add('correct');
        score += 10;
        document.getElementById('score').textContent = score;
        speak('Correct! ' + currentQuestion.correct.word);
    } else {
        element.classList.add('wrong');
        speak('Try again');
    }
}

// Câu hỏi tiếp theo
function nextQuestion() {
    const options = document.querySelectorAll('#gameContent .image-card');
    options.forEach(opt => {
        opt.classList.remove('correct', 'wrong');
        opt.style.pointerEvents = 'auto';
    });
    generateQuestion();
}

// Khởi tạo trang
renderVocabulary();
generateQuestion();
