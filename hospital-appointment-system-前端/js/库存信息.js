// 全局变量
let currentRecordId = null;
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
const searchMedicine = document.getElementById('search-medicine');
const searchOperationType = document.getElementById('search-operation-type');
const searchStartDate = document.getElementById('search-start-date');
const searchEndDate = document.getElementById('search-end-date');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载药品列表和库存记录
  loadMedicines();
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

// 加载药品列表用于下拉选择
function loadMedicines() {
  // 加载搜索框中的药品列表
  axios.get('/api/medicines')
    .then(response => {
      const medicines = response.data;
      
      // 清空现有选项
      searchMedicine.innerHTML = '<option value="">全部药品</option>';
      
      // 添加药品选项
      medicines.forEach(medicine => {
        const option = document.createElement('option');
        option.value = medicine.medicine_id;
        option.textContent = `${medicine.medicine_name} (${medicine.medicine_spec})`;
        searchMedicine.appendChild(option);
      });
      
      // 复制药品选项到添加记录模态框
      const recordMedicineSelect = document.getElementById('record-medicine');
      recordMedicineSelect.innerHTML = '<option value="">请选择药品</option>';
      
      medicines.forEach(medicine => {
        const option = document.createElement('option');
        option.value = medicine.medicine_id;
        option.textContent = `${medicine.medicine_name} (${medicine.medicine_spec})`;
        recordMedicineSelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error('获取药品数据失败:', error);
      searchMedicine.innerHTML = '<option value="">加载药品数据失败</option>';
      document.getElementById('record-medicine').innerHTML = '<option value="">加载药品数据失败</option>';
    });
}

// 加载库存记录列表
function loadRecords() {
  // 显示加载状态
  recordList.innerHTML = `
    <tr class="text-center">
      <td colspan="10" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载库存记录数据...</p>
        </div>
      </td>
    </tr>
  `;
  
  // 使用axios获取库存记录数据
  axios.get('/api/inventory_records')
    .then(response => {
      const records = response.data;
      totalCount.textContent = records.length;
      
      if (records.length === 0) {
        recordList.innerHTML = `
          <tr class="text-center">
            <td colspan="10" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-clipboard-list text-4xl mb-4 text-gray-300"></i>
                <p>暂无库存记录数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }
      
      // 渲染库存记录列表
      recordList.innerHTML = records.map(record => {
        // 确定操作类型样式
        let operationClass = '';
        let operationText = '';
        
        switch (record.operation_type) {
          case 1:
            operationClass = 'operation-in';
            operationText = '入库';
            break;
          case 2:
            operationClass = 'operation-out';
            operationText = '出库';
            break;
          case 3:
            operationClass = 'operation-return';
            operationText = '退货';
            break;
          default:
            operationClass = '';
            operationText = '未知';
        }
        
        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.record_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${record.medicine_name}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${operationClass}">
                ${operationText}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.quantity} ${record.medicine_unit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.batch_number}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(record.expiry_date)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.operator_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(record.operation_time)}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${record.reason}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="editRecord(${record.record_id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete(${record.record_id})" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('获取库存记录数据失败:', error);
      recordList.innerHTML = `
        <tr class="text-center">
          <td colspan="10" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载库存记录数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加库存记录模态框
function openAddRecordModal() {
  isEditing = false;
  currentRecordId = null;
  document.getElementById('modal-title').textContent = '添加库存记录';
  recordForm.reset();
  
  // 设置默认日期为今天
  document.getElementById('record-expiry').valueAsDate = new Date();
  
  recordModal.classList.remove('hidden');
}

// 关闭库存记录模态框
function closeRecordModal() {
  recordModal.classList.add('hidden');
}

// 打开编辑库存记录模态框
function editRecord(id) {
  isEditing = true;
  currentRecordId = id;
  document.getElementById('modal-title').textContent = '编辑库存记录';
  
  // 使用axios获取库存记录详情
  axios.get(`/api/inventory_records/${id}`)
    .then(response => {
      const record = response.data;
      
      // 填充表单数据
      document.getElementById('record-id').value = record.record_id;
      document.getElementById('record-medicine').value = record.medicine_id;
      document.getElementById('record-operation-type').value = record.operation_type;
      document.getElementById('record-quantity').value = record.quantity;
      document.getElementById('record-operator').value = record.operator_id;
      document.getElementById('record-batch').value = record.batch_number;
      document.getElementById('record-expiry').value = formatDate(record.expiry_date);
      document.getElementById('record-reason').value = record.reason;
      
      // 显示模态框
      recordModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取库存记录详情失败:', error);
      alert('获取库存记录详情失败，请重试');
    });
}

// 保存库存记录信息
function saveRecord() {
  // 表单验证
  if (!recordForm.checkValidity()) {
    recordForm.reportValidity();
    return;
  }
  
  // 收集表单数据
  const formData = {
    medicine_id: document.getElementById('record-medicine').value,
    operation_type: parseInt(document.getElementById('record-operation-type').value),
    quantity: parseInt(document.getElementById('record-quantity').value),
    operator_id: document.getElementById('record-operator').value,
    batch_number: document.getElementById('record-batch').value,
    expiry_date: document.getElementById('record-expiry').value,
    reason: document.getElementById('record-reason').value
  };
  
  // 显示加载状态
  saveRecordBtn.disabled = true;
  saveRecordBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';
  
  // 使用axios发送数据
  if (isEditing) {
    // 更新库存记录
    formData.record_id = currentRecordId;
    
    axios.put(`/api/inventory_records/${currentRecordId}`, formData)
      .then(response => {
        alert('库存记录更新成功');
        closeRecordModal();
        loadRecords();
      })
      .catch(error => {
        console.error('更新库存记录失败:', error);
        alert('更新库存记录失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveRecordBtn.disabled = false;
        saveRecordBtn.innerHTML = '保存';
      });
  } else {
    // 添加库存记录
    axios.post('/api/inventory_records', formData)
      .then(response => {
        alert('库存记录添加成功');
        closeRecordModal();
        loadRecords();
      })
      .catch(error => {
        console.error('添加库存记录失败:', error);
        alert('添加库存记录失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveRecordBtn.disabled = false;
        saveRecordBtn.innerHTML = '保存';
      });
  }
}

// 确认删除库存记录
function confirmDelete(id) {
  currentRecordId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  currentRecordId = null;
}

// 删除库存记录
function deleteRecord() {
  if (!currentRecordId) return;
  
  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';
  
  // 使用axios删除库存记录
  axios.delete(`/api/inventory_records/${currentRecordId}`)
    .then(response => {
      alert('库存记录已删除');
      closeDeleteModal();
      loadRecords();
    })
    .catch(error => {
      console.error('删除库存记录失败:', error);
      alert('删除库存记录失败，请重试');
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

// 搜索库存记录
function searchRecords() {
  const medicineId = searchMedicine.value;
  const operationType = searchOperationType.value;
  const startDate = searchStartDate.value;
  const endDate = searchEndDate.value;
  
  // 显示加载状态
  recordList.innerHTML = `
    <tr class="text-center">
      <td colspan="10" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索库存记录数据...</p>
        </div>
      </td>
    </tr>
  `;
  
  // 使用axios搜索库存记录
  let url = '/api/inventory_records';
  const params = [];
  
  if (medicineId) params.push(`medicine_id=${encodeURIComponent(medicineId)}`);
  if (operationType) params.push(`operation_type=${encodeURIComponent(operationType)}`);
  if (startDate) params.push(`start_date=${encodeURIComponent(startDate)}`);
  if (endDate) params.push(`end_date=${encodeURIComponent(endDate)}`);
  
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  
  axios.get(url)
    .then(response => {
      const records = response.data;
      totalCount.textContent = records.length;
      
      if (records.length === 0) {
        recordList.innerHTML = `
          <tr class="text-center">
            <td colspan="10" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的库存记录数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }
      
      // 渲染搜索结果
      recordList.innerHTML = records.map(record => {
        // 确定操作类型样式
        let operationClass = '';
        let operationText = '';
        
        switch (record.operation_type) {
          case 1:
            operationClass = 'operation-in';
            operationText = '入库';
            break;
          case 2:
            operationClass = 'operation-out';
            operationText = '出库';
            break;
          case 3:
            operationClass = 'operation-return';
            operationText = '退货';
            break;
          default:
            operationClass = '';
            operationText = '未知';
        }
        
        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.record_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${record.medicine_name}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${operationClass}">
                ${operationText}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${record.quantity} ${record.medicine_unit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.batch_number}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDate(record.expiry_date)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${record.operator_id}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(record.operation_time)}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${record.reason}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button onclick="editRecord(${record.record_id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete(${record.record_id})" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('搜索库存记录数据失败:', error);
      recordList.innerHTML = `
        <tr class="text-center">
          <td colspan="10" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索库存记录数据失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 格式化日期
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 格式化日期时间
function formatDateTime(dateTimeString) {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}  