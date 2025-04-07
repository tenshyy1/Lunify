## Тестовые кейсы для логина и регистрации

### Тестовые кейсы для логина

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

### Тестовые кейсы для регистрации

#### Тестовый пример #1: REGISTER_1
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

#### Тестовый пример #2: REGISTER_2
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

#### Тестовый пример #3: REGISTER_3
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

#### Тестовый пример #4: REGISTER_4
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

#### Тестовый пример #5: REGISTER_5
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

#### Тестовый пример #6: REGISTER_6
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

#### Тестовый пример #7: REGISTER_7
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

#### Тестовый пример #8: REGISTER_8
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

#### Тестовый пример #9: REGISTER_9
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

#### Тестовый пример #10: REGISTER_10
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
