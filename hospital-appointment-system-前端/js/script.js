document.addEventListener('DOMContentLoaded', function() {
// 科室与医生数据映射
const doctorsByDepartment = {
  '内科': ['张医生 - 主任医师', '李医生 - 副主任医师', '王医生 - 主治医师'],
  '外科': ['赵医生 - 主任医师', '刘医生 - 副主任医师', '陈医生 - 主治医师'],
  '儿科': ['孙医生 - 主任医师', '周医生 - 副主任医师', '吴医生 - 主治医师'],
  '妇产科': ['郑医生 - 主任医师', '钱医生 - 副主任医师', '冯医生 - 主治医师'],
  '眼科': ['蒋医生 - 主任医师', '沈医生 - 副主任医师', '韩医生 - 主治医师'],
  '口腔科': ['杨医生 - 主任医师', '朱医生 - 副主任医师', '秦医生 - 主治医师'],
  '皮肤科': ['尤医生 - 主任医师', '许医生 - 副主任医师', '何医生 - 主治医师'],
  '中医科': ['吕医生 - 主任医师', '施医生 - 副主任医师', '张医生 - 主治医师']
};

// DOM元素
const departmentSelect = document.getElementById('department');
const doctorSelect = document.getElementById('doctor');
const appointmentForm = document.getElementById('appointmentForm');
const appointmentSuccess = document.getElementById('appointmentSuccess');
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const loginModalContent = document.getElementById('loginModalContent');
const registerModalContent = document.getElementById('registerModalContent');
const closeLoginModal = document.getElementById('closeLoginModal');
const closeRegisterModal = document.getElementById('closeRegisterModal');
const showRegisterModal = document.getElementById('showRegisterModal');
const showLoginModal = document.getElementById('showLoginModal');
const faqQuestions = document.querySelectorAll('.faq-question');
const scrollLinks = document.querySelectorAll('a[href^="#"]');

// 导航栏滚动效果
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('py-2', 'shadow-md');
    navbar.classList.remove('py-3');
  } else {
    navbar.classList.add('py-3');
    navbar.classList.remove('py-2', 'shadow-md');
  }
});

// 移动端菜单
mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// 科室选择联动医生  
departmentSelect.addEventListener('change', () => {
  const department = departmentSelect.value;
  doctorSelect.innerHTML = '<option value="">请选择医生</option>';
  
  if (department && doctorsByDepartment[department]) {
    doctorsByDepartment[department].forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor;
      option.textContent = doctor;
      doctorSelect.appendChild(option);
    });
  }
});

// 模态框动画函数
function openLoginModal() {
  loginModal.classList.remove('hidden');
  setTimeout(() => {
    loginModalContent.classList.remove('scale-95', 'opacity-0');
    loginModalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

function closeLoginModalFunc() {
  loginModalContent.classList.remove('scale-100', 'opacity-100');
  loginModalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    loginModal.classList.add('hidden');
  }, 300);
}

function openRegisterModal() {
  registerModal.classList.remove('hidden');
  setTimeout(() => {
    registerModalContent.classList.remove('scale-95', 'opacity-0');
    registerModalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

function closeRegisterModalFunc() {
  registerModalContent.classList.remove('scale-100', 'opacity-100');
  registerModalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    registerModal.classList.add('hidden');
  }, 300);
}

// 模态框事件监听
loginBtn.addEventListener('click', openLoginModal);
closeLoginModal.addEventListener('click', closeLoginModalFunc);
showRegisterModal.addEventListener('click', () => {
  closeLoginModalFunc();
  setTimeout(openRegisterModal, 300);
});

registerBtn.addEventListener('click', openRegisterModal);
closeRegisterModal.addEventListener('click', closeRegisterModalFunc);
showLoginModal.addEventListener('click', () => {
  closeRegisterModalFunc();
  setTimeout(openLoginModal, 300);
});

// 点击模态框外部关闭
loginModal.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    closeLoginModalFunc();
  }
});

registerModal.addEventListener('click', (e) => {
  if (e.target === registerModal) {
    closeRegisterModalFunc();
  }
});

// 表单提交处理
appointmentForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // 表单验证
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const idCard = document.getElementById('idCard').value;
  const age = document.getElementById('age').value;
  const department = document.getElementById('department').value;
  const doctor = document.getElementById('doctor').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  
  // 简单验证
  if (!name || !phone || !idCard || !age || !department || !doctor || !date || !time) {
    alert('请填写完整预约信息');
    return;
  }
  
  // 手机号码验证
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    alert('请输入正确的手机号码');
    return;
  }
  
  // 身份证验证
  const idCardRegex = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!idCardRegex.test(idCard)) {
    alert('请输入正确的身份证号码');
    return;
  }
  
  // 年龄验证
  if (age < 1 || age > 120) {
    alert('请输入合理的年龄');
    return;
  }
  
  // 日期验证（不能选择过去的日期）
  const today = new Date();
  const selectedDate = new Date(date);
  if (selectedDate < today) {
    alert('请选择今天或以后的日期');
    return;
  }
  
  // 准备数据
  const appointmentData = {
    patient_id,
    phone,
    idCard,
    patient_age,
    department,
    doctor,
    date,
    time,
    symptoms: document.getElementById('symptoms').value
  };
  
 
// 发送数据到后端（这里使用axios）
axios.post('http://localhost:8080/api/', appointmentData)
    .then(response => {
      // 显示成功提示
      appointmentSuccess.classList.remove('translate-y-20', 'opacity-0');

      // 重置表单
      appointmentForm.reset();
      doctorSelect.innerHTML = '<option value="">请先选择科室</option>';

      // 3秒后隐藏提示
      setTimeout(() => {
          appointmentSuccess.classList.add('translate-y-20', 'opacity-0');
      }, 3000);
    })
    .catch(error => {
          console.error('Error:', error);
          alert('预约失败，请重试');
      });
});


// FAQ折叠面板
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');
    
    answer.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
  });
});

// 平滑滚动
scrollLinks.forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // 关闭移动端菜单
      if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }
      
      // 滚动到目标位置
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// 登录表单提交
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const phone = document.getElementById('loginPhone').value;
  const password = document.getElementById('loginPassword').value;
  
  // 简单验证
  if (!phone || !password) {
    alert('请输入手机号码和密码');
    return;
  }
  
  // 发送登录请求
axios.post('http://localhost:8080/api/auth/login', {
    phone,
    password
})
    .then(response => {
          // 登录成功，存储token
          localStorage.setItem('token', response.data.token);

          // 关闭登录模态框
          closeLoginModalFunc();

          // 更新UI显示已登录状态
          loginBtn.textContent = '我的账户';
          loginBtn.removeEventListener('click', openLoginModal);
          loginBtn.addEventListener('click', () => {
              alert('欢迎回来！这是您的账户页面。');
          });

          registerBtn.style.display = 'none';

          alert('登录成功！');
      })
      .catch(error => {
          console.error('Error:', error);
          alert('登录失败，请检查账号密码');
      });
});

// 注册表单提交
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  // const phone = document.getElementById('registerPhone').value;
  // const idCard = document.getElementById('registerIdCard').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  // 简单验证
  if (!name || !phone || !idCard || !password || !confirmPassword) {
    alert('请填写完整注册信息');
    return;
  }
  
  // // 手机号码验证
  // const phoneRegex = /^1[3-9]\d{9}$/;
  // if (!phoneRegex.test(phone)) {
  //   alert('请输入正确的手机号码');
  //   return;
  // }
  
  // // 身份证验证
  // const idCardRegex = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  // if (!idCardRegex.test(idCard)) {
  //   alert('请输入正确的身份证号码');
  //   return;
  // }
  
  // 密码验证
  if (password.length < 6) {
    alert('密码长度至少为6位');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('两次输入的密码不一致');
    return;
  }
  
  // 发送注册请求
  axios.post('http://localhost:8080/api/auth/register', {
      name,
      phone,
      idCard,
      password
  })
      .then(response => {
            // 注册成功
            closeRegisterModalFunc();
            alert('注册成功，请登录！');

            // 自动打开登录模态框
            setTimeout(openLoginModal, 500);
      })
      .catch(error => {
            console.error('Error:', error);
            alert('注册失败，请重试');
        });
  });

// 留言反馈表单提交
document.getElementById('feedbackForm').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('feedbackName').value;
  const email = document.getElementById('feedbackEmail').value;
  const subject = document.getElementById('feedbackSubject').value;
  const message = document.getElementById('feedbackMessage').value;
  
  // 简单验证
  if (!name || !email || !subject || !message) {
    alert('请填写完整留言信息');
    return;
  }
  
  // 邮箱验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('请输入正确的邮箱地址');
    return;
  }
  
  // 发送留言请求
   axios.post('https://api.example.com/feedback', {
      name,
      email,
      subject,
      message
    })
        .then(response => {
              alert('留言提交成功，我们会尽快回复您！');
              document.getElementById('feedbackForm').reset();
        })
        .catch(error => {
              console.error('Error:', error);
              alert('提交失败，请重试');
          });
    });
});
