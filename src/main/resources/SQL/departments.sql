use hospital;
delimiter //
# 查询部门
# 要求:实现动态化查询
# 查询条件为 dept_name dept_status
create procedure getDepartments(IN p_department_name varchar(50),IN p_department_status varchar(50))
begin
    # 如果部门状态为空,设置为NULL
    if(p_department_status='')then
        set p_department_status=null;
    end if ;
    # 如果部门状态为空,设置为NULL
    if(p_department_name='')then
        set p_department_name=null;
    end if ;
    select * from  departments where (p_department_name is null or dept_name=p_department_name)
                                 and (p_department_status is null or dept_status=p_department_status);
end //

# 增加部门
delimiter //
create procedure addDepartment(in p_dept_name varchar(50),
                               in p_dept_head varchar(50),
                               in p_dept_status tinyint,
                               in p_dept_desc varchar(255))
begin
    insert into departments (dept_name, dept_head, dept_head,dept_desc)values (p_dept_name,p_dept_head,p_dept_status,p_dept_desc);
end //

# 查询部门
# 要求:实现动态化查询
# 查询条件为 dept_name dept_status
create procedure getDepartments(IN p_department_name varchar(50),IN p_department_status varchar(50))
begin
    # 如果部门状态为空,设置为NULL
    if(p_department_status='')then
        set p_department_status=null;
    end if ;
    # 如果部门状态为空,设置为NULL
    if(p_department_name='')then
        set p_department_name=null;
    end if ;
    select * from  departments where (p_department_name is null or dept_name=p_department_name)
                                 and (p_department_status is null or dept_status=p_department_status);
end //
delimiter ;
# 删除部门
# 业务要求:该部门下有医生不能被删除。
delimiter //
create procedure deleteDepartments(IN p_dept_id varchar(50))
begin
    declare dept_doctor_num  int;
    declare dept_existence int;

    select * from departments where dept_id=p_dept_id;

    select count(*) into dept_doctor_num from departments join doctors on departments.dept_id = doctors.dept_id;

    start transaction ;
    if(dept_doctor_num>0)then
        select 1 as message;
    else
        delete from departments where dept_id=p_dept_id;
        select 0 as message;
    end if;
    commit ;
end //
# 更新科室
# 业务规则:选择的负责人不能有其他负责的科室
delimiter //
create procedure updateDepartment(in p_dept_id varchar(50),in p_dept_name varchar(50),in p_dept_head varchar(50),in p_dept_status tinyint,in p_dept_desc varchar(50))
begin
    declare head_hadOther int;
    select * into head_hadOther from departments where dept_head=p_dept_head AND dept_id <> p_dept_id;;

    start transaction;
    if(head_hadOther>0)then
        select '该负责人有其他负责的科室' as message;
    else
        update departments set dept_name=p_dept_name,dept_head=p_dept_head,dept_status=p_dept_status,dept_desc=p_dept_desc where dept_id=p_dept_id;
        select '更新成功' as message;
    end if;
    commit;

end //