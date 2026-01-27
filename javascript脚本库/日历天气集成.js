// 日历功能
class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.today = new Date();
    this.events = [
      { date: new Date(2023, 9, 15), title: "团队会议" },
      { date: new Date(2023, 9, 18), title: "项目截止" },
      { date: new Date(2023, 9, 22), title: "医生预约" },
      { date: new Date(2023, 9, 25), title: "生日聚会" },
    ];

    this.init();
  }

  init() {
    this.renderCalendar();
    this.setupEventListeners();
  }

  renderCalendar() {
    const monthYearElement = document.getElementById("currentMonthYear");
    const calendarDaysElement = document.getElementById("calendarDays");

    // 设置月份标题
    const monthNames = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];
    monthYearElement.textContent = `${this.currentDate.getFullYear()}年 ${monthNames[this.currentDate.getMonth()]}`;

    // 清空日历
    calendarDaysElement.innerHTML = "";

    // 获取当前月份的第一天
    const firstDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      1,
    );
    // 获取当前月份的第一天是星期几 (0 = 星期日, 6 = 星期六)
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // 获取当前月份的最后一天
    const lastDayOfMonth = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth() + 1,
      0,
    );
    // 获取当前月份的总天数
    const totalDaysInMonth = lastDayOfMonth.getDate();

    // 获取上个月的最后几天
    const prevMonthLastDay = new Date(
      this.currentDate.getFullYear(),
      this.currentDate.getMonth(),
      0,
    ).getDate();

    // 生成日历天数
    let dayCount = 1;

    // 添加上个月的日期
    for (let i = firstDayOfWeek; i > 0; i--) {
      const day = document.createElement("div");
      day.className = "calendar-day other-month";
      day.innerHTML = `<div class="day-number">${prevMonthLastDay - i + 1}</div>`;
      calendarDaysElement.appendChild(day);
    }

    // 添加当前月份的日期
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const day = document.createElement("div");
      const dayDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        i,
      );

      // 检查是否是今天
      const isToday = dayDate.toDateString() === this.today.toDateString();

      // 检查是否有事件
      const dayEvents = this.events.filter(
        (event) => event.date.toDateString() === dayDate.toDateString(),
      );

      day.className = `calendar-day current-month ${isToday ? "today" : ""}`;
      day.innerHTML = `
                        <div class="day-number">${i}</div>
                        ${
                          dayEvents.length > 0
                            ? `<div class="calendar-events">${dayEvents[0].title}</div>`
                            : ""
                        }
                    `;

      // 添加点击事件
      day.addEventListener("click", () => {
        this.selectDay(dayDate);
      });

      calendarDaysElement.appendChild(day);
      dayCount++;
    }

    // 添加下个月的日期
    const totalCells = 42; // 6行 x 7列
    const nextMonthDays = totalCells - (firstDayOfWeek + totalDaysInMonth);

    for (let i = 1; i <= nextMonthDays; i++) {
      const day = document.createElement("div");
      day.className = "calendar-day other-month";
      day.innerHTML = `<div class="day-number">${i}</div>`;
      calendarDaysElement.appendChild(day);
    }
  }

  selectDay(date) {
    alert(`您选择了: ${date.toLocaleDateString("zh-CN")}`);
    // 这里可以添加更多选择日期的功能
  }

  setupEventListeners() {
    document.getElementById("prevMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    document.getElementById("nextMonth").addEventListener("click", () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    document.getElementById("todayBtn").addEventListener("click", () => {
      this.currentDate = new Date();
      this.renderCalendar();
    });
  }
}

// 天气功能 - 模拟数据（实际使用时可以替换为真实的API调用）
class Weather {
  constructor() {
    this.currentLocation = "北京";
    this.locations = {
      北京: {
        temp: 22,
        condition: "晴朗",
        humidity: 45,
        windSpeed: 12,
        feelsLike: 21,
      },
      上海: {
        temp: 24,
        condition: "多云",
        humidity: 60,
        windSpeed: 8,
        feelsLike: 23,
      },
      广州: {
        temp: 28,
        condition: "部分多云",
        humidity: 70,
        windSpeed: 10,
        feelsLike: 29,
      },
      成都: {
        temp: 20,
        condition: "小雨",
        humidity: 80,
        windSpeed: 6,
        feelsLike: 19,
      },
    };

    this.forecastData = {
      北京: [
        { day: "周一", icon: "fa-sun", high: 23, low: 15 },
        { day: "周二", icon: "fa-cloud-sun", high: 21, low: 14 },
        { day: "周三", icon: "fa-cloud", high: 19, low: 13 },
        { day: "周四", icon: "fa-cloud-rain", high: 18, low: 12 },
        { day: "周五", icon: "fa-cloud-sun", high: 20, low: 13 },
      ],
      上海: [
        { day: "周一", icon: "fa-cloud", high: 25, low: 18 },
        { day: "周二", icon: "fa-cloud-sun", high: 24, low: 17 },
        { day: "周三", icon: "fa-sun", high: 26, low: 19 },
        { day: "周四", icon: "fa-cloud-rain", high: 22, low: 16 },
        { day: "周五", icon: "fa-cloud", high: 23, low: 17 },
      ],
    };

    this.init();
  }

  init() {
    this.renderCurrentWeather();
    this.renderForecast();
    this.setupEventListeners();
    this.updateCurrentDate();
  }

  renderCurrentWeather() {
    const locationData = this.locations[this.currentLocation];

    document.getElementById("currentLocation").textContent =
      `${this.currentLocation}, 中国`;
    document.getElementById("currentTemp").textContent =
      `${locationData.temp}°C`;
    document.getElementById("weatherCondition").textContent =
      locationData.condition;
    document.getElementById("windSpeed").textContent =
      `${locationData.windSpeed} km/h`;
    document.getElementById("humidity").textContent =
      `${locationData.humidity}%`;
    document.getElementById("feelsLike").textContent =
      `${locationData.feelsLike}°C`;
  }

  renderForecast() {
    const forecastDaysElement = document.getElementById("forecastDays");
    forecastDaysElement.innerHTML = "";

    const forecastData =
      this.forecastData[this.currentLocation] || this.forecastData["北京"];

    forecastData.forEach((day) => {
      const dayElement = document.createElement("div");
      dayElement.className = "forecast-day";
      dayElement.innerHTML = `
                        <div class="forecast-day-name">${day.day}</div>
                        <div class="forecast-icon"><i class="fas ${day.icon}"></i></div>
                        <div class="forecast-temp">${day.high}° / ${day.low}°</div>
                    `;
      forecastDaysElement.appendChild(dayElement);
    });
  }

  updateCurrentDate() {
    const now = new Date();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    document.getElementById("currentDate").textContent = now.toLocaleDateString(
      "zh-CN",
      options,
    );
  }

  setupEventListeners() {
    document.getElementById("changeLocation").addEventListener("click", () => {
      const locations = Object.keys(this.locations);
      const currentIndex = locations.indexOf(this.currentLocation);
      const nextIndex = (currentIndex + 1) % locations.length;
      this.currentLocation = locations[nextIndex];
      this.renderCurrentWeather();
      this.renderForecast();
    });
  }
}

// 初始化组件
document.addEventListener("DOMContentLoaded", () => {
  const calendar = new Calendar();
  const weather = new Weather();

  // 这里可以添加与外部API集成的代码
  // 例如，使用fetch从天气API获取真实数据
  /* fetch('https://api.openweathermap.org/data/2.5/weather?q=Beijing&appid=YOUR_API_KEY&units=metric&lang=zh_cn')
     .then(response => response.json())
     .then(data => {// 处理天气数据})
     .catch(error => console.error('Error fetching weather:', error));
      */
});
