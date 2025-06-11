// 全局变量
let medicalRecordId = null;
let isEditing = false;

// DOM 元素
const recordList = document.getElementById('record-list');
const addRecordBtn = document.getElementById('add-record-btn');
const recordModal = document.getElementById('record-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveRecordBtn = document.getElementById('save-record');
const recordForm = document.getElementById('record-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchPatient = document.getElementById('search-patient');
const searchDoctor = document.getElementById('search-doctor');
const searchStatus = document.getElementById('search-status');
const searchStartDate = document.getElementById('search-start-date');
const searchEndDate = document.getElementById('search-end-date');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载患者、医生和病例数据
  loadPatients();
  loadDoctors();
  loadRecords();

  // 绑定事件监听器
  addRecordBtn.addEventListener('click', openAddRecordModal);
  closeModal.addEventListener('click', closeRecordModal);
  cancelModal.addEventListener('click', closeRecordModal);
  saveRecordBtn.addEventListener('click', saveRecord);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteRecord);
  searchBtn.addEventListener('click', searchRecords);

  // 点击模态框外部关闭
  recordModal.addEventListener('click', (e) => {
    if (e.target === recordModal) {
      closeRecordModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
});

// 加载患者列表
function loadPatients() {
  axios.post('http://localhost:8080/api/patients/search', {})
    .then(response => {
      const patients = response.data.data;
      const patientSelect = document.getElementById('patient-id');

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
      document.getElementById('patient-id').innerHTML = '<option value="">加载患者数据失败</option>';
    });
}

// 加载医生列表
function loadDoctors() {
  axios.post('http://localhost:8080/api/doctors/search', {})
    .then(response => {
      const doctors = response.data.data;
      const doctorSelect = document.getElementById('doctor-id');

      // 清空现有选项
      doctorSelect.innerHTML = '<option value="">请选择医生</option>';

      // 添加医生选项
      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorId;
        option.textContent = `${doctor.doctorName} (${doctor.deptName})`;
        doctorSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取医生数据失败:', error);
      document.getElementById('doctor-id').innerHTML = '<option value="">加载医生数据失败</option>';
    });
}

// 加载病例列表
function loadRecords() {
  // 显示加载状态
  recordList.innerHTML = `
    <tr class="text-center">
      <td colspan="7" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载病例数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios获取病例数据
  axios.post('http://localhost:8080/api/MedicalRecords/search', {})
    .then(response => {
      const records = response.data.data;
      totalCount.textContent = records.length;

      if (records.length === 0) {
        recordList.innerHTML = `
          <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-file-medical text-4xl mb-4 text-gray-300"></i>
                <p>暂无病例数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染病例列表
      recordList.innerHTML = records.map(record => {
        // 确定状态样式
        let statusClass = '';
        let statusText = '';

        switch (parseInt(record.recordStatus)) {
          case 0:
            statusClass = 'status-0';
            statusText = '草稿';
            break;
          case 1:
            statusClass = 'status-1';
            statusText = '已提交';
            break;
          case 2:
            statusClass = 'status-2';
            statusText = '已审核';
            break;
          default:
            statusClass = '';
            statusText = '未知';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.recordId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${record.patientName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.doctorName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(record.recordDate)}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${record.symptoms}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${statusText}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="viewRecord('${record.recordId}')" class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fa fa-eye mr-1"></i> 查看
              </button>
              <button onclick="editRecord('${record.recordId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${record.recordId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('获取病例数据失败:', error);
      recordList.innerHTML = `
        <tr class="text-center">
          <td colspan="7" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载病例数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加病例模态框
function openAddRecordModal() {
  isEditing = false;
  medicalRecordId = null;
  document.getElementById('modal-title').textContent = '添加病例';
  recordForm.reset();

  // 设置默认日期为当前时间
  const now = new Date();
  const dateTimeString = now.toISOString().slice(0, 16);
  document.getElementById('record-date').value = dateTimeString;

  // 设置默认状态为草稿
  document.getElementById('record-status').value = '0';

  recordModal.classList.remove('hidden');
}

// 关闭病例模态框
function closeRecordModal() {
  recordModal.classList.add('hidden');
}

// 查看病例详情
function viewRecord(medicalRecordId) {
  const detailContent = document.getElementById('detail-content');

  // 显示加载状态
  detailContent.innerHTML = `
    <div class="flex flex-col items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p class="mt-4 text-gray-500">加载中...</p>
    </div>
  `;

  // 显示详情区域
  document.getElementById('record-detail').classList.remove('hidden');

  // 请求数据
  axios.get(`http://localhost:8080/api/MedicalRecords/${medicalRecordId}`)
    .then(response => {
      const record = response.data.data;

      // 填充详情内容
      detailContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">患者信息</h4>
            <p class="text-lg font-semibold text-gray-900">${record.patientName}</p>
            <p class="text-gray-600">ID: ${record.patientId}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">医生信息</h4>
            <p class="text-lg font-semibold text-gray-900">${record.doctorName}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500">记录日期</h4>
            <p class="text-gray-900">${formatDateTime(record.recordDate)}</p>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">病例状态</h4>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(record.recordStatus)}">
              ${getStatusText(record.recordStatus)}
            </span>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500">病例ID</h4>
            <p class="text-gray-900">${record.recordId}</p>
          </div>
        </div>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium text-gray-900">症状描述</h3>
            <p class="mt-2 text-gray-700">${record.symptoms || '无'}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900">诊断结果</h3>
            <p class="mt-2 text-gray-700">${record.diagnosis || '无'}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900">治疗方案</h3>
            <p class="mt-2 text-gray-700">${record.treatmentPlan || '无'}</p>
          </div>
          
          <div>
            <h3 class="text-lg font-medium text-gray-900">用药记录</h3>
            <p class="mt-2 text-gray-700">${record.medications || '无'}</p>
          </div>
        </div>
      `;
    })
    .catch(error => {
      console.error('获取病例详情失败:', error);
      detailContent.innerHTML = `
        <div class="flex flex-col items-center py-8">
          <i class="fa fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p class="text-gray-700">加载病例详情失败</p>
          <p class="text-gray-500 text-sm mt-2">请检查网络连接或稍后重试</p>
        </div>
      `;
    });
}
document.getElementById('close-detail').addEventListener('click', () => {
  document.getElementById('record-detail').classList.add('hidden');
});

// 状态辅助函数
function getStatusText(status) {
  const map = { 0: '草稿', 1: '已提交', 2: '已审核' };
  return map[status] || '未知';
}

function getStatusClass(status) {
  const map = {
    0: 'bg-yellow-100 text-yellow-800',
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800'
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}


// 打开编辑病例模态框
function editRecord(medicalRecordId) {
  isEditing = true;
  window.medicalRecordId = medicalRecordId
  document.getElementById('modal-title').textContent = '编辑病例';
  document.getElementById('record-id').setAttribute('readonly', 'true'); // 添加只读属性

  // 使用axios获取病历详情
  axios.get(`http://localhost:8080/api/MedicalRecords/${medicalRecordId}`)
    .then(response => {
      const record = response.data.data;

      // 填充表单数据
      document.getElementById('record-id').value = record.recordId;
      document.getElementById('patient-id').value = record.patientId;
      document.getElementById('doctor-id').value = record.doctorId;
      document.getElementById('record-date').value = formatDateTimeForInput(record.recordDate);
      document.getElementById('symptoms').value = record.symptoms;
      document.getElementById('diagnosis').value = record.diagnosis;
      document.getElementById('treatment-plan').value = record.treatmentPlan;
      document.getElementById('medications').value = record.medications;
      document.getElementById('record-status').value = record.recordStatus;

      // 显示模态框
      recordModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取病例详情失败:', error);
      alert('获取病例详情失败，请重试');
    });
}

// 保存病例信息
function saveRecord() {
  // 表单验证
  if (!recordForm.checkValidity()) {
    recordForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    recordId: document.getElementById('record-id').value,
    patientId: document.getElementById('patient-id').value,
    doctorId: document.getElementById('doctor-id').value,
    recordDate: document.getElementById('record-date').value,
    symptoms: document.getElementById('symptoms').value,
    diagnosis: document.getElementById('diagnosis').value,
    medications: document.getElementById('medications').value,
    treatmentPlan: document.getElementById('diagnosis').value,
    recordStatus: parseInt(document.getElementById('record-status').value)
  };

  // 显示加载状态
  saveRecordBtn.disabled = true;
  saveRecordBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新病例


    axios.put(`http://localhost:8080/api/MedicalRecords/${medicalRecordId}`, formData)
      .then(response => {
        alert('病例更新成功');
        closeRecordModal();
        loadRecords();
      })
      .catch(error => {
        console.error('更新病例失败:', error);
        alert('更新病例失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveRecordBtn.disabled = false;
        saveRecordBtn.innerHTML = '保存';
      });
  } else {
    // 添加病例
    axios.post('http://localhost:8080/api/MedicalRecords', formData)
      .then(response => {
        alert('病例添加成功');
        closeRecordModal();
        loadRecords();
      })
      .catch(error => {
        console.error('添加病例失败:', error);
        alert('添加病例失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveRecordBtn.disabled = false;
        saveRecordBtn.innerHTML = '保存';
      });
  }
}

// 确认删除病例
function confirmDelete(id) {
  medicalRecordId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  medicalRecordId = null;
}

// 删除病例
function deleteRecord() {
  if (!medicalRecordId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除病例
  axios.delete(`http://localhost:8080/api/MedicalRecords/${medicalRecordId}`)
    .then(response => {
      alert('病例已删除');
      closeDeleteModal();
      loadRecords();
    })
    .catch(error => {
      console.error('删除病例失败:', error);
      alert('删除病例失败，请重试');
      if (error.response && error.response.status === 409) {
        alert('该记录已关联其他数据，无法直接删除');
      }
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索病例
function searchRecords() {
  const patientName = searchPatient.value;
  const doctorName = searchDoctor.value;
  const recordStatus = searchStatus.value;
  const startTime = searchStartDate.value;
  const endTime = searchEndDate.value;

  // 显示加载状态
  recordList.innerHTML = `
    <tr class="text-center">
      <td colspan="7" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索病例数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索病例
  let url = 'http://localhost:8080/api/MedicalRecords/search';

  const requestBody = {
    patientName,
    doctorName,
    recordStatus,
    startTime,
    endTime
  };

  axios.post(url, requestBody)
    .then(response => {
      const records = response.data.data;
      totalCount.textContent = records.length;

      if (records.length === 0) {
        recordList.innerHTML = `
          <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的病例数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      recordList.innerHTML = records.map(records => {
        // 确定状态样式
        let statusClass = '';
        let statusText = '';

        switch (parseInt(records.recordStatus)) {
          case 0:
            statusClass = 'status-0';
            statusText = '草稿';
            break;
          case 1:
            statusClass = 'status-1';
            statusText = '已提交';
            break;
          case 2:
            statusClass = 'status-2';
            statusText = '已审核';
            break;
          default:
            statusClass = '';
            statusText = '未知';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${records.recordId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${records.patientName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${records.doctorName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(records.recordDate)}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${records.symptoms}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                ${statusText}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="viewRecord('${records.recordId}')" class="text-blue-600 hover:text-blue-900 mr-3">
                <i class="fa fa-eye mr-1"></i> 查看
              </button>
              <button onclick="editRecord('${records.recordId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${records.recordId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('搜索病例失败:', error);
      recordList.innerHTML = `
        <tr class="text-center">
          <td colspan="7" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索病例失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}


// 辅助函数：格式化日期时间
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';

  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 辅助函数：为datetime-local输入格式化日期时间
function formatDateTimeForInput(dateTimeString) {
  if (!dateTimeString) return '';

  // 处理可能的时区问题
  const date = new Date(dateTimeString);
  return date.toISOString().slice(0, 16);
}