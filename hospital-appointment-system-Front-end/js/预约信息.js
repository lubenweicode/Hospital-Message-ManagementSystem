// 全局变量
let appointmentId = null;
let isEditing = false;

// DOM 元素
const appointmentList = document.getElementById('appointment-list');
const addAppointmentBtn = document.getElementById('add-appointment-btn');
const appointmentModal = document.getElementById('appointment-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveAppointmentBtn = document.getElementById('save-appointment');
const appointmentForm = document.getElementById('appointment-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchPatient = document.getElementById('search-patient');
const searchDoctor = document.getElementById('search-doctor');
const searchStatus = document.getElementById('search-status');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载医生、患者和预约列表
  loadDoctors();
  loadPatients();
  loadAppointments();

  // 绑定事件监听器
  addAppointmentBtn.addEventListener('click', openAddAppointmentModal);
  closeModal.addEventListener('click', closeAppointmentModal);
  cancelModal.addEventListener('click', closeAppointmentModal);
  saveAppointmentBtn.addEventListener('click', saveAppointment);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteAppointment);
  searchBtn.addEventListener('click', searchAppointments);

  // 监听医生选择变化，更新排班列表
  document.getElementById('appointment-doctor').addEventListener('change', loadSchedulesByDoctor);

  // 点击模态框外部关闭
  appointmentModal.addEventListener('click', (e) => {
    if (e.target === appointmentModal) {
      closeAppointmentModal();
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
        option.value = doctor.doctorName;
        option.textContent = `${doctor.doctorName} (${doctor.deptName})`;
        searchDoctor.appendChild(option);
      });

      // 复制医生选项到添加预约模态框
      const appointmentDoctorSelect = document.getElementById('appointment-doctor');
      appointmentDoctorSelect.innerHTML = '<option value="">请选择医生</option>';

      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = `${doctor.doctorName} (${doctor.deptName})`;
        appointmentDoctorSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取医生数据失败:', error);
      searchDoctor.innerHTML = '<option value="">加载医生数据失败</option>';
      document.getElementById('appointment-doctor').innerHTML = '<option value="">加载医生数据失败</option>';
    });
}

// 加载患者列表用于下拉选择
function loadPatients() {
  axios.post('http://localhost:8080/api/patients/search', {})
    .then(response => {
      const patients = response.data.data;
      const patientSelect = document.getElementById('appointment-patient');

      // 清空现有选项
      patientSelect.innerHTML = '<option value="">请选择患者</option>';

      // 添加患者选项
      patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.patientId;
        option.textContent = `${patient.patientName} (${patient.patientId})`;
        patientSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取患者数据失败:', error);
      document.getElementById('appointment-patient').innerHTML = '<option value="">加载患者数据失败</option>';
    });
}

// 根据医生加载可用排班
function loadSchedulesByDoctor() {
  const doctorId = document.getElementById('appointment-doctor').value;
  const scheduleSelect = document.getElementById('appointment-schedule');

  if (!doctorId) {
    scheduleSelect.innerHTML = '<option value="">请先选择医生</option>';
    return;
  }

  // 显示加载状态
  scheduleSelect.innerHTML = '<option value="">加载中...</option>';

  // 获取该医生的可用排班
  axios.get(`http://localhost:8080/api/schedules/doctor/${doctorId}`)
    .then(response => {
      const schedules = response.data.data;

      if (schedules.length === 0) {
        scheduleSelect.innerHTML = '<option value="">该医生暂无可用排班</option>';
        return;
      }

      // 清空现有选项
      scheduleSelect.innerHTML = '<option value="">请选择排班</option>';

      // 添加排班选项
      schedules.forEach(schedule => {
        const option = document.createElement('option');
        option.value = schedule.scheduleId;

        // 格式化日期和时间段
        const date = new Date(schedule.scheduleTime);
        const dateStr = schedule.scheduleDate;
        const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];

        option.textContent = `${dateStr} ${weekday} ${schedule.scheduleTime} (剩余: ${schedule.currentPatients}/${schedule.maxPatients})`;
        scheduleSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取排班数据失败:', error);
      scheduleSelect.innerHTML = '<option value="">加载排班数据失败</option>';
    });
}

// 加载预约列表
function loadAppointments() {
  // 显示加载状态
  appointmentList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载预约数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios获取预约数据
  axios.post('http://localhost:8080/api/appointment/search', {})
    .then(response => {
      const appointments = response.data.data;
      // totalCount.textContent = appointments.length;

      if (appointments === null) {
        appointmentList.innerHTML = `
          <tr class="text-center">
            <td colspan="8" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-calendar-o text-4xl mb-4 text-gray-300"></i>
                <p>暂无预约数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染预约列表
      appointmentList.innerHTML = appointments.map(appointment => {
        // 确定状态样式
        let statusClass = '';
        let statusText = '';

        switch (appointment.appointmentStatus) {
          case 1:
            statusClass = 'status-pending';
            statusText = '待就诊';
            break;
          case 2:
            statusClass = 'status-completed';
            statusText = '已完成';
            break;
          case 0:
            statusClass = 'status-canceled';
            statusText = '已取消';
            break;
          case 3:
            statusClass = 'status-no-show';
            statusText = '已爽约';
            break;
          default:
            statusClass = '';
            statusText = '未知';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.appointmentId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.patientName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.doctorName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDateTime(appointment.appointmentTime)}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${appointment.symptoms || '无'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${statusText}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="editAppointment('${appointment.appointmentId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${appointment.appointmentId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('获取预约数据失败:', error);
      appointmentList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载预约数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加预约模态框
function openAddAppointmentModal() {
  isEditing = false;
  appointmentId = null;
  document.getElementById('modal-title').textContent = '添加预约';
  appointmentForm.reset();

  // 重置排班选择
  document.getElementById('appointment-schedule').innerHTML = '<option value="">请先选择医生</option>';

  appointmentModal.classList.remove('hidden');
}

// 关闭预约模态框
function closeAppointmentModal() {
  appointmentModal.classList.add('hidden');
}

// 打开编辑预约模态框
function editAppointment(id) {
  isEditing = true;
  appointmentId = id;
  document.getElementById('modal-title').textContent = '编辑预约';

  // 使用axios获取预约详情
  axios.get(`http://localhost:8080/api/appointment/${appointmentId}`)
    .then(response => {
      const appointment = response.data.data;

      // 填充表单数据
      document.getElementById('appointment-id').value = appointment.appointmentId;
      document.getElementById('appointment-patient').value = appointment.patientId;
      document.getElementById('appointment-doctor').value = appointment.doctorId;
      document.getElementById('appointment-status').value = appointment.appointmentStatus;
      document.getElementById('appointment-symptoms').value = appointment.symptoms;

      // 加载医生的排班并选择当前排班
      loadSchedulesByDoctor();

      // 由于排班是异步加载的，需要等待加载完成后再选择
      setTimeout(() => {
        document.getElementById('appointment-schedule').value = appointment.scheduleId;
      }, 500);

      // 显示模态框
      appointmentModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取预约详情失败:', error);
      alert('获取预约详情失败，请重试');
    });
}

// 保存预约信息
function saveAppointment() {
  // 表单验证
  if (!appointmentForm.checkValidity()) {
    appointmentForm.reportValidity();
    return;
  }
  const now = new Date()

  // 收集表单数据
  const formData = {
    patientId: document.getElementById('appointment-patient').value,
    doctorId: document.getElementById('appointment-doctor').value,
    scheduleId: parseInt(document.getElementById('appointment-schedule').value),
    appointmentStatus: parseInt(document.getElementById('appointment-status').value),
    symptoms: document.getElementById('appointment-symptoms').value,
    appointmentTime: formatDateTimeWithoutSeconds(now)
  };
  console.log('格式化后的时间:', formData.appointmentTime);
  // 显示加载状态
  saveAppointmentBtn.disabled = true;
  saveAppointmentBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新预约
    formData.appointmentId = appointmentId;

    axios.put(`http://localhost:8080/api/appointment/${appointmentId}`, formData)
      .then(response => {
        alert('预约信息更新成功');
        closeAppointmentModal();
        loadAppointments();
      })
      .catch(error => {
        console.error('更新预约信息失败:', error);
        alert('更新预约信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveAppointmentBtn.disabled = false;
        saveAppointmentBtn.innerHTML = '保存';
      });
  } else {
    // 添加预约
    axios.post('http://localhost:8080/api/appointment', formData)
      .then(response => {
        alert('预约信息添加成功');
        closeAppointmentModal();
        loadAppointments();
      })
      .catch(error => {
        console.error('添加预约信息失败:', error);
        alert('添加预约信息失败，请重试');
        if (error.response && error.response.status === 400) {
          alert('该排班已满，无法添加新预约');
        }
      })
      .finally(() => {
        // 恢复按钮状态
        saveAppointmentBtn.disabled = false;
        saveAppointmentBtn.innerHTML = '保存';
      });
  }
}

function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 确保有秒部分
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
function formatDateTimeWithoutSeconds(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:00`; // 强制补全秒为 00
}

// 确认删除预约
function confirmDelete(id) {
  appointmentId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  appointmentId = null;
}

// 删除预约
function deleteAppointment() {
  if (!appointmentId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除预约
  axios.delete(`http://localhost:8080/api/appointment/${appointmentId}`)
    .then(response => {
      alert('预约信息已删除');
      closeDeleteModal();
      loadAppointments();
    })
    .catch(error => {
      console.error('删除预约信息失败:', error);
      alert('删除预约信息失败，请重试');
      if (error.response && error.response.status === 409) {
        alert('该预约状态不允许删除');
      }
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索预约
function searchAppointments() {
  const patientName = searchPatient.value.trim();
  const doctorName = searchDoctor.value;
  const appointmentStatus = searchStatus.value;

  // 显示加载状态
  appointmentList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索预约数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索预约
  let url = 'http://localhost:8080/api/appointment/search';

  const requestBody = {
    patientName,
    doctorName,
    appointmentStatus
  };

  axios.post(url, requestBody)
    .then(response => {
      const appointments = response.data.data;


      if (appointments === null) {
        appointmentList.innerHTML = `
          <tr class="text-center">
            <td colspan="8" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的预约数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      appointmentList.innerHTML = appointments.map(appointment => {
        // 确定状态样式
        let statusClass = '';
        let statusText = '';

        switch (appointment.appointmentStatus) {
          case 1:
            statusClass = 'status-pending';
            statusText = '待就诊';
            break;
          case 2:
            statusClass = 'status-completed';
            statusText = '已完成';
            break;
          case 0:
            statusClass = 'status-canceled';
            statusText = '已取消';
            break;
          case 3:
            statusClass = 'status-no-show';
            statusText = '已爽约';
            break;
          default:
            statusClass = '';
            statusText = '未知';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.appointmentId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.patientName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${appointment.doctorName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formatDateTime(appointment.appointmentTime)}</td>
      
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${appointment.symptoms || '无'}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${statusText}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="editAppointment('${appointment.appointmentId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${appointment.appointmentId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('搜索预约数据失败:', error);
      appointmentList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索预约数据失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 格式化日期时间
function formatDateTime(dateTime) {
  if (!dateTime) return '';

  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}  