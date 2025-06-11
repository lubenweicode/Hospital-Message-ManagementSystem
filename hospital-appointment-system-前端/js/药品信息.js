// 全局变量
let medicineId = null;
let isEditing = false;
let orderMedicineId = null;

// DOM 元素
const medicineList = document.getElementById('medicine-list');
const addMedicineBtn = document.getElementById('add-medicine-btn');
const medicineModal = document.getElementById('medicine-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveMedicineBtn = document.getElementById('save-medicine');
const medicineForm = document.getElementById('medicine-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchName = document.getElementById('search-name');
const searchCategory = document.getElementById('search-category');
const searchStockStatus = document.getElementById('search-stock-status');
const totalCount = document.getElementById('total-count');

// 新增：下单模态框相关 DOM
const orderModal = document.getElementById('order-modal');
const closeOrderModal = document.getElementById('close-order-modal');
const cancelOrderBtn = document.getElementById('cancel-order');
const confirmOrderBtn = document.getElementById('confirm-order');
const orderForm = document.getElementById('order-form');
const orderQuantity = document.getElementById('order-quantity');
const orderRemark = document.getElementById('order-remark');


// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载药品列表
  loadMedicines();

  // 绑定事件监听器
  addMedicineBtn.addEventListener('click', openAddMedicineModal);
  closeModal.addEventListener('click', closeMedicineModal);
  cancelModal.addEventListener('click', closeMedicineModal);
  saveMedicineBtn.addEventListener('click', saveMedicine);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteMedicine);
  searchBtn.addEventListener('click', searchMedicines);

  // 新增：下单按钮点击事件
  medicineList.addEventListener('click', (e) => {
    if (e.target.closest('[data-action="order"]')) {
      const btn = e.target.closest('[data-action="order"]');
      const id = bt.getAttribute('data-id');
      openOrderModal(id);
    }
  });

  // 新增：下单模态框事件
  closeOrderModal.addEventListener('click', closeOrderModal);
  cancelOrderBtn.addEventListener('click', closeOrderModal);
  confirmOrderBtn.addEventListener('click', confirmOrder);

  // 点击模态框外部关闭
  medicineModal.addEventListener('click', (e) => {
    if (e.target === medicineModal) {
      closeMedicineModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  // 新增：下单模态框外部点击关闭
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      closeOrderModal1();
    }
  });
});

function closeOrderModal1() {
  orderModal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  orderMedicineId = null;
}


// 加载药品列表
function loadMedicines() {
  // 显示加载状态
  medicineList.innerHTML = `
    <tr class="text-center">
      <td colspan="9" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载药品数据...</p>
        </div>
      </td>
    </tr>
  `;

  const medicineName = document.getElementById('search-name').value;
  const medicineCategory = document.getElementById('search-category').value;
  const medicineStatus = document.getElementById('search-stock-status').value;
  const requestBody = { medicineName, medicineCategory, medicineStatus };

  // 使用axios获取药品数据
  axios.post('http://localhost:8080/api/medicine/search', requestBody)
    .then(response => {
      const medicines = response.data.data;
      totalCount.textContent = medicines.length;

      if (medicines.length === 0) {
        medicineList.innerHTML = `
          <tr class="text-center">
            <td colspan="9" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-medkit text-4xl mb-4 text-gray-300"></i>
                <p>暂无药品数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染药品列表
      medicineList.innerHTML = medicines.map(medicine => {
        // 确定库存状态
        let stockStatus = '充足';
        if (medicine.medicineStatus === "3") {
          stockStatus = '短缺';
        } else if (medicine.medicineStatus === "2") {
          stockStatus = '预警';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${medicine.medicineId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${medicine.medicineName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.medicineSpec}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.medicineUnit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.medicineCategory}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${medicine.manufacturer}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥${parseFloat(medicine.price).toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full stock-${stockStatus}">
                ${medicine.stockQuantity} ${medicine.medicineUnit} (${stockStatus})
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-800 mr-2" data-action="order" data-id="${medicine.medicineId}">
                 <i class="fa fa-shopping-cart mr-1"></i> 下单
              </button>
              <button onclick="editMedicine('${medicine.medicineId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${medicine.medicineId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('获取药品数据失败:', error);
      medicineList.innerHTML = `
        <tr class="text-center">
          <td colspan="9" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载药品数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加药品模态框
function openAddMedicineModal() {
  isEditing = false;
  medicineId = null;
  document.getElementById('modal-title').textContent = '添加药品';
  medicineForm.reset();

  medicineModal.classList.remove('hidden');
}

// 关闭药品模态框
function closeMedicineModal() {
  medicineModal.classList.add('hidden');
}

// 打开编辑药品模态框
function editMedicine(id) {
  isEditing = true;
  medicineId = id;
  document.getElementById('modal-title').textContent = '编辑药品';

  // 使用axios获取药品详情
  axios.get(`http://localhost:8080/api/medicine/${medicineId}`)
    .then(response => {
      const medicine = response.data.data;

      // 填充表单数据
      document.getElementById('medicine-id').value = medicine.medicineId;
      document.getElementById('medicine-name').value = medicine.medicineName;
      document.getElementById('medicine-spec').value = medicine.medicineSpec;
      document.getElementById('medicine-unit').value = medicine.medicineUnit;
      document.getElementById('medicine-category').value = medicine.medicineCategory;
      document.getElementById('manufacturer').value = medicine.manufacturer;
      document.getElementById('price').value = parseFloat(medicine.price).toFixed(2);
      document.getElementById('stock-quantity').value = medicine.stockQuantity;
      document.getElementById('min-stock').value = medicine.minStock;

      // 显示模态框
      medicineModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取药品详情失败:', error);
      alert('获取药品详情失败，请重试');
    });
}

// 保存药品信息
function saveMedicine() {
  // 表单验证
  if (!medicineForm.checkValidity()) {
    medicineForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    medicineId: document.getElementById('medicine-id').value,
    medicineName: document.getElementById('medicine-name').value,
    medicineSpec: document.getElementById('medicine-spec').value,
    medicineUnit: document.getElementById('medicine-unit').value,
    medicineCategory: document.getElementById('medicine-category').value,
    manufacturer: document.getElementById('manufacturer').value,
    price: parseFloat(document.getElementById('price').value),
    stockQuantity: parseInt(document.getElementById('stock-quantity').value),
    minStock: parseInt(document.getElementById('min-stock').value)
  };

  // 显示加载状态
  saveMedicineBtn.disabled = true;
  saveMedicineBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新药品
    formData.medicineId = medicineId;

    axios.put(`http://localhost:8080/api/medicine/${medicineId}`, formData)
      .then(response => {
        alert('药品信息更新成功');
        closeMedicineModal();
        loadMedicines();
      })
      .catch(error => {
        console.error('更新药品信息失败:', error);
        alert('更新药品信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveMedicineBtn.disabled = false;
        saveMedicineBtn.innerHTML = '保存';
      });
  } else {
    // 添加药品
    axios.post('http://localhost:8080/api/medicine', formData)
      .then(response => {
        alert('药品信息添加成功');
        closeMedicineModal();
        loadMedicines();
      })
      .catch(error => {
        console.error('添加药品信息失败:', error);
        alert('添加药品信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveMedicineBtn.disabled = false;
        saveMedicineBtn.innerHTML = '保存';
      });
  }
}

// 确认删除药品
function confirmDelete(id) {
  medicineId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  medicineId = null;
}

// 删除药品
function deleteMedicine() {
  if (!medicineId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除药品
  axios.delete(`http://localhost:8080/api/medicine/${medicineId}`)
    .then(response => {
      alert('药品信息已删除');
      closeDeleteModal();
      loadMedicines();
    })
    .catch(error => {
      console.error('删除药品信息失败:', error);
      alert('删除药品信息失败，请重试');
      if (error.response && error.response.status === 409) {
        alert('该药品存在关联记录，无法直接删除');
      }
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索药品
function searchMedicines() {
  const medicineName = searchName.value.trim();
  const medicineCategory = searchCategory.value;
  const medicineStatus = parseInt(searchStockStatus.value);

  // 显示加载状态
  medicineList.innerHTML = `
    <tr class="text-center">
      <td colspan="9" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索药品数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索药品
  let url = 'http://localhost:8080/api/medicine/search';

  const requestBody = {
    medicineName,
    medicineCategory,
    medicineStatus
  };

  axios.post(url, requestBody)
    .then(response => {
      const medicines = response.data.data;
      totalCount.textContent = medicines.length;

      if (medicines.length === 0) {
        medicineList.innerHTML = `
          <tr class="text-center">
            <td colspan="9" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的药品数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      medicineList.innerHTML = medicines.map(medicine => {
        // 确定库存状态
        let stockStatus = '充足';
        if (medicine.stock_quantity <= 0) {
          stockStatus = '短缺';
        } else if (medicine.stock_quantity <= medicine.min_stock) {
          stockStatus = '预警';
        }

        return `
          <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${medicine.medicineId}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${medicine.medicineName}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.medicineSpec}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.medicineUnit}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${medicine.medicineCategory}</td>
            <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">${medicine.manufacturer}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥${parseFloat(medicine.price).toFixed(2)}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full stock-${stockStatus}">
                ${medicine.stockQuantity} ${medicine.medicineUnit} (${stockStatus})
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button class="text-blue-600 hover:text-blue-800 mr-2" data-action="order" data-id="${medicine.medicineId}">
                 <i class="fa fa-shopping-cart mr-1"></i> 下单
              </button>
              <button onclick="editMedicine('${medicine.medicineId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
                <i class="fa fa-edit mr-1"></i> 编辑
              </button>
              <button onclick="confirmDelete('${medicine.medicineId}')" class="text-red-600 hover:text-red-900">
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
        `;
      }).join('');
    })
    .catch(error => {
      console.error('搜索药品数据失败:', error);
      medicineList.innerHTML = `
        <tr class="text-center">
          <td colspan="9" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索药品数据失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}


// 新增：打开下单模态框
function openOrderModal(id) {
  orderMedicineId = id;
  orderForm.reset();
  orderModal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');

  // 可选：加载药品详情（如库存信息）
  loadMedicineDetails(id);
}

// 新增：加载药品详情（用于下单前校验）
function loadMedicineDetails(id) {
  axios.get(`http://localhost:8080/api/medicine/${id}`)
    .then(response => {
      const medicine = response.data.data;
      // 可以显示药品名称、当前库存等信息
      // 设置最大可下单数量（可选）
    })
    .catch(error => {
      console.error('获取药品详情失败:', error);
      alert('获取药品信息失败，请重试');
    });
}



// 新增：确认下单
function confirmOrder() {
  const quantity = parseInt(orderQuantity.value);
  const remark = orderRemark.value.trim();

  if (!quantity || quantity < 1) {
    orderQuantity.reportValidity();
    return;
  }

  // 显示加载状态
  confirmOrderBtn.disabled = true;
  confirmOrderBtn.innerHTML = '<div class="loading-spinner"></div> 下单中...';

  // 发送下单请求
  axios.post(`http://localhost:8080/api/medicine/order`, {
    medicineId: orderMedicineId,
    quantity,
    remark
    // userId: 1 // 实际项目中应从会话获取用户ID
  })
    .then(response => {
      if (response.data.code === 1) {
        alert('下单成功！');
        closeOrderModal1();
        loadMedicines(); // 刷新药品列表
      } else {
        alert(`下单失败：${response.data.msg}`);
      }
      closeOrderModal1();
    })
    .catch(error => {
      console.error('下单请求失败:', error);
      alert('下单失败，请联系管理员');
    })
    .finally(() => {
      // 恢复按钮状态
      confirmOrderBtn.disabled = false;
      confirmOrderBtn.innerHTML = '确认下单';
    });
}