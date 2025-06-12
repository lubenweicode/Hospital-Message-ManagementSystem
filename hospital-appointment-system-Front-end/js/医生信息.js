// 全局变量
let doctorId = null;
let isEditing = false;

// DOM 元素
const doctorList = document.getElementById('doctor-list');
const addDoctorBtn = document.getElementById('add-doctor-btn');
const doctorModal = document.getElementById('doctor-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveDoctorBtn = document.getElementById('save-doctor');
const doctorForm = document.getElementById('doctor-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchName = document.getElementById('search-name');
const searchDepartment = document.getElementById('search-department');
const searchTitle = document.getElementById('search-title');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载医生列表
  loadDoctors();

  // 绑定事件监听器
  addDoctorBtn.addEventListener('click', openAddDoctorModal);
  closeModal.addEventListener('click', closeDoctorModal);
  cancelModal.addEventListener('click', closeDoctorModal);
  saveDoctorBtn.addEventListener('click', saveDoctor);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteDoctor);
  searchBtn.addEventListener('click', searchDoctors);

  // 点击模态框外部关闭
  doctorModal.addEventListener('click', (e) => {
    if (e.target === doctorModal) {
      closeDoctorModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
});

// 加载医生列表
function loadDoctors() {
  // 显示加载状态
  doctorList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载医生数据...</p>
        </div>
      </td>
    </tr>
  `;

  const doctorName = document.getElementById('search-name').value;
  const deptId = document.getElementById('search-department').value;
  const doctorTitle = document.getElementById('search-title').value;

  const requestBody = { doctorName, deptId, doctorTitle };

  // 使用axios获取医生数据
  axios.post('http://localhost:8080/api/doctors/search', requestBody)
    .then(response => {
      const doctors = response.data.data;
      totalCount.textContent = doctors.length;

      if (doctors.length === 0) {
        doctorList.innerHTML = `
          <tr class="text-center">
            <td colspan="8" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-user-md text-4xl mb-4 text-gray-300"></i>
                <p>暂无医生数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染医生列表
      doctorList.innerHTML = doctors.map(doctor => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorGender === 1 ? '男' : '女'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorTitle}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.deptName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorSpecialty}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.doctorStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
              ${doctor.doctorStatus === 1 ? '正常出诊' : '休假'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editDoctor('${doctor.doctorId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${doctor.doctorId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('获取医生数据失败:', error);
      doctorList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载医生数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加医生模态框
function openAddDoctorModal() {
  isEditing = false;
  doctorId = null;
  document.getElementById('modal-title').textContent = '添加医生';
  doctorForm.reset();
  doctorModal.classList.remove('hidden');
}

// 关闭医生模态框
function closeDoctorModal() {
  doctorModal.classList.add('hidden');
}

// 打开编辑医生模态框
function editDoctor(id) {
  isEditing = true;
  doctorId = id;
  document.getElementById('modal-title').textContent = '编辑医生';

  // 使用axios获取医生详情
  axios.get(`http://localhost:8080/api/doctors/${doctorId}`)
    .then(response => {
      const doctor = response.data.data;

      // 填充表单数据
      document.getElementById('doctor-id').value = doctor.doctorId;
      document.getElementById('doctor-name').value = doctor.doctorName;
      document.getElementById('doctor-gender').value = doctor.doctorGender;
      document.getElementById('doctor-title').value = doctor.doctorTitle;
      document.getElementById('doctor-department').value = doctor.deptId;
      document.getElementById('doctor-specialty').value = doctor.doctorSpecialty;
      document.getElementById('doctor-status').value = doctor.doctorStatus;

      // 显示模态框
      doctorModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取医生详情失败:', error);
      alert('获取医生详情失败，请重试');
    });
}

// 保存医生信息
function saveDoctor() {
  // 表单验证
  if (!doctorForm.checkValidity()) {
    doctorForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    doctorName: document.getElementById('doctor-name').value,
    doctorGender: parseInt(document.getElementById('doctor-gender').value),
    doctorTitle: document.getElementById('doctor-title').value,
    deptId: document.getElementById('doctor-department').value,
    doctorSpecialty: document.getElementById('doctor-specialty').value,
    doctorStatus: parseInt(document.getElementById('doctor-status').value)
  };

  // 显示加载状态
  saveDoctorBtn.disabled = true;
  saveDoctorBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新医生
    formData.doctorId = doctorId;

    axios.put(`http://localhost:8080/api/doctors/${doctorId}`, formData)
      .then(response => {
        alert('医生信息更新成功');
        closeDoctorModal();
        loadDoctors();
      })
      .catch(error => {
        console.error('更新医生信息失败:', error);
        alert('更新医生信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveDoctorBtn.disabled = false;
        saveDoctorBtn.innerHTML = '保存';
      });
  } else {
    // 添加医生
    axios.post('http://localhost:8080/api/doctors', formData)
      .then(response => {
        alert('医生信息添加成功');
        closeDoctorModal();
        loadDoctors();
      })
      .catch(error => {
        console.error('添加医生信息失败:', error);
        alert('添加医生信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveDoctorBtn.disabled = false;
        saveDoctorBtn.innerHTML = '保存';
      });
  }
}

// 确认删除医生
function confirmDelete(id) {
  doctorId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  doctorId = null;
}

// 删除医生
function deleteDoctor() {
  if (!doctorId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除医生
  axios.delete(`http://localhost:8080/api/doctors/${doctorId}`)
    .then(response => {
      alert('医生信息已删除');
      closeDeleteModal();
      loadDoctors();
    })
    .catch(error => {
      console.error('删除医生信息失败:', error);
      alert('删除医生信息失败，请重试');
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索医生
function searchDoctors() {
  const doctorName = searchName.value.trim();
  const deptId = searchDepartment.value;
  const doctorTitle = searchTitle.value;

  // 显示加载状态
  doctorList.innerHTML = `
    <tr class="text-center">
      <td colspan="8" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索医生数据...</p>
        </div>
      </td>
    </tr>
  `;


  // 使用axios搜索医生
  let url = 'http://localhost:8080/api/doctors/search';
  const requestBody = { doctorName, deptId, doctorTitle }

  axios.post(url, requestBody)
    .then(response => {
      const doctors = response.data.data;
      totalCount.textContent = doctors.length;

      if (doctors.length === 0) {
        doctorList.innerHTML = `
          <tr class="text-center">
            <td colspan="8" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的医生数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      doctorList.innerHTML = doctors.map(doctor => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorGender === 1 ? '男' : '女'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorTitle}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.deptName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${doctor.doctorSpecialty}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doctor.doctorStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
              ${doctor.doctorStatus === 1 ? '正常出诊' : '休假'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editDoctor(${doctor.doctorId})" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete(${doctor.doctorId})" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('搜索医生数据失败:', error);
      doctorList.innerHTML = `
        <tr class="text-center">
          <td colspan="8" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索医生数据失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}  