// получаем поле и делим его на клетки
let canvas = document.getElementById('earth');
if (canvas.getContext) {
  var ctx = canvas.getContext('2d');
  for (let wid = 0; wid < canvas.width; wid += 20) {
    for (let height = 0; height < canvas.height; height += 20) {
      ctx.strokeRect(wid, height, 20, 20);
    }
  }
}

// начальное количество живых клеток
const LIVING_AMOUNT = 300;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ячейка - квадрат 20 на 20, значит координаты округляем до 20
function getRandomNumber(max) {
  let number = Math.floor(Math.random() * max);
  return number - (number % 20);
}

// генерируем случайные координаты для начала
function generateCoordinates() {
  let coordinates = [];
  for (let i = 0; i < LIVING_AMOUNT; i++) {
    coordinates.push({
      w: getRandomNumber(canvas.width),
      h: getRandomNumber(canvas.height),
    });
  }
  return coordinates;
}

// очищаем поле
function clearField() {
  for (let wid = 0; wid < canvas.width; wid += 20) {
    for (let height = 0; height < canvas.height; height += 20) {
      ctx.fillStyle = 'white';
      ctx.fillRect(wid, height, 20, 20);
      ctx.strokeRect(wid, height, 20, 20);
    }
  }
}

// условия для жизни клетки на следующей итерации
function checkCell(alive, width, height, condition) {
  let living = 0;
  for (let aliveCell of alive) {
    for (let w = width - 20; w <= width + 20; w += 20) {
      for (let h = height - 20; h <= height + 20; h += 20) {
        if (aliveCell.w == w && aliveCell.h == h) living++;
      }
    }
  }

  // если сейчас мертвая, и рядом 3 живых - она оживает
  if (condition == 'dead' && living == 3) return 3;
  // если сейчас живая, и рядом 2 или 3 живых - она остается живой
  else if (condition == 'alive' && (living == 3 || living == 4)) return true;
  else return false;
}

async function iterations(aliveNow) {
  // очищаем поле и затем отрисовываем новые живые клетки
  clearField();
  ctx.fillStyle = 'black';
  for (let i = 0; i < aliveNow.length; i++) {
    ctx.fillRect(aliveNow[i].w, aliveNow[i].h, 20, 20);
  }

  let aliveNext = [];
  // проходимся по всем клеткам и проверяем следующее поколение для каждой
  for (let wid = 0; wid < canvas.width; wid += 20) {
    for (let height = 0; height < canvas.height; height += 20) {
      if (aliveNow.filter((el) => el.w == wid && el.h == height).length > 0) {
        let living = checkCell(aliveNow, wid, height, 'alive');
        if (living) aliveNext.push({ w: wid, h: height });
      } else {
        let living = checkCell(aliveNow, wid, height, 'dead');
        if (living) aliveNext.push({ w: wid, h: height });
      }
    }
  }

  // ждем немного и переходим к следующей итерации
  await sleep(700);
  iterations(aliveNext);
}

function start() {
  // генерируем начальные координаты живых клеток и запускаем итерации
  let firstAlive = generateCoordinates();
  iterations(firstAlive);
}

start();
