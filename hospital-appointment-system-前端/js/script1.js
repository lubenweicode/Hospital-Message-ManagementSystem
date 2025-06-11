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
toggleSubmenu(financeBtn, financeSubmenu);

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
          window.location.href = '/login'; // 重定向到登录页面
        }
      })
      .catch(error => {
        console.error('注销失败:', error);
        alert('注销失败，请重试');
      });
      
    closeModalFunc();
  };
});

// 初始化图表
function initCharts() {
  // 预约趋势图表
  const appointmentCtx = document.getElementById('appointmentChart').getContext('2d');
  const appointmentChart = new Chart(appointmentCtx, {
    type: 'line',
    data: {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [{
        label: '预约数量',
        data: [35, 42, 38, 45, 50, 25, 20],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });

  // 科室预约分布图表
  const departmentCtx = document.getElementById('departmentChart').getContext('2d');
  const departmentChart = new Chart(departmentCtx, {
    type: 'doughnut',
    data: {
      labels: ['内科', '外科', '儿科', '妇产科', '眼科', '其他'],
      datasets: [{
        data: [30, 25, 15, 10, 12, 8],
        backgroundColor: [
          '#3B82F6', // 蓝色
          '#10B981', // 绿色
          '#F59E0B', // 黄色
          '#EF4444', // 红色
          '#8B5CF6', // 紫色
          '#6B7280'  // 灰色
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      },
      cutout: '70%'
    }
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initCharts();
  
  // 示例：模拟从API获取数据
  simulateAPICalls();
});

// 模拟API调用
function simulateAPICalls() {
  // 模拟获取患者数据
  function fetchPatients() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '张三', age: 32, gender: '男', status: '住院' },
          { id: 2, name: '李四', age: 45, gender: '女', status: '门诊' },
          { id: 3, name: '王五', age: 28, gender: '男', status: '已出院' }
        ]);
      }, 500);
    });
  }
  
  // 模拟获取医生数据
  function fetchDoctors() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '赵医生', department: '内科', title: '主任医师' },
          { id: 2, name: '钱医生', department: '外科', title: '副主任医师' },
          { id: 3, name: '孙医生', department: '儿科', title: '主治医师' }
        ]);
      }, 500);
    });
  }
  
  // 使用axios获取数据
  function fetchDataWithAxios() {
    // 实际项目中使用axios发送请求
    /*
    axios.get('/api/patients')
      .then(response => {
        console.log('患者数据:', response.data);
      })
      .catch(error => {
        console.error('获取患者数据失败:', error);
      });
    */
    
    // 这里使用模拟数据
    fetchPatients().then(patients => {
      console.log('模拟患者数据:', patients);
    });
    
    fetchDoctors().then(doctors => {
      console.log('模拟医生数据:', doctors);
    });
  }
  
  // 初始加载时获取数据
  fetchDataWithAxios();
}

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
  
  // 模拟加载延迟
  setTimeout(() => {
    // 根据不同功能ID加载不同内容
    let content = '';
    
    if (featureId === '#patient-list') {
      content = `
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年龄</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性别</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 患者数据将通过axios动态加载 -->
            </tbody>
          </table>
        </div>
      `;
      
      // 使用axios获取患者数据
      fetchPatients().then(patients => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';
        
        patients.forEach(patient => {
          const row = document.createElement('tr');
          row.className = 'hover:bg-gray-50 transition-colors';
          
          row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.age}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.gender}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                patient.status === '住院' ? 'bg-red-100 text-red-800' : 
                patient.status === '门诊' ? 'bg-blue-100 text-blue-800' : 
                'bg-green-100 text-green-800'
              }">
                ${patient.status}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-indigo-600 hover:text-indigo-900 mr-3">查看</button>
              <button class="text-green-600 hover:text-green-900 mr-3">编辑</button>
              <button class="text-red-600 hover:text-red-900">删除</button>
            </td>
          `;
          
          tableBody.appendChild(row);
        });
      });
    } else if (featureId === '#doctor-list') {
      content = `
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">科室</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">职称</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 医生数据将通过axios动态加载 -->
            </tbody>
          </table>
        </div>
      `;
      
      // 使用axios获取医生数据
      fetchDoctors().then(doctors => {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';
        
        doctors.forEach(doctor => {
          const row = document.createElement('tr');
          row.className = 'hover:bg-gray-50 transition-colors';
          
          row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.department}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.title}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-indigo-600 hover:text-indigo-900 mr-3">查看</button>
              <button class="text-green-600 hover:text-green-900 mr-3">编辑</button>
              <button class="text-red-600 hover:text-red-900">删除</button>
            </td>
          `;
          
          tableBody.appendChild(row);
        });
      });
    } else {
      content = `
        <p class="text-gray-700">${featureId.replace('#', '')} 功能正在开发中...</p>
      `;
    }
    
    // 更新模态框内容
    modalContent.innerHTML = content;
    modalTitle.textContent = featureId.replace('#', '').replace(/-/g, ' ') + ' 管理';
    
    // 更新确认按钮逻辑
    if (featureId === '#patient-add' || featureId === '#doctor-add') {
      modalConfirm.onclick = () => {
        // 模拟表单提交
        alert('数据已提交，实际应用中将使用axios发送数据到服务器');
        closeModalFunc();
      };
    } else {
      modalConfirm.onclick = closeModalFunc;
    }
  }, 1000);
}  