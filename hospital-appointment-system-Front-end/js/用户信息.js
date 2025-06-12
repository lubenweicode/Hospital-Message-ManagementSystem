// 全局变量
let userId = null;
let isEditing = false;

// DOM 元素
const userList = document.getElementById('user-list');
const addUserBtn = document.getElementById('add-user-btn');
const userModal = document.getElementById('user-modal');
const closeModal = document.getElementById('close-modal');
const cancelModal = document.getElementById('cancel-modal');
const saveUserBtn = document.getElementById('save-user');
const userForm = document.getElementById('user-form');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const searchBtn = document.getElementById('search-btn');
const searchUsername = document.getElementById('search-username');
const searchPrivilege = document.getElementById('search-privilege');
const totalCount = document.getElementById('total-count');

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 加载用户列表
  loadUsers();

  // 绑定事件监听器
  addUserBtn.addEventListener('click', openAddUserModal);
  closeModal.addEventListener('click', closeUserModal);
  cancelModal.addEventListener('click', closeUserModal);
  saveUserBtn.addEventListener('click', saveUser);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', deleteUser);
  searchBtn.addEventListener('click', searchUsers);

  // 点击模态框外部关闭
  userModal.addEventListener('click', (e) => {
    if (e.target === userModal) {
      closeUserModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });
});

// 加载用户列表
function loadUsers() {
  // 显示加载状态
  userList.innerHTML = `
    <tr class="text-center">
      <td colspan="6" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在加载用户数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios获取用户数据
  axios.post('http://localhost:8080/api/users/search')
    .then(response => {
      const users = response.data.data;
      totalCount.textContent = users.length;

      if (users.length === 0) {
        userList.innerHTML = `
          <tr class="text-center">
            <td colspan="6" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-users text-4xl mb-4 text-gray-300"></i>
                <p>暂无用户数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染用户列表
      userList.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.userId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.userDisplayName}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.userPhone}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPermissionClass(user.userPrivate)}">
              ${getPermissionText(user.userPrivate)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${user.userStatus === 1 ? "bg-green-100 text-green-800" :
          user.userStatus === 0 ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"}">
    ${user.userStatus === 1 ? "启用" :
          user.userStatus === 0 ? "禁用" :
            "已删除"}
  </span>
</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(user.createTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(user.updateTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editUser('${user.userId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${user.userId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('获取用户数据失败:', error);
      userList.innerHTML = `
        <tr class="text-center">
          <td colspan="6" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>加载用户数据失败，请刷新页面重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 打开添加用户模态框
function openAddUserModal() {
  isEditing = false;
  userId = null;
  document.getElementById('modal-title').textContent = '添加用户';
  userForm.reset();
  userModal.classList.remove('hidden');
}

// 关闭用户模态框
function closeUserModal() {
  userModal.classList.add('hidden');
}

// 打开编辑用户模态框
function editUser(id) {
  isEditing = true;
  userId = id;
  document.getElementById('modal-title').textContent = '编辑用户';

  // 使用axios获取用户详情
  axios.get(`http://localhost:8080/api/users/${userId}`)
    .then(response => {
      const user = response.data.data;

      // 填充表单数据
      document.getElementById('user-displayname').value = user.userDisplayName;
      document.getElementById('user-id').value = user.userId;
      document.getElementById('user-privilege').value = user.userPrivate;
      document.getElementById('user-phone').value = user.userPhone;
      // 显示模态框
      userModal.classList.remove('hidden');
    })
    .catch(error => {
      console.error('获取用户详情失败:', error);
      alert('获取用户详情失败，请重试');
    });
}

// 保存用户信息
function saveUser() {
  // 表单验证
  if (!userForm.checkValidity()) {
    userForm.reportValidity();
    return;
  }

  // 收集表单数据
  const formData = {
    userDisplayName: document.getElementById('user-displayname').value,
    userPhone: document.getElementById('user-phone').value,
    userUsername: document.getElementById('user-username').value,
    userPassword: document.getElementById('user-password').value,
    userPrivate: document.getElementById('user-privilege').value,
    userStatus: parseInt(document.getElementById('user-status').value)
  };

  // 显示加载状态
  saveUserBtn.disabled = true;
  saveUserBtn.innerHTML = '<div class="loading-spinner"></div> 保存中...';

  // 使用axios发送数据
  if (isEditing) {
    // 更新用户
    formData.userId = userId;

    axios.put(`http://localhost:8080/api/users/${userId}`, formData)
      .then(response => {
        alert('用户信息更新成功');
        closeUserModal();
        loadUsers();
      })
      .catch(error => {
        console.error('更新用户信息失败:', error);
        alert('更新用户信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveUserBtn.disabled = false;
        saveUserBtn.innerHTML = '保存';
      });
  } else {
    // 添加用户
    axios.post('http://localhost:8080/api/users', formData)
      .then(response => {
        alert('用户信息添加成功');
        closeUserModal();
        loadUsers();
      })
      .catch(error => {
        console.error('添加用户信息失败:', error);
        alert('添加用户信息失败，请重试');
      })
      .finally(() => {
        // 恢复按钮状态
        saveUserBtn.disabled = false;
        saveUserBtn.innerHTML = '保存';
      });
  }
}

// 确认删除用户
function confirmDelete(id) {
  userId = id;
  deleteModal.classList.remove('hidden');
}

// 关闭删除确认模态框
function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  userId = null;
}

// 删除用户
function deleteUser() {
  if (!userId) return;

  // 显示加载状态
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.innerHTML = '<div class="loading-spinner"></div> 删除中...';

  // 使用axios删除用户
  axios.delete(`http://localhost:8080/api/users/${userId}`)
    .then(response => {
      alert('用户信息已删除');
      closeDeleteModal();
      loadUsers();
    })
    .catch(error => {
      console.error('删除用户信息失败:', error);
      alert('删除用户信息失败，请重试');
    })
    .finally(() => {
      // 恢复按钮状态
      confirmDeleteBtn.disabled = false;
      confirmDeleteBtn.innerHTML = '确认删除';
    });
}

// 搜索用户
function searchUsers() {
  const userDisplayName = searchUsername.value.trim();
  const userPrivate = searchPrivilege.value;

  // 显示加载状态
  userList.innerHTML = `
    <tr class="text-center">
      <td colspan="6" class="px-6 py-12 text-gray-500">
        <div class="flex flex-col items-center">
          <div class="loading-spinner mb-4"></div>
          <p>正在搜索用户数据...</p>
        </div>
      </td>
    </tr>
  `;

  // 使用axios搜索用户
  let url = 'http://localhost:8080/api/users/search';
  const userData = { userDisplayName, userPrivate };

  axios.post(url, userData)
    .then(response => {
      const users = response.data.data;
      totalCount.textContent = users.length;

      if (users.length === 0) {
        userList.innerHTML = `
          <tr class="text-center">
            <td colspan="6" class="px-6 py-12 text-gray-500">
              <div class="flex flex-col items-center">
                <i class="fa fa-search text-4xl mb-4 text-gray-300"></i>
                <p>未找到匹配的用户数据</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      // 渲染搜索结果
      userList.innerHTML = users.map(user => `
        <tr class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.userId}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.userDisplayName}</td>
           <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${user.userPhone}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPermissionClass(user.userPrivate)}">
            ${getPermissionText(user.userPrivate)}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    ${user.userStatus === 1 ? "bg-green-100 text-green-800" :
          user.userStatus === 0 ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"}">
    ${user.userStatus === 1 ? "启用" :
          user.userStatus === 0 ? "禁用" :
            "已删除"}
  </span>
</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(user.createTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatDateTime(user.updateTime)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editUser('${user.userId}')" class="text-indigo-600 hover:text-indigo-900 mr-3">
              <i class="fa fa-edit mr-1"></i> 编辑
            </button>
            <button onclick="confirmDelete('${user.userId}')" class="text-red-600 hover:text-red-900">
              <i class="fa fa-trash mr-1"></i> 删除
            </button>
          </td>
        </tr>
      `).join('');
    })
    .catch(error => {
      console.error('搜索用户数据失败:', error);
      userList.innerHTML = `
        <tr class="text-center">
          <td colspan="6" class="px-6 py-12 text-gray-500">
            <div class="flex flex-col items-center">
              <i class="fa fa-exclamation-triangle text-4xl mb-4 text-red-400"></i>
              <p>搜索用户数据失败，请重试</p>
            </div>
          </td>
        </tr>
      `;
    });
}

// 根据权限值获取对应的文本描述
function getPermissionText(permission) {
  switch (permission) {
    case 1: return '医生';
    case 2: return '护士';
    case 3: return '职工';
    case 4: return '管理者';
    default: return '未知权限';
  }
}

// 根据权限值获取对应的样式类
function getPermissionClass(permission) {
  switch (permission) {
    case 1: return 'bg-blue-100 text-blue-800';    // 医生：蓝色
    case 2: return 'bg-green-100 text-green-800';  // 护士：绿色
    case 3: return 'bg-yellow-100 text-yellow-800'; // 职工：黄色
    case 4: return 'bg-purple-100 text-purple-800'; // 管理者：紫色
    default: return 'bg-gray-100 text-gray-800';  // 未知权限：灰色
  }
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

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});