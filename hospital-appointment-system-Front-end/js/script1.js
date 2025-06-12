// DOM 元素
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const patientBtn = document.getElementById('patient-btn');
const patientSubmenu = document.getElementById('patient-submenu');
const doctorBtn = document.getElementById('doctor-btn');
const doctorSubmenu = document.getElementById('doctor-submenu');
const appointmentBtn = document.getElementById('appointment-btn');
const appointmentSubmenu = document.getElementById('appointment-submenu');
const medicalBtn = document.getElementById('medical-btn');
const medicalSubmenu = document.getElementById('medical-submenu');
const medicineBtn = document.getElementById('medicine-btn');
const medicineSubmenu = document.getElementById('medicine-submenu');
const financeBtn = document.getElementById('finance-btn');
const financeSubmenu = document.getElementById('finance-submenu');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
const logoutBtn = document.getElementById('logout-btn');

// 侧边栏切换
sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('sidebar-collapsed');
  sidebar.classList.toggle('sidebar-expanded');
});

// 子菜单切换
function toggleSubmenu(button, submenu) {
  button.addEventListener('click', () => {
    const isOpen = !submenu.classList.contains('hidden');

    // 关闭所有其他子菜单
    document.querySelectorAll('ul[id$="-submenu"]').forEach(menu => {
      if (menu !== submenu) {
        menu.classList.add('hidden');
        const parentButton = menu.previousElementSibling;
        if (parentButton) {
          const chevron = parentButton.querySelector('.fa-chevron-down');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      }
    });

    // 切换当前子菜单
    if (isOpen) {
      submenu.classList.add('hidden');
      const chevron = button.querySelector('.fa-chevron-down');
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    } else {
      submenu.classList.remove('hidden');
      const chevron = button.querySelector('.fa-chevron-down');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    }
  });
}

// 初始化所有子菜单
toggleSubmenu(patientBtn, patientSubmenu);
toggleSubmenu(doctorBtn, doctorSubmenu);
toggleSubmenu(appointmentBtn, appointmentSubmenu);
toggleSubmenu(medicalBtn, medicalSubmenu);
toggleSubmenu(medicineBtn, medicineSubmenu);

// 模态框控制
function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

closeModal.addEventListener('click', closeModalFunc);
modalCancel.addEventListener('click', closeModalFunc);

// 点击模态框外部关闭
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModalFunc();
  }
});

// 注销功能
logoutBtn.addEventListener('click', () => {
  openModal('确认注销', `
    <p class="text-gray-700">你确定要注销当前账号吗？</p>
  `);

  modalConfirm.onclick = () => {
    // 这里使用axios发送注销请求
    axios.post('/api/logout')
      .then(response => {
        if (response.status === 200) {
          alert('注销成功');
          window.location.href = '登录页面.html'; // 重定向到登录页面
        }
      })
      .catch(error => {
        console.error('注销失败:', error);
        alert('注销失败，请重试');
      });

    closeModalFunc();
  };
});


// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initCharts();

  // 示例：模拟从API获取数据
  simulateAPICalls();
});


// 导航链接点击处理
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId + '-section');

    // 如果目标部分存在，则滚动到该部分
    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: 'smooth'
      });
    } else {
      // 否则，这可能是一个功能链接，需要加载对应的内容
      loadFeatureContent(targetId);
    }

    // 关闭侧边栏（移动端）
    if (window.innerWidth < 768) {
      sidebar.classList.add('sidebar-collapsed');
      sidebar.classList.remove('sidebar-expanded');
    }
  });
});

// 加载功能内容（示例）
function loadFeatureContent(featureId) {
  // 在实际应用中，这里会根据featureId加载对应的功能模块
  console.log('加载功能:', featureId);

  // 示例：显示模态框，展示功能内容
  openModal('功能加载中', `
    <p class="text-gray-700">正在加载 ${featureId.replace('#', '')} 功能...</p>
    <div class="mt-4 flex justify-center">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  `);

}
// 统计卡片数据获取与渲染
function fetchAndRenderStats() {
  // 显示加载状态
  document.querySelectorAll('#stats-cards h3').forEach(el => {
    el.textContent = '--';
  });
  document.querySelectorAll('#stats-cards p.text-sm').forEach(el => {
    el.innerHTML = '<i class="fa fa-refresh fa-spin mr-1"></i> 加载中...';
    el.className = 'text-sm text-gray-500 flex items-center mt-2';
  });

  // 组合API请求（请替换为您的实际API路径）
  axios.all([
    axios.get('http://localhost:8080/api/patients/count'),
    axios.get('http://localhost:8080/api/doctors/count'),
    axios.get('http://localhost:8080/api/appointment/count'),
    axios.get('http://localhost:8080/api/medicine/count')
  ])
    .then(axios.spread((patients, doctors, appointments, medicines) => {
      // 处理患者数据
      const patientData = patients.data.data;
      const doctorsData = doctors.data.data;
      const medicineData = medicines.data.data;
      const appointmentData = appointments.data.data;
      document.getElementById('today-patient').textContent = patientData.count;
      document.getElementById('active-doctors').textContent = doctorsData.count;
      document.getElementById('completed-appointments').textContent = appointmentData.count;
      document.getElementById('urgent-medicines').textContent = medicineData.count;
    }))
    .catch(error => {
      console.error('获取统计数据失败:', error);
      // 显示错误状态
      document.querySelectorAll('#stats-cards p.text-sm').forEach(el => {
        el.className = 'text-sm text-red-500 flex items-center mt-2';
        el.innerHTML = `<i class="fa fa-exclamation-circle mr-1"></i> 数据加载失败`;
      });
    });
}

// 更新变化指示器
function updateChangeIndicator(elementId, change) {
  const el = document.getElementById(elementId);
  if (change > 0) {
    el.className = 'text-sm text-green-500 flex items-center mt-2';
    el.innerHTML = `<i class="fa fa-arrow-up mr-1"></i> ${change}% <span class="text-gray-500 ml-1">较昨日</span>`;
  } else if (change < 0) {
    el.className = 'text-sm text-red-500 flex items-center mt-2';
    el.innerHTML = `<i class="fa fa-arrow-down mr-1"></i> ${Math.abs(change)}% <span class="text-gray-500 ml-1">较昨日</span>`;
  } else {
    el.className = 'text-sm text-gray-500 flex items-center mt-2';
    el.innerHTML = `<i class="fa fa-minus mr-1"></i> 持平 <span class="text-gray-500 ml-1">较昨日</span>`;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 首次加载数据
  fetchAndRenderStats();

  // 每5分钟刷新一次数据
  setInterval(fetchAndRenderStats, 300000); // 300000毫秒 = 5分钟

  // 初始化其他功能
  initCharts();
  // 其他数据获取逻辑...
});