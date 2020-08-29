function getMatrix(col, row) {  /* функция по созданию матрицы с клетками*/
	const matrix = [];

	let idCounter = 1;
	for (let y = 0; y < row; y++) {
		const need = []; //матрицы, состоит из строк, а строки из элементов,  need заполняемая строка

		for (let x = 0; x < col; x++) {
			need.push({
				id: idCounter++, //id клетки
				left: false, // нажали левой кнопкой
				rigth: false, // нажали правой кнопкой
				x,  // координата по x клетки
				y, // координата по y клетки
				mine: false, // есть мина или нет
				show: false, // выводить или нет
				flag: false, // !!!!!НА ВСЯКИЙ СЛУЧАЙ!!! ИЗМЕНИТЬ ПРИ ИСПОЛЬЗОВАНИЕ!!!
				number: 0, // колличество мин вокруг
				poten: false, // для дабл клика подсветка
				extralive: false, //доп жизнь
				radar: false //радар
			});

		}

		matrix.push(need); //кидаем в матрицу строку
	}

	return matrix;
}

function getRandomFreeCell(matrix, a, b) {   /*функция, котораяя выбирает клетку, в которую кладёт мину*/
	const freeCells = [];   /*массив клеток, которые не заполнены минами. Он заполнякется клетками, после чего рандомная клетка заполняется миной*/

	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x]; /*клетка */
			if (!cell.mine) {   /* проверка на то, что в ней нет мины*/
				if(running || b != y || a != x){//проверяем, не совпадает ли с начальной координатой
					freeCells.push(cell);
				}
			}
		}
	}
	const index = Math.floor(Math.random() * freeCells.length); /*рандомный индекс элемента массива*/
	return freeCells[index]; /*рандомный элемент массива */
}

function setRandomMine(matrix, a, b) {
	const cell = getRandomFreeCell(matrix, a, b); /* получаем рандомную мину*/

	cell.mine = true;

	const cells = getAroundCells(matrix, cell.x, cell.y); /* ищем все клетки, которые вокруг нашей мины */

	for (const cell of cells) {  /* цикл ув. переменной number для всех эл. массива cells*/
		cell.number += 1;
	}
}

function getRandomLives(numbon) { //рандомизация кол-ва доп жизней в зависимости от сложности
	let extralivescount;
	if (numbon == 3) {
		extralivescount = Math.round(1 - 0.5 + Math.random() * (2 - 1 + 1));
	}
	if (numbon == 7) {
		extralivescount = Math.round(2 - 0.5 + Math.random() * (4 - 2 + 1));
	}
	if (numbon == 15) {
		extralivescount = Math.round(5 - 0.5 + Math.random() * (10 - 5 + 1));
	}
	return (extralivescount);
}

function setRandomLives(matrix) { //помещение доп жизни на рандомную клетку
	const cell = getRandomFreeCell(matrix);

	cell.extralive = true;
	const cells = getAroundCells(matrix, cell.x, cell.y);
}

function setRandomRadar(matrix) { //помещение радара на рандомную клетку
	const cell = getRandomFreeCell(matrix);

	cell.radar = true;
	console.log(cell.x);
	console.log(cell.y);
	const cells = getAroundCells(matrix, cell.x, cell.y);
}

function showRadar(matrix, x, y) { //фукнция помечающий метки при активации радара
	let flag = true;
	let num;
	let num1;
	while (flag) {
		flag = false;
		num = y - 2;
		num1 = x - 2;
		for (num; num != y + 3; num++) {
			num1 = x - 2;
			for (num1; num1 != x + 3; num1++) {
				const cell = getCell(matrix, num1, num);
				if (cell.mine) {
					cell.flag = true;
				}
			}
		}
	}
}

function getNumberOfBonus(difficulty) { //получаем кол-во бонусов в зависимоти от сложности
	if (difficulty == 'easy')
		return 3;
	if (difficulty == 'normal')
		return 7;
	if (difficulty == 'hard')
		return 15;
}

function getCell(matrix, x, y) {   /*функция проверки на сущ. объекта в нашей матрице + его возвращение, если сущ*/
	if (!matrix[y] || !matrix[y][x]) {
		return false;
	}

	return matrix[y][x];
}

function getAroundCells(matrix, x, y) {  /*собирает массив всех клеток, которые находятся вокруг x и y*/
	const array = [];

	for (let dx = -1; dx <= 1; dx++) {  /* отклонение по оси x от первоначальной точки, оно может быть от -1 до 1*/
		for (let dy = -1; dy <= 1; dy++) { /* отклонение по оси y от первоначальной точки, оно может быть от -1 до 1 */
			if (dx === 0 && dy === 0) {
				continue;
			}

			const cell = getCell(matrix, x + dx, y + dy);

			if (cell) array.push(cell); /*в принципе этот if не нужен, но на всякий случай оставлю) */
		}
	}

	return array;
}


function getCellById(matrix, id) {   /*поиск клетки в матрице по id, для возвращения её значения*/
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x];

			if (cell.id === id) {
				return cell;
			}
		}
	}

	return false;
}

function matrixToHtml(matrix, difficulty) {  /*превращает матрицу в дом дерево https://ru.wikipedia.org/wiki/Document_Object_Model*/
	const gameElement = document.createElement('div');  /*создаём создаём эл. типа div*/
	gameElement.classList.add('sapper'); /*даём эл. класс sapper*/

	for (let y = 0; y < matrix.length; y++) {
		const rowelement = document.createElement('div');
		rowelement.classList.add('row');

		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x];
			const imgElement = document.createElement('img');

			imgElement.draggable = false; /*нельзя нажать и перетащить картинку*/
			imgElement.oncontextmenu = () => false; /*при нажатие правой кнопки мыши, не выскакивает меню*/
			imgElement.setAttribute('data-cell-id', cell.id); /*запоминаем у изображения, id  эл в массиве*/
			imgElement.classList.add(`${difficulty}_img`);
			rowelement.append(imgElement);

			if (cell.flag) {
				imgElement.src = `assets/flag.jpg`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			if (cell.poten) {
				imgElement.src = `assets/poten.jpg`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			if (!cell.show) {
				imgElement.src = `assets/white.jpg`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			if (cell.mine) {
				imgElement.src = `assets/mine.jpg`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			if (cell.extralive) {
				imgElement.src = `assets/extralive.jpg`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			if (cell.radar) {
				imgElement.src = `assets/radar.png`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			if (cell.number) {
				imgElement.src = `assets/${cell.number}.png`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
				continue;
			}

			imgElement.src = `assets/start.jpg`; //даём нговое значение клетке в виде изображения(какое опр. по названию файла)
		}
		gameElement.append(rowelement);
	}


	return gameElement;

}

function forEach(matrix, handler) {  //функция, которая получает матрицу и функцию handler, теперь для каждого элекента матрицы сделай  handler
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			handler(matrix[y][x]); //применяет для эл. матрицы функцию handler
		}
	}
}

function showSpread (matrix, x ,y) { // функция, которая отображает доп. участки поля, если клетка полностью путсая и мы открыли её
  const cell = getCell(matrix,x,y)

  if (cell.number || cell.mine || cell.flag) {
     return  //на всякий случай проверяем клетку на условие пустоты, есть мина, есть цифра > 0, есть флаг, то уходим
  }

  forEach(matrix, x => x._marked = false) //создание временного поля дляя маркировки нужных эл.

  cell._marked = true //маркируем наш элемент

  let flag = true  //пока флаг активен, ходим по массиву
  while (flag){
      flag = false

      for( let y = 0; y < matrix.length; y++) {
          for (let x = 0; x < matrix.length; x++) {
              const cell = matrix[y][x] //выбираем эелемент матрицы

              if (!cell._marked || cell.number) {
                 continue //если не маркирован или пуст, идём дальше
              }

              const cells = getAroundCells(matrix, x , y) // ищем, все соседние эл к нашему
              for (const cell of cells) {
                 if (cell._marked) { //если маркирован, идём дальше
                   continue
              }
              if (!cell.flag && !cell.mine) { //иначе, если нет флага и нет мины, то маркируем
                  	cell._marked = true
                  	flag = true
                }
              }
            }
        }
   }



  forEach(matrix, x =>  { if(x._marked)  {
                          x.show = true  //вывод всех маркерованных клеток
                        }

                        delete x._marked //удаление временного поля
                      })

}



function isWin(matrix) { // функция проверяющая на победу
	const flags = []; //массив флагов
	const mines = []; //массив мин

	forEach(matrix, cell => { //для каждого эл. матрицы
		if (cell.flag) { //если есть флаг, запихиваем в массив с флагами
			flags.push(cell);
		}

		if (cell.mine) { //если есть мина, запихиваем в массив с минами
			mines.push(cell);
		}
	});

	if (flags.length !== mines.length) { //если кол-во флагов не равно кол-ву мин, значит ещё не победили
		return false;
	}

	for (const cell of mines) { // если у какой-то мины не тфлага, не победили
		if (!cell.flag) {
			return false;
		}
	}

	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x];

			if (!cell.mine && !cell.show) {  //если у какого-то эл. матрицы не мина и не показан, проиграли
				return false;
			}
		}
	}

	return true; //УХУ ПОБЕДА
}

function isLosing(matrix) {//проверка на проигрышь
	var count;
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x];

			if (cell.mine && cell.show) { //если у какой-то эл. матрицы мина и показан, то проиграли
				count = document.getElementById("live_count").textContent;
				document.getElementById("live_count").innerHTML = count - 1; //смена  кол-ва жизней
				cell.flag = true;
				cell.mine = false;
				if (document.getElementById("live_count").textContent == 0) {
					return true;
				} else {
					return false;
				}
			}
		}
	}

	return false;
}
