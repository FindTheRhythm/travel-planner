describe('Travel Planner End-to-End Test', () => {
  
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  }

  const travel = {
    tag: 'Культура',
    destination: 'Париж, Франция'
  }

  beforeEach(() => {
    // Сбрасываем состояние перед каждым тестом
    cy.clearLocalStorage()
    cy.clearCookies()
  })

  const login = () => {
    cy.visit('login')
    cy.get('[data-cy=email-input]')
      .should('be.visible')
      .type(testUser.email)
    cy.get('[data-cy=password-input]')
      .should('be.visible')
      .type(testUser.password)
    cy.get('[data-cy=login-button]')
      .should('be.visible')
      .click()
    cy.url().should('include', 'profile', { timeout: 10000 })
  }

  it('Регистрация нового пользователя', () => {
    cy.visit('register')
    
    // Заполняем форму регистрации
    cy.get('[data-cy=username-input]')
      .should('be.visible')
      .type(testUser.username)
      .should('have.value', testUser.username)

    cy.get('[data-cy=email-input]')
      .should('be.visible')
      .type(testUser.email)
      .should('have.value', testUser.email)

    cy.get('[data-cy=password-input]')
      .should('be.visible')
      .type(testUser.password)
      .should('have.value', testUser.password)

    cy.get('[data-cy=confirm-password-input]')
      .should('be.visible')
      .type(testUser.password)
      .should('have.value', testUser.password)

    // Нажимаем кнопку регистрации
    cy.get('[data-cy=register-button]')
      .should('be.visible')
      .should('not.be.disabled')
      .click()

    // Ждем редиректа на страницу логина
    cy.url().should('include', 'login', { timeout: 20000 })
  })

  it('Вход в систему', () => {
    login()
  })

  it('Переход на страницу поиска', () => {
    login()
    cy.visit('travels/explore')
    cy.url().should('include', 'travels/explore')
  })

  it('Поиск путешествия по тегу', () => {
    login()
    cy.visit('travels/explore')
    
    // Ищем путешествие по тегу
    cy.get('.MuiAutocomplete-input')
      .should('be.visible')
      .should('be.enabled')
      .click()
      .type(travel.tag)

    cy.contains('.MuiAutocomplete-option', travel.tag)
      .should('be.visible')
      .click()

    cy.contains('.MuiCard-root', travel.destination)
      .should('be.visible')
      .click()
  })

  it('Сохранение места в избранное', () => {
    login()
    cy.visit('travels/explore')
    
    // Ищем путешествие по тегу
    cy.get('.MuiAutocomplete-input')
      .should('be.visible')
      .should('be.enabled')
      .click()
      .type(travel.tag)

    cy.contains('.MuiAutocomplete-option', travel.tag)
      .should('be.visible')
      .click()

    cy.contains('.MuiCard-root', travel.destination)
      .should('be.visible')
      .click()

    cy.url().should('include', 'travels/')

    cy.contains('h1', 'Париж')
      .should('be.visible')
    
    // Прокручиваем страницу до конца
    cy.scrollTo('bottom')
    
    // Ищем кнопку по тексту
    cy.contains('button', 'Сохранить место')
      .should('be.visible')
      .should('be.enabled')
      .scrollIntoView()
      .click()
    
    // Ждем уведомление об успешном сохранении
    cy.get('.MuiAlert-message')
      .should('be.visible')
      .should('contain', 'сохранен')
  })

  it('Просмотр главной страницы', () => {
    login()
    cy.visit('')
    
    // Проверяем заголовок на главной странице
    cy.contains('h1', 'Популярные туристические места')
      .should('be.visible')
    
    // Проверяем наличие иконки
    cy.get('svg[data-testid="TravelExploreIcon"]')
      .should('be.visible')
    
    // Прокручиваем страницу вниз
    cy.scrollTo('bottom', { duration: 1000 })
    
    // Проверяем наличие секции с советами
    cy.contains('h2', 'Советы для путешественников')
      .should('be.visible')
    
    // Проверяем наличие иконки советов
    cy.get('svg[data-testid="TipsAndUpdatesIcon"]')
      .should('be.visible')
    
    // Проверяем кнопку "Показать еще"
    cy.contains('button', 'Показать еще')
      .should('be.visible')
      .click()
  })

  it('Переход на страницу О проекте', () => {
    // Переходим на страницу О проекте
    cy.visit('/about')
    
    // Проверяем заголовок
    cy.contains('h1', 'О проекте')
      .should('be.visible')

    
    // Проверяем наличие основных секций
    cy.contains('h2', 'О приложении')
      .should('be.visible')
    
    cy.contains('h2', 'Об авторе')
      .should('be.visible')
    
    cy.contains('h2', 'Функциональность')
      .should('be.visible')
    
    // Проверяем наличие ссылок на соцсети
    cy.get('a[href="https://github.com"]')
      .should('be.visible')
      .should('contain', 'GitHub')
    
    cy.get('a[href="https://t.me"]')
      .should('be.visible')
      .should('contain', 'Telegram')
  })

  it('Переход в профиль', () => {
    login()
    cy.get('button').contains(testUser.username)
      .should('be.visible')
      .click()

    cy.contains('Личный кабинет')
      .should('be.visible')
      .click()

    cy.url().should('include', 'profile')
  })

  it('Удаление места из избранного', () => {
    login()
    cy.visit('profile')
    
    // Переходим на вкладку сохраненных мест
    cy.get('.MuiTab-root').contains('Сохраненные места')
      .should('be.visible')
      .click()

    // Находим карточку Парижа и удаляем
    cy.contains('.MuiCard-root', travel.destination)
      .should('be.visible')
      .within(() => {
        // Ищем кнопку с иконкой корзины (DeleteIcon)
        cy.get('.MuiIconButton-root')
          .should('be.visible')
          .should('be.enabled')
          .click()
      })

    // Ждем уведомление об успешном удалении
    cy.get('.MuiAlert-message')
      .should('be.visible')
      .should('contain', 'удален')
  })

  it('Удаление аккаунта', () => {
    login()
    cy.visit('profile')
    
    cy.get('.MuiTab-root').contains('Настройки')
      .should('be.visible')
      .click()

    cy.contains('button', 'Удалить аккаунт')
      .should('be.visible')
      .scrollIntoView()
      .click()
    
    // Подтверждаем удаление в диалоговом окне
    cy.get('.MuiDialog-root')
      .should('be.visible')
      .within(() => {
        cy.contains('button', 'Удалить аккаунт')
          .should('be.visible')
          .should('be.enabled')
          .click()
      })

    // Проверяем редирект на страницу логина
    cy.url().should('include', 'login', { timeout: 10000 })
  })
})
