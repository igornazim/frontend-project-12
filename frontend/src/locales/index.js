const resources = {
  ru: {
    translation: {
      errors: {
        nameMinlength: 'Минимум 3 символа',
        namaMaxlength: 'Максимум 20 символов',
        passwordMinLenth: 'Минимум 6 символов',
        required: 'Обязательное поле',
        confirmPassword: 'Пароли должны совпадать',
        notOneOfUser: 'Такой пользователь уже существует',
        notOneOfChannel: 'Должно быть уникальным',
        incorrectNameOrPass: 'Неверные имя пользователя или пароль',
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
        counter: {
          count_one: '{{count}} сообщение',
          count_few: '{{count}} сообщения',
          count_many: '{{count}} сообщений',
        },
        inputText: 'Введите сообщение...',
        dropdownItemDelete: 'Удалить',
        dropdownItemRename: 'Переименовать',
      },
      modals: {
        add: {
          headline: 'Добавить канал',
          cancelButton: 'Отменить',
          submitButton: 'Отправить',
        },
        rename: {
          headline: 'Переименовать канал',
          cancelButton: 'Отменить',
          submitButton: 'Отправить',
        },
        remove: {
          headline: 'Удалить канал',
          subText: 'Уверены?',
          cancelButton: 'Отменить',
          submitButton: 'Отправить',
        },
      },
    },
  },
};

export default resources;