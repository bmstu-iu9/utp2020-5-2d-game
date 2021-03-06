let matrix = null //массив переменных, нашего поля

let running = null //условная переменная, которая отслеживает играем мы или нет ещё

let difficulty;

let mines;

init();

document
	.querySelector('button') //создаём переменную, хранящую значение кнопки
	.addEventListener('click', init); //проверяем на клик, если он есть, то запускаем заново

function init() { //функция запуска игры, в зависимости он переключателя сложности задаёт параметры
	var countX;
	var countY;
	var bon;
	var numbon;
	var numlives;

	if (document.getElementById('easy').checked) {
		countX = 10;
		countY = 10;
		mines = 10;
		difficulty = 'easy';
	}
	else if (document.getElementById('norm').checked) {
		countX = 20;
		countY = 20;
		mines = 60;
		difficulty = 'normal';
	}
	else if (document.getElementById('hard').checked) {
		countX = 20;
		countY = 20;
		mines = 80;
		difficulty = 'hard';
	}
	
	document.getElementById("live_count").innerHTML = "1";
	matrix = getMatrix(countX, countY); //создаём "поле" в виде массива, без изображения
	bon = document.getElementById('bonus');
	if (bon.checked) { //проверка на клик игры с допами
		numbon = getNumberOfBonus(difficulty)
	}

	if (bon.checked) { // спавн жизней и радаров
		numlives = getRandomLives(numbon);
		for (let i = 0; i < numlives; i++) {
			setRandomLives(matrix);
			update();
		}
		numbon = numbon - numlives;
		for (let i = 0; i < numbon; i++) {
			setRandomRadar(matrix);
			update();
		}
	}
	running = false;
	update();
}

if (!running) {
	init(); //если не играем, то запускаем новую партию
}


function update() {  //функиця обновления изображения и данных



	const gameElement = matrixToHtml(matrix, difficulty); /*создание нашей игры*/

	console.log(gameElement);  /* вывод нашей игры. вроде бы не надо, но оставл. на всякий случай*/

	const appeElement = document.querySelector('#app'); /*вставляем его в div id, смотри HTML файл и ищи app*/
	appeElement.innerHTML = ''; /*очистка div id от прочего хлама*/
	appeElement.append(gameElement);

	appeElement
		.querySelectorAll('img') /*ищем все изображения*/
		.forEach(imgElement => { /*для каждого элемента*/
			imgElement.addEventListener('mousedown', mousedownHandler)  /*отслеживаем мауз даун*/
			imgElement.addEventListener('mouseup', mouseupHandler) /*отслеживаем мауз ап*/
			imgElement.addEventListener('mouseleave', mouseleaveHandler) /*мышь ушла с клетки*/
		});

	if (isLosing(matrix)) { //проверяем на условие проигрыша
		if(language == "russian")
			alert('Попробуй еще раз!');
		else
			alert('Try again!');
		running = false;
		init(); //новый запуск
	}

	if (isWin(matrix)) { //проверяем на условие выигрыша
		if(language == "russian")
			alert('ВЫ ПОБЕДИЛИ!');
		else
			alert('WELL DONE!');
		running = false;
		init(); //новый запуск
	}
}



function mouseupHandler(event) { /*служебная функция, которая принимает само событие и обрабатывает его,"поднятие" кнопки мыши*/
	const { cell, rigth, left } = getInfo(event);  // { } - деконструкция, https://learn.javascript.ru/destructuring

	const both = cell.rigth && cell.left && (left || rigth); //опустили обе кнопки
	const leftMouse = !both && cell.left && left; //опустили левую только
	const rigthMouse = !both && cell.rigth && rigth; //опустили правую кнопку

	if (both) { //если подняли обе кнопки,то убираем оранжевое изображение
		forEach(matrix, x => x.poten = false);
	}

	if (left) {
		cell.left = false;  //помечаем, что подняли левую кнопку мыши
	}

	if (rigth) {
		cell.rigth = false;  //помечаем, что подняли правую кнопку мыши
	}

	if (leftMouse) { //если подняли левую кнопку мыши, то запускаем клик левой кнопки
		leftHandler(cell);
	}

	else if (rigthMouse) { //если подняли правую кнопку мыши, то запускаем правый клик
		rigthHandler(cell);
	}

	update();
}

function mousedownHandler(event) { /*служебная функция, которая принимает само событие и обрабатывает его, нажатие мыши*/
	const { cell, left, rigth } = getInfo(event);  // { } - деконструкция, https://learn.javascript.ru/destructuring

	if (left) { //если мы нажали левую кнопку мыши
		cell.left = true;
	}

	if (rigth) { //если мы нажали правую кнопку мыши
		cell.rigth = true;
	}

	if (cell.left && cell.rigth) { //если нажали обе кнопки мыши
		bothHandler(cell);
	}

	update(); //обнови изображение
}

function mouseleaveHandler(event) {// фкнуция фиксирующая отжатие кнопки
	const info = getInfo(event);

	info.cell.lest = false;
	info.cell.rigth = false;

	update();
}

function getInfo(event) {
	const element = event.target; /*на кого мы кликнули*/
	const cellid = parseInt(element.getAttribute('data-cell-id')); /*получаем от объекта id, parseInt для превращения в int,getAttribute возвращает строку*/

	return {
		left: event.which === 1, /*прожали левую кнопку мыши или нет*/
		rigth: event.which === 3, /*прожали правую кнопку мыши или нет*/
		cell: getCellById(matrix, cellid)
	}
}

function leftHandler(cell) {//функция при нажатие левой кнопки мыши
	var count;
	if(!running){
		for (let i = 0; i < mines; i++) {
			setRandomMine(matrix, cell.x, cell.y); //сажаем мины, скролько раз цикл работает, столько и мины
			update(); //обновляем изображение
		}
	}
	running = true; //отмечаем, что играем

	console.log("jjjjjjj");
	if (cell.extralive) { //проверка на клик доп жизни
		count = document.getElementById("live_count").textContent;
		document.getElementById("live_count").innerHTML = Number(count) + 1;
		cell.extralive = false;
	}

	if (cell.radar) { //проверка на клик радара
		console.log("radar");
		showRadar(matrix, cell.x, cell.y);
		cell.radar = false;
		update();
	}

	if (cell.flag || cell.show) { //если на клетке уже стоит флаг или мы уже тыкали на неё
		return;
	}

	cell.show = true;

	if (!cell.mine) { //если клетка пустая, то открываем все смежные пустые клетки, если же это цифра, то, если есть смежная пустая, то открываем все смежные с последней
		showSpread(matrix, cell.x, cell.y, true); //функция по поткрытию всех соседних клеток до 1 клеток с цифрами
		update();
	}
}

function rigthHandler(cell) {  //функция запускающаяся при нажатие на правую кнопку
	console.log("lllll");
	if (!cell.show) {
		cell.flag = !cell.flag;
	}
}

function bothHandler(cell) { //фукнция запускающаяся при нажатие двух кнопок одновременно
	console.log("dqdwqddwq");
	if (!cell.show || !cell.number) {
		return;
	}

	const cells = getAroundCells(matrix, cell.x, cell.y); //все рядом счтоящие клетки
	const flags = cells.filter(x => x.flag).length; //колличество всех клеток,  которые рядом и на них есть флаг

	if (flags === cell.number) { //если цифра на клетке и кол-во флагов рядом равны, то открываем  все соседние
		cells
			.filter(x => !x.flag && !x.show)  //ищем все клетки, которые без флага и не показаны
			.forEach(x => { // для каждой из них
				x.show = true;  //покажи
				//showSpread(matrix, cell.x, cell.y, true); //если чёрная, то покажи все клетки до первых с цифрами
			});
	}

	else {
		if (flags < cell.number) //если флагов меньше, чем цифр, подсвети, где может быть мина
			cells
				.filter(x => !x.flag && !x.show) //ищем все не отмеченные флагом и не показанные
				.forEach(cell => cell.poten = true); //меняем для них значение poten
	}
}

