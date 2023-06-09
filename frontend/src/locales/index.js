const resources = {
  ru: {
    translation: {
      errors: {
        nameMinlength: 'От 3 до 20 символов',
        nameMaxlength: 'Максимум 20 символов',
        passwordMinLenth: 'Не менее 6 символов',
        required: 'Обязательное поле',
        confirmPassword: 'Пароли должны совпадать',
        notOneOfUser: 'Такой пользователь уже существует',
        notOneOfChannel: 'Должно быть уникальным',
        incorrectNameOrPass: 'Неверные имя пользователя или пароль',
        fetchingError: 'Error fetching data',
        connectionError: 'Ошибка соединения',
        submitError: 'Не удалось отправить форму',
      },
      header: {
        logoText: 'Hexlet chat',
        logInButton: 'Войти',
        logOutButton: 'Выйти',
      },
      authForm: {
        headline: 'Войти',
        logInButton: 'Войти',
        footerText: 'Нет аккаунта?',
        footerButton: 'Регистрация',
      },
      signUpForm: {
        headline: 'Регистрация',
        signUpButton: 'Зарегистрироваться',
        footerText: 'Уже зарегистрированы?',
        footerButton: 'Войти',
      },
      chat: {
        headline: 'Каналы',
        defaultChannel: 'general',
        counter: {
          count_one: '{{count}} сообщение',
          count_few: '{{count}} сообщения',
          count_many: '{{count}} сообщений',
        },
        inputText: 'Введите сообщение...',
        dropdownItemDelete: 'Удалить',
        dropdownItemRename: 'Переименовать',
        hiddenText: 'Управление каналом',
      },
      modals: {
        add: {
          headline: 'Добавить канал',
          cancelButton: 'Отменить',
          submitButton: 'Отправить',
          toastText: 'Канал создан',
        },
        rename: {
          headline: 'Переименовать канал',
          cancelButton: 'Отменить',
          submitButton: 'Отправить',
          toastText: 'Канал переименован',
        },
        remove: {
          headline: 'Удалить канал',
          subText: 'Уверены?',
          cancelButton: 'Отменить',
          submitButton: 'Отправить',
          toastText: 'Канал удалён',
        },
      },
      page404: {
        headline: '404',
        thirdLevelHeadLine: 'Страница не найдена',
        textPartOne: 'Но вы можете перейти на ',
        textPartTwo: 'главную страницу',
      },
    },
  },
};

export default resources;
