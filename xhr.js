var content = document.getElementById("content");
var buttonGame = document.getElementById("button_game");
var buttonOptions = document.getElementById("button_options");
var buttonRules = document.getElementById("button_rules");
var form_options = document.getElementsByClassName("form_options");
var easy = document.getElementById("easy-span");
var medium = document.getElementById("medium-span");
var hard = document.getElementById("hard-span");
var restart = document.getElementById("restart");
var bonus = document.getElementById("bonus-span");
var language = "russian";
var indexOfPage = 0;

function set_cookie(name, value, exp_y, exp_m, exp_d, path, domain, secure) {
    var cookie_string = name + "=" + escape(value);
    if (exp_y) {
        var expires = new Date(exp_y, exp_m, exp_d);
        cookie_string += "; expires=" + expires.toGMTString();
    }
    if (path) cookie_string += "; path=" + escape(path);
    if (domain) cookie_string += "; domain=" + escape(domain);
    if (secure) cookie_string += "; secure";
    document.cookie = cookie_string;
}

function delete_cookie(cookie_name) {
    var cookie_date = new Date(); // Текущая дата и время
    cookie_date.setTime(cookie_date.getTime() - 1);
    document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}

function get_cookie(cookie_name) {
    var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
    if (results) return (unescape(results[2]));
    else return null;
}


buttonGame.onclick = function () {
    // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
    xhr.open('GET', 'index.html', false);

    // 3. Отсылаем запрос
    xhr.send();

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status != 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        indexOfPage = 0;
        var text = xhr.responseText;
        var posOfStart = text.indexOf("<div class=\"content\" id=\"content\">");
        var posOfEnd = text.indexOf("</div>")
        content.innerHTML = '<div id="app"></div>';
        content.innerHTML += '<script src="console.js"></script>'
        content.innerHTML += '<script src="script.js"></script>';
        buttonGame.classList.toggle("actived");
        buttonOptions.classList.remove("actived");
        buttonRules.classList.remove("actived");

    }
}

buttonOptions.onclick = function () {
    // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
    xhr.open('GET', 'options.html', false);

    // 3. Отсылаем запрос
    xhr.send();

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status != 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        indexOfPage = 1;
        var text = xhr.responseText;
        var posOfStart = text.indexOf("<div class=\"content\" id=\"content\">");
        var posOfEnd = text.indexOf("</div>")
        content.innerHTML = text.slice(posOfStart + "<div class=\"content\" id=\"content\">".length, posOfEnd);
        buttonOptions.classList.toggle("actived");
        buttonGame.classList.remove("actived");
        buttonRules.classList.remove("actived");
        if (language === "russian") {
            console.log(document.getElementsByTagName("h2").innerHTML);
            document.getElementById("russian").setAttribute("checked", true);
        } else {
            console.log(document.getElementsByTagName("h2").innerHTML);
            document.getElementById("english").setAttribute("checked", true);
        }
    }
}

buttonRules.onclick = function () {
    // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
    xhr.open('GET', 'rules.html', false);

    // 3. Отсылаем запрос
    xhr.send();

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status != 200) {
        // обработать ошибку
        alert(xhr.status + ': ' + xhr.statusText); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        indexOfPage = 2;
        var text = xhr.responseText;
        var posOfStart = text.indexOf("<div class=\"content\" id=\"content\">");
        var posOfEnd = text.indexOf("</div>")
        content.innerHTML = text.slice(posOfStart + "<div class=\"content\" id=\"content\">".length, posOfEnd);
        buttonRules.classList.toggle("actived");
        buttonGame.classList.remove("actived");
        buttonOptions.classList.remove("actived");

    }
}

function setRussian () {
    var title = document.getElementById("title")
    var radioRus = document.getElementById("russian");
    var page = document.getElementById("page")
    title.innerHTML = "Сапёр";
    radioRus.setAttribute("checked", "true");
    buttonGame.innerHTML = "Игра";
    buttonOptions.innerHTML = "Настройки";
    buttonRules.innerHTML = "Правила игры";
    easy.innerHTML = "<input id=\"easy\" type=\"radio\" name=\"hard\" checked>Легко";
    medium.innerHTML = "<input id=\"norm\" type=\"radio\" name=\"hard\">Нормально";
    hard.innerHTML = "<input id=\"hard\" type=\"radio\" name=\"hard\">Сложно";
    restart.innerHTML = "Рестарт";
     bonus.innerHTML = "<input id=\"bonus\" type=\"checkbox\" name=\"bonus\" value=1>Бонус режим";
    switch(indexOfPage) {
        case 0:
            break;
        case 1:
            page.innerHTML = "Настройки";
            break;
        case 2:
            page.innerHTML = "Правила игры";
            break;
    }

    language = "russian";

}

function setEnglish() {
    var title = document.getElementById("title")
    var radioEng = document.getElementById("english");
    var page = document.getElementById("page")
    title.innerHTML = "Sapper";
    radioEng.setAttribute("checked", "true");
    buttonGame.innerHTML = "Game";
    buttonOptions.innerHTML = "Options";
    buttonRules.innerHTML = "Rules of game";
    easy.innerHTML = "<input id=\"easy\" type=\"radio\" name=\"hard\" checked>Easy";
    medium.innerHTML = "<input id=\"norm\" type=\"radio\" name=\"hard\">Medium";
    hard.innerHTML = "<input id=\"hard\" type=\"radio\" name=\"hard\">Hard";
    restart.innerHTML = "Restart";
    bonus.innerHTML = "<input id=\"bonus\" type=\"checkbox\" name=\"bonus\" value=1>Bonus mode";
    switch(indexOfPage) {
        case 0:
            break;
        case 1:
            page.innerHTML = "Options";
            break;
        case 2:
            page.innerHTML = "Game rules";
            break;
    }

    language = "english";
}
