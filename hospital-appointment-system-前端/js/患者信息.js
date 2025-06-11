// 全局变量
let patientId = null;
let isEditing = false;

// DOM 元素
const patientList = document.getElementById('patient-list');
const addPatientBtn = document.getElementById('add-patient-btn');
const patientModal = document.getElementById('patient-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const savePatientBtn = document.getElementById('save-patient');
const patientForm = document.getElementById('patient-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchName = document.getElementById('search-name');
const searchPhone = document.getElementById('search-phone');
const searchCase = document.getElementById('search-case');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载患者列表
  loadPatients();

  // 绑定事件监听器
  addPatientBtn.addEventListener('click', openAddPatientModal);
  closeModal.addEventListener('click', closePatientModal);
  cancelModal.addEventListener('click', closePatientModal);
  savePatientBtn.addEventListener('click', savePatient);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deletePatient);
  searchBtn.addEventListener('click', searchPatients);

  // 点击模态框外部关闭
  patientModal.addEventListener('click', (e) => {
    if (e.target === patientModal) {
      closePatientModal();
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
  // 显示加载状态
  patientList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载患者数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios获取患者数据
  axios.post('http://localhost:8080/api/patients/search', {})
    .then(response => {
      const patients = response.data.data;
      totalCount.textContent = patients.length;

      if (patients.length === 0) {
        patientList.innerHTML = `
          <tr class="text-center">
            <td colspan="8" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-hospital-o text-4xl mb-4 text-gray-300"></i>
                <p>暂无患者数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染患者列表
      patientList.innerHTML = patients.map(patient => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientGender === 1 ? '男' : '女'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientAge}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientPhone}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPatientCaseClass(patient.patientCase)}">
              ${patient.patientCase}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(patient.createTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editPatient('${patient.patientId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${patient.patientId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('获取患者数据失败:', error);
      patientList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载患者数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加患者模态框
function openAddPatientModal() {
  isEditing = false;
  patientId = null;
  document.getElementById('modal-title').textContent = '添加患者';
  patientForm.reset();
  patientModal.classList.remove('hidden');
}

// 关闭患者模态框
function closePatientModal() {
  patientModal.classList.add('hidden');
}

// 打开编辑患者模态框
function editPatient(id) {
  console.log(id);
  isEditing = true;
  patientId = id;
  document.getElementById('modal-title').textContent = '编辑患者';

  // 使用axios获取患者详情
  axios.get(`http://localhost:8080/api/patients/${patientId}`)
    .then(response => {
      const patient = response.data.data;

      // 填充表单数据
      document.getElementById('patient-id').value = patient.patientId;
      document.getElementById('patient-name').value = patient.patientName;
      document.getElementById('patient-gender').value = patient.patientGender;
      document.getElementById('patient-age').value = patient.patientAge;
      document.getElementById('patient-birth').value = patient.patientBirth;
      document.getElementById('patient-address').value = patient.patientAddress;
      document.getElementById('patient-phone').value = patient.patientPhone;
      document.getElementById('patient-card').value = patient.patientIdCard;
      document.getElementById('patient-case').value = patient.patientCase;
      document.getElementById('patient-allergy').value = patient.patientAllergy;
      document.getElementById('patient-history').value = patient.patientHistory;
      document.getElementById('patient-detail').value = patient.patientCasedetail;

      // 显示模态框
      patientModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取患者详情失败:', error);
      alert('获取患者详情失败，请重试');
    });
}

// 保存患者信息
function savePatient() {
  // 表单验证
  if (!patientForm.checkValidity()) {
    patientForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    patientName: document.getElementById('patient-name').value,
    patientGender: parseInt(document.getElementById('patient-gender').value),
    patientAge: parseInt(document.getElementById('patient-age').value),
    patientBirth: document.getElementById('patient-birth').value,
    patientAddress: document.getElementById('patient-address').value,
    patientPhone: document.getElementById('patient-phone').value,
    patientIdCard: document.getElementById('patient-card').value,
    patientCase: document.getElementById('patient-case').value,
    patientAllergy: document.getElementById('patient-allergy').value,
    patientHistory: document.getElementById('patient-history').value,
    patientCasedetail: document.getElementById('patient-detail').value
  };

  // 显示加载状态
  savePatientBtn.disabled = true;
  savePatientBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新患者
    formData.patientId = patientId;

    axios.put(`http://localhost:8080/api/patients/${patientId}`, formData)
      .then(response => {
        alert('患者信息更新成功');
        closePatientModal();
        loadPatients();
      })
      .catch(error => {
        console.error('更新患者信息失败:', error);
        alert('更新患者信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        savePatientBtn.disabled = false;
        savePatientBtn.innerHTML = '保存';
      });
  } else {
    // 添加患者
    axios.post('http://localhost:8080/api/patients', formData)
      .then(response => {
        alert('患者信息添加成功');
        closePatientModal();
        loadPatients();
      })
      .catch(error => {
        console.error('添加患者信息失败:', error);
        alert('添加患者信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        savePatientBtn.disabled = false;
        savePatientBtn.innerHTML = '保存';
      });
  }
}

// 确认删除患者
function confirmDelete(id) {
  patientId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  patientId = null;
}

// 删除患者
function deletePatient() {
  if (!patientId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除患者
  axios.delete(`http://localhost:8080/api/patients/${patientId}`)
    .then(response => {
      alert('患者信息已删除');
      closeDeleteModal();
      loadPatients();
    })
    .catch(error => {
      console.error('删除患者信息失败:', error);
      alert('删除患者信息失败，请重试');
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索患者
function searchPatients() {
  const patientName = searchName.value.trim();
  const patientPhone = searchPhone.value.trim();
  const patientCase = searchCase.value;

  // 显示加载状态
  patientList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索患者数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索患者
  let url = 'http://localhost:8080/api/patients/search';

  const requestBody = {
    patientName,
    patientPhone,
    patientCase
  };

  axios.post(url, requestBody)
    .then(response => {
      const patients = response.data.data;
      totalCount.textContent = patients.length;

      if (patients.length === 0) {
        patientList.innerHTML = `
          <tr class="text-center">
            <td colspan="8" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的患者数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      patientList.innerHTML = patients.map(patient => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientGender === 1 ? '男' : '女'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientAge}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${patient.patientPhone}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPatientCaseClass(patient.patientCase)}">
              ${patient.patientCase}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(patient.createTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editPatient('${patient.patientId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${patient.patientId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('搜索患者数据失败:', error);
      patientList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索患者数据失败，请重试</p>
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

// 新增状态映射函数（可选，提升代码可读性）
function getPatientCaseClass(caseStatus) {
  switch (caseStatus) {
    case '住院中': return 'bg-red-100 text-red-800';
    case '门诊中': return 'bg-blue-100 text-blue-800';
    case '已出院': return 'bg-green-100 text-green-800'; // 新增状态
    default: return 'bg-gray-100 text-gray-800';
  }
}