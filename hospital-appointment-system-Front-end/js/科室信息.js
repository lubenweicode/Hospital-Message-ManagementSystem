// 全局变量
let currentDepartmentId = null;
let isEditing = false;

// DOM 元素
const departmentList = document.getElementById('department-list');
const addDepartmentBtn = document.getElementById('add-department-btn');
const departmentModal = document.getElementById('department-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveDepartmentBtn = document.getElementById('save-department');
const departmentForm = document.getElementById('department-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchName = document.getElementById('search-name');
const searchStatus = document.getElementById('search-status');
const totalCount = document.getElementById('total-count');
const departmentHeadSelect = document.getElementById('department-head');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载科室列表和医生列表
  loadDoctors();
  loadDepartments();

  // 绑定事件监听器
  addDepartmentBtn.addEventListener('click', openAddDepartmentModal);
  closeModal.addEventListener('click', closeDepartmentModal);
  cancelModal.addEventListener('click', closeDepartmentModal);
  saveDepartmentBtn.addEventListener('click', saveDepartment);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteDepartment);
  searchBtn.addEventListener('click', searchDepartments);

  // 点击模态框外部关闭
  departmentModal.addEventListener('click', (e) => {
    if (e.target === departmentModal) {
      closeDepartmentModal();
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
  axios.post('http://localhost:8080/api/doctors/search', {})
    .then(response => {
      const doctors = response.data.data;

      // 清空现有选项
      departmentHeadSelect.innerHTML = '<option value="">请选择科室负责人</option>';

      // 添加医生选项
      doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.doctorName;
        option.textContent = `${doctor.doctorName} (${doctor.doctorTitle})`;
        departmentHeadSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取医生数据失败:', error);
      departmentHeadSelect.innerHTML = '<option value="">加载医生数据失败</option>';
    });
}

// 加载科室列表
function loadDepartments() {
  // 显示加载状态
  departmentList.innerHTML = `
    <tr class="text-center">
      <td colspan="7" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载科室数据...</p>
        </div>
      </td>
    </tr>
  `;

  const deptName = document.getElementById('search-name').value;
  const deptStatus = document.getElementById('search-status').value;

  const requestBody = { deptName, deptStatus };

  // 使用axios获取科室数据
  axios.post('http://localhost:8080/api/departments/search', requestBody)
    .then(response => {
      const departments = response.data.data;
      totalCount.textContent = departments.length;

      if (departments.length === 0) {
        departmentList.innerHTML = `
          <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-hospital-o text-4xl mb-4 text-gray-300"></i>
                <p>暂无科室数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染科室列表
      departmentList.innerHTML = departments.map(department => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.deptId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.deptName}</td>
          <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${department.deptDesc}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.deptHead || '未指定'}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${department.deptStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
              ${department.deptStatus === 1 ? '启用' : '停用'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(department.createTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editDepartment('${department.deptId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${department.deptId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('获取科室数据失败:', error);
      departmentList.innerHTML = `
        <tr class="text-center">
          <td colspan="7" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载科室数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加科室模态框
function openAddDepartmentModal() {
  isEditing = false;
  currentDepartmentId = null;
  document.getElementById('modal-title').textContent = '添加科室';
  departmentForm.reset();
  departmentModal.classList.remove('hidden');
}

// 关闭科室模态框
function closeDepartmentModal() {
  departmentModal.classList.add('hidden');
}

// 打开编辑科室模态框
function editDepartment(id) {
  isEditing = true;
  currentDepartmentId = id;
  document.getElementById('modal-title').textContent = '编辑科室';

  // 使用axios获取科室详情
  axios.get(`http://localhost:8080/api/departments/${currentDepartmentId}`)
    .then(response => {
      const department = response.data.data;

      // 填充表单数据
      document.getElementById('department-id').value = department.deptId;
      document.getElementById('department-name').value = department.deptName;
      document.getElementById('department-head').value = department.deptHead;
      document.getElementById('department-status').value = department.deptStatus;
      document.getElementById('department-description').value = department.deptDesc;

      // 显示模态框
      departmentModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取科室详情失败:', error);
      alert('获取科室详情失败，请重试');
    });
}

// 保存科室信息
function saveDepartment() {
  // 表单验证
  if (!departmentForm.checkValidity()) {
    departmentForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    deptName: document.getElementById('department-name').value,
    deptHead: document.getElementById('department-head').value,
    deptStatus: parseInt(document.getElementById('department-status').value),
    deptDesc: document.getElementById('department-description').value
  };

  // 显示加载状态
  saveDepartmentBtn.disabled = true;
  saveDepartmentBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新科室
    formData.deptId = currentDepartmentId;

    axios.put(`http://localhost:8080/api/departments/${currentDepartmentId}`, formData)
      .then(response => {
        alert('科室信息更新成功');
        closeDepartmentModal();
        loadDepartments();
      })
      .catch(error => {
        console.error('更新科室信息失败:', error);
        alert('更新科室信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveDepartmentBtn.disabled = false;
        saveDepartmentBtn.innerHTML = '保存';
      });
  } else {
    // 添加科室
    axios.post('http://localhost:8080/api/departments', formData)
      .then(response => {
        alert('科室信息添加成功');
        closeDepartmentModal();
        loadDepartments();
      })
      .catch(error => {
        console.error('添加科室信息失败:', error);
        alert('添加科室信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveDepartmentBtn.disabled = false;
        saveDepartmentBtn.innerHTML = '保存';
      });
  }
}

// 确认删除科室
function confirmDelete(id) {
  currentDepartmentId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  currentDepartmentId = null;
}

// 删除科室
function deleteDepartment() {
  if (!currentDepartmentId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除科室
  axios.delete(`http://localhost:8080/api/departments/${currentDepartmentId}`)
    .then(response => {
      alert('科室信息已删除');
      closeDeleteModal();
      loadDepartments();
    })
    .catch(error => {
      console.error('删除科室信息失败:', error);
      alert('删除科室信息失败，请重试');
      if (error.response && error.response.status === 409) {
        alert('该科室下存在医生，无法直接删除');
      }
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索科室
function searchDepartments() {
  const deptName = searchName.value.trim();
  const deptStatus = searchStatus.value;

  // 显示加载状态
  departmentList.innerHTML = `
    <tr class="text-center">
      <td colspan="7" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索科室数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索科室
  let url = 'http://localhost:8080/api/departments/search';
  const requestBody = { deptName, deptStatus };

  axios.post(url, requestBody)
    .then(response => {
      const departments = response.data.data;
      totalCount.textContent = departments.length;

      if (departments.length === 0) {
        departmentList.innerHTML = `
          <tr class="text-center">
            <td colspan="7" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的科室数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      departmentList.innerHTML = departments.map(department => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.deptId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.deptName}</td>
          <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${department.deptDesc}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.deptHead || '未指定'}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${department.deptStatus === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }">
              ${department.deptStatus === 1 ? '启用' : '停用'}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(department.createTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editDepartment('${department.deptId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${department.deptId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('搜索科室数据失败:', error);
      departmentList.innerHTML = `
        <tr class="text-center">
          <td colspan="7" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索科室数据失败，请重试</p>
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