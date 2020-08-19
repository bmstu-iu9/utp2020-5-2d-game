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
				poten: false // для дабл клика подсветка
			});

		}

		matrix.push(need); //кидаем в матрицу строку
	}

	return matrix;
}

function getRandomFreeCell(matrix) {   /*функция, котораяя выбирает клетку, в которую кладёт мину*/
	const freeCells = [];   /*массив клеток, которые не заполнены минами. Он заполнякется клетками, после чего рандомная клетка заполняется миной*/

	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x]; /*клетка */
			if (!cell.mine) {   /* проверка на то, что в ней нет мины*/
				freeCells.push(cell);
			}
		}
	}
	const index = Math.floor(Math.random() * freeCells.length); /*рандомный индекс элемента массива*/
	return freeCells[index]; /*рандомный элемент массива */
}

function setRandomMine(matrix) {
	const cell = getRandomFreeCell(matrix); /* получаем рандомную мину*/

	cell.mine = true;

	const cells = getAroundCells(matrix, cell.x, cell.y); /* ищем все клетки, которые вокруг нашей мины */

	for (const cell of cells) {  /* цикл ув. переменной number для всех эл. массива ctlls*/
		cell.number += 1;
	}
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


function showSpread(matrix, x, y, boo) { // функция, которая отображает доп. участки поля, если клетка полностью путсая и мы открыли её, или если это цифра, рядом с которой есть пустая
	const cell = getCell(matrix, x, y);

	if (cell.mine || cell.flag || (cell.number && !boo)) {
		return;  //на всякий случай проверяем клетку на условие пустоты, есть мина, есть цифра > 0, есть флаг, то уходим
	}

	if (cell.number && boo) {
		showSpread(matrix, x - 1, y + 1, !boo);
		showSpread(matrix, x, y + 1, !boo);
		showSpread(matrix, x + 1, y + 1, !boo);
		showSpread(matrix, x - 1, y, !boo);
		showSpread(matrix, x + 1, y, !boo);
		showSpread(matrix, x - 1, y - 1, !boo);
		showSpread(matrix, x, y - 1, !boo);
		showSpread(matrix, x + 1, y - 1, !boo);
	}


	forEach(matrix, x => x._marked = false); //создание временного поля дляя маркировки нужных эл.

	cell._marked = true; //маркируем наш элемент

	let flag = true;  //пока флаг активен, ходим по массиву
	while (flag) {
		flag = false;

		for (let y = 0; y < matrix.length; y++) {
			for (let x = 0; x < matrix.length; x++) {
				const cell = matrix[y][x]; //выбираем эелемент матрицы

				if (!cell._marked || cell.number) {
					continue //если не маркирован или пуст, идём дальше
				}

				const cells = getAroundCells(matrix, x, y); // ищем, все соседние эл к нашему
				for (const cell of cells) {
					if (cell._marked) { //если маркирован, идём дальше
						continue;
					}
					if (!cell.flag && !cell.mine) {  //иначе, если нет флага и нет мины, то маркируем
						cell._marked = true;
						flag = true;
					}
				}
			}
		}
	}



	forEach(matrix, x => {
		if (x._marked); {
			x.show = true;  //вывод всех маркерованных клеток
		}

		delete x._marked; //удаление временного поля
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
	for (let y = 0; y < matrix.length; y++) {
		for (let x = 0; x < matrix[y].length; x++) {
			const cell = matrix[y][x];

			if (cell.mine && cell.show) { //если у какой-то эл. матрицы мина и показан, то проиграли
				return true;
			}
		}
	}

	return false;
}
