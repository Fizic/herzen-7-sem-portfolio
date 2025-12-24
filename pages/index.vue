<template>
  <div class="max-w-6xl mx-auto">
    <!-- Hero Section -->
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-900 mb-4">Кирилл Фирсов</h1>
      <div class="flex flex-wrap justify-center gap-3 text-lg text-gray-600">
        <span class="px-4 py-2 bg-primary-100 rounded-full">Go-Разработчик</span>
        <span class="px-4 py-2 bg-primary-100 rounded-full">Архитектор программного обеспечения</span>
      </div>
    </div>

    <!-- Experience Section -->
    <section class="mb-12">
      <h2 class="text-3xl font-bold mb-8 text-gray-900">Опыт работы</h2>

      <!-- Ozon Банк -->
      <div class="card mb-6">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-2xl font-bold text-gray-900">Ozon Банк</h3>
              <span class="text-sm text-gray-500">Специальное подразделение Ozon, где тесно переплетается всё, что связано с финансами и IT</span>
            </div>
            <p class="text-gray-600 mb-2">От 1000 до 5000 сотрудников</p>
            <p class="text-primary-600 font-semibold mb-2">Бэкенд разработчик (Старший)</p>
            <p class="text-gray-500">Июль 2024 — По настоящее время</p>
            <p class="text-gray-600 mt-2">Направление разработки кредитных продуктов B2C</p>
          </div>
        </div>

        <div class="space-y-4 mt-6">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Архитектура и координация крупных распределенных систем</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Проектировал и координировал разработку комплексных кредитных продуктов с участием до 50 разработчиков.</li>
              <li>Выстраивал взаимодействие между командами и feature leads для формирования единой архитектурной стратегии, обеспечения согласованности решений и исключения конфликтов в рамках экосистемы.</li>
              <li>Отвечал за создание целостной, масштабируемой и отказоустойчивой картины системы, объединяющей работу множества команд.</li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold text-gray-900 mb-2">Сквозная реализация ключевых проектов</h4>
            <ul class="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Руководил end-to-end реализацией стратегически важных инициатив (от анализа требований до запуска в production) в роли feature/tech lead отдельных систем больших проектов.</li>
              <li>Успешно запустил новый кредитный продукт за рекордные 4 месяца.</li>
              <li>Реализовал критически важные регуляторные проекты (самозапрет, период охлаждения) и интеграционные (ЕСИА).</li>
              <li>Запускал коммерческие акции, напрямую влияющие на бизнес-метрики.</li>
              <li>Ключевые компетенции: управление командой (до 5 разработчиков), проектирование и защита архитектуры, планирование, контроль сроков и управление ожиданиями стейкхолдеров.</li>
            </ul>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Golang</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">PostgreSQL</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Redis</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Apache Kafka</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">gRPC</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Kubernetes</span>
        </div>
      </div>

      <!-- Яндекс -->
      <div class="card">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-2xl font-bold text-gray-900">Яндекс</h3>
              <span class="text-sm text-gray-500">Компания, которая развивает самую популярную в России поисковую систему и десятки других сервисов</span>
            </div>
            <p class="text-gray-600 mb-2">Санкт-Петербург • Более 5000 сотрудников</p>
            <p class="text-primary-600 font-semibold mb-2">Бэкенд разработчик (Средний) • Разработчик</p>
            <p class="text-gray-500">Декабрь 2022 — Июнь 2024 (1 год и 7 месяцев)</p>
            <p class="text-gray-600 mt-2">Группа разработки сервисов управления РСУБД</p>
          </div>
        </div>

        <div class="space-y-4 mt-6">
          <ul class="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Участвовал в архитектурных улучшениях, предложил ключевой способ оптимизации разработки. Своими идеями сильно улучшил сбор метрик с хостов баз данных.</li>
            <li>Придумал и реализовал способ объедения кода для разных типов баз в gRPC API на Go, это сильно упростило код и уменьшило дублирование в нем на порядок.</li>
            <li>Улучшение инструментов для автоматического управления кластером базы данных. Примеры mysync и wal-g. В последний добавил инновационный способ восстановления хоста из бэкапа на точку во времени и об этом есть статья на habr-е.</li>
            <li>Полностью переписал старую систему для сбора метрик кластера и получения его состояния. Новая система в своей основе использует telegraf. Это упростило дальнейшее улучшение мониторинга благодаря системе плагинов.</li>
          </ul>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Golang</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Python</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">PostgreSQL</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">MySQL</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Kubernetes</span>
          <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">DevOps</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Обо мне - Портфолио Кирилла Фирсова'
})
</script>

