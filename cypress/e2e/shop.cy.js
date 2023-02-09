describe('Тестирование магазина', () => {
    it('Длинный автотест на оформление заказа', () => {
        /*
            1. Заходим на сайт
            2. Ставим ловушку на гет-запрос по ручке /page/ (подгрузка товаров со следующей страницы)
            3. Скроллим в самый низ страницы, чтобы сработал AJAX и ушел запрос на подгрузку оставшихся товаров
            4. Ждем ответа от бека, пока пришлет список оставшихся товаров
            5. Ищем нужный нам товар в блоке с товарами и кликаем на него
        */
        cy.visit('https://testqastudio.me/');
        cy.intercept('GET', '/page/**').as('ajax-load-items');
        cy.scrollTo('bottom');
        cy.wait('@ajax-load-items');
        cy.get('#rz-shop-content').contains('БРОММС Двухместная кровать').click();

        /*
            1. Проверяем, что попали на нужную карточку товара (название совпадает)
            2. Ставим ловушку на пост-запрос добавления товара в корзину
            3. Ставим ловушку на пост-запрос AJAX-обновления корзины
            4. Находим инпут с количеством, очищаем и пишем туда цифру 3
            5. Находим кнопку "Добавить в корзину" и кликаем
            6. Ждем ответы от бека, после чего должно выехать модальное окно корзины
            7. Ждем 0.5 секунды, пока выезжает сбоку модальное окно (анимация css)
            8. Проверяем в модальном окне корзины, что добавился наш первый товар
            9. Проверяем в модальном окне корзины, что кол-во товара равно 3
        */
        cy.get('.product-gallery-summary').should('contain', 'БРОММС Двухместная кровать');
        cy.intercept('POST', '/product/**').as('ajax-add-to-cart');
        cy.intercept('POST', '/?wc-ajax=get_refreshed_fragments').as('ajax-reload-cart');
        cy.get('.product-button-wrapper > .quantity > input[name="quantity"]:visible').clear().type('3');
        cy.get('.product-button-wrapper > button[name="add-to-cart"]:visible').click();
        cy.wait(['@ajax-add-to-cart', '@ajax-reload-cart']);
        cy.wait(500); // ждем анимацию выезда окна (0.5 сек)
        cy.get('.cart_list').children().first().find('.woocommerce-mini-cart-item__title').should('contain', 'БРОММС Двухместная кровать');
        cy.get('.cart_list').children().first().find('input[type="number"]').should('have.value', '3');

        /*
            1. Идем обратно на главную
            2. Скроллим вниз страницы, чтобы сработала AJAX-подгрузка оставшихся товаров
            3. Ждем ответа от бека, пока пришлет список оставшихся товаров
            4. Ищем нужный нам товар в блоке с товарами и кликаем на него
        */
        cy.visit('https://testqastudio.me/');
        cy.scrollTo('bottom');
        cy.wait('@ajax-load-items');
        cy.get('#rz-shop-content').contains('КЛЛАРИОН Низкий столик').click();

        /*
            1. Проверяем, что попали на нужную карточку товара (название совпадает)
            2. Проверяем, что количество по-умолчанию стоит 1
            3. Находим кнопку "Добавить в корзину" и кликаем
            4. Ждем ответы от бека, после чего должно выехать модальное окно корзины
            5. Ждем 0.5 секунды, пока выезжает сбоку модальное окно (анимация css)
            6. Проверяем в модальном окне корзины, что добавился наш второй товар
            7. Проверяем в модальном окне корзины, что кол-во второго товара равно 1
            8. Находим и жмем кнопку "Оформление заказа" в модальном окне
        */
        cy.get('.product-gallery-summary').should('contain', 'КЛЛАРИОН Низкий столик');
        cy.get('.product-button-wrapper > .quantity > input[name="quantity"]:visible').should('have.value', '1');
        cy.get('.product-button-wrapper > button[name="add-to-cart"]:visible').click();
        cy.wait(['@ajax-add-to-cart', '@ajax-reload-cart']);
        cy.wait(500);
        cy.get('.cart_list').children().next().find('.woocommerce-mini-cart-item__title').should('contain', 'КЛЛАРИОН Низкий столик');
        cy.get('.cart_list').children().next().find('input[type="number"]').should('have.value', '1');
        cy.get('#cart-modal').contains('Оформение заказа').click();

        /*
            1. Ставим заглушку на пост-запрос обновления информации о доставке
            2. Ищем поле и вводим имя
            3. Ищем поле и вводим фамилию
            4. Ищем поле и вводим адрес
            5. Ищем поле и вводим населенный пункт
            6. Ищем поле и вводим область / район
            7. Ищем поле и вводим индекс, снимаем фокус с поля чтобы отработало событие AJAX
            8. Ищем поле и вводим номер телефона
            9. Ищем поле и вводим адрес почты
            10. Дожидаемся ответа от бекенда по обновлению информации о доставке
        */
        cy.intercept('POST', '/?wc-ajax=update_order_review').as('ajax-reload-delivery');
        cy.get('#billing_first_name').type('Вячеслав');
        cy.get('#billing_last_name').type('Кузнецов');
        cy.get('#billing_address_1').type('Кутузовский проспект, д. 32к1');
        cy.get('#billing_city').type('Москва');
        cy.get('#billing_state').type('Москва');
        cy.get('#billing_postcode').type('121165').blur();
        cy.get('#billing_phone').type('8 (800) 555-55-50');
        cy.get('#billing_email').type('stripslash@yandex.ru');
        cy.wait('@ajax-reload-delivery');

        /*
            1. Ставим ловушку на пост-запрос оформления заказа
            2. Ищем и кликаем на кнопку "Оформить"
            3. Ждем пока вернет бекенд вернет ответ
            4. Ищем сообщение, что все прошло успешно и заказ оформлен
        */
        cy.intercept('POST', '?wc-ajax=checkout').as('ajax-checkout');
        cy.get('#place_order').click();
        cy.wait('@ajax-checkout');
        cy.get('#content').should('contain', 'Ваш заказ принят. Благодарим вас.');
    });
});