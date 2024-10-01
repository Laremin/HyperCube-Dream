'use strict';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let shapes = [];
let currentShape = "cube";
let isRotating = true;
let rotationSpeed = 0.01;

function createShape(geometry, color) {
    const material = new THREE.LineBasicMaterial({ color: color });
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, material);
    return line;
}

// Создание куба по умолчанию
let cube = createShape(new THREE.BoxGeometry(1, 1, 1), 0x00ff00);
scene.add(cube);
shapes.push(cube);

camera.position.z = 5;

function animate() {
    if (isRotating) {
        shapes.forEach(shape => {
            shape.rotation.x += rotationSpeed;
            shape.rotation.y += rotationSpeed;
        });
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Управление изменением формы и цветом
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (event) => {
    const color = event.target.value;
    shapes.forEach(shape => {
        shape.material.color.set(color);
    });
    updateInfo();
});

const shapeSelector = document.getElementById('shapeSelector');
shapeSelector.addEventListener('change', (event) => {
    currentShape = event.target.value;
    changeShape();
    updateInfo();
});

// Изменение формы
function changeShape() {
    scene.remove(...shapes);
    shapes = [];

    if (currentShape === "cube") {
        const newCube = createShape(new THREE.BoxGeometry(1, 1, 1), colorPicker.value);
        scene.add(newCube);
        shapes.push(newCube);
    } else if (currentShape === "sphere") {
        const sphere = createShape(new THREE.SphereGeometry(1, 32, 32), colorPicker.value);
        scene.add(sphere);
        shapes.push(sphere);
    } else if (currentShape === "octahedron") {
        const octahedron = createShape(new THREE.OctahedronGeometry(1), colorPicker.value);
        scene.add(octahedron);
        shapes.push(octahedron);
    } else if (currentShape === "pentagram") {
        const pentagon = createShape(new THREE.DodecahedronGeometry(1), colorPicker.value); // Используем додекаэдр как 3D версию
        scene.add(pentagon);
        shapes.push(pentagon);
    }
}

// Управление скоростью вращения
const rotationSpeedSlider = document.getElementById('rotationSpeed');
rotationSpeedSlider.addEventListener('input', (event) => {
    rotationSpeed = parseFloat(event.target.value);
    updateInfo();
});

// Пауза/Запуск анимации при клике
window.addEventListener('mousedown', () => {
    isRotating = !isRotating;
});

// Изменение скорости вращения через мышь
window.addEventListener('mousemove', (event) => {
    if (event.buttons === 1) {
        rotationSpeed = (event.clientX / window.innerWidth) * 0.1;
        rotationSpeedSlider.value = rotationSpeed;
        updateInfo();
    }
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Обновление информации слева
function updateInfo() {
    document.getElementById('shapeInfo').innerText = `Фигура: ${currentShape}`;
    document.getElementById('colorInfo').innerText = `Цвет: ${colorPicker.value}`;
    document.getElementById('speedInfo').innerText = `Скорость: ${rotationSpeed.toFixed(2)}`;
}

// Инициализация информации
updateInfo();

// Экспорт фигуры
const exportButton = document.getElementById('exportButton');
exportButton.addEventListener('click', () => {
    const shapeData = {
        type: currentShape,
        color: colorPicker.value,
        rotationSpeed: rotationSpeed
    };
    const code = JSON.stringify(shapeData, null, 2); // Преобразование в JSON с отступами
    alert(`Код для импорта фигуры:\n\n${code}`);
});



// Обработчик для кнопки FAQ
const faqButton = document.getElementById('faqButton');
faqButton.addEventListener('click', () => {
    const faqBlob = new Blob([`
        FAQ - Инструкции по использованию

    Создатель: Laremin

    1. Выбор фигуры:
    Используйте выпадающее меню для выбора фигуры (Куб, Сфера, Октаэдр, Пентаграмма). После выбора фигуры она появится на экране.

    2. Изменение цвета:
    Кликните на цветовой выборщик, чтобы изменить цвет фигуры. Новый цвет применится ко всем фигурам на экране.

    3. Изменение скорости вращения:
    Перемещайте ползунок, чтобы настроить скорость вращения фигуры. Вы можете изменять скорость вращения в диапазоне от 0 до 0.1.

    4. Пауза и запуск анимации:
    Нажмите на любое место на экране мышью, чтобы приостановить или запустить анимацию вращения фигур.

    5. Экспорт фигуры:
    Нажмите на кнопку "Экспортировать фигуру", чтобы получить код для импорта выбранной фигуры. Код будет скопирован в буфер обмена.

    6. FAQ:
    Нажмите на кнопку "FAQ", чтобы загрузить этот файл с инструкциями. Вы можете использовать эти инструкции для понимания функционала приложения.

    7. Обратная связь:
    Если у вас есть вопросы или предложения, вы можете связаться с разработчиком через Telegram (https://t.me/Laremin).

    Спасибо за использование моего продукта!

    `], { type: 'text/plain' });

    const url = URL.createObjectURL(faqBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FAQ.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
