'use strict';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const edges = new THREE.EdgesGeometry(geometry);
const line = new THREE.LineSegments(edges, material);

scene.add(line);
camera.position.z = 5;

let isRotating = true;
let rotationSpeed = 0.01; // Начальная скорость вращения
let currentShape = "Cube"; // Переменная для хранения текущей фигуры

function animate() {
    if (isRotating) {
        line.rotation.x += rotationSpeed;
        line.rotation.y += rotationSpeed;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Обработка выбора цвета
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (event) => {
    const color = event.target.value;
    material.color.set(color);
    updateInfo(); // Обновляем информацию при изменении цвета
});

// Обработка нажатия мыши на куб
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousedown', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(line);

    if (intersects.length > 0) {
        isRotating = !isRotating; // Переключаем состояние вращения
        rotationSpeed = isRotating ? parseFloat(rotationSpeedSlider.value) : 0.00; // Устанавливаем скорость
        updateInfo(); // Обновляем информацию
    }
});

// Обработка выбора фигуры
const shapeSelector = document.getElementById('shapeSelector');
const infoDisplay = document.getElementById('info');

shapeSelector.addEventListener('change', (event) => {
    currentShape = event.target.value;
    infoDisplay.innerText = `Current Shape: ${currentShape}, Color: ${colorPicker.value}, Rotation Speed: ${rotationSpeed.toFixed(2)}`;
    // Здесь можно добавить логику для переключения между кубом и тессерактом
    if (currentShape === "cube") {
        line.geometry = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    } else if (currentShape === "tesseract") {
        line.geometry = createTesseractEdges();
    }
});

// Управление скоростью вращения
const rotationSpeedSlider = document.getElementById('rotationSpeed');
rotationSpeedSlider.addEventListener('input', (event) => {
    rotationSpeed = parseFloat(event.target.value);
    updateInfo(); // Обновляем информацию при изменении скорости
});

// Функция для обновления информации
function updateInfo() {
    infoDisplay.innerText = `Current Shape: ${currentShape}, Color: ${colorPicker.value}, Rotation Speed: ${rotationSpeed.toFixed(2)}`;
}

// Функция для создания рёбер тессеракта (упрощенный вариант)
function createTesseractEdges() {
    const vertices = [
        new THREE.Vector4(-1, -1, -1, -1),
        new THREE.Vector4(1, -1, -1, -1),
        new THREE.Vector4(1, 1, -1, -1),
        new THREE.Vector4(-1, 1, -1, -1),
        new THREE.Vector4(-1, -1, 1, -1),
        new THREE.Vector4(1, -1, 1, -1),
        new THREE.Vector4(1, 1, 1, -1),
        new THREE.Vector4(-1, 1, 1, -1),
        new THREE.Vector4(-1, -1, -1, 1),
        new THREE.Vector4(1, -1, -1, 1),
        new THREE.Vector4(1, 1, -1, 1),
        new THREE.Vector4(-1, 1, -1, 1),
        new THREE.Vector4(-1, -1, 1, 1),
        new THREE.Vector4(1, -1, 1, 1),
        new THREE.Vector4(1, 1, 1, 1),
        new THREE.Vector4(-1, 1, 1, 1),
    ];

    const edges = [];
    const edgeIndices = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
        [8, 9], [9, 10], [10, 11], [11, 8],
        [12, 13], [13, 14], [14, 15], [15, 12],
        [8, 12], [9, 13], [10, 14], [11, 15],
        [0, 8], [1, 9], [2, 10], [3, 11],
        [4, 12], [5, 13], [6, 14], [7, 15],
    ];

    for (const [start, end] of edgeIndices) {
        edges.push(vertices[start], vertices[end]);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(edges);
    return geometry;
}

// Вызов функции обновления информации при загрузке страницы
updateInfo();
