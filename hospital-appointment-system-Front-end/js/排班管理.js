// 全局变量
let scheduleId = null;
let isEditing = false;

// DOM 元素
const scheduleList = document.getElementById('schedule-list');
const addScheduleBtn = document.getElementById('add-schedule-btn');
const scheduleModal = document.getElementById('schedule-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveScheduleBtn = document.getElementById('save-schedule');
const scheduleForm = document.getElementById('schedule-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchDoctor = document.getElementById('search-doctor');
const searchDateFrom = document.getElementById('search-date-from');
const searchDateTo = document.getElementById('search-date-to');
const searchTimePeriod = document.getElementById('search-time-period');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 设置默认搜索日期范围（今天和未来7天）
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  searchDateFrom.valueAsDate = today;
  searchDateTo.valueAsDate = nextWeek;

  // 加载医生列表和排班表
  loadDoctors();
  loadSchedules();

  // 绑定事件监听器
  addScheduleBtn.addEventListener('click', openAddScheduleModal);
  closeModal.addEventListener('click', closeScheduleModal);
  cancelModal.addEventListener('click', closeScheduleModal);
  saveScheduleBtn.addEventListener('click', saveSchedule);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteSchedule);
  searchBtn.addEventListener('click', searchSchedules);

  // 点击模态框外部关闭
  scheduleModal.addEventListener('click', (e) => {
    if (e.target === scheduleModal) {
      closeScheduleModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
});

// 加载医生列表用于下拉选择
function loadDoctors() {
  // 加载搜索框中的医生列表
  axios.post('http://localhost:8080/api/doctors/search', {})
    .then(response => {
      const doctors = response.data.data;

      // 清空现有选项
      searchDoctor.innerHTML = '<option value="">全部医生</option>';

      // 添加医生选项
      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = `${doctor.doctorName} (${doctor.deptName})`;
        searchDoctor.appendChild(option);
      });

      // 复制医生选项到添加排班模态框
      const scheduleDoctorSelect = document.getElementById('schedule-doctor');
      scheduleDoctorSelect.innerHTML = '<option value="">请选择医生</option>';

      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = `${doctor.doctorName} (${doctor.deptName})`;
        scheduleDoctorSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取医生数据失败:', error);
      searchDoctor.innerHTML = '<option value="">加载医生数据失败</option>';
      document.getElementById('schedule-doctor').innerHTML = '<option value="">加载医生数据失败</option>';
    });
}

// 加载排班表
function loadSchedules() {
  // 显示加载状态
  scheduleList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载排班数据...</p>
        </div>
      </td>
    </tr>
  `;

  const doctorName = document.getElementById('search-doctor').value;
  const startDate = document.getElementById('search-date-from').value;
  const endDate = document.getElementById('search-date-to').value;
  const scheduleStatus = parseInt(document.getElementById('search-time-period').value);

  const defaultBody = {
    doctorName, startDate, endDate, scheduleStatus
  };

  // 使用axios获取排班数据
  axios.post('http://localhost:8080/api/schedules/search', defaultBody)
    .then(response => {
      const schedules = response.data.data;
      // totalCount.textContent = schedules.length;

      // if (schedules.length === 0) {
      //   scheduleList.innerHTML = `
      //     <tr class="text-center">
      //       <td colspan="8" class="px-6 py-12 text-gray-500">
      //         <div class="flex flex-col items-center">
      //           <i class="fa fa-calendar-o text-4xl mb-4 text-gray-300"></i>
      //           <p>暂无排班数据</p>
      //         </div>
      //       </td>
      //     </tr>
      //   `;
      //   return;
      // }

      // 渲染排班表
      scheduleList.innerHTML = schedules.map(schedule => {
        // 计算预约百分比
        const appointmentPercent = Math.round((schedule.currentPatients / schedule.maxPatients) * 100);

        // 确定进度条颜色类
        let progressClass = 'appointment-low';
        if (appointmentPercent >= 70) {
          progressClass = 'appointment-high';
        } else if (appointmentPercent >= 40) {
          progressClass = 'appointment-medium';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.scheduleId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.doctorName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.deptName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDateForDisplay(schedule.scheduleDate)}</td>
             <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  ${schedule.scheduleTime === 1 ? '上午' : schedule.scheduleTime === 2 ? '下午' : schedule.scheduleTime === 3 ? '晚上' : '未知' // 可选：处理异常值
          }
          </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="appointment-progress w-full mr-2">
                  <div class="appointment-progress-bar ${progressClass}" style="width: ${appointmentPercent}%"></div>
                </div>
                <span class="text-xs font-medium">${schedule.currentPatients}/${schedule.maxPatients}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.scheduleStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }">
                ${schedule.scheduleStatus === 1 ? '正常' : '取消'}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="editSchedule('${schedule.scheduleId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${schedule.scheduleId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('获取排班数据失败:', error);
      scheduleList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载排班数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加排班模态框
function openAddScheduleModal() {
  isEditing = false;
  scheduleId = null;
  document.getElementById('modal-title').textContent = '添加排班';
  scheduleForm.reset();

  // 设置默认日期为今天
  const today = new Date();
  document.getElementById('schedule-date').valueAsDate = today;

  scheduleModal.classList.remove('hidden');
}

// 关闭排班模态框
function closeScheduleModal() {
  scheduleModal.classList.add('hidden');
}

// 打开编辑排班模态框
function editSchedule(id) {
  isEditing = true;
  scheduleId = id;
  document.getElementById('modal-title').textContent = '编辑排班';

  // 使用axios获取排班详情
  axios.get(`http://localhost:8080/api/schedules/${id}`)
    .then(response => {
      const schedule = response.data.data;

      // 填充表单数据
      document.getElementById('schedule-doctor').value = schedule.doctorId;
      document.getElementById('schedule-id').value = schedule.scheduleId;
      document.getElementById('schedule-date').value = formatDateForInput(schedule.scheduleDate);
      document.getElementById('schedule-time-period').value = schedule.scheduleTime;
      document.getElementById('schedule-max-patients').value = schedule.maxPatients;
      document.getElementById('schedule-status').value = schedule.scheduleStatus;

      // 显示模态框
      scheduleModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取排班详情失败:', error);
      alert('获取排班详情失败，请重试');
    });
}

// 保存排班信息
function saveSchedule() {
  // 表单验证
  if (!scheduleForm.checkValidity()) {
    scheduleForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    doctorId: document.getElementById('schedule-doctor').value,
    scheduleDate: document.getElementById('schedule-date').value,
    scheduleTime: parseInt(document.getElementById('schedule-time-period').value),
    maxPatients: parseInt(document.getElementById('schedule-max-patients').value),
    scheduleStatus: parseInt(document.getElementById('schedule-status').value),
    currentPatients: 0 // 默认初始预约数为0
  };

  // 显示加载状态
  saveScheduleBtn.disabled = true;
  saveScheduleBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新排班
    formData.scheduleId = scheduleId;

    axios.put(`http://localhost:8080/api/schedules/${scheduleId}`, formData)
      .then(response => {
        alert('排班信息更新成功');
        closeScheduleModal();
        loadSchedules();
      })
      .catch(error => {
        console.error('更新排班信息失败:', error);
        alert('更新排班信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveScheduleBtn.disabled = false;
        saveScheduleBtn.innerHTML = '保存';
      });
  } else {
    // 添加排班
    axios.post('http://localhost:8080/api/schedules', formData)
      .then(response => {
        alert('排班信息添加成功');
        closeScheduleModal();
        loadSchedules();
      })
      .catch(error => {
        console.error('添加排班信息失败:', error);
        alert('添加排班信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveScheduleBtn.disabled = false;
        saveScheduleBtn.innerHTML = '保存';
      });
  }
}

// 确认删除排班
function confirmDelete(id) {
  scheduleId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  scheduleId = null;
}

// 删除排班
function deleteSchedule() {
  if (!scheduleId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除排班
  axios.delete(`http://localhost:8080/api/schedules/${scheduleId}`)
    .then(response => {
      alert('排班信息已删除');
      closeDeleteModal();
      loadSchedules();
    })
    .catch(error => {
      console.error('删除排班信息失败:', error);
      alert('删除排班信息失败，请重试');
      if (error.response && error.response.status === 409) {
        alert('该排班下已有患者预约，无法直接删除');
      }
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索排班
function searchSchedules() {
  const doctorId = searchDoctor.value;
  const startDate = searchDateFrom.value;
  const endDate = searchDateTo.value;
  const scheduleStatus = searchTimePeriod.value;

  // 验证日期范围
  if (startDate && endDate && startDate > endDate) {
    alert('开始日期不能大于结束日期');
    return;
  }

  // 显示加载状态
  scheduleList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索排班数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索排班
  const requestBody = { doctorId, startDate, endDate, scheduleStatus }

  axios.post('http://localhost:8080/api/schedules/search', requestBody)
    .then(response => {
      const schedules = response.data.data;
      // totalCount.textContent = schedules.length;

      // if (schedules.length === 0) {
      //   scheduleList.innerHTML = `
      //     <tr class="text-center">
      //       <td colspan="8" class="px-6 py-12 text-gray-500">
      //         <div class="flex flex-col items-center">
      //           <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
      //           <p>未找到匹配的排班数据</p>
      //         </div>
      //       </td>
      //     </tr>
      //   `;
      //   return;
      // }

      // 渲染搜索结果
      scheduleList.innerHTML = schedules.map(schedule => {
        // 计算预约百分比
        const appointmentPercent = Math.round((schedule.currentPatients / schedule.maxPatients) * 100);

        // 确定进度条颜色类
        let progressClass = 'appointment-low';
        if (appointmentPercent >= 70) {
          progressClass = 'appointment-high';
        } else if (appointmentPercent >= 40) {
          progressClass = 'appointment-medium';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.scheduleId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${schedule.doctorName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${schedule.deptName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDateForDisplay(schedule.scheduleDate)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
  ${schedule.scheduleTime === 1
            ? '上午'
            : schedule.scheduleTime === 2
              ? '下午'
              : schedule.scheduleTime === 3
                ? '晚上'
                : '未知' // 可选：处理异常值
          }
</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="appointment-progress w-full mr-2">
                  <div class="appointment-progress-bar ${progressClass}" style="width: ${appointmentPercent}%"></div>
                </div>
                <span class="text-xs font-medium">${schedule.currentPatients}/${schedule.maxPatients}</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.scheduleStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }">
                ${schedule.scheduleStatus === 1 ? '正常' : '取消'}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="editSchedule('${schedule.scheduleId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${schedule.scheduleId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('搜索排班数据失败:', error);
      scheduleList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索排班数据失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 日期格式化辅助函数
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateForDisplay(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
  return `${year}-${month}-${day} ${weekday}`;
}

function formatDateForInput(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}  