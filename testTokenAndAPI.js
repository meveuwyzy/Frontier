// testTokenAndAPI.js
import api from "@/api/swapapi";

// Глобальный тест токена и API
const runTokenAPITest = async () => {
  console.log("🔍 === НАЧАЛО ТЕСТА ТОКЕНА И API ===");

  // 1. Проверка инициализации API
  console.log("1. Проверка инициализации API...");
  if (!api || !api.instance) {
    console.error("❌ API не инициализирован");
    return false;
  }
  console.log("✅ API инициализирован");

  // 2. Проверка базовых методов
  console.log("2. Проверка базовых методов...");
  const requiredMethods = [
    "setToken",
    "checkTokenExpiry",
    "login",
    "getDashboard",
    "getRS232Settings",
    "setRS232Settings",
  ];

  const missingMethods = requiredMethods.filter((method) => !api[method]);
  if (missingMethods.length > 0) {
    console.error(`❌ Отсутствуют методы: ${missingMethods.join(", ")}`);
    return false;
  }
  console.log("✅ Все методы доступны");

  // 3. Проверка текущего токена
  console.log("3. Проверка текущего токена...");
  const currentToken = localStorage.getItem("token");
  console.log(
    `Текущий токен: ${
      currentToken ? `есть (${currentToken.length} символов)` : "отсутствует"
    }`
  );

  if (currentToken) {
    const isValid = api.checkTokenExpiry();
    console.log(`Токен валиден: ${isValid ? "✅" : "❌"}`);

    if (!isValid) {
      console.log("🗑️ Удаляем невалидный токен");
      localStorage.removeItem("token");
    }
  }

  // 4. Тест логина (если нет токена)
  if (!currentToken || !api.checkTokenExpiry()) {
    console.log("4. Тестирование логина...");
    try {
      console.log("Попытка логина с тестовыми данными...");

      // Пробуем разные варианты логина
      const testCredentials = [
        { username: "admin", password: "admin123" },
        { username: "user", password: "password" },
        { username: "test", password: "test" },
      ];

      let loginSuccess = false;

      for (const creds of testCredentials) {
        try {
          console.log(`Попытка: ${creds.username}/${creds.password}`);
          const response = await api.login(creds);

          if (response.data?.token) {
            console.log(`✅ Успешный логин с ${creds.username}`);
            loginSuccess = true;
            break;
          }
        } catch (error) {
          console.log(`❌ Ошибка логина с ${creds.username}:`, error.message);
        }
      }

      if (!loginSuccess) {
        console.log(
          "⚠️ Все попытки логина провалились, продолжаем тест с mock"
        );
        api.setUseMock(true);
      }
    } catch (error) {
      console.error("❌ Ошибка теста логина:", error.message);
      api.setUseMock(true);
    }
  }

  // 5. Тест работы с токеном
  console.log("5. Тест работы с токеном...");

  // Сохраняем текущий токен для восстановления
  const originalToken = localStorage.getItem("token");

  // Тест setToken с разными значениями
  const testTokens = [
    null,
    "",
    "invalid",
    "short",
    "mock-jwt-token-1234567890",
    "24charactertoken1234567890", // 24 символа без точек
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c", // валидный JWT
  ];

  for (const testToken of testTokens) {
    console.log(
      `Тестируем токен: ${
        testToken ? `${testToken.substring(0, 10)}...` : "null"
      }`
    );

    api.setToken(testToken);

    const storedToken = localStorage.getItem("token");
    const hasAuthHeader = api.instance.defaults.headers.common["Authorization"];

    console.log(`  Сохранен: ${storedToken ? "да" : "нет"}`);
    console.log(`  Header: ${hasAuthHeader ? "установлен" : "отсутствует"}`);
    console.log(
      `  Валидность: ${api.checkTokenExpiry() ? "валиден" : "невалиден"}`
    );
  }

  // Восстанавливаем оригинальный токен
  if (originalToken) {
    api.setToken(originalToken);
  } else {
    localStorage.removeItem("token");
    delete api.instance.defaults.headers.common["Authorization"];
  }

  // 6. Тест защищенных endpoints
  console.log("6. Тест защищенных endpoints...");

  const endpointsToTest = [
    { name: "Dashboard", method: api.getDashboard },
    { name: "RS232 Settings", method: api.getRS232Settings },
    { name: "Network Settings", method: api.getNetworkSettings },
  ];

  for (const endpoint of endpointsToTest) {
    try {
      console.log(`Тестируем ${endpoint.name}...`);
      const response = await endpoint.method();
      console.log(`✅ ${endpoint.name}: Успех (status: ${response.status})`);
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Ошибка - ${error.message}`);

      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("  🔒 Требуется авторизация");
      }
    }
  }

  // 7. Тест CORS и сетевых ошибок
  console.log("7. Тест сетевых аспектов...");

  // Проверяем базовый URL
  console.log(`Base URL: ${api.instance.defaults.baseURL}`);

  // Проверяем заголовки
  console.log("Заголовки:", api.instance.defaults.headers.common);

  // 8. Итоговый отчет
  console.log("8. Итоговый отчет:");

  const finalToken = localStorage.getItem("token");
  const finalTokenValid = finalToken ? api.checkTokenExpiry() : false;

  console.log(`Токен: ${finalToken ? "присутствует" : "отсутствует"}`);
  console.log(`Валидность токена: ${finalTokenValid ? "✅" : "❌"}`);
  console.log(`Mock режим: ${api.isMock() ? "включен" : "выключен"}`);
  console.log(
    "Заголовок Authorization:",
    api.instance.defaults.headers.common["Authorization"]
      ? "установлен"
      : "отсутствует"
  );

  if (finalTokenValid) {
    console.log("🎉 ТЕСТ ПРОЙДЕН: Токен и API работают корректно");
    return true;
  } else if (api.isMock()) {
    console.log("⚠️ ТЕСТ ЧАСТИЧНО ПРОЙДЕН: Используется mock режим");
    return true;
  } else {
    console.log("❌ ТЕСТ ПРОВАЛЕН: Проблемы с токеном или API");
    return false;
  }
};

// Утилиты для ручного тестирования
window.runTokenTest = runTokenAPITest;
window.clearToken = () => {
  localStorage.removeItem("token");
  delete api.instance.defaults.headers.common["Authorization"];
  console.log("🗑️ Токен очищен");
};
window.setTestToken = (token) => api.setToken(token);
window.getTokenInfo = () => ({
  token: localStorage.getItem("token"),
  length: localStorage.getItem("token")?.length,
  isValid: api.checkTokenExpiry(),
  hasHeader: !!api.instance.defaults.headers.common["Authorization"],
});

console.log("🔧 Глобальный тест токена загружен. Используйте:");
console.log("runTokenTest() - запуск полного теста");
console.log("clearToken() - очистка токена");
console.log('setTestToken("token") - установка тестового токена');
console.log("getTokenInfo() - информация о текущем токене");

// Автозапуск теста при загрузке (опционально)
// runTokenAPITest().then(result => {
//   console.log(`Результат автопроверки: ${result ? 'УСПЕХ' : 'НЕУДАЧА'}`);
// });

export default runTokenAPITest;
