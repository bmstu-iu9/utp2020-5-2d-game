window.onload = function () {
    var content = document.getElementById("content");
    var buttonGame = document.getElementById("button_game");
    var buttonOptions = document.getElementById("button_options");
    var buttonRules = document.getElementById("button_rules");

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
            var text = xhr.responseText;
            var posOfStart = text.indexOf("<div class=\"content\" id=\"content\">");
            var posOfEnd = text.indexOf("</div>")
            content.innerHTML = '<div id="app"></div>';
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
            var text = xhr.responseText;
            var posOfStart = text.indexOf("<div class=\"content\" id=\"content\">");
            var posOfEnd = text.indexOf("</div>")
            content.innerHTML = text.slice(posOfStart + "<div class=\"content\" id=\"content\">".length, posOfEnd);
            buttonOptions.classList.toggle("actived");
            buttonGame.classList.remove("actived");
            buttonRules.classList.remove("actived");
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
            var text = xhr.responseText;
            var posOfStart = text.indexOf("<div class=\"content\" id=\"content\">");
            var posOfEnd = text.indexOf("</div>")
            content.innerHTML = text.slice(posOfStart + "<div class=\"content\" id=\"content\">".length, posOfEnd);
            buttonRules.classList.toggle("actived");
            buttonGame.classList.remove("actived");
            buttonOptions.classList.remove("actived");

        }
    }
};
