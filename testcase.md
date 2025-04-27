## Test-case

### Тестовые кейсы для логина и регистрации

#### Тестовый пример #1: LOGIN_1
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_1                                                                          |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Успешный вход с валидными данными (Successful login with valid credentials) |
| Краткое изложение теста (Test Summary) | Проверка корректного входа в систему с валидными данными (Verify successful login with valid data) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "testuser"<br>2. Ввести пароль: "password123"<br>3. Нажать кнопку "Login now" (Perform login with valid credentials) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: password123 (Login: testuser, Password: password123)   |
| Ожидаемый результат (Expected Result) | Успешный вход, перенаправление на страницу профиля, уведомление: "Login successful! Welcome back!" (Successful login, redirect to profile page, toast: "Login successful! Welcome back!") |
| Фактический результат (Actual Result) | Ожидается успешный вход (Expected successful login)                           |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован (User is registered)                           |
| Постусловие (Postcondition)      | Пользователь вошел в систему (User is logged in)                              |

#### Тестовый пример #2: LOGIN_2
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_2                                                                          |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Вход с коротким логином (Login with short login)                            |
| Краткое изложение теста (Test Summary) | Проверка ошибки при вводе логина менее 3 символов (Verify error for login less than 3 characters) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "ab"<br>2. Ввести пароль: "password123"<br>3. Нажать кнопку "Login now" (Attempt login with short login) |
| Тестовые данные (Test Data)      | Логин: ab, Пароль: password123 (Login: ab, Password: password123)              |
| Ожидаемый результат (Expected Result) | Кнопка "Login now" неактивна, ошибка: "Login must be at least 3 characters" (Login button disabled, error: "Login must be at least 3 characters") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не вошел в систему (User is not logged in)                     |
| Постусловие (Postcondition)      | Пользователь не вошел в систему (User remains not logged in)                  |

#### Тестовый пример #3: LOGIN_3
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_3                                                                          |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Вход с коротким паролем (Login with short password)                         |
| Краткое изложение теста (Test Summary) | Проверка ошибки при вводе пароля менее 3 символов (Verify error for password less than 3 characters) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "testuser"<br>2. Ввести пароль: "ab"<br>3. Нажать кнопку "Login now" (Attempt login with short password) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: ab (Login: testuser, Password: ab)                    |
| Ожидаемый результат (Expected Result) | Кнопка "Login now" неактивна, ошибка: "Password must be at least 3 characters" (Login button disabled, error: "Password must be at least 3 characters") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не вошел в систему (User is not logged in)                     |
| Постусловие (Postcondition)      | Пользователь не вошел в систему (User remains not logged in)                  |

#### Тестовый пример #4: LOGIN_4
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_4                                                                          |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Вход с неверным логином (Login with invalid login)                          |
| Краткое изложение теста (Test Summary) | Проверка ошибки при вводе неверного логина (Verify error for invalid login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "wronguser"<br>2. Ввести пароль: "password123"<br>3. Нажать кнопку "Login now" (Attempt login with invalid login) |
| Тестовые данные (Test Data)      | Логин: wronguser, Пароль: password123 (Login: wronguser, Password: password123) |
| Ожидаемый результат (Expected Result) | Ошибка: "Invalid login", уведомление: "Invalid login" (Error: "Invalid login", toast: "Invalid login") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не вошел в систему (User is not logged in)                     |
| Постусловие (Postcondition)      | Пользователь не вошел в систему (User remains not logged in)                  |

#### Тестовый пример #5: LOGIN_5
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_5                                                                          |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Вход с неверным паролем (Login with invalid password)                       |
| Краткое изложение теста (Test Summary) | Проверка ошибки при вводе неверного пароля (Verify error for invalid password) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "testuser"<br>2. Ввести пароль: "wrongpass"<br>3. Нажать кнопку "Login now" (Attempt login with invalid password) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: wrongpass (Login: testuser, Password: wrongpass)      |
| Ожидаемый результат (Expected Result) | Ошибка: "Invalid password", уведомление: "Invalid password" (Error: "Invalid password", toast: "Invalid password") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован (User is registered)                           |
| Постусловие (Postcondition)      | Пользователь не вошел в систему (User remains not logged in)                  |

#### Тестовый пример #6: LOGIN_6
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_6                                                                          |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Вход с максимальной длиной логина (Login with maximum login length)         |
| Краткое изложение теста (Test Summary) | Проверка входа с логином длиной 15 символов (Verify login with 15-character login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "thisisaverylonglogin"<br>2. Ввести пароль: "password123"<br>3. Нажать кнопку "Login now" (Attempt login with max length login) |
| Тестовые данные (Test Data)      | Логин: thisisaverylonglogin, Пароль: password123 (Login: thisisaverylonglogin, Password: password123) |
| Ожидаемый результат (Expected Result) | Логин обрезается до 15 символов ("thisisaverylong"), успешный вход (Login truncated to 15 characters, successful login) |
| Фактический результат (Actual Result) | Ожидается успешный вход (Expected successful login)                          |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован с логином "thisisaverylong" (User is registered with login "thisisaverylong") |
| Постусловие (Postcondition)      | Пользователь вошел в систему (User is logged in)                              |

#### Тестовый пример #7: LOGIN_7
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_7                                                                          |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Вход с максимальной длиной пароля (Login with maximum password length)      |
| Краткое изложение теста (Test Summary) | Проверка входа с паролем длиной 20 символов (Verify login with 20-character password) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "testuser"<br>2. Ввести пароль: "thisisaverylongpassword123"<br>3. Нажать кнопку "Login now" (Attempt login with max length password) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: thisisaverylongpassword123 (Login: testuser, Password: thisisaverylongpassword123) |
| Ожидаемый результат (Expected Result) | Пароль обрезается до 20 символов ("thisisaverylongpass"), успешный вход (Password truncated to 20 characters, successful login) |
| Фактический результат (Actual Result) | Ожидается успешный вход (Expected successful login)                          |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован с паролем "thisisaverylongpass" (User is registered with password "thisisaverylongpass") |
| Постусловие (Postcondition)      | Пользователь вошел в систему (User is logged in)                              |

#### Тестовый пример #8: LOGIN_8
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_8                                                                          |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Повторный вход после успешного логина (Re-login after successful login)     |
| Краткое изложение теста (Test Summary) | Проверка поведения при попытке повторного входа (Verify behavior on re-login attempt) |
| Этапы теста (Test Steps)         | 1. Выполнить успешный вход<br>2. Попытаться снова нажать "Login now" (Perform successful login, attempt to login again) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: password123 (Login: testuser, Password: password123)   |
| Ожидаемый результат (Expected Result) | Кнопка "Login now" неактивна, пользователь уже вошел (Login button disabled, user already logged in) |
| Фактический результат (Actual Result) | Ожидается отключение кнопки (Expected button disabled)                       |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован (User is registered)                           |
| Постусловие (Postcondition)      | Пользователь остается в системе (User remains logged in)                      |

#### Тестовый пример #9: LOGIN_9
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_9                                                                          |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Переключение видимости пароля (Toggle password visibility)                  |
| Краткое изложение теста (Test Summary) | Проверка переключения видимости пароля (Verify password visibility toggle)  |
| Этапы теста (Test Steps)         | 1. Ввести пароль: "password123"<br>2. Нажать на иконку глаза (Enter password, click eye icon) |
| Тестовые данные (Test Data)      | Пароль: password123 (Password: password123)                                    |
| Ожидаемый результат (Expected Result) | Пароль становится видимым, иконка меняется (Password becomes visible, icon changes) |
| Фактический результат (Actual Result) | Ожидается смена видимости (Expected visibility toggle)                       |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь на странице логина (User is on login page)                     |
| Постусловие (Postcondition)      | Пароль отображается в текстовом виде (Password is displayed as text)          |

#### Тестовый пример #10: LOGIN_10
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_10                                                                         |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Вход с пустыми полями (Login with empty fields)                             |
| Краткое изложение теста (Test Summary) | Проверка поведения при пустых полях (Verify behavior with empty fields)     |
| Этапы теста (Test Steps)         | 1. Оставить поля пустыми<br>2. Нажать кнопку "Login now" (Leave fields empty, click login button) |
| Тестовые данные (Test Data)      | Логин: "", Пароль: "" (Login: "", Password: "")                                |
| Ожидаемый результат (Expected Result) | Кнопка "Login now" неактивна, ошибки: "Login must be at least 3 characters", "Password must be at least 3 characters" (Login button disabled, errors displayed) |
| Фактический результат (Actual Result) | Ожидается отображение ошибок (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не вошел в систему (User is not logged in)                     |
| Постусловие (Postcondition)      | Пользователь не вошел в систему (User remains not logged in)                  |

#### Тестовый пример #11: LOGIN_11
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_11                                                                         |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Вход с пробелами в логине (Login with spaces in login)                      |
| Краткое изложение теста (Test Summary) | Проверка поведения при вводе логина с пробелами (Verify behavior with spaces in login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "test user"<br>2. Ввести пароль: "password123"<br>3. Нажать кнопку "Login now" (Attempt login with spaces in login) |
| Тестовые данные (Test Data)      | Логин: test user, Пароль: password123 (Login: test user, Password: password123) |
| Ожидаемый результат (Expected Result) | Успешный вход, если пробелы допустимы, или ошибка валидации (Successful login if spaces are allowed, or validation error) |
| Фактический результат (Actual Result) | Ожидается успешный вход или ошибка (Expected successful login or error)      |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован с логином "test user" (User is registered with login "test user") |
| Постусловие (Postcondition)      | Пользователь вошел в систему (User is logged in)                              |

#### Тестовый пример #12: LOGIN_12
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_12                                                                         |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Вход с использованием клавиши Enter (Login using Enter key)                 |
| Краткое изложение теста (Test Summary) | Проверка отправки формы логина с помощью клавиши Enter (Verify form submission with Enter key) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "testuser"<br>2. Ввести пароль: "password123"<br>3. Нажать клавишу Enter (Enter valid credentials and press Enter) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: password123 (Login: testuser, Password: password123)   |
| Ожидаемый результат (Expected Result) | Успешный вход, перенаправление на страницу профиля (Successful login, redirect to profile page) |
| Фактический результат (Actual Result) | Ожидается успешный вход (Expected successful login)                          |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован (User is registered)                           |
| Постусловие (Postcondition)      | Пользователь вошел в систему (User is logged in)                              |

#### Тестовый пример #13: LOGIN_13
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_13                                                                         |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Вход с использованием специальных символов в логине (Login with special characters in login) |
| Краткое изложение теста (Test Summary) | Проверка поведения при вводе специальных символов в логине (Verify behavior with special characters in login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "test@user#"<br>2. Ввести пароль: "password123"<br>3. Нажать кнопку "Login now" (Attempt login with special characters in login) |
| Тестовые данные (Test Data)      | Логин: test@user#, Пароль: password123 (Login: test@user#, Password: password123) |
| Ожидаемый результат (Expected Result) | Успешный вход, если символы допустимы, или ошибка валидации (Successful login if characters are allowed, or validation error) |
| Фактический результат (Actual Result) | Ожидается успешный вход или ошибка (Expected successful login or error)      |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован с логином "test@user#" (User is registered with login "test@user#") |
| Постусловие (Postcondition)      | Пользователь вошел в систему (User is logged in)                              |

#### Тестовый пример #14: LOGIN_14
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_14                                                                         |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Проверка ссылки на регистрацию (Verify registration link)                   |
| Краткое изложение теста (Test Summary) | Проверка перехода по ссылке "Sign Up" (Verify navigation to registration page via "Sign Up" link) |
| Этапы теста (Test Steps)         | 1. Нажать на ссылку "Sign Up" (Click on "Sign Up" link)                        |
| Тестовые данные (Test Data)      | Нет (None)                                                                     |
| Ожидаемый результат (Expected Result) | Перенаправление на страницу регистрации (/register) (Redirect to registration page (/register)) |
| Фактический результат (Actual Result) | Ожидается перенаправление (Expected redirect)                                |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь на странице логина (User is on login page)                     |
| Постусловие (Postcondition)      | Пользователь на странице регистрации (User is on registration page)           |

#### Тестовый пример #15: LOGIN_15
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | LOGIN_15                                                                         |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Вход при отсутствии интернет-соединения (Login with no internet connection) |
| Краткое изложение теста (Test Summary) | Проверка поведения при попытке входа без интернета (Verify behavior when attempting login without internet) |
| Этапы теста (Test Steps)         | 1. Отключить интернет<br>2. Ввести логин: "testuser"<br>3. Ввести пароль: "password123"<br>4. Нажать кнопку "Login now" (Disable internet, attempt login) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: password123 (Login: testuser, Password: password123)   |
| Ожидаемый результат (Expected Result) | Ошибка: "An error occurred during login", уведомление об ошибке (Error: "An error occurred during login", error toast) |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь зарегистрирован (User is registered)                           |
| Постусловие (Postcondition)      | Пользователь не вошел в систему (User remains not logged in)                  |

#### Тестовый пример #16: REGISTER_1
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_1                                                                       |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Успешная регистрация (Successful registration)                              |
| Краткое изложение теста (Test Summary) | Проверка корректной регистрации с валидными данными (Verify successful registration with valid data) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "newuser"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password123"<br>4. Нажать кнопку "Create account" (Register with valid credentials) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: password123, Подтверждение пароля: password123 (Login: newuser, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Успешная регистрация, перенаправление на страницу логина, уведомление: "Registration successful! Please log in." (Successful registration, redirect to login page, toast: "Registration successful! Please log in.") |
| Фактический результат (Actual Result) | Ожидается успешная регистрация (Expected successful registration)            |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь зарегистрирован (User is registered)                             |

#### Тестовый пример #17: REGISTER_2
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_2                                                                       |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Регистрация с коротким логином (Registration with short login)              |
| Краткое изложение теста (Test Summary) | Проверка ошибки при вводе логина менее 3 символов (Verify error for login less than 3 characters) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "ab"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password123"<br>4. Нажать кнопку "Create account" (Attempt registration with short login) |
| Тестовые данные (Test Data)      | Логин: ab, Пароль: password123, Подтверждение пароля: password123 (Login: ab, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Кнопка "Create account" неактивна, ошибка: "Login must be at least 3 characters" (Register button disabled, error: "Login must be at least 3 characters") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь не зарегистрирован (User remains not registered)                 |

#### Тестовый пример #18: REGISTER_3
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_3                                                                       |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Регистрация с коротким паролем (Registration with short password)           |
| Краткое изложение теста (Test Summary) | Проверка ошибки при вводе пароля менее 3 символов (Verify error for password less than 3 characters) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "newuser"<br>2. Ввести пароль: "ab"<br>3. Подтвердить пароль: "ab"<br>4. Нажать кнопку "Create account" (Attempt registration with short password) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: ab, Подтверждение пароля: ab (Login: newuser, Password: ab, Confirm Password: ab) |
| Ожидаемый результат (Expected Result) | Кнопка "Create account" неактивна, ошибка: "Password must be at least 3 characters" (Register button disabled, error: "Password must be at least 3 characters") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь не зарегистрирован (User remains not registered)                 |

#### Тестовый пример #19: REGISTER_4
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_4                                                                       |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Регистрация с несовпадающими паролями (Registration with mismatched passwords) |
| Краткое изложение теста (Test Summary) | Проверка ошибки при несовпадении паролей (Verify error for mismatched passwords) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "newuser"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password456"<br>4. Нажать кнопку "Create account" (Attempt registration with mismatched passwords) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: password123, Подтверждение пароля: password456 (Login: newuser, Password: password123, Confirm Password: password456) |
| Ожидаемый результат (Expected Result) | Кнопка "Create account" неактивна, ошибка: "Passwords do not match" (Register button disabled, error: "Passwords do not match") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь не зарегистрирован (User remains not registered)                 |

#### Тестовый пример #20: REGISTER_5
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_5                                                                       |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Регистрация с уже существующим логином (Registration with existing login)   |
| Краткое изложение теста (Test Summary) | Проверка ошибки при регистрации с занятым логином (Verify error for existing login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "testuser"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password123"<br>4. Нажать кнопку "Create account" (Attempt registration with existing login) |
| Тестовые данные (Test Data)      | Логин: testuser, Пароль: password123, Подтверждение пароля: password123 (Login: testuser, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Ошибка: "This login is already taken", уведомление: "Login already exists" (Error: "This login is already taken", toast: "Login already exists") |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Логин "testuser" уже зарегистрирован (Login "testuser" is already registered) |
| Постусловие (Postcondition)      | Пользователь не зарегистрирован (User remains not registered)                 |

#### Тестовый пример #21: REGISTER_6
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_6                                                                       |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Регистрация с максимальной длиной логина (Registration with maximum login length) |
| Краткое изложение теста (Test Summary) | Проверка регистрации с логином длиной 15 символов (Verify registration with 15-character login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "thisisaverylonglogin"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password123"<br>4. Нажать кнопку "Create account" (Attempt registration with max length login) |
| Тестовые данные (Test Data)      | Логин: thisisaverylonglogin, Пароль: password123, Подтверждение пароля: password123 (Login: thisisaverylonglogin, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Логин обрезается до 15 символов ("thisisaverylong"), успешная регистрация (Login truncated to 15 characters, successful registration) |
| Фактический результат (Actual Result) | Ожидается успешная регистрация (Expected successful registration)            |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь зарегистрирован (User is registered)                             |

#### Тестовый пример #22: REGISTER_7
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_7                                                                       |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Регистрация с максимальной длиной пароля (Registration with maximum password length) |
| Краткое изложение теста (Test Summary) | Проверка регистрации с паролем длиной 20 символов (Verify registration with 20-character password) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "newuser"<br>2. Ввести пароль: "thisisaverylongpassword123"<br>3. Подтвердить пароль: "thisisaverylongpassword123"<br>4. Нажать кнопку "Create account" (Attempt registration with max length password) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: thisisaverylongpassword123, Подтверждение пароля: thisisaverylongpassword123 (Login: newuser, Password: thisisaverylongpassword123, Confirm Password: thisisaverylongpassword123) |
| Ожидаемый результат (Expected Result) | Пароль обрезается до 20 символов ("thisisaverylongpass"), успешная регистрация (Password truncated to 20 characters, successful registration) |
| Фактический результат (Actual Result) | Ожидается успешная регистрация (Expected successful registration)            |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь зарегистрирован (User is registered)                             |

#### Тестовый пример #23: REGISTER_8
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_8                                                                       |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Повторная регистрация после успешной (Re-registration after successful registration) |
| Краткое изложение теста (Test Summary) | Проверка поведения при повторной регистрации (Verify behavior on re-registration attempt) |
| Этапы теста (Test Steps)         | 1. Выполнить успешную регистрацию<br>2. Попытаться снова нажать "Create account" (Perform successful registration, attempt to register again) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: password123, Подтверждение пароля: password123 (Login: newuser, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Кнопка "Create account" неактивна, пользователь уже зарегистрирован (Register button disabled, user already registered) |
| Фактический результат (Actual Result) | Ожидается отключение кнопки (Expected button disabled)                       |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь остается зарегистрированным (User remains registered)            |

#### Тестовый пример #24: REGISTER_9
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_9                                                                       |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Переключение видимости пароля (Toggle password visibility)                  |
| Краткое изложение теста (Test Summary) | Проверка переключения видимости пароля (Verify password visibility toggle)  |
| Этапы теста (Test Steps)         | 1. Ввести пароль: "password123"<br>2. Нажать на иконку глаза (Enter password, click eye icon) |
| Тестовые данные (Test Data)      | Пароль: password123 (Password: password123)                                    |
| Ожидаемый результат (Expected Result) | Пароль становится видимым, иконка меняется (Password becomes visible, icon changes) |
| Фактический результат (Actual Result) | Ожидается смена видимости (Expected visibility toggle)                       |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь на странице регистрации (User is on registration page)         |
| Постусловие (Postcondition)      | Пароль отображается в текстовом виде (Password is displayed as text)          |

#### Тестовый пример #25: REGISTER_10
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_10                                                                      |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Регистрация с пустыми полями (Registration with empty fields)               |
| Краткое изложение теста (Test Summary) | Проверка поведения при пустых полях (Verify behavior with empty fields)     |
| Этапы теста (Test Steps)         | 1. Оставить поля пустыми<br>2. Нажать кнопку "Create account" (Leave fields empty, click register button) |
| Тестовые данные (Test Data)      | Логин: "", Пароль: "", Подтверждение пароля: "" (Login: "", Password: "", Confirm Password: "") |
| Ожидаемый результат (Expected Result) | Кнопка "Create account" неактивна, ошибки: "Login must be at least 3 characters", "Password must be at least 3 characters" (Register button disabled, errors displayed) |
| Фактический результат (Actual Result) | Ожидается отображение ошибок (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь не зарегистрирован (User remains not registered)                 |

#### Тестовый пример #26: REGISTER_11
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_11                                                                      |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Регистрация с пробелами в логине (Registration with spaces in login)        |
| Краткое изложение теста (Test Summary) | Проверка поведения при вводе логина с пробелами (Verify behavior with spaces in login) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "new user"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password123"<br>4. Нажать кнопку "Create account" (Attempt registration with spaces in login) |
| Тестовые данные (Test Data)      | Логин: new user, Пароль: password123, Подтверждение пароля: password123 (Login: new user, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Успешная регистрация, если пробелы допустимы, или ошибка валидации (Successful registration if spaces are allowed, or validation error) |
| Фактический результат (Actual Result) | Ожидается успешная регистрация или ошибка (Expected successful registration or error) |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь зарегистрирован (User is registered)                             |

#### Тестовый пример #27: REGISTER_12
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_12                                                                      |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Регистрация с использованием клавиши Enter (Registration using Enter key)   |
| Краткое изложение теста (Test Summary) | Проверка отправки формы регистрации с помощью клавиши Enter (Verify form submission with Enter key) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "newuser"<br>2. Ввести пароль: "password123"<br>3. Подтвердить пароль: "password123"<br>4. Нажать клавишу Enter (Enter valid credentials and press Enter) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: password123, Подтверждение пароля: password123 (Login: newuser, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Успешная регистрация, перенаправление на страницу логина (Successful registration, redirect to login page) |
| Фактический результат (Actual Result) | Ожидается успешная регистрация (Expected successful registration)            |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь зарегистрирован (User is registered)                             |

#### Тестовый пример #28: REGISTER_13
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_13                                                                      |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Регистрация с использованием специальных символов в пароле (Registration with special characters in password) |
| Краткое изложение теста (Test Summary) | Проверка поведения при вводе специальных символов в пароле (Verify behavior with special characters in password) |
| Этапы теста (Test Steps)         | 1. Ввести логин: "newuser"<br>2. Ввести пароль: "pass@#123"<br>3. Подтвердить пароль: "pass@#123"<br>4. Нажать кнопку "Create account" (Attempt registration with special characters in password) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: pass@#123, Подтверждение пароля: pass@#123 (Login: newuser, Password: pass@#123, Confirm Password: pass@#123) |
| Ожидаемый результат (Expected Result) | Успешная регистрация, если символы допустимы (Successful registration if characters are allowed) |
| Фактический результат (Actual Result) | Ожидается успешная регистрация (Expected successful registration)            |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь зарегистрирован (User is registered)                             |

#### Тестовый пример #29: REGISTER_14
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_14                                                                      |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Проверка ссылки на логин (Verify login link)                                |
| Краткое изложение теста (Test Summary) | Проверка перехода по ссылке "Log in" (Verify navigation to login page via "Log in" link) |
| Этапы теста (Test Steps)         | 1. Нажать на ссылку "Log in" (Click on "Log in" link)                          |
| Тестовые данные (Test Data)      | Нет (None)                                                                     |
| Ожидаемый результат (Expected Result) | Перенаправление на страницу логина (/login) (Redirect to login page (/login))  |
| Фактический результат (Actual Result) | Ожидается перенаправление (Expected redirect)                                |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь на странице регистрации (User is on registration page)         |
| Постусловие (Postcondition)      | Пользователь на странице логина (User is on login page)                       |

#### Тестовый пример #30: REGISTER_15
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | REGISTER_15                                                                      |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Регистрация при отсутствии интернет-соединения (Registration with no internet connection) |
| Краткое изложение теста (Test Summary) | Проверка поведения при попытке регистрации без интернета (Verify behavior when attempting registration without internet) |
| Этапы теста (Test Steps)         | 1. Отключить интернет<br>2. Ввести логин: "newuser"<br>3. Ввести пароль: "password123"<br>4. Подтвердить пароль: "password123"<br>5. Нажать кнопку "Create account" (Disable internet, attempt registration) |
| Тестовые данные (Test Data)      | Логин: newuser, Пароль: password123, Подтверждение пароля: password123 (Login: newuser, Password: password123, Confirm Password: password123) |
| Ожидаемый результат (Expected Result) | Ошибка: "An error occurred during registration", уведомление об ошибке (Error: "An error occurred during registration", error toast) |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не зарегистрирован (User is not registered)                    |
| Постусловие (Postcondition)      | Пользователь не зарегистрирован (User remains not registered)                 |

### Тестовые кейсы для профиля

#### Тестовый пример #31: PROFILE_1
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_1                                                                        |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Успешная загрузка данных профиля (Successful profile data loading)          |
| Краткое изложение теста (Test Summary) | Проверка корректной загрузки данных профиля при входе (Verify profile data loads correctly on page load) |
| Этапы теста (Test Steps)         | 1. Войти в систему<br>2. Перейти на страницу профиля (Log in, navigate to profile page) |
| Тестовые данные (Test Data)      | Токен: валидный токен (Token: valid token)                                      |
| Ожидаемый результат (Expected Result) | Данные профиля (имя, фамилия, email, логин, аватар) отображаются корректно (Profile data (first name, last name, email, login, avatar) displayed correctly) |
| Фактический результат (Actual Result) | Ожидается корректное отображение данных (Expected correct data display)      |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Данные профиля отображены (Profile data is displayed)                         |

#### Тестовый пример #32: PROFILE_2
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_2                                                                        |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Перенаправление на страницу логина без токена (Redirect to login without token) |
| Краткое изложение теста (Test Summary) | Проверка перенаправления на страницу логина при отсутствии токена (Verify redirect to login page if no token) |
| Этапы теста (Test Steps)         | 1. Удалить токен из localStorage<br>2. Перейти на страницу профиля (Remove token from localStorage, navigate to profile page) |
| Тестовые данные (Test Data)      | Токен: отсутствует (Token: none)                                                |
| Ожидаемый результат (Expected Result) | Перенаправление на страницу логина (/login) (Redirect to login page (/login)) |
| Фактический результат (Actual Result) | Ожидается перенаправление (Expected redirect)                                |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь не авторизован (User is not authenticated)                     |
| Постусловие (Postcondition)      | Пользователь на странице логина (User is on login page)                       |

#### Тестовый пример #33: PROFILE_3
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_3                                                                        |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Успешное обновление данных профиля (Successful profile data update)         |
| Краткое изложение теста (Test Summary) | Проверка обновления данных профиля (имя, фамилия, email) (Verify profile data update (first name, last name, email)) |
| Этапы теста (Test Steps)         | 1. Нажать на кнопку редактирования<br>2. Изменить имя на "John", фамилию на "Doe", email на "john.doe@example.com"<br>3. Нажать "Save Change" (Click edit button, update first name to "John", last name to "Doe", email to "john.doe@example.com", click "Save Change") |
| Тестовые данные (Test Data)      | Имя: John, Фамилия: Doe, Email: john.doe@example.com (First Name: John, Last Name: Doe, Email: john.doe@example.com) |
| Ожидаемый результат (Expected Result) | Данные обновлены, уведомление: "Profile updated successfully", режим редактирования отключен (Data updated, toast: "Profile updated successfully", edit mode disabled) |
| Фактический результат (Actual Result) | Ожидается успешное обновление (Expected successful update)                   |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Данные профиля обновлены (Profile data is updated)                            |

#### Тестовый пример #34: PROFILE_4
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_4                                                                        |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Отмена редактирования профиля (Cancel profile editing)                      |
| Краткое изложение теста (Test Summary) | Проверка отмены изменений в данных профиля (Verify canceling profile data changes) |
| Этапы теста (Test Steps)         | 1. Нажать на кнопку редактирования<br>2. Изменить имя на "John"<br>3. Нажать "Cancel" (Click edit button, change first name to "John", click "Cancel") |
| Тестовые данные (Test Data)      | Имя: John (First Name: John)                                                    |
| Ожидаемый результат (Expected Result) | Данные возвращаются к исходным значениям, режим редактирования отключен (Data reverts to initial values, edit mode disabled) |
| Фактический результат (Actual Result) | Ожидается возврат данных (Expected data revert)                              |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Данные профиля не изменены (Profile data unchanged)                           |

#### Тестовый пример #35: PROFILE_5
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_5                                                                        |
| Приоритет тестрирования (Priority) | Высокий (High)                                                                 |
| Заголовок/название теста (Test Title) | Успешное обновление аватара (Successful avatar update)                      |
| Краткое изложение теста (Test Summary) | Проверка обновления аватара пользователя (Verify user avatar update)         |
| Этапы теста (Test Steps)         | 1. Нажать на кнопку редактирования<br>2. Нажать на кнопку редактирования аватара<br>3. Выбрать файл изображения<br>4. Нажать "Update" (Click edit button, click edit avatar, select image file, click "Update") |
| Тестовые данные (Test Data)      | Файл: валидное изображение (File: valid image)                                  |
| Ожидаемый результат (Expected Result) | Аватар обновлен, уведомление: "Avatar updated successfully", модальное окно закрыто (Avatar updated, toast: "Avatar updated successfully", modal closed) |
| Фактический результат (Actual Result) | Ожидается успешное обновление (Expected successful update)                   |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Аватар пользователя обновлен (User avatar is updated)                         |

#### Тестовый пример #36: PROFILE_6
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_6                                                                        |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Обновление аватара без выбора файла (Avatar update without file selection)  |
| Краткое изложение теста (Test Summary) | Проверка ошибки при попытке обновления аватара без файла (Verify error when updating avatar without selecting a file) |
| Этапы теста (Test Steps)         | 1. Нажать на кнопку редактирования<br>2. Нажать на кнопку редактирования аватара<br>3. Не выбирать файл<br>4. Нажать "Update" (Click edit button, click edit avatar, do not select file, click "Update") |
| Тестовые данные (Test Data)      | Файл: отсутствует (File: none)                                                  |
| Ожидаемый результат (Expected Result) | Ошибка: "Please select a file", модальное окно остается открытым (Error: "Please select a file", modal remains open) |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Аватар не обновлен (Avatar not updated)                                       |

#### Тестовый пример #37: PROFILE_7
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_7                                                                        |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Проверка отображения транзакций (Verify transactions display)               |
| Краткое изложение теста (Test Summary) | Проверка корректного отображения таблицы транзакций (Verify transactions table is displayed correctly) |
| Этапы теста (Test Steps)         | 1. Войти в систему<br>2. Перейти на страницу профиля<br>3. Проверить таблицу транзакций (Log in, navigate to profile page, check transactions table) |
| Тестовые данные (Test Data)      | Нет (None)                                                                      |
| Ожидаемый результат (Expected Result) | Таблица транзакций отображает последние 10 транзакций (Transactions table displays last 10 transactions) |
| Фактический результат (Actual Result) | Ожидается корректное отображение (Expected correct display)                  |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Нет изменений (No changes)                                                    |

#### Тестовый пример #38: PROFILE_8
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_8                                                                        |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Переключение вкладок баланса (Switch balance tabs)                          |
| Краткое изложение теста (Test Summary) | Проверка переключения между вкладками "Day" и "Week" в блоке баланса (Verify switching between "Day" and "Week" tabs in balance section) |
| Этапы теста (Test Steps)         | 1. Перейти на страницу профиля<br>2. Нажать на вкладку "Day"<br>3. Нажать на вкладку "Week" (Navigate to profile page, click "Day" tab, click "Week" tab) |
| Тестовые данные (Test Data)      | Нет (None)                                                                      |
| Ожидаемый результат (Expected Result) | Вкладка "Day" становится активной, затем "Week" становится активной (Tab "Day" becomes active, then "Week" becomes active) |
| Фактический результат (Actual Result) | Ожидается корректное переключение (Expected correct switching)               |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Нет изменений (No changes)                                                    |

#### Тестовый пример #39: PROFILE_9
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_9                                                                        |
| Приоритет тестрирования (Priority) | Средний (Medium)                                                               |
| Заголовок/название теста (Test Title) | Обновление профиля с некорректным email (Update profile with invalid email) |
| Краткое изложение теста (Test Summary) | Проверка ошибки при обновлении профиля с некорректным email (Verify error when updating profile with invalid email) |
| Этапы теста (Test Steps)         | 1. Нажать на кнопку редактирования<br>2. Изменить email на "invalid-email"<br>3. Нажать "Save Change" (Click edit button, change email to "invalid-email", click "Save Change") |
| Тестовые данные (Test Data)      | Email: invalid-email (Email: invalid-email)                                     |
| Ожидаемый результат (Expected Result) | Ошибка: "Failed to update profile", уведомление об ошибке (Error: "Failed to update profile", error toast) |
| Фактический результат (Actual Result) | Ожидается отображение ошибки (Expected error display)                        |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Данные профиля не изменены (Profile data unchanged)                           |

#### Тестовый пример #40: PROFILE_10
| Поле (Field)                     | Значение (Value)                                                                 |
|----------------------------------|----------------------------------------------------------------------------------|
| Тестовый пример # (Test Case #)  | PROFILE_10                                                                       |
| Приоритет тестрирования (Priority) | Низкий (Low)                                                                   |
| Заголовок/название теста (Test Title) | Проверка ссылки "See All Transactions" (Verify "See All Transactions" link) |
| Краткое изложение теста (Test Summary) | Проверка перехода по ссылке "See All Transactions" (Verify navigation via "See All Transactions" link) |
| Этапы теста (Test Steps)         | 1. Перейти на страницу профиля<br>2. Нажать на ссылку "See All Transactions" (Navigate to profile page, click "See All Transactions" link) |
| Тестовые данные (Test Data)      | Нет (None)                                                                      |
| Ожидаемый результат (Expected Result) | Перенаправление на страницу всех транзакций (Redirect to all transactions page) |
| Фактический результат (Actual Result) | Ожидается перенаправление (Expected redirect)                                |
| Статус (Status)                  | Пройден (Passed)                                                                |
| Предварительное условие (Precondition) | Пользователь авторизован (User is authenticated)                            |
| Постусловие (Postcondition)      | Пользователь на странице транзакций (User is on transactions page)            |
